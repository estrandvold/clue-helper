import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PlayersService } from './players.service';

@Component({
  moduleId: module.id,
  selector: 'players',
  templateUrl: 'players.component.html'
})

export class PlayersComponent implements OnInit {

  players: Player[];

  constructor(
    private playersService: PlayersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.players = [];
    // this.players = [{value: "Eric"}, {value: "Shenoa"}, {value: "Charlie"}];
    for(let i = 0; i < 6; i++) {
      this.players.push({value: ""});
    }

    // this.goToGame();
  }

  private buildPlayerArray(): string[] {
    let players: string[] = [];
    this.players.forEach(function(obj) {
      if(obj.value !== "") {
        players.push(obj.value);
      }
    });

    return players;
  }

  getPlaceholderText(index: number): string {
    if(index === 0) {
      return "Add the Main Player..."
    } else {
      return "Add a Player..."
    }
  }

  goToGame(): void {
    this.playersService.addPlayers(this.buildPlayerArray());
    this.router.navigate(['items']);
  }

  playersValid(): boolean {
    let validCount = 0;
    for(let i = 0; i < this.players.length; i++) {
      if(this.players[i].value) {
        validCount++;
      }
    }
    return (this.players[0].value != "" && this.players.length > 2 && validCount > 2);
  }
}

class Player {
  value: string;
}
