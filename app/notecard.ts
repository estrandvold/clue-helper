import { Item } from './item';
import { NotecardBrain } from './notecard-brain'

export class Notecard {
  public name: string;
  public canToggle: boolean;
  public items: Item[] = [];

  public constructor(name: string, items: Item[], canToggle: boolean) {
    this.name = name;
    this.items = items;
    this.canToggle = canToggle;
  }

  public markNo(name: string) {
    for(var i in this.items) {
      if(this.items[i].name === name) {
        this.items[i].status = NotecardBrain.NO;
      }
    }
  }
}
