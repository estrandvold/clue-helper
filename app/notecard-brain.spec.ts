import { NotecardBrain } from './notecard-brain';
import { Notecard } from './notecard';
import { Item } from './item';
import { GuessInformation } from './guess-information';

describe('NotecardBrain class tests', () => {

  let notecardBrain: NotecardBrain;
  let notecards: Notecard[];
  let playerIndex = 0;

  beforeEach(() => {
    let type = "TYPE";
    notecards = [];

    for(let i = 0; i < 3; i++) {
      let status = (i === playerIndex) ? Notecard.NO : Notecard.UNKNOWN;
      let canToggle = (i === playerIndex) ? true : false;
      let items: Item[] = [];
      items.push(new Item("Miss Scarlet", status, type));
      items.push(new Item("Professor Plum", status, type));
      items.push(new Item("Candlestick", status, type));
      items.push(new Item("Knife", status, type));
      items.push(new Item("Kitchen", status, type));
      items.push(new Item("Ballroom", status, type));

      let notecard: Notecard = new Notecard("Player" + i, items, canToggle);
      notecards.push(notecard);
    }

    notecardBrain = new NotecardBrain(notecards, playerIndex);
  });

  it('should create a NotecardBrain', () => {
    expect(notecardBrain.getNotecards()).toBe(notecards);
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player1");
  });

  it('should be able to go to the next player', () => {
    notecardBrain.nextPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player1");
    expect(notecardBrain.getRevealPlayer()).toBe("Player2");

    notecardBrain.nextPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player2");
    expect(notecardBrain.getRevealPlayer()).toBe("Player0");

    notecardBrain.nextPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player1");
  });

  it('should be able to go to the previous player', () => {
    notecardBrain.previousPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player2");
    expect(notecardBrain.getRevealPlayer()).toBe("Player0");

    notecardBrain.previousPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player1");
    expect(notecardBrain.getRevealPlayer()).toBe("Player2");

    notecardBrain.previousPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player1");
  });

  it('should be able to go to the next player who will reveal cards', () => {
    notecardBrain.nextRevealPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player2");

    notecardBrain.nextRevealPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player0");

    notecardBrain.nextRevealPlayer();
    expect(notecardBrain.getActivePlayer()).toBe("Player0");
    expect(notecardBrain.getRevealPlayer()).toBe("Player1");
  });

  it('should update a player card', () => {
    let itemIndex = 1;
    let playerNotecard = notecardBrain.getNotecards()[playerIndex];

    notecardBrain.updatePlayerCard(itemIndex);
    expect(playerNotecard.items[itemIndex].status).toBe(Notecard.YES);

    notecardBrain.updatePlayerCard(itemIndex);
    expect(playerNotecard.items[itemIndex].status).toBe(Notecard.NO);
  });

  it('should update opponent cards when the player card is updated', () => {
    let itemIndex = 1;
    let notecards = notecardBrain.getNotecards();

    notecardBrain.updatePlayerCard(itemIndex);
    for(let i = 0; i < notecards.length; i++) {
      if(i != playerIndex) {
        expect(notecards[i].items[itemIndex].status).toBe(Notecard.NO);
      }
    }

    notecardBrain.updatePlayerCard(itemIndex);
    for(let i = 0; i < notecards.length; i++) {
      if(i != playerIndex) {
        expect(notecards[i].items[itemIndex].status).toBe(Notecard.UNKNOWN);
      }
    }
  });

  it('should report if an item has been found by any player', () => {
    expect(notecardBrain.itemFound(0)).toBe(false);
    notecardBrain.getNotecards()[0].items[0].status = Notecard.YES;
    expect(notecardBrain.itemFound(0)).toBe(true);

    expect(notecardBrain.itemFound(1)).toBe(false);
    notecardBrain.getNotecards()[1].items[1].status = Notecard.YES;
    expect(notecardBrain.itemFound(1)).toBe(true);
  });

  function createGuessInformation(suspect: string, weapon: string, room: string): GuessInformation {
    let guessInformation: GuessInformation = new GuessInformation([], [], []);
    guessInformation.selectSuspect(suspect);
    guessInformation.selectWeapon(weapon);
    guessInformation.selectRoom(room);

    return guessInformation;
  }

  it('should mark when an opponent does not have anything in the guess', () => {
    expect(notecards[1].items[0].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[2].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[4].status).toBe(Notecard.UNKNOWN);
    notecardBrain.opponentHasNone(createGuessInformation("Miss Scarlet", "Candlestick", "Kitchen"));
    expect(notecards[1].items[0].status).toBe(Notecard.NO);
    expect(notecards[1].items[2].status).toBe(Notecard.NO);
    expect(notecards[1].items[4].status).toBe(Notecard.NO);
  });

  it('should mark when an opponent has a specific item', () => {
    notecardBrain.opponentHasItem("Miss Scarlet");
    for(var i = 0; i < notecards.length; i++) {
      if(i === 1) {
        expect(notecards[i].items[0].status).toBe(Notecard.YES);
      } else {
        expect(notecards[i].items[0].status).toBe(Notecard.NO);
      }
    }
  });

  it('should allow specifying the opponent with the item', () => {
    notecardBrain.opponentHasItem("Miss Scarlet", 2);
    expect(notecards[2].items[0].status).toBe(Notecard.YES);
  });

  it('should keep track of opponent ORs', () => {
    // An OR that is created when all three guesses are UNKNOWN shouldn't change anything
    notecardBrain.opponentHasOr(createGuessInformation("Miss Scarlet", "Candlestick", "Kitchen"));
    expect(notecards[1].items[0].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[2].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[4].status).toBe(Notecard.UNKNOWN);

    // An OR that is created when 2 of the 3 guesses are known to be NO should
    // infer that the unknown guess must be YES
    notecardBrain.opponentHasNone(createGuessInformation("Professor Plum", "Knife", "Kitchen"));
    notecardBrain.opponentHasOr(createGuessInformation("Professor Plum", "Knife", "Ballroom"));
    expect(notecards[1].items[5].status).toBe(Notecard.YES);
  });

  it('should resolve ORs when NOs are marked', () => {
    // Initially we have no information about this OR
    notecardBrain.opponentHasOr(createGuessInformation("Miss Scarlet", "Candlestick", "Kitchen"));
    expect(notecards[1].items[0].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[2].status).toBe(Notecard.UNKNOWN);
    expect(notecards[1].items[4].status).toBe(Notecard.UNKNOWN);

    // After learning that two items in the OR are NO, the other can be inferred
    // to be YES
    notecardBrain.opponentHasNone(createGuessInformation("Miss Scarlet", "Candlestick", "Ballroom"));
    expect(notecards[1].items[4].status).toBe(Notecard.YES);
  });

});