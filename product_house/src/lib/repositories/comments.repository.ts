// src/lib/repositories/comments.repository.ts
import { prisma } from '@/lib/prisma';
import { MasterplanComment } from '@/types/masterplan';

// Type for the CommentCategory enum from Prisma
type CommentCategory = 'CLARIFICATION' | 'RISK' | 'MODIFICATION' | 'TECHNICAL';

/**
 * Map database comment to application model
 */
function mapDbCommentToModel(dbComment: any): MasterplanComment {
  return {
    id: dbComment.id,
    userId: dbComment.userId,
    userName: dbComment.user.name,
    sectionId: dbComment.sectionId,
    content: dbComment.content,
    timestamp: dbComment.createdAt.toISOString(),
    category: dbComment.category?.toLowerCase() as any,
    mentions: dbComment.mentions?.map((mention: any) => mention.userId) || []
  };
}

/**
 * Add a comment to a masterplan section
 */
export async function addComment(
  sectionId: string,
  masterplanId: string,
  userId: string,
  content: string,
  category?: string,
  mentions: string[] = []
): Promise<MasterplanComment> {
  return await prisma.$transaction(async (tx) => {
    // Create the comment
    const comment = await tx.comment.create({
      data: {
        content,
        userId,
        sectionId,
        masterplanId,
        category: category as CommentCategory | undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Add mentions if any
    if (mentions.length > 0) {
      await tx.mention.createMany({
        data: mentions.map(userId => ({
          userId,
          commentId: comment.id
        }))
      });
    }

    // Get the comment with mentions
    const commentWithMentions = await tx.comment.findUnique({
      where: { id: comment.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        mentions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!commentWithMentions) {
      throw new Error(`Failed to fetch created comment: ${comment.id}`);
    }

    return mapDbCommentToModel(commentWithMentions);
  });
}

/**
 * Get comments for a masterplan section
 */
export async function getCommentsBySectionId(
  sectionId: string
): Promise<MasterplanComment[]> {
  const comments = await prisma.comment.findMany({
    where: { sectionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      mentions: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return comments.map(mapDbCommentToModel);
}

/**
 * Get all comments for a masterplan
 */
export async function getCommentsByMasterplanId(
  masterplanId: string
): Promise<MasterplanComment[]> {
  const comments = await prisma.comment.findMany({
    where: { masterplanId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      mentions: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return comments.map(mapDbCommentToModel);
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<boolean> {
  try {
    await prisma.comment.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

/**
 * Update a comment
 */
export async function updateComment(
  id: string,
  content: string,
  category?: string
): Promise<MasterplanComment> {
  const comment = await prisma.comment.update({
    where: { id },
    data: {
      content,
      category: category as CommentCategory | undefined,
      updatedAt: new Date()
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      mentions: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  return mapDbCommentToModel(comment);
}