import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments.repository';
import { GetAllDto } from '../dto/getAll.dto';
import { ExtendedComment } from '../types/comments.types';

@Injectable()
export class CommentsService {
  private readonly commentsCache: Map<number, ExtendedComment[]> = new Map();

  constructor(private repository: CommentsRepository) {}

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
    const result = await this.repository.create(data);
    this.commentsCache.delete(result.parentId);

    return result;
  }

  async getAll(data: GetAllDto) {
    const parents = await this.repository.getAll(data);

    return {
      data: await this.collectChildrenTree(parents.data),
      count: parents.count,
    };
  }

  private async getChildren(parentIds: number[]) {
    const result = [];

    const wasNotInCache = [];
    parentIds.forEach((parentId) => {
      if (this.commentsCache.has(parentId)) {
        result.push(...this.commentsCache.get(parentId));
      } else {
        wasNotInCache.push(parentId);
      }
    });

    if (wasNotInCache.length) {
      const children = await this.repository.getChildren(wasNotInCache);
      const toCache = {};

      children.forEach((child) => {
        if (Object.keys(toCache).includes(child.parentId.toString())) {
          toCache[child.parentId].push(child);
        } else {
          toCache[child.parentId] = [child];
        }

        result.push(child);
      });

      Object.keys(toCache).forEach((key) => {
        this.commentsCache.set(+key, toCache[key]);
      });

      const fetchedParentId = [...new Set(children.map((c) => c.parentId))];
      wasNotInCache
        .filter((parentId) => !fetchedParentId.includes(parentId))
        .forEach((parentId) => {
          this.commentsCache.set(parentId, []);
        });
    }

    return result;
  }

  private async collectChildrenTree(parrents: ExtendedComment[]) {
    const children = await this.getChildren(parrents.map((p) => p.id));

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
      parrents.map(async (parrent) =>
        this.collectChildrenTree(parrent.children),
      ),
    );

    return parrents;
  }
}
