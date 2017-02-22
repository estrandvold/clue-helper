import { Notecard } from './notecard';
import { Item } from './item';

describe('Notecard class tests', () => {

  let notecard: Notecard;
  let items: Item[];

  beforeEach(() => {
    items = [];
    let status = Notecard.UNKNOWN;
    let type = "TYPE";

    items.push(new Item("Miss Scarlet", status, type));
    items.push(new Item("Professor Plum", status, type));
    items.push(new Item("Candlestick", status, type));
    items.push(new Item("Knife", status, type));
    items.push(new Item("Kitchen", status, type));
    items.push(new Item("Ballroom", status, type));

    notecard = new Notecard("Tim", items);
  });

  it('should create a Notecard', () => {
    expect(notecard.name).toBe("Tim");
    expect(notecard.items).toBe(items);
  });

  it('should change the status of notecard items', () => {

    let countStatus = (items: Item[], status: string): number => {
      let count = 0;
      for(var i = 0; i < items.length; i++) {
        if(items[i].status === status) {
          count ++;
        }
      }
      return count;
    };

    // The test notecard has been created so all items are marked UNKNOWN
    expect(countStatus(notecard.items, Notecard.UNKNOWN)).toBe(6);
    expect(countStatus(notecard.items, Notecard.YES)).toBe(0);

    expect(notecard.items[0].status).toBe(Notecard.UNKNOWN);
    notecard.mark("Miss Scarlet", Notecard.YES);
    expect(notecard.items[0].status).toBe(Notecard.YES);

    expect(notecard.items[2].status).toBe(Notecard.UNKNOWN);
    notecard.mark("Candlestick", Notecard.YES);
    expect(notecard.items[2].status).toBe(Notecard.YES);

    notecard.mark("Wrong", Notecard.YES);

    // The notecard has been marked YES 3 times, but 1 time was incorrect so
    // we should only see 2 changes
    expect(countStatus(notecard.items, Notecard.UNKNOWN)).toBe(4);
    expect(countStatus(notecard.items, Notecard.YES)).toBe(2);
  });

  it('should add OR items', () => {
    let item = notecard.addOrItems(["Miss Scarlet", "Candlestick", "Kitchen"]);
    expect(item).toBeUndefined();
  });

  it('should return an item when the OR is already resolved', () => {
    notecard.mark("Miss Scarlet", Notecard.NO);
    let item = notecard.addOrItems(["Miss Scarlet", "Candlestick", "Kitchen"]);
    expect(item).toBeUndefined();

    notecard.mark("Candlestick", Notecard.NO);
    item = notecard.addOrItems(["Miss Scarlet", "Candlestick", "Kitchen"]);
    expect(item).toBe("Kitchen");
  });

  it('should be able to resolve OR items when new information is found', () => {
    notecard.addOrItems(["Miss Scarlet", "Candlestick", "Kitchen"]);
    let items = notecard.checkOrItems("Miss Scarlet");
    expect(items).toEqual([]);

    items = notecard.checkOrItems("Candlestick");
    expect(items).toEqual(["Kitchen"]);
  });

  it('should be able to resolve multiple OR items simultaneously', () => {
    notecard.addOrItems(["Miss Scarlet", "Candlestick", "Kitchen"]);
    notecard.addOrItems(["Miss Scarlet", "Knife", "Ballroom"]);

    let items = notecard.checkOrItems("Candlestick");
    expect(items).toEqual([]);

    items = notecard.checkOrItems("Knife");
    expect(items).toEqual([]);

    items = notecard.checkOrItems("Miss Scarlet");
    expect(items).toEqual(["Kitchen", "Ballroom"]);
  });
});
