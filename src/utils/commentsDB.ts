import type { Comment } from '../types/comment';

/**
 * IndexedDB utility class for managing comments persistence
 */
export class CommentsDB {
  private dbName = 'CommentsDatabase';
  private storeName = 'comments';
  private version = 1;

  /**
   * Opens the IndexedDB database connection
   */
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Saves comments to IndexedDB
   * @param comments - Array of comments to save
   */
  async saveComments(comments: Comment[]): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    // Clear existing comments and save new ones
    await store.clear();
    for (const comment of comments) {
      await store.add(comment);
    }
  }

  /**
   * Loads comments from IndexedDB and builds the tree structure
   */
  async loadComments(): Promise<Comment[]> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const flatComments = request.result as Comment[];
        resolve(this.buildCommentTree(flatComments));
      };
    });
  }

  /**
   * Builds a hierarchical tree structure from flat comment data
   * @param flatComments - Flat array of comments from database
   */
  private buildCommentTree(flatComments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create all comment objects
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build the tree structure
    flatComments.forEach(comment => {
      const commentObj = commentMap.get(comment.id)!;
      if (comment.parentId && commentMap.has(comment.parentId)) {
        commentMap.get(comment.parentId)!.replies.push(commentObj);
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const commentsDB = new CommentsDB();
