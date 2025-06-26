export interface Post {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  userId: number;
  userName: string;
  userEmail: string;
}