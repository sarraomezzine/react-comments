import React, { useState } from 'react';
import type { Comment } from '../../types/comment';
import './Comments.css';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply: (commentId: string, replyText: string) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  depth = 0, 
  onReply,
  onDelete 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText('');
  };

  return (
    <div 
      className={`comment-item ${depth > 0 ? 'comment-reply' : ''}`}
      style={{ marginLeft: depth * 20 }}
    >
      <div className="comment-item-text">{comment.text}</div>
      <div className="comment-item-meta">
        <span className="comment-item-timestamp">
          {new Date(comment.timestamp).toLocaleString()}
        </span>
        <button 
          onClick={() => setIsReplying(!isReplying)} 
          className="comment-item-reply-btn"
        >
          Reply
        </button>
        <button 
          onClick={() => onDelete(comment.id)} 
          className="comment-item-delete-btn"
        >
          Delete
        </button>
      </div>

      {isReplying && (
        <div className="comment-item-reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="comment-item-reply-textarea"
            rows={2}
            autoFocus
          />
          <div className="comment-item-reply-actions">
            <button 
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className="comment-item-reply-submit"
            >
              Add Reply
            </button>
            <button 
              onClick={handleCancelReply}
              className="comment-item-reply-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {comment.replies.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentItem;
