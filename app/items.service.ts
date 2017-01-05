import { Injectable }    from '@angular/core';

import { Item } from './item';

@Injectable()
export class ItemsService {

  static readonly SUSPECT = "SUSPECT";
  static readonly WEAPON = "WEAPON";
  static readonly ROOM = "ROOM";

  getItems(status?: string): Item[] {
    return [
      new Item("Miss Scarlet", status, ItemsService.SUSPECT),
      new Item("Professor Plum", status, ItemsService.SUSPECT),
      new Item("Mrs. Peacock", status, ItemsService.SUSPECT),
      new Item("Mr. Green", status, ItemsService.SUSPECT),
      new Item("Colonel Mustard", status, ItemsService.SUSPECT),
      new Item("Mrs. White", status, ItemsService.SUSPECT),
      new Item("Candlestick", status, ItemsService.WEAPON),
      new Item("Knife", status, ItemsService.WEAPON),
      new Item("Lead Pipe", status, ItemsService.WEAPON),
      new Item("Revolver", status, ItemsService.WEAPON),
      new Item("Rope", status, ItemsService.WEAPON),
      new Item("Wrench", status, ItemsService.WEAPON),
      new Item("Kitchen", status, ItemsService.ROOM),
      new Item("Ballroom", status, ItemsService.ROOM),
      new Item("Conservatory", status, ItemsService.ROOM),
      new Item("Dining Room", status, ItemsService.ROOM),
      new Item("Billiard Room", status, ItemsService.ROOM),
      new Item("Library", status, ItemsService.ROOM),
      new Item("Lounge", status, ItemsService.ROOM),
      new Item("Hall", status, ItemsService.ROOM),
      new Item("Study", status, ItemsService.ROOM)
    ];
  }
}
