export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  private _isTA: boolean;

  constructor(id: string, userName: string, location: UserLocation, isTA: boolean) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this._isTA = isTA;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get isTA(): boolean {
    return this._isTA;
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(playerFromServer._id, playerFromServer._userName, playerFromServer.location, playerFromServer._isTA);
  }
}
export type ServerPlayer = { _id: string, _userName: string, location: UserLocation, _isTA: boolean };

export type Direction = 'front'|'back'|'left'|'right';

export type UserLocation = {
  x: number,
  y: number,
  rotation: Direction,
  moving: boolean
};
