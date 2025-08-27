import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CommentItem from './CommentItem';
import type { Comment } from '../../types/comment';
import './Comments.css';

// Main Comments Component
interface CommentsProps {
  onCommentChange?: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ onCommentChange }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const addComment = (text: string, parentId?: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      text: text.trim(),
      timestamp: Date.now(),
      parentId,
      replies: []
    };

    if (!parentId) {
      // Add as top-level comment
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      onCommentChange?.(updatedComments);
    } else {
      // Add as reply
      const addReplyToTree = (commentList: Comment[]): Comment[] => {
        return commentList.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment]
            };
          }
          return {
            ...comment,
            replies: addReplyToTree(comment.replies)
          };
        });
      };

      const updatedComments = addReplyToTree(comments);
      setComments(updatedComments);
      onCommentChange?.(updatedComments);
    }
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

  const handleReply = (parentId: string, replyText: string) => {
    addComment(replyText, parentId);
  };

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
