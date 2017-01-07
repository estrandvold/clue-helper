import { Component, OnInit } from '@angular/core';

import { Notecard } from './notecard';
import { Item } from './item';
import { NotecardBrain } from './notecard-brain';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

@Component({
  moduleId: module.id,
  selector: 'all-notecards',
  templateUrl: 'all-notecards.component.html'
})
export class AllNotecardsComponent implements OnInit {
  notecards: Notecard[];
  items: Item[];
  notecardBrain: NotecardBrain;

  constructor(
    private playersService: PlayersService,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    this.items = this.itemsService.getItems();

    this.notecards = [new Notecard("ME", this.itemsService.getItems(NotecardBrain.NO), true)];
    let players = this.playersService.getPlayers();
    for(var index in players) {
      this.notecards.push(
        new Notecard(
          players[index],
          this.itemsService.getItems(NotecardBrain.UNKNOWN), false)
        );
    }

    this.notecardBrain = new NotecardBrain(this.notecards, 0);
  }

  toggleStatus(notecard: Notecard, i: number): void {
    if(notecard.canToggle) {
      this.notecardBrain.updatePlayerCard(i);
    }
  }


}