import { Item } from './item';

export class Notecard {
  public name: string;
  public items: Item[] = [];
  private ors: string[][] = [];

  public static readonly YES = "YES";
  public static readonly NO = "NO";
  public static readonly UNKNOWN = "UNKNOWN";

  public constructor(name: string, items: Item[]) {
    this.name = name;
    this.items = items;
  }

  public mark(name: string, status: string) {
    for(var i = 0; i < this.items.length; i++) {
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
      console.log("OR resolved! - " + ors[0]);
      return ors[0];
    } else {
      this.ors.push(ors);
      return undefined;
    }
  }

  public checkOrItems(item: string): string[] {
    let results: string[] = [];

    for(let i = 0; i < this.ors.length; i++) {
      let or = this.ors[i];
      for(let t = 0; t < or.length; t++) {
        if(or[t] === item) {
          or.splice(t, 1);
          t--;
        }
      }
      if(or.length === 1) {
        // We have reduced an OR and know the opponent has an item
        console.log("OR resolved in checkOrItems! - " + or[0]);
        results.push(or[0]);
        this.ors.splice(i, 1);
        i--;
      }
    }

    return results;
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
