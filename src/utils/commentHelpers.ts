import type { Comment } from '../types/comment';

/**
 * Utility functions for comment operations
 */

/**
 * Flattens a hierarchical comment tree into a flat array for database storage
 * @param comments - Hierarchical comment tree
 */
export const flattenComments = (comments: Comment[]): Comment[] => {
  const result: Comment[] = [];
  
  const flatten = (commentList: Comment[], parentId?: string) => {
    commentList.forEach(comment => {
      const flatComment = {
        id: comment.id,
        text: comment.text,
        timestamp: comment.timestamp,
        parentId,
        replies: []
      };
      result.push(flatComment);
      if (comment.replies.length > 0) {
        flatten(comment.replies, comment.id);
      }
    });
  };
  
  flatten(comments);
  return result;
};

/**
 * Adds a reply to a specific comment in the tree
 * @param commentList - List of comments to search
 * @param parentId - ID of the parent comment
 * @param reply - Reply comment to add
 */
export const addReplyToComment = (
  commentList: Comment[], 
  parentId: string, 
  reply: Comment
): Comment[] => {
  return commentList.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [reply, ...comment.replies]
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, parentId, reply)
      };
    }
    return comment;
  });
};

/**
 * Removes a comment and all its replies from the tree
 * @param commentList - List of comments to search
 * @param idToRemove - ID of the comment to remove
 */
export const removeCommentById = (
  commentList: Comment[], 
  idToRemove: string
): Comment[] => {
  return commentList
    .filter(comment => comment.id !== idToRemove)
    .map(comment => ({
      ...comment,
      replies: removeCommentById(comment.replies, idToRemove)
    }));
};


/**
 * Formats a timestamp into a human-readable relative time string
 * @param timestamp - Unix timestamp in milliseconds
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};
