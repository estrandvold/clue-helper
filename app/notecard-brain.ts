import { Notecard } from './notecard';

export class NotecardBrain {
  private notecards: Notecard[];
  private playerIndex: number;

  public static readonly YES = "YES";
  public static readonly NO = "NO";
  public static readonly UNKNOWN = "UNKNOWN";

  constructor(notecards: Notecard[], playerIndex: number) {
    this.notecards = notecards;
    this.playerIndex = playerIndex;
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
}
