import { Notecard } from './notecard';
import { Item } from './item';
import { GuessInformation } from './guess-information'

export class NotecardBrain {
  public static readonly UNKNOWN = "UNKNOWN";
  public static readonly ALL_NO = "ALL_NO";
  public static readonly ONE_YES = "ONE_YES";

  private notecards: Notecard[];
  private items: any;
  private playerIndex: number;
  private activePlayer: number;
  private revealPlayer: number;

  constructor(notecards: Notecard[], playerIndex: number) {
    this.notecards = notecards;
    this.playerIndex = playerIndex;
    this.activePlayer = 0;
    this.revealPlayer = 1;
    this.items = this.buildItemStatus(notecards[0].items);
  }

  getNotecards(): Notecard[] {
    return this.notecards;
  }

  getItemStatus(item: string): string {
    return this.items[item].status;
  }

  getPlayerNames(): string[] {
    let names: string[] = [];

    for(var i = 0; i < this.notecards.length; i++) {
      names.push(this.notecards[i].name);
    }

    return names;
  }

  getMainPlayerName(): string {
    return this.notecards[this.playerIndex].name;
  }

  getActivePlayer(): string {
    return this.notecards[this.activePlayer].name;
  }

  getRevealPlayer(): string {
    return this.notecards[this.revealPlayer].name;
  }

  isMyTurn(): boolean {
    return (this.activePlayer === this.playerIndex) ? true : false;
  }

  isMyReveal(): boolean {
    return (this.revealPlayer === this.playerIndex) ? true : false;
  }

  nextPlayer(): void {
    this.activePlayer = this.increment(this.activePlayer, this.notecards.length - 1);
    this.revealPlayer = this.increment(this.activePlayer, this.notecards.length - 1);
  }

  nextRevealPlayer(): void {
    this.revealPlayer = this.increment(this.revealPlayer, this.notecards.length - 1);
  }

  previousPlayer(): void {
    this.activePlayer = this.decrement(this.activePlayer, this.notecards.length - 1);
    this.revealPlayer = this.increment(this.activePlayer, this.notecards.length - 1);
  }

  opponentHasNone(guessInformation: GuessInformation): string[] {
    let results: string[] = [];
    results.push(...this.markNo(this.revealPlayer, guessInformation.selectedSuspect));
    results.push(...this.markNo(this.revealPlayer, guessInformation.selectedWeapon));
    results.push(...this.markNo(this.revealPlayer, guessInformation.selectedRoom));
    return results;
  }

  opponentHasItem(item: string, opponentIndex?: number): string[] {
    // If an opponent isn't received, assume it is the player revealing cards
    if(opponentIndex === undefined) {opponentIndex = this.revealPlayer;}

    return this.markYes(opponentIndex, item);
  }

  opponentHasOr(guessInformation: GuessInformation): string[] {
    let results: string[] = [];
    let item = this.notecards[this.revealPlayer].addOrItems([
      guessInformation.selectedSuspect,
      guessInformation.selectedWeapon,
      guessInformation.selectedRoom
    ]);

    if(item) {
      // We can deduce they have an item!
      results.push(this.notecards[this.revealPlayer].name + " has " + item,
                                  ...this.opponentHasItem(item));
    }

    return results;
  }

  private buildItemStatus(items: Item[]): any {
    let itemStatus = {};
    for(let i = 0; i < items.length; i++) {
      itemStatus[items[i].name] = {status: NotecardBrain.UNKNOWN, type: items[i].type};
    }

    return itemStatus;
  }

  private markNo(index: number, item: string): string[] {
    this.notecards[index].mark(item, Notecard.NO);

    if(this.noPlayerHasItem(item)) {
      this.items[item].status = NotecardBrain.ALL_NO;
    }

    let results: string[] = [];
    let items = this.notecards[index].checkOrItems(item);
    for(let i = 0; i < items.length; i++) {
      results.push(this.notecards[index].name + " has " + items[i]);
      results.push(...this.opponentHasItem(items[i], index));
    }

    return results;
  }

  private markYes(index: number, item: string): string[] {
    this.items[item].status = NotecardBrain.ONE_YES;
    let results: string[] = [];

    for(let i = 0; i < this.notecards.length; i++) {
      if(i === index) {
        this.notecards[i].mark(item, Notecard.YES);
      } else {
        results.push(...this.markNo(i, item));
      }
    }

    // Check to see if there is only one item of a type that is not marked YES.
    // If so, that means nobody has the remaining item and it must be in the
    // middle of the board
    let singleName = this.getNameOfSingleRemainingType(this.items[item].type);
    if(singleName != null) {
      for(let j = 0; j < this.notecards.length; j++) {
        this.markNo(j, singleName);
      }
      results.push(singleName + " is in the middle!");
    }

    return results;
  }

  private getNameOfSingleRemainingType(type: string): string {
    let count = 0;
    let name: string;
    for(let item in this.items) {
      if(this.items[item].type === type && this.items[item].status !== NotecardBrain.ONE_YES) {
        count++;
        name = item;
      }
    }

    if(count !== 1) {
      name = null;
    }

    return name;
  }

  private noPlayerHasItem(item: string): boolean {
    // Get index from item name
    let index = -1;
    let items = this.notecards[0].items;
    for(let i = 0; i < items.length; i++) {
      if(items[i].name === item) {
        index = i;
        break;
      }
    }

    // Look through notecards and check if any player has or might have the item
    for(let i = 0; i < this.notecards.length; i++) {
      if(this.notecards[i].items[index].status !== Notecard.NO) {
        return false;
      }
    }

    return true;
  }

  private increment(num: number, max: number): number {
    num++;
    if(num > max) {
      num = 0;
    }

    return num;
  }

  private decrement(num: number, max: number): number {
    num--;
    if(num < 0) {
      num = max;
    }

    return num;
  }
}
