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

  getActivePlayer(): string {
    return this.notecards[this.activePlayer].name;
  }

  getRevealPlayer(): string {
    return this.notecards[this.revealPlayer].name;
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

  /**
   * @todo This whole function is destined for the garbage bin as soon as player
   * items are selected on a different screen and toggling is disabled.
   */
  updatePlayerCard(i: number): void {
    let playerNotecard = this.notecards[this.playerIndex];
    let status = playerNotecard.items[i].status;
    let itemName = playerNotecard.items[i].name;

    // Toggle the player card
    if(status === Notecard.NO) {
      this.markYes(this.playerIndex, itemName);
    } else {
      // Because main player status can be toggled, we need to make sure opponent
      // status is changed back to UNKNOWN when appropriate
      for(let notecardIndex = 0; notecardIndex < this.notecards.length; notecardIndex++) {
        if(notecardIndex === this.playerIndex) { continue; }
        this.notecards[notecardIndex].items[i].status = Notecard.UNKNOWN;
      }
      this.items[itemName].status = NotecardBrain.UNKNOWN;

      this.markNo(this.playerIndex, itemName);
    }

  }

  opponentHasNone(guessInformation: GuessInformation): void {
    this.markNo(this.revealPlayer, guessInformation.selectedSuspect);
    this.markNo(this.revealPlayer, guessInformation.selectedWeapon);
    this.markNo(this.revealPlayer, guessInformation.selectedRoom);
  }

  opponentHasItem(item: string, opponentIndex?: number): void {
    // If an opponent isn't received, assume it is the player revealing cards
    if(!opponentIndex) {opponentIndex = this.revealPlayer;}

    this.markYes(opponentIndex, item);
  }

  opponentHasOr(guessInformation: GuessInformation): void {
    let item = this.notecards[this.revealPlayer].addOrItems([
      guessInformation.selectedSuspect,
      guessInformation.selectedWeapon,
      guessInformation.selectedRoom
    ]);

    if(item) {
      // We can deduce they have an item!
      this.opponentHasItem(item);
    }
  }

  private buildItemStatus(items: Item[]): any {
    let itemStatus = {};
    for(let i = 0; i < items.length; i++) {
      itemStatus[items[i].name] = {status: NotecardBrain.UNKNOWN, type: items[i].type};
    }

    return itemStatus;
  }

  private markNo(index: number, item: string): void {
    this.notecards[index].mark(item, Notecard.NO);

    if(this.noPlayerHasItem(item)) {
      this.items[item].status = NotecardBrain.ALL_NO;
    }

    let items = this.notecards[index].checkOrItems(item);
    for(let i = 0; i < items.length; i++) {
      this.opponentHasItem(items[i], index);
    }
  }

  private markYes(index: number, item: string): void {
    this.items[item].status = NotecardBrain.ONE_YES;

    for(let i = 0; i < this.notecards.length; i++) {
      if(i === index) {
        this.notecards[i].mark(item, Notecard.YES);
      } else {
        this.notecards[i].mark(item, Notecard.NO);
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
    }
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
