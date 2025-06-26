import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Comment } from "../types/Comment";
import { createComment } from "../services/commentService";

dayjs.extend(relativeTime);

export const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [replies, setReplies] = useState(comment.replies);
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState("");

  const submitReply = async () => {
    if (!text.trim()) return;
    try {
      const newComment = await createComment(
        comment.postId,
        text,
        comment.id
      );
      setReplies([...replies, newComment]);
      setText("");
      setShowBox(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  return (
    <div className="mb-3">
      <div className="fw-bold">{comment.userName}</div>
      <small className="text-muted">{dayjs(comment.createdAt).fromNow()}</small>
      <p>{comment.content}</p>

      <button
        className="btn btn-link btn-sm p-0"
        onClick={() => setShowBox(!showBox)}
        aria-label="Reply to comment"
      >
        Reply
      </button>

      {showBox && (
        <div className="mt-2">
          <textarea
            className="form-control"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Reply text"
            placeholder="Write your reply..."
          />
          <button
            className="btn btn-primary btn-sm mt-1"
            onClick={submitReply}
            aria-label="Submit reply"
          >
            Post reply
          </button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="ms-4 border-start ps-3">
          {replies.map((r) => (
            <CommentItem key={r.id} comment={r} />
          ))}
        </div>
      )}
    </div>
  );
}; 