import { Injectable }    from '@angular/core';

import { Item } from './item';

@Injectable()
export class ItemsService {

  public static readonly SUSPECT = "SUSPECT";
  public static readonly WEAPON = "WEAPON";
  public static readonly ROOM = "ROOM";

  private suspects = [
    "Miss Scarlet",
    "Professor Plum",
    "Mrs. Peacock",
    "Mr. Green",
    "Colonel Mustard",
    "Mrs. White",
  ];

  private weapons = [
    "Candlestick",
    "Knife",
    "Lead Pipe",
    "Revolver",
    "Rope",
    "Wrench",
  ];

  private rooms = [
    "Kitchen",
    "Ballroom",
    "Conservatory",
    "Dining Room",
    "Billiard Room",
    "Library",
    "Lounge",
    "Hall",
    "Study"
  ];

  getItems(status?: string): Item[] {
    let items: Item[] = [];

    for(let i in this.suspects) {
      items.push(new Item(this.suspects[i], status, ItemsService.SUSPECT));
    }

    for(let i in this.weapons) {
      items.push(new Item(this.weapons[i], status, ItemsService.WEAPON));
    }

    for(let i in this.rooms) {
      items.push(new Item(this.rooms[i], status, ItemsService.ROOM));
    }

    return items;
  }

  getSuspects(): string[] {
    return this.suspects.slice(0);
  }

  getWeapons(): string[] {
    return this.weapons.slice(0);
  }

  getRooms(): string[] {
    return this.rooms.slice(0);
  }
}
