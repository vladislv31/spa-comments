import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommentCreated } from '../comments.events';
import { CacheService } from '../providers/cache.service';

@EventsHandler(CommentCreated)
export class CommentCreatedHandler implements IEventHandler<CommentCreated> {
  constructor(private readonly cache: CacheService) {}
  handle(event: CommentCreated) {
    console.log(`Received event with data: ${event.data}`);
    if (event.data.parentId) {
      this.cache.deleteCache(event.data.parentId);
    }
  }
}
