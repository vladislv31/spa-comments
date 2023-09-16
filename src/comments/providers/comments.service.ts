import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments.repository';
import { GetAllDto } from '../dto/getAll.dto';
import { ExtendedComment } from '../types/comments.types';
import { CacheService } from './cache.service';
import { EventBus } from '@nestjs/cqrs';
import { CommentCreated } from '../comments.events';

@Injectable()
export class CommentsService {
  constructor(
    private repository: CommentsRepository,
    private eventBus: EventBus,
    private cache: CacheService,
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
    const result = await this.repository.create(data);
    this.eventBus.publish(new CommentCreated(result));
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
      if (this.cache.isExists(parentId)) {
        result.push(...this.cache.getCached(parentId));
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
        this.cache.updateCache(+key, toCache[key]);
      });

      const fetchedParentId = [...new Set(children.map((c) => c.parentId))];
      wasNotInCache
        .filter((parentId) => !fetchedParentId.includes(parentId))
        .forEach((parentId) => {
          this.cache.updateCache(parentId, []);
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
