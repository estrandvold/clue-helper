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

  public mark(name: string, status: string) {
    for(var i in this.items) {
      if(this.items[i].name === name) {
        this.items[i].status = status;
      }
    }
  }
}
