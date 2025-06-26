import { Button, Form, Card } from "react-bootstrap";
import React, { useState } from "react";
import type { Post } from "../types/Post";
import { createPost } from "../services/postService";
import {getUserProfile} from "../services/userService";

const NewPost = ({ posts, setPosts }: { posts: Post[], setPosts: (posts: Post[]) => void }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userProfile = await getUserProfile();
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      if (mediaType) {
        formData.append('mediaType', mediaType);
      }

      const newPost = await createPost({
        content,
        mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
        mediaType: mediaType || undefined,
      });

      setPosts([newPost, ...posts]);
      setContent('');
      setMediaFile(null);
      setMediaType(null);
    } catch (error) {
      console.error('Failed to create post:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Add Media (Image or Video)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={(!content && !mediaFile) || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewPost;
