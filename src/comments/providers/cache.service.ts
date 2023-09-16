import { Injectable } from '@nestjs/common';
import { ExtendedComment } from '../types/comments.types';

@Injectable()
export class CacheService {
  private readonly commentsCache: Map<number, ExtendedComment[]> = new Map();

  getCached(parentId: number) {
    return this.commentsCache.get(parentId);
  }

  isExists(parentId: number) {
    return this.commentsCache.has(parentId);
  }

  updateCache(parentId: number, comment: ExtendedComment[]) {
    this.commentsCache.set(parentId, comment);
  }

  deleteCache(parentId: number) {
    this.commentsCache.delete(parentId);
  }
}
