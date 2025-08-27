import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  parentId?: string;
  replies: Comment[];
}

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

// Main Comments  Component
interface CommentsProps {
  onCommentChange?: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ onCommentChange }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const addComment = (text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      text: text.trim(),
      timestamp: Date.now(),
      replies: []
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    onCommentChange?.(updatedComments);
  };

  const deleteComment = (commentId: string) => {
    const removeFromTree = (commentList: Comment[]): Comment[] => {
      return commentList
        .filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: removeFromTree(comment.replies)
        }));
    };

    const updatedComments = removeFromTree(comments);
    setComments(updatedComments);
    onCommentChange?.(updatedComments);
  };

  const handleAddComment = () => {
    addComment(newCommentText);
    setNewCommentText('');
  };

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <h2>Comments  ({comments.length})</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={handleAddComment} disabled={!newCommentText.trim()}>
          Add Comment
        </button>
      </div>

      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#666' }}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
