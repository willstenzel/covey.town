import Player from './Player';

/**
 * The object associated with a player in the Queue
 */
export interface QueueTicket {
  player: Player,
  timestamp: Date
}

/**
 * The Queue object that stores the list of players to be served by the TA
 */
export default class Queue {

  /** Our queue of players */
  private _playerQueue: QueueTicket[] = [];

  /**
   * Adds the given player to the Queue
   * 
   * @param player 
   */
  push(player: Player): void {
    const timestamp = new Date();
    this._playerQueue.push({ player, timestamp });
  }

  /**
   * Removes the first player in the Queue
   */
  pop(): QueueTicket {
    const poppedQueueTicket = this._playerQueue.shift(); 
    if (!poppedQueueTicket) {
      throw new Error('The current Queue is empty!');
    }
    return poppedQueueTicket;
  }

  /** Gets the Queue position of the given player */
  getPlayerPosition(player: Player): number {
    for (const queueTicket of this._playerQueue) {
      if (player.id === queueTicket.player.id) {
        return this._playerQueue.indexOf(queueTicket) + 1;
      }
    }
    throw new Error('The given player is not in the Queue!');
  }

  /** Checks if a given player is in the queue */
  isPlayerInQueue(player: Player): boolean {
    try {
      const position = this.getPlayerPosition(player);
      return true;
    } catch (e) {
      return false;
    }
  }
  
}