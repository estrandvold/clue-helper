import { GuessInformation } from './guess-information';

describe('GuessInformation class tests', () => {

  let guessInformation: GuessInformation;
  let SUSPECTS = ["Bob", "Sue"];
  let WEAPONS = ["Candlestick", "Rope"];
  let ROOMS = ["Ballroom", "Kitchen"];

  beforeEach(() => {
    guessInformation = new GuessInformation(SUSPECTS, WEAPONS, ROOMS);
  });

  it('should create a GuessInformation', () => {
    expect(guessInformation.suspects).toBe(SUSPECTS);
    expect(guessInformation.weapons).toBe(WEAPONS);
    expect(guessInformation.rooms).toBe(ROOMS);
    expect(guessInformation.selectedSuspect).toBe("");
    expect(guessInformation.selectedWeapon).toBe("");
    expect(guessInformation.selectedRoom).toBe("");
  });

  it('should allow selecting and clearing items', () => {
    let suspect = "Harry";
    let weapon = "Pipe";
    let room = "Attic";

    guessInformation.selectSuspect(suspect);
    expect(guessInformation.selectedSuspect).toBe(suspect);

    guessInformation.selectWeapon(weapon);
    expect(guessInformation.selectedWeapon).toBe(weapon);

    guessInformation.selectRoom(room);
    expect(guessInformation.selectedRoom).toBe(room);

    guessInformation.clearSelected();
    expect(guessInformation.selectedSuspect).toBe("");
    expect(guessInformation.selectedWeapon).toBe("");
    expect(guessInformation.selectedRoom).toBe("");

  });

  it('should validate a guess', () => {
    expect(guessInformation.isValid()).toBe(false);

    guessInformation.selectSuspect("Harry");
    expect(guessInformation.isValid()).toBe(false);

    guessInformation.selectWeapon("Pipe");
    expect(guessInformation.isValid()).toBe(false);

    guessInformation.selectRoom("Attic");
    expect(guessInformation.isValid()).toBe(true);

  });
});
