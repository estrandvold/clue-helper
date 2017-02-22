import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
    private playersService: PlayersService,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    const PLAYER_INDEX = 0;

    this.items = this.itemsService.getItems();
    this.guessInformation = new GuessInformation(
      this.itemsService.getSuspects(),
      this.itemsService.getWeapons(),
      this.itemsService.getRooms()
    );
    this.notecardBrain = this.createNotecardBrain(PLAYER_INDEX);
    this.playerNames = this.notecardBrain.getPlayerNames();
    this.markItems(this.route.snapshot.params['items'].split("|"), PLAYER_INDEX);
    this.guessing = false;
    this.announcements = [];
  }

  public toggleGuessing(): void {
    this.guessing = (this.guessing) ? false : true;
  }

  public nextPlayer(): void {
    this.guessInformation.clearSelected();
    this.guessing = false;
    this.notecardBrain.nextPlayer();
  }

  public markItems(items: string[], playerIndex: number): void {
    for(let i = 0; i < items.length; i++) {
      if(items[i]) {
        this.notecardBrain.opponentHasItem(items[i], playerIndex);
      }
    }
  }

  public learnOpponentHasNone(): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasNone(this.guessInformation));
    this.notecardBrain.nextRevealPlayer();
  }

  public learnOpponentHasItem(item: string): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasItem(item));
    this.nextPlayer();
  }

  public learnOpponentHasSomething(): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasOr(this.guessInformation));
    this.nextPlayer();
  }

  public getRowStyle(item: string): string {
    let status = this.notecardBrain.getItemStatus(item);

    if(status === NotecardBrain.ALL_NO) {
      return "success";
    } else if (status === NotecardBrain.ONE_YES) {
      return "danger";
    } else {
      return "";
    }
  }

  private createNotecardBrain(playerIndex: number): NotecardBrain {
    let notecards: Notecard[] = [];
    let players = this.playersService.getPlayers();

    for(let i = 0; i < players.length; i++) {
      let status = (i === playerIndex) ? Notecard.NO : Notecard.UNKNOWN;

      notecards.push(new Notecard(players[i], this.itemsService.getItems(status)));
    }

    return new NotecardBrain(notecards, playerIndex);
  }
}
