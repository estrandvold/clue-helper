import { Component, OnInit } from '@angular/core';

import { Notecard } from './notecard';
import { Item } from './item';
import { PlayersService } from './players.service';

@Component({
  moduleId: module.id,
  selector: 'notecard',
  templateUrl: 'notecard.component.html'
})
export class NotecardComponent implements OnInit {
  notecard: Notecard;
  players: string[];

  constructor(
    private playersService: PlayersService
  ) { }

  ngOnInit(): void {
    this.players = this.playersService.getPlayers();
    this.notecard = new Notecard("ME", "NO");
  }

  toggleStatus(status: string): string {
    if(status === "NO") {
      return "YES";
    } else {
      return "NO";
    }
  }
}
