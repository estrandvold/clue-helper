import { ArrayViewItem } from './array-view-item';

describe('ArrayViewItem tests', () => {

  it('should create ArrayViewItems', () => {
    let item: ArrayViewItem = new ArrayViewItem("name");
    expect(item.name).toEqual("name");
  });

  it('should convert an array of strings to an array of ArrayViewItems', () => {
    let strings: string[] = ["Hello", "World"];
    let items: ArrayViewItem[] = ArrayViewItem.convertToArrayViewItems(strings);
    expect(items.length).toBe(2);
    expect(items[0].name).toEqual("Hello");
  })
});
