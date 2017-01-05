import { Item } from './item';

export class Notecard {
  public name: string;
  public canToggle: boolean;
  public items: Item[] = [];

  public constructor(name: string, items: Item[], canToggle: boolean) {
    this.name = name;
    this.items = items;
    this.canToggle = canToggle;
  }
}
