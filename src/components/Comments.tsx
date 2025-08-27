import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { useComments } from '../hooks/useComments';
import type { Comment } from '../types/comment';
import './Comments.css';

// Main Comments Component
interface CommentsProps {
  onCommentChange?: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ onCommentChange }) => {
  const [newCommentText, setNewCommentText] = useState('');

  const { 
    comments, 
    isLoading,
    error,
    addComment, 
    deleteComment,
  } = useComments(onCommentChange);

  const handleAddComment = () => {
    addComment(newCommentText);
    setNewCommentText('');
  };

  const handleReply = (parentId: string, replyText: string) => {
    addComment(replyText, parentId);
  };

  if (isLoading) {
    return (
      <div className="comments-container">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comments-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments  ({comments.length})</h2>
      
      <div className="comments-form">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="comments-textarea"
        />
        <button 
          onClick={handleAddComment} 
          disabled={!newCommentText.trim()}
          className="comments-submit-btn"
        >
          Add Comment
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
