import { Component, OnInit, Input } from '@angular/core';

import { Notecard } from './notecard';
import { Item } from './item';
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

  constructor(
    private playersService: PlayersService,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    this.items = this.itemsService.getItems();

    this.notecards = [new Notecard("ME", this.itemsService.getItems("NO"), true)];
    let players = this.playersService.getPlayers();
    for(var index in players) {
      this.notecards.push(new Notecard(players[index], this.itemsService.getItems("UNKNOWN"), false));
    }
  }

  toggleStatus(notecard: Notecard, i: number): void {
    if(notecard.canToggle) {
      this.updatePlayerCard(i);
    }
  }

  updatePlayerCard(i: number): void {
    let playerNotecard = this.notecards[0];
    let status = playerNotecard.items[i].status;
    if(status === "NO") {
      playerNotecard.items[i].status = "YES";
    } else {
      playerNotecard.items[i].status = "NO";
    }

    let othersStatus = (status === "NO") ? "NO" : "UNKNOWN";
    for(var notecardIndex = 1; notecardIndex < this.notecards.length; notecardIndex++) {
      this.notecards[notecardIndex].items[i].status = othersStatus;
    }
  }
}
