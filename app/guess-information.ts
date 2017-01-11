export class GuessInformation {
  suspects: string[];
  weapons: string[];
  rooms: string[];
  selectedSuspect: string;
  selectedWeapon: string;
  selectedRoom: string;

  public constructor(suspects: string[], weapons: string[], rooms: string[]) {
    this.suspects = suspects;
    this.weapons = weapons;
    this.rooms = rooms;
    this.selectedSuspect = "";
    this.selectedWeapon = "";
    this.selectedRoom = "";
  }

  public selectSuspect(suspect: string): void {
    this.selectedSuspect = suspect;
  }

  public selectWeapon(weapon: string): void {
    this.selectedWeapon = weapon;
  }

  public selectRoom(room: string): void {
    this.selectedRoom = room;
  }

  public clearSelected(): void {
    this.selectedSuspect = "";
    this.selectedWeapon = "";
    this.selectedRoom = "";
  }

  public isValid(): boolean {
    if (this.selectedSuspect && this.selectedWeapon && this.selectedRoom) {
      return true
    } else {
      return false;
    };
  }
}
