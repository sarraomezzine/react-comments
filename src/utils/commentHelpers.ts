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
