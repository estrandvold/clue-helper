import { Item } from './item';

describe('Item class tests', () => {
  let ITEM = "ITEM";
  let STATUS = "STATUS";
  let TYPE = "TYPE";

  it('should create an Item', () => {
    let item: Item = new Item(ITEM, STATUS, TYPE);
    expect(item.name).toBe(ITEM);
    expect(item.status).toBe(STATUS);
    expect(item.type).toBe(TYPE);
  });
});
