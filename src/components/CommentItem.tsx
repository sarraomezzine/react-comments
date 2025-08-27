import React from 'react';
import type { Comment } from '../../types/comment';
import './Comments.css';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  depth = 0, 
  onDelete 
}) => {

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
          onClick={() => onDelete(comment.id)} 
          className="comment-item-delete-btn"
        >
          Delete
        </button>
      </div>
      
      {comment.replies.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentItem;
