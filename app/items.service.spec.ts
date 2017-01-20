import { ItemsService } from './items.service';
import { Item } from './item';

describe('ItemsService class tests', () => {
  let itemsService: ItemsService;

  beforeEach(() => {
    itemsService = new ItemsService();
  });

  it('should get suspects', () => {
    expect(itemsService.getSuspects()).toEqual([
      "Miss Scarlet",
      "Professor Plum",
      "Mrs. Peacock",
      "Mr. Green",
      "Colonel Mustard",
      "Mrs. White"
    ]);
  });

  it('should get weapons', () => {
    expect(itemsService.getWeapons()).toEqual([
      "Candlestick",
      "Knife",
      "Lead Pipe",
      "Revolver",
      "Rope",
      "Wrench"
    ]);
  });

  it('should get rooms', () => {
    expect(itemsService.getRooms()).toEqual([
      "Kitchen",
      "Ballroom",
      "Conservatory",
      "Dining Room",
      "Billiard Room",
      "Library",
      "Lounge",
      "Hall",
      "Study"
    ]);
  });

  it('should get all items', () => {
    let items = itemsService.getItems("STATUS");
    expect(items.length).toBe(21);
    expect(items[0].status).toEqual("STATUS");
  });
});
