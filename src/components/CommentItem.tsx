import React from 'react';
import type { Comment } from '../../types/comment';

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
    <div style={{ marginLeft: depth * 20, border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
      <div>{comment.text}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        <span>{new Date(comment.timestamp).toLocaleString()}</span>
        <button onClick={() => onDelete(comment.id)} style={{ marginLeft: '10px' }}>
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
