import { Component, OnInit } from '@angular/core';

import { Notecard } from './notecard';
import { Item } from './item';
import { GuessInformation } from './guess-information';
import { NotecardBrain } from './notecard-brain';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

@Component({
  moduleId: module.id,
  selector: 'all-notecards',
  templateUrl: 'all-notecards.component.html'
})
export class AllNotecardsComponent implements OnInit {
  items: Item[];
  playerNames: string[];
  notecardBrain: NotecardBrain;
  guessInformation: GuessInformation;
  guessing: boolean;
  announcements: string[];

  constructor(
    private playersService: PlayersService,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    this.items = this.itemsService.getItems();
    this.guessInformation = new GuessInformation(
      this.itemsService.getSuspects(),
      this.itemsService.getWeapons(),
      this.itemsService.getRooms()
    );
    this.notecardBrain = this.createNotecardBrain();
    this.playerNames = this.notecardBrain.getPlayerNames();
    this.guessing = false;
    this.announcements = [];
  }

  createNotecardBrain(): NotecardBrain {
    let notecards: Notecard[] = [];
    let players = this.playersService.getPlayers();

    for(let i = 0; i < players.length; i++) {
      let status = (i === 0) ? Notecard.NO : Notecard.UNKNOWN;
      let change = (i === 0) ? true : false;

      notecards.push(
        new Notecard(players[i], this.itemsService.getItems(status), change));
    }

    return new NotecardBrain(notecards, 0);
  }

  toggleGuessing(): void {
    this.guessing = (this.guessing) ? false : true;
  }

  toggleStatus(notecard: Notecard, i: number): void {
    if(notecard.canToggle) {
      this.notecardBrain.updatePlayerCard(i);
    }
  }

  nextPlayer(): void {
    this.guessInformation.clearSelected();
    this.guessing = false;
    this.notecardBrain.nextPlayer();
  }

  learnOpponentHasNone(): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasNone(this.guessInformation));
    this.notecardBrain.nextRevealPlayer();
  }

  learnOpponentHasItem(item: string): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasItem(item));
    this.nextPlayer();
  }

  learnOpponentHasSomething(): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasOr(this.guessInformation));
    this.nextPlayer();
  }

  getRowStyle(item: string): string {
    let status = this.notecardBrain.getItemStatus(item);

    if(status === NotecardBrain.ALL_NO) {
      return "success";
    } else if (status === NotecardBrain.ONE_YES) {
      return "danger";
    } else {
      return "";
    }
  }
}
