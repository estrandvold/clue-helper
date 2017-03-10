import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Notecard } from './notecard';
import { Item } from './item';
import { GuessInformation } from './guess-information';
import { NotecardBrain } from './notecard-brain';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

enum GUESS {
  SUSPECT,
  ROOM,
  WEAPON
}

@Component({
  moduleId: module.id,
  selector: 'all-notecards',
  templateUrl: 'all-notecards.component.html'
})
export class AllNotecardsComponent implements OnInit {
  items: Item[];
  myItems: any;
  playerNames: string[];
  notecardBrain: NotecardBrain;
  guessInformation: GuessInformation;
  guessing: boolean;
  announcements: string[];
  itemAnnouncements: string[];
  GUESS_TYPES = GUESS;

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
    this.guessing = false;
    this.announcements = [];

    // Mark the items I start with and store them
    let initialItems = this.route.snapshot.params['items'].split("|");
    this.markItems(initialItems, PLAYER_INDEX);
    this.myItems = this.createMyItemsObject(initialItems);
    this.itemAnnouncements = ["", "", ""];
  }

  public toggleGuessing(): void {
    this.guessing = (this.guessing) ? false : true;
  }

  public guess(guessType: GUESS, item: string) {
    let announcementIndex: number;

    if(guessType === GUESS.SUSPECT) {
      this.guessInformation.selectSuspect(item);
      announcementIndex = 0;
    } else if(guessType === GUESS.WEAPON) {
      this.guessInformation.selectWeapon(item);
      announcementIndex = 1;
    } else if(guessType === GUESS.ROOM) {
      this.guessInformation.selectRoom(item);
      announcementIndex = 2;
    }

    this.itemAnnouncements[announcementIndex] = "";
    if(this.myItems.hasOwnProperty(item)) {
      this.itemAnnouncements[announcementIndex] = "You have " + item + ". ";
    }
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
    this.itemAnnouncements = ["", "", ""];
  }

  public learnOpponentHasSomething(): void {
    this.announcements.unshift(...this.notecardBrain.opponentHasOr(this.guessInformation));
    this.nextPlayer();
    this.itemAnnouncements = ["", "", ""];
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

  private createMyItemsObject(myItems: string[]): any {
    let result = {};
    for(let i = 0; i < myItems.length; i++) {
      result[myItems[i]] = true;
    }

    return result;
  }
}
