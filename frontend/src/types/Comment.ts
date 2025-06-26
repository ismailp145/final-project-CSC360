export interface Comment {
  id: number;
  postId: number;
  parentCommentId: number | null;
  content: string;
  createdAt: string;
  userName: string;         // include in DTO from server
  replies: Comment[];       // nested array
}