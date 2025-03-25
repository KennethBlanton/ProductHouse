// src/lib/repositories/conversation.repository.ts
import { prisma } from '@/lib/prisma';
import { Conversation, Message } from '@/types/conversation';

/**
 * Converts database Conversation model to application model
 */
function mapDbConversationToModel(dbConversation: any): Conversation {
  return {
    id: dbConversation.id,
    title: dbConversation.title,
    userId: dbConversation.userId,
    createdAt: dbConversation.createdAt.toISOString(),
    updatedAt: dbConversation.updatedAt.toISOString(),
    messages: dbConversation.messages?.map((message: any) => ({
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp.toISOString(),
      conversationId: message.conversationId,
      userId: message.userId
    })) || []
  };
}

/**
 * Create a new conversation
 */
export async function createConversation(
  title: string,
  userId: string
): Promise<Conversation> {
  const conversation = await prisma.conversation.create({
    data: {
      title,
      userId
    }
  });

  return mapDbConversationToModel(conversation);
}

/**
 * Get a conversation by ID
 */
export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: {
          timestamp: 'asc'
        }
      }
    }
  });

  if (!conversation) {
    return null;
  }

  return mapDbConversationToModel(conversation);
}

/**
 * Get all conversations for a user
 */
export async function getConversationsByUserId(
  userId: string
): Promise<Conversation[]> {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: {
          timestamp: 'asc'
        }
      },
      _count: {
        select: { messages: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return conversations.map(mapDbConversationToModel);
}

/**
 * Update a conversation
 */
export async function updateConversation(
  id: string,
  updates: Partial<Conversation>
): Promise<Conversation> {
  const { title } = updates;

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      ...(title && { title }),
      updatedAt: new Date()
    },
    include: {
      messages: {
        orderBy: {
          timestamp: 'asc'
        }
      }
    }
  });

  return mapDbConversationToModel(conversation);
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<boolean> {
  try {
    await prisma.conversation.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  content: string,
  sender: 'user' | 'assistant',
  userId?: string
): Promise<Message> {
  const message = await prisma.message.create({
    data: {
      content,
      sender,
      userId,
      conversationId
    }
  });

  // Update conversation's updatedAt timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  });

  return {
    id: message.id,
    content: message.content,
    sender: message.sender as 'user' | 'assistant',
    timestamp: message.timestamp.toISOString(),
    conversationId: message.conversationId,
    userId: message.userId || undefined
  };
}

/**
 * Get messages for a conversation
 */
export async function getMessagesByConversationId(
  conversationId: string
): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: {
      timestamp: 'asc'
    }
  });

  return messages.map(message => ({
    id: message.id,
    content: message.content,
    sender: message.sender as 'user' | 'assistant',
    timestamp: message.timestamp.toISOString(),
    conversationId: message.conversationId,
    userId: message.userId || undefined
  }));
}