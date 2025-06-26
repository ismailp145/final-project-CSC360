import { createAuthenticatedApi } from './authService';
import type { Comment } from '../types/Comment';

const api = createAuthenticatedApi();

export const getComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};

export const createComment = async (
  postId: number,
  content: string,
  parentCommentId?: number
): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`/api/posts/${postId}/comments`, {
      content,
      parentCommentId: parentCommentId ?? null,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw error;
  }
}; 