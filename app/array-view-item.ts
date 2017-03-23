export class ArrayViewItem {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static convertToArrayViewItems(items: string[]) {
    return items.map(function(obj: string) {return new ArrayViewItem(obj)});
  }

  public static convertFromArrayViewItems(items: ArrayViewItem[]) {
    return items.map((obj: ArrayViewItem) => {return obj.name});
  }
}
