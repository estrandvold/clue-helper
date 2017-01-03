import { Item } from './item';

export class Notecard {
  public name: string;
  public suspects: Item[] = [];
  public weapons: Item[] = [];
  public rooms: Item[] = [];

  public constructor(name: string, status: string) {
    this.name = name;

    this.suspects.push(
      new Item("Miss Scarlet", status),
      new Item("Professor Plum", status),
      new Item("Mrs. Peacock", status),
      new Item("Mr. Green", status),
      new Item("Colonel Mustard", status),
      new Item("Mrs. White", status)
    );

    this.weapons.push(
      new Item("Candlestick", status),
      new Item("Knife", status),
      new Item("Lead Pipe", status),
      new Item("Revolver", status),
      new Item("Rope", status),
      new Item("Wrench", status)
    )

    this.rooms.push(
      new Item("Kitchen", status),
      new Item("Ballroom", status),
      new Item("Conservatory", status),
      new Item("Dining Room", status),
      new Item("Billiard Room", status),
      new Item("Library", status),
      new Item("Lounge", status),
      new Item("Hall", status),
      new Item("Study", status)
    )
  }
}
