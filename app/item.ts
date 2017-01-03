export class Item {
  private name: string;
  private alibi: string;

  private static readonly MINE = "MINE";
  private static readonly OTHER = "OTHER";
  private static readonly UNKNOWN = "UNKNOWN";

  public constructor(name: string) {
    this.name = name;
    this.isUnknown();
  }

  public getAlibi(): string {
    return this.alibi;
  }

  public getName(): string {
    return this.name;
  }

  public isMine(): void {
    this.alibi = Item.MINE;
  }

  public isOther(): void {
    this.alibi = Item.OTHER;
  }

  public isUnknown(): void {
    this.alibi = Item.UNKNOWN;
  }

}
