import { customAlphabet, nanoid } from 'nanoid';
import { Direction, UserLocation } from '../CoveyTypes';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import PlayerSession from '../types/PlayerSession';
import Queue from '../types/Queue';
import IVideoClient from './IVideoClient';
import TwilioVideo from './TwilioVideo';

const friendlyNanoID = customAlphabet('1234567890ABCDEF', 8);

/**
 * The CoveyTownController implements the logic for each town: managing the various events that
 * can occur (e.g. joining a town, moving, leaving a town)
 */
export default class CoveyTownController {
  get capacity(): number {
    return this._capacity;
  }

  set isPubliclyListed(value: boolean) {
    this._isPubliclyListed = value;
  }

  get isPubliclyListed(): boolean {
    return this._isPubliclyListed;
  }

  get townUpdatePassword(): string {
    return this._townUpdatePassword;
  }

  get players(): Player[] {
    return this._players;
  }

  get occupancy(): number {
    return this._listeners.length;
  }

  get friendlyName(): string {
    return this._friendlyName;
  }

  set friendlyName(value: string) {
    this._friendlyName = value;
  }

  get coveyTownID(): string {
    return this._coveyTownID;
  }

  /** The list of players currently in the town * */
  private _players: Player[] = [];

  /** TA Player that controls the processing of the Queue */
  private _taPlayer: Player | undefined;

  /** The list of valid sessions for this town * */
  private _sessions: PlayerSession[] = [];

  /** The videoClient that this CoveyTown will use to provision video resources * */
  private _videoClient: IVideoClient = TwilioVideo.getInstance();

  /** The list of CoveyTownListeners that are subscribed to events in this town * */
  private _listeners: CoveyTownListener[] = [];

  private readonly _coveyTownID: string;

  private _friendlyName: string;

  private readonly _townUpdatePassword: string;

  private _isPubliclyListed: boolean;

  private _queue: Queue;

  private _capacity: number;

  private HELPING_LOCATION = {
    x: 1100,
    y: 200,
    rotation: 'front' as Direction,
    moving: false,
  };

  constructor(friendlyName: string, isPubliclyListed: boolean) {
    this._coveyTownID = process.env.DEMO_TOWN_ID === friendlyName ? friendlyName : friendlyNanoID();
    this._capacity = 50;
    this._townUpdatePassword = nanoid(24);
    this._queue = new Queue();
    this._isPubliclyListed = isPubliclyListed;
    this._friendlyName = friendlyName;
    // when the room gets created we add the first user as the admin of the room
  }

  set taPlayer(taPlayer: Player) {
    if (!this._taPlayer) {
      this._taPlayer = taPlayer;
    }
  }

  get taPlayer(): Player {
    if (this._taPlayer) {
      return this._taPlayer;
    }
    throw new Error('No TA player!');
  }

  /**
   * Adds a player to this Covey Town, provisioning the necessary credentials for the
   * player, and returning them
   *
   * @param newPlayer The new player to add to the town
   */
  async addPlayer(newPlayer: Player): Promise<PlayerSession> {
    const theSession = new PlayerSession(newPlayer);

    // Set player as adminPlayer if they are the first player joining the room
    if (this._players.length === 0) {
      this.taPlayer = newPlayer;
      this.taPlayer.isTA = true;
    }

    this._sessions.push(theSession);
    this._players.push(newPlayer);

    // Create a video token for this user to join this town
    theSession.videoToken = await this._videoClient.getTokenForTown(
      this._coveyTownID,
      newPlayer.id,
    );

    // Notify other players that this player has joined
    this._listeners.forEach(listener => listener.onPlayerJoined(newPlayer));

    return theSession;
  }

  /**
   * Adds a player to the current Covey Town queue and
   * returns to them their current position in the queue
   *
   * @param  playerID The ID of the new player being added to the queue
   */
  addPlayerToQueue(playerID: string): number {
    // Find the player by ID
    const player = this._players.find(p => p.id === playerID);
    if (!player) {
      throw new Error('Player ID is invalid');
    }
    // Check that the player does not already exist in the queue
    if (this._queue.isPlayerInQueue(player)) {
      throw new Error('Player is already in the queue');
    }
    // Add the player to the queue
    this._queue.push(player);

    // Send out an updated queue to all listeners
    this._listeners.forEach(listener => listener.onQueueUpdated(this._queue.playerQueue));

    return this._queue.getPlayerPosition(player);
  }

  /**
   * Removes a player from the current Covey Town queue and returns
   *
   * @param  playerID The ID of the new player being removed from the queue
   */
  removePlayerFromQueue(playerID: string): void {
    // Filter the player from the queue
    this._queue.remove(playerID);

    // Send out an updated queue to all listeners
    this._listeners.forEach(listener => listener.onQueueUpdated(this._queue.playerQueue));
  }

  /**
   * Helps the next student in the queue and sends out
   * and update to all players with the updated queue
   */
  helpNextStudent(): boolean {
    // Check if there is anyone left in the queue
    if (!this._queue || this._queue.size() === 0) {
      return false;
    }

    // Get the next player in the queue
    const { player } = this._queue.pop();

    // Change the player's and TA's location so they are in the same space
    this.updatePlayerLocation(player, this.HELPING_LOCATION, true);
    this.updatePlayerLocation(this.taPlayer, this.HELPING_LOCATION, true);

    // Send out an updated queue to all listeners
    this._listeners.forEach(listener => listener.onQueueUpdated(this._queue.playerQueue));

    // Return successful update
    return true;
  }

  /**
   * Destroys all data related to a player in this town.
   *
   * @param session PlayerSession to destroy
   */
  destroySession(session: PlayerSession): void {
    this.removePlayerFromQueue(session.player.id);
    this._players = this._players.filter(p => p.id !== session.player.id);
    this._sessions = this._sessions.filter(s => s.sessionToken !== session.sessionToken);
    this._listeners.forEach(listener => listener.onPlayerDisconnected(session.player));
  }

  /**
   * Updates the location of a player within the town
   * @param player Player to update location for
   * @param location New location for this player
   */
  updatePlayerLocation(player: Player, location: UserLocation, force = false): void {
    player.updateLocation(location);
    this._listeners.forEach(listener => listener.onPlayerMoved(player, force));
  }

  /**
   * Subscribe to events from this town. Callers should make sure to
   * unsubscribe when they no longer want those events by calling removeTownListener
   *
   * @param listener New listener
   */
  addTownListener(listener: CoveyTownListener): void {
    this._listeners.push(listener);
  }

  /**
   * Unsubscribe from events in this town.
   *
   * @param listener The listener to unsubscribe, must be a listener that was registered
   * with addTownListener, or otherwise will be a no-op
   */
  removeTownListener(listener: CoveyTownListener): void {
    this._listeners = this._listeners.filter(v => v !== listener);
  }

  /**
   * Fetch a player's session based on the provided session token. Returns undefined if the
   * session token is not valid.
   *
   * @param token
   */
  getSessionByToken(token: string): PlayerSession | undefined {
    return this._sessions.find(p => p.sessionToken === token);
  }

  disconnectAllPlayers(): void {
    this._listeners.forEach(listener => listener.onTownDestroyed());
  }
}
