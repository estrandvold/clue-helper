export class Item {
  name: string;
  status: string;
  type: string;

  public constructor(name: string, status: string, type: string) {
    this.name = name;
    this.status = status;
    this.type = type;
  }
}
