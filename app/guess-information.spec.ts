import { GuessInformation } from './guess-information';

describe('GuessInformation class tests', () => {

  let guessInformation: GuessInformation;
  let SUSPECTS = ["Bob", "Sue"];
  let WEAPONS = ["Candlestick", "Rope"];
  let ROOMS = ["Ballroom", "Kitchen"];

  beforeEach(() => {
    this.guessInformation = new GuessInformation(SUSPECTS, WEAPONS, ROOMS);
  });

  it('should create a GuessInformation', () => {
    expect(this.guessInformation.suspects).toBe(SUSPECTS);
    expect(this.guessInformation.weapons).toBe(WEAPONS);
    expect(this.guessInformation.rooms).toBe(ROOMS);
    expect(this.guessInformation.selectedSuspect).toBe("");
    expect(this.guessInformation.selectedWeapon).toBe("");
    expect(this.guessInformation.selectedRoom).toBe("");
  });

  it('should allow selecting and clearing items', () => {
    let suspect = "Harry";
    let weapon = "Pipe";
    let room = "Attic";

    this.guessInformation.selectSuspect(suspect);
    expect(this.guessInformation.selectedSuspect).toBe(suspect);

    this.guessInformation.selectWeapon(weapon);
    expect(this.guessInformation.selectedWeapon).toBe(weapon);

    this.guessInformation.selectRoom(room);
    expect(this.guessInformation.selectedRoom).toBe(room);

    this.guessInformation.clearSelected();
    expect(this.guessInformation.selectedSuspect).toBe("");
    expect(this.guessInformation.selectedWeapon).toBe("");
    expect(this.guessInformation.selectedRoom).toBe("");

  });

  it('should validate a guess', () => {
    expect(this.guessInformation.isValid()).toBe(false);

    this.guessInformation.selectSuspect("Harry");
    expect(this.guessInformation.isValid()).toBe(false);

    this.guessInformation.selectWeapon("Pipe");
    expect(this.guessInformation.isValid()).toBe(false);

    this.guessInformation.selectRoom("Attic");
    expect(this.guessInformation.isValid()).toBe(true);

  });
});
