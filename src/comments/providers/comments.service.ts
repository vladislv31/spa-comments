import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { GetAllDto } from '../dto/getAll.dto';
import { ExtendedComment } from '../types/comments.types';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private repository: CommentsRepository,
  ) {}

  async create(data: {
    body: string;
    parentId: number;
    authorId: number;
    file?: {
      name?: string;
      path?: string;
      type?: string;
    };
  }) {
    return this.repository.create(data);
  }

  async getAll(data: GetAllDto) {
    const parents = await this.repository.getAll(data);

    return {
      data: await this.collectChildren(parents.data),
      count: parents.count,
    };
  }

  private async collectChildren(parrents: ExtendedComment[]) {
    const children = await this.repository.getChildren(
      parrents.map((p) => p.id),
    );

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
