import { Notecard } from './notecard';
import { GuessInformation } from './guess-information'

export class NotecardBrain {
  private notecards: Notecard[];
  private playerIndex: number;
  private activePlayer: number;
  private revealPlayer: number;

  public static readonly YES = "YES";
  public static readonly NO = "NO";
  public static readonly UNKNOWN = "UNKNOWN";

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
    if(status === NotecardBrain.NO) {
      playerNotecard.items[i].status = NotecardBrain.YES;
    } else {
      playerNotecard.items[i].status = NotecardBrain.NO;
    }

    // Set all the opponent's status to UNKNOWN if the player status is NO
    // Set all the opponent's status to NO if the player status is YES
    let opponentStatus = (status === NotecardBrain.NO) ? NotecardBrain.NO : NotecardBrain.UNKNOWN;
    for(var notecardIndex = 0; notecardIndex < this.notecards.length; notecardIndex++) {
      // Don't update the player's card
      if(notecardIndex === this.playerIndex) { continue; }

      // Update an opponent's card
      this.notecards[notecardIndex].items[i].status = opponentStatus;
    }
  }

  opponentHasNone(guessInformation: GuessInformation) {
    this.notecards[this.revealPlayer].markNo(guessInformation.selectedSuspect);
    this.notecards[this.revealPlayer].markNo(guessInformation.selectedWeapon);
    this.notecards[this.revealPlayer].markNo(guessInformation.selectedRoom);
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
