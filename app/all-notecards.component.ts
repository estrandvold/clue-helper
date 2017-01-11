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
  notecardBrain: NotecardBrain;
  guessInformation: GuessInformation;
  guessing: boolean;

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
    this.guessing = false;
  }

  createNotecardBrain(): NotecardBrain {
    let notecards = [new Notecard("ME", this.itemsService.getItems(NotecardBrain.NO), true)];
    let players = this.playersService.getPlayers();
    for(var index in players) {
      notecards.push(
        new Notecard(
          players[index],
          this.itemsService.getItems(NotecardBrain.UNKNOWN), false)
        );
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
    this.notecardBrain.opponentHasNone(this.guessInformation);
    this.notecardBrain.nextRevealPlayer();
  }

  learnOpponentHasItem(item: string): void {
    this.notecardBrain.opponentHasItem(item);
    this.nextPlayer();
  }

  learnOpponentHasSomething(): void {
    this.nextPlayer();
  }
}
