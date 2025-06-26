// frontend/book-manager/src/services/postService.tsx
import { createAuthenticatedApi } from './authService';
import type { Post } from '../types/Post';

const api = createAuthenticatedApi();

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>('/api/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

export const getPostById = async (id: number): Promise<Post> => {
  try {
    const response = await api.get<Post>(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (post: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' }): Promise<Post> => {
  try {
    const response = await api.post<Post>('/api/posts', post);
    return response.data;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<void> => {
  try {
    await api.put(`/api/posts/${id}`, post);
  } catch (error) {
    console.error(`Failed to update post ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/posts/${id}`);
  } catch (error) {
    console.error(`Failed to delete post ${id}:`, error);
    throw error;
  }
};

export const updatePostAvailability = async (id: number, isAvailable: boolean): Promise<void> => {
  try {
    await api.patch(`/api/posts/${id}/availability`, { isAvailable });
  } catch (error) {
    console.error(`Failed to update post ${id} availability:`, error);
    throw error;
  }
};