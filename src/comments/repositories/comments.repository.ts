import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllDto } from '../dto/getAll.dto';
import { Comment } from '@prisma/client';
import { ExtendedComment } from '../types/comments.types';

@Injectable()
export class CommentsRepository {
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
    try {
      const extraDetails = {};

      if (file && file.name && file.path && file.type) {
        extraDetails['fileUrl'] = file.path;
        extraDetails['fileName'] = file.name;
        extraDetails['fileType'] = file.type;
      }

      return await this.prisma.comment.create({
        data: {
          body,
          parentId: +parentId,
          authorId,
          extraDetails: extraDetails,
        },
        include: {
          parent: {
            include: {
              author: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async getAll(
    data: GetAllDto,
  ): Promise<{ data: ExtendedComment[]; count: number }> {
    try {
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
        take: data.perPage,
        skip: (data.page - 1) * data.perPage,
        orderBy: {},
      };

      if (['username', 'email'].includes(data.sortBy)) {
        query.orderBy = {
          author: {
            [data.sortBy]:
              data.sortOrder === 'undefined' ? 'desc' : data.sortOrder,
          },
        };
      } else {
        query.orderBy = {
          [data.sortBy === 'undefined' ? 'id' : data.sortBy]:
            data.sortOrder === 'undefined' ? 'desc' : data.sortOrder,
        };
      }

      const result = await this.prisma.comment.findMany(query);

      const count = await this.prisma.comment.count({
        where: {
          parentId: null,
        },
      });

      return {
        data: result as unknown as ExtendedComment[],
        count,
      };
    } catch (e) {
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async getChildren(parrentsIds: number[]): Promise<Comment[]> {
    try {
      return await this.prisma.comment.findMany({
        where: {
          parentId: {
            in: parrentsIds,
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
    } catch (e) {
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}
