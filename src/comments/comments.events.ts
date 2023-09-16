import { Comment } from '@prisma/client';

export class CommentCreated {
  constructor(public readonly data: Comment) {}
}
