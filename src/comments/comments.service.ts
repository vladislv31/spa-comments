import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create({
    body,
    parentId,
    authorId,
    file,
  }: {
    body: string;
    parentId: number;
    authorId: number;
    file?: {
      name?: string;
      path?: string;
      type?: string;
    };
  }) {
    const extraDetails = {};

    if (file && file.name && file.path && file.type) {
      extraDetails['fileUrl'] = file.path;
      extraDetails['fileName'] = file.name;
      extraDetails['fileType'] = file.type;
    }

    return this.prisma.comment.create({
      data: {
        body,
        parentId: +parentId,
        authorId,
        extraDetails: extraDetails,
      },
    });
  }

  async getAll({
    sortBy,
    sortOrder,
    page,
    perPage,
  }: {
    sortBy?: string;
    sortOrder?: string;
    page: number;
    perPage: number;
  }) {
    const query = {
      where: {
        parentId: null,
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {},
    };

    if (['username', 'email'].includes(sortBy)) {
      query.orderBy = {
        author: {
          [sortBy]: sortOrder === 'undefined' ? 'desc' : sortOrder,
        },
      };
    } else {
      query.orderBy = {
        [sortBy === 'undefined' ? 'id' : sortBy]:
          sortOrder === 'undefined' ? 'desc' : sortOrder,
      };
    }

    const parents = await this.prisma.comment.findMany(query);

    const count = await this.prisma.comment.count({
      where: {
        parentId: null,
      },
    });

    return {
      data: await this.collectChildren(parents),
      count,
    };
  }

  private async collectChildren(parrents) {
    const children = await this.prisma.comment.findMany({
      where: {
        parentId: {
          in: parrents.map((parrent) => parrent.id),
        },
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const commentsMap = new Map();
    parrents.forEach((comment) => {
      comment.children = [];
      commentsMap.set(comment.id, comment);
    });

    children.forEach((child) => {
      const parent = commentsMap.get(child.parentId);
      if (parent) {
        parent.children.push(child);
      }
    });

    await Promise.all(
      parrents.map(async (parrent) => this.collectChildren(parrent.children)),
    );

    return parrents;
  }
}
