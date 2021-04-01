import Player from './Player';

/**
 * The object associated with a player in the Queue
 */
export interface QueueTicket {
  player: Player;
  timestamp: Date;
}