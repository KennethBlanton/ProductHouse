// src/lib/repositories/masterplan.repository.ts
import { prisma } from '@/lib/prisma';
import { Masterplan, MasterplanSection, MasterplanFormat } from '@/types/masterplan';

/**
 * Converts database Masterplan model to application model
 */
function mapDbMasterplanToModel(dbMasterplan: any): Masterplan {
  const formats: Record<string, string> = {};
  
  dbMasterplan.formats.forEach((format: any) => {
    formats[format.type] = format.content;
  });
  
  return {
    id: dbMasterplan.id,
    title: dbMasterplan.title,
    conversationId: dbMasterplan.conversationId,
    version: dbMasterplan.version,
    createdAt: dbMasterplan.createdAt.toISOString(),
    updatedAt: dbMasterplan.updatedAt.toISOString(),
    sections: dbMasterplan.sections.map((section: any) => ({
      id: section.id,
      title: section.title,
      content: section.content,
      level: section.level
    })),
    formats
  };
}

/**
 * Create a new masterplan
 */
export async function createMasterplan(masterplan: Omit<Masterplan, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Masterplan> {
  const { sections, formats, ...masterplanData } = masterplan;
  
  // Create masterplan with sections and formats
  const dbMasterplan = await prisma.masterplan.create({
    data: {
      title: masterplanData.title,
      version: masterplanData.version,
      userId,
      conversation: {
        connect: { id: masterplanData.conversationId }
      },
      sections: {
        create: sections.map((section, index) => ({
          title: section.title,
          content: section.content,
          level: section.level,
          order: index
        }))
      },
      formats: {
        create: Object.entries(formats).map(([type, content]) => ({
          type,
          content
        }))
      }
    },
    include: {
      sections: {
        orderBy: {
          order: 'asc'
        }
      },
      formats: true
    }
  });

  // Create initial version record
  await prisma.masterplanVersion.create({
    data: {
      version: masterplanData.version,
      masterplanId: dbMasterplan.id,
      userId,
      changelog: 'Initial version'
    }
  });
  
  return mapDbMasterplanToModel(dbMasterplan);
}

/**
 * Get a masterplan by ID
 */
export async function getMasterplanById(id: string): Promise<Masterplan | null> {
  const dbMasterplan = await prisma.masterplan.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: {
          order: 'asc'
        }
      },
      formats: true
    }
  });
  
  if (!dbMasterplan) {
    return null;
  }
  
  return mapDbMasterplanToModel(dbMasterplan);
}

/**
 * Get all masterplans for a user
 */
export async function getMasterplansByUserId(userId: string): Promise<Masterplan[]> {
  const dbMasterplans = await prisma.masterplan.findMany({
    where: { userId },
    include: {
      sections: {
        orderBy: {
          order: 'asc'
        }
      },
      formats: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  return dbMasterplans.map(mapDbMasterplanToModel);
}

/**
 * Update a masterplan
 */
export async function updateMasterplan(
  id: string, 
  updates: Partial<Masterplan>, 
  userId: string,
  createNewVersion: boolean = false
): Promise<Masterplan> {
  const { sections, formats, ...masterplanData } = updates;
  
  // Get the current version number
  const currentMasterplan = await prisma.masterplan.findUnique({
    where: { id },
    select: { version: true }
  });

  if (!currentMasterplan) {
    throw new Error(`Masterplan not found: ${id}`);
  }
  
  // Calculate new version number if needed
  let newVersion = currentMasterplan.version;
  if (createNewVersion) {
    const [major, minor] = currentMasterplan.version.split('.').map(Number);
    newVersion = `${major}.${minor + 1}`;
  }

  // Start a transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    // Update masterplan base data
    const updatedMasterplan = await tx.masterplan.update({
      where: { id },
      data: {
        ...(masterplanData.title && { title: masterplanData.title }),
        version: newVersion,
        updatedAt: new Date()
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        formats: true
      }
    });

    // Update sections if provided
    if (sections) {
      // Delete existing sections
      await tx.masterplanSection.deleteMany({
        where: { masterplanId: id }
      });

      // Create new sections
      await tx.masterplanSection.createMany({
        data: sections.map((section, index) => ({
          id: section.id,
          title: section.title,
          content: section.content,
          level: section.level,
          order: index,
          masterplanId: id
        }))
      });
    }

    // Update formats if provided
    if (formats) {
      // Delete existing formats
      await tx.masterplanFormat.deleteMany({
        where: { masterplanId: id }
      });

      // Create new formats
      await Promise.all(
        Object.entries(formats).map(([type, content]) => 
          tx.masterplanFormat.create({
            data: {
              type,
              content,
              masterplanId: id
            }
          })
        )
      );
    }

    // Create version record if creating a new version
    if (createNewVersion) {
      await tx.masterplanVersion.create({
        data: {
          version: newVersion,
          masterplanId: id,
          userId,
          changelog: 'Updated masterplan'
        }
      });
    }

    // Fetch the updated masterplan with all related data
    const refreshedMasterplan = await tx.masterplan.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        formats: true
      }
    });

    if (!refreshedMasterplan) {
      throw new Error(`Failed to fetch updated masterplan: ${id}`);
    }

    return mapDbMasterplanToModel(refreshedMasterplan);
  });
}

/**
 * Delete a masterplan
 */
export async function deleteMasterplan(id: string): Promise<boolean> {
  try {
    await prisma.masterplan.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting masterplan:', error);
    return false;
  }
}

/**
 * Get masterplan versions
 */
export async function getMasterplanVersions(masterplanId: string) {
  return await prisma.masterplanVersion.findMany({
    where: { masterplanId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}