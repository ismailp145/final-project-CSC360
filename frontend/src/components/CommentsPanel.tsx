import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getComments, createComment } from "../services/commentService";
import { CommentItem } from "./CommentItem";

interface CommentsPanelProps {
  postId: number;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const { data: comments, isLoading, error, refetch } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId)
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(postId, newComment);
      setNewComment("");
      refetch(); // Refresh comments after adding new one
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <section className="mt-4">
      <h5>Comments</h5>
      
      {/* New Comment Input */}
      <div className="mb-4">
        <textarea
          className="form-control"
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          aria-label="New comment"
        />
        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      {comments?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </section>
  );
}; 