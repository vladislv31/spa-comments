import { Comment } from '@prisma/client';

export interface ExtendedComment extends Comment {
  children: ExtendedComment[];
}
