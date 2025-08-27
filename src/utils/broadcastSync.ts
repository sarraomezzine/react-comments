/**
 * Real-time synchronization utility using BroadcastChannel API
 * Enables communication between browser tabs, windows, and workers
 */

export type SyncEventHandler = () => void;

export class BroadcastSync {
  private channel: BroadcastChannel;
  private channelName = 'comments-sync';

  constructor() {
    this.channel = new BroadcastChannel(this.channelName);
  }

  /**
   * Listen for sync events from other contexts
   * @param handler - Function to call when sync event is received
   */
  onSync(handler: SyncEventHandler): void {
    this.channel.addEventListener('message', handler);
  }

  /**
   * Remove sync event listener
   * @param handler - Function to remove from listeners
   */
  offSync(handler: SyncEventHandler): void {
    this.channel.removeEventListener('message', handler);
  }

  /**
   * Notify other contexts that data has been updated
   */
  notifyUpdate(): void {
    this.channel.postMessage('comments-updated');
  }
}

export const broadcastSync = new BroadcastSync();
