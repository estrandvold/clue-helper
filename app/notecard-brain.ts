import { Notecard } from './notecard';
import { GuessInformation } from './guess-information'

export class NotecardBrain {
  private notecards: Notecard[];
  private playerIndex: number;
  private activePlayer: number;
  private revealPlayer: number;

  constructor(notecards: Notecard[], playerIndex: number) {
    this.notecards = notecards;
    this.playerIndex = playerIndex;
    this.activePlayer = 0;
    this.revealPlayer = 1;
  }

  getNotecards(): Notecard[] {
    return this.notecards;
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

  updatePlayerCard(i: number): void {
    let playerNotecard = this.notecards[this.playerIndex];
    let status = playerNotecard.items[i].status;

    // Toggle the player card
    if(status === Notecard.NO) {
      playerNotecard.items[i].status = Notecard.YES;
    } else {
      playerNotecard.items[i].status = Notecard.NO;
    }

    // Set all the opponent's status to UNKNOWN if the player status is NO
    // Set all the opponent's status to NO if the player status is YES
    let opponentStatus = (status === Notecard.NO) ? Notecard.NO : Notecard.UNKNOWN;
    for(var notecardIndex = 0; notecardIndex < this.notecards.length; notecardIndex++) {
      // Don't update the player's card
      if(notecardIndex === this.playerIndex) { continue; }

      // Update an opponent's card
      this.notecards[notecardIndex].items[i].status = opponentStatus;
    }
  }

  itemFound(index: number): boolean {
    for(var i in this.notecards) {
      if(this.notecards[i].items[index].status === Notecard.YES) {
        return true;
      }
    }

    return false;
  }

  opponentHasNone(guessInformation: GuessInformation) {
    this.markNo(this.revealPlayer, guessInformation.selectedSuspect);
    this.markNo(this.revealPlayer, guessInformation.selectedWeapon);
    this.markNo(this.revealPlayer, guessInformation.selectedRoom);
  }

  opponentHasItem(item: string, opponentIndex?: number): void {
    if(!opponentIndex) {opponentIndex = this.revealPlayer;}

    var that = this;
    this.notecards.forEach(function(notecard, index) {
      if(index === opponentIndex) {
        notecard.mark(item, Notecard.YES);
      } else {
        that.markNo(index, item);
      }
    });
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

  private markNo(index: number, item: string): void {
    this.notecards[index].mark(item, Notecard.NO);
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
