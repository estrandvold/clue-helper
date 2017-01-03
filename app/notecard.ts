import { Item } from './item';

export class Notecard {
  public suspects: Item[] = [];
  public weapons: Item[] = [];
  public rooms: Item[] = [];

  public constructor() {
    this.suspects.push(
      new Item("Miss Scarlet"),
      new Item("Professor Plum"),
      new Item("Mrs. Peacock"),
      new Item("Mr. Green"),
      new Item("Colonel Mustard"),
      new Item("Mrs. White")
    );

    this.weapons.push(
      new Item("Candlestick"),
      new Item("Knife"),
      new Item("Lead Pipe"),
      new Item("Revolver"),
      new Item("Rope"),
      new Item("Wrench")
    )

    this.rooms.push(
      new Item("Kitchen"),
      new Item("Ballroom"),
      new Item("Conservatory"),
      new Item("Dining Room"),
      new Item("Billiard Room"),
      new Item("Library"),
      new Item("Lounge"),
      new Item("Hall"),
      new Item("Study")
    )
  }
}
