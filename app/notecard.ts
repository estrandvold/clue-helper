import { Item } from './item';

export class Notecard {
  public name: string;
  public canToggle: boolean;
  public items: Item[] = [];
  private ors: string[][] = [];

  public static readonly YES = "YES";
  public static readonly NO = "NO";
  public static readonly UNKNOWN = "UNKNOWN";

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

  public addOrItems(items: string[]): string {
    let ors: string[] = [];
    for(var i in items) {
      if(this.getStatus(items[i]) !== Notecard.NO) {
        ors.push(items[i]);
      }
    }

    if(ors.length === 1) {
      // Since there is only one OR we can definitly mark it as YES
      return ors[0];
    } else {
      this.ors.push(ors);
      console.log(this.ors);
      return undefined;
    }
  }

  private getStatus(item: string): string {
    for(var i in this.items) {
      if(this.items[i].name === item) {
        return this.items[i].status;
      }
    }

    // Need to handle this error!
    return undefined;
  }
}
