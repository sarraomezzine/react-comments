import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from '../types/comment';
import { commentsDB } from '../utils/commentsDB';
import { 
  flattenComments, 
  addReplyToComment, 
  removeCommentById 
} from '../utils/commentHelpers';
import { broadcastSync } from '../utils/broadcastSync';

/**
 * Custom hook for managing comments state and operations
 */
export const useComments = (onCommentChange?: (comments: Comment[]) => void) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load comments from IndexedDB
   */
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedComments = await commentsDB.loadComments();
      setComments(loadedComments);
      onCommentChange?.(loadedComments);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [onCommentChange]);

  /**
   * Save comments to IndexedDB and notify other tabs
   */
  const saveComments = useCallback(async (newComments: Comment[]) => {
    try {
      setError(null);
      const flatComments = flattenComments(newComments);
      await commentsDB.saveComments(flatComments);
      broadcastSync.notifyUpdate();
      onCommentChange?.(newComments);
    } catch (err) {
      console.error('Failed to save comments:', err);
      setError('Failed to save comments');
    }
  }, [onCommentChange]);

  /**
   * Add a new comment or reply
   */
  const addComment = useCallback(async (text: string, parentId?: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      text: text.trim(),
      timestamp: Date.now(),
      parentId,
      replies: []
    };

    let updatedComments: Comment[];

    if (parentId) {
      updatedComments = addReplyToComment(comments, parentId, newComment);
    } else {
      updatedComments = [newComment, ...comments];
    }

    setComments(updatedComments);
    await saveComments(updatedComments);
  }, [comments, saveComments]);

  /**
   * Delete a comment and all its replies
   */
  const deleteComment = useCallback(async (commentId: string) => {
    const updatedComments = removeCommentById(comments, commentId);
    setComments(updatedComments);
    await saveComments(updatedComments);
  }, [comments, saveComments]);

  /**
   * Get total comment count (including replies)
   */
  const getTotalCommentCount = useCallback((commentList: Comment[] = comments): number => {
    return commentList.reduce((count, comment) => {
      return count + 1 + getTotalCommentCount(comment.replies);
    }, 0);
  }, [comments]);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Listen for cross-tab sync events
  useEffect(() => {
    const handleSync = () => {
      loadComments();
    };

    broadcastSync.onSync(handleSync);

    return () => {
      broadcastSync.offSync(handleSync);
    };
  }, [loadComments]);
  
  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    totalCommentCount: getTotalCommentCount(),
    refresh: loadComments
  };
};
