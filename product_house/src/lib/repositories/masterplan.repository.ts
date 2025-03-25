import { prisma } from '@/lib/prisma';
import { Masterplan } from '@/types/masterplan';

function mapDbMasterplanToModel(dbMasterplan: any): Masterplan {
  return {
    id: dbMasterplan.id,
    title: dbMasterplan.title,
    userId: dbMasterplan.userId,
    conversationId: dbMasterplan.conversationId,
    sections: dbMasterplan.sections,
    formats: dbMasterplan.formats.reduce((acc: any, format: any) => {
      acc[format.format] = format.content;
      return acc;
    }, {})
  };
}

export async function createMasterplanInDb(masterplan: Omit<Masterplan, 'id'>): Promise<Masterplan> {
  const created = await prisma.masterplan.create({
    data: {
      title: masterplan.title,
      userId: masterplan.userId,
      conversationId: masterplan.conversationId,
      sections: {
        create: masterplan.sections.map((section, index) => ({
          ...section,
          order: index
        }))
      },
      formats: {
        create: Object.entries(masterplan.formats).map(([format, content]) => ({
          format,
          content
        }))
      }
    },
    include: {
      sections: true,
      formats: true
    }
  });
  
  return mapDbMasterplanToModel(created);
}

export async function getMasterplanById(id: string): Promise<Masterplan | null> {
  const masterplan = await prisma.masterplan.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      },
      formats: true
    }
  });
  
  return masterplan ? mapDbMasterplanToModel(masterplan) : null;
}

export async function getMasterplansByUserId(userId: string): Promise<Masterplan[]> {
  const masterplans = await prisma.masterplan.findMany({
    where: { userId },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      },
      formats: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return masterplans.map(mapDbMasterplanToModel);
}

export async function getMasterplanVersions(masterplanId: string) {
  return await prisma.masterplanVersion.findMany({
    where: {
      masterplanId
    },
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
