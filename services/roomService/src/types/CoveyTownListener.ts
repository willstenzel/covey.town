import Player from './Player';
import { QueueTicket } from './Queue';

/**
 * A listener for player-related events in each town
 */
export default interface CoveyTownListener {
  /**
   * Called when a player joins a town
   * @param newPlayer the new player
   */
  onPlayerJoined(newPlayer: Player): void;

  /**
   * Called when a player's location changes
   * @param movedPlayer the player that moved
   * @param force wether or not this action should override the current players location
   */
  onPlayerMoved(movedPlayer: Player, force: boolean): void;

  /**
   * Called when a player disconnects from the town
   * @param removedPlayer the player that disconnected
   */
  onPlayerDisconnected(removedPlayer: Player): void;

  /**
   * Called when a town is destroyed, causing all players to disconnect
   */
  onTownDestroyed(): void;

  /**
   * Called when the queue is updated, causing all players to move position
   */
  onQueueUpdated(queue: QueueTicket[]): void;
}
