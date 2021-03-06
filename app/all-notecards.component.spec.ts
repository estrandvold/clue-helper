import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AllNotecardsComponent } from './all-notecards.component';
import { NotecardBrain } from './notecard-brain';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';
import { Item } from './item';

describe('AllNotecards Component tests', () => {
  const UNKNOWN = "UNKNOWN";
  const NO = "NO";
  const YES = "YES";

  let comp:    AllNotecardsComponent;
  let fixture: ComponentFixture<AllNotecardsComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(async(() => {
    let playersServiceStub = {
      getPlayers: () => {return ["ME", "Shenoa", "Glen", "Cindy"];},
      addPlayers: () => {}
    };

    let itemsServiceStub = {
      getItems: (status?: string) => {
        return [
          new Item("Miss Scarlet", status, "SUSPECT"),
          new Item("Mr. Green", status, "SUSPECT"),
          new Item("Wrench", status, "WEAPON"),
          new Item("Rope", status, "WEAPON"),
          new Item("Kitchen", status, "ROOM"),
          new Item("Study", status, "ROOM"),
          new Item("Library", status, "ROOM")
        ];
      },
      getSuspects: () => {
        return [new Item("Miss Scarlet", status, "SUSPECT")];
      },
      getWeapons: () => {
        return [new Item("Wrench", status, "WEAPON")];
      },
      getRooms: () => {
        return [new Item("Kitchen", status, "ROOM")];
      }
    }

    let activatedRouteStub = {snapshot: {params: {items: "Miss Scarlet|Mr. Green"}}}

    TestBed.configureTestingModule({
      declarations: [
        AllNotecardsComponent
      ],
      providers: [
        {provide: PlayersService, useValue: playersServiceStub},
        {provide: ItemsService, useValue: itemsServiceStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllNotecardsComponent);

    comp = fixture.componentInstance;
  });

  it('should create a NotecardBrain', () => {
    fixture.detectChanges();
    let notecards = comp.notecardBrain.getNotecards();
    expect(notecards[0].name).toEqual("ME");
    expect(notecards[1].name).toEqual("Shenoa");
    expect(notecards[2].name).toEqual("Glen");
    expect(notecards[3].name).toEqual("Cindy");
  });

  it('should have a list of player names', () => {
    fixture.detectChanges();
    let playerNames = comp.playerNames;
    expect(playerNames.length).toBe(4);
    expect(playerNames[0]).toBe("ME");
    expect(playerNames[3]).toBe("Cindy");
  });

  it('should mark inital items', () => {
    fixture.detectChanges();
    let items = comp.notecardBrain.getNotecards()[0].items;
    for(var i = 0; i < 2; i++) {
      expect(items[i].status).toEqual(YES);
    }

    let notecards = comp.notecardBrain.getNotecards();
    for(var i = 1; i < notecards.length; i++) {
      let items = notecards[i].items;
      for(var j = 0; j < 2; j++) {
        expect(items[j].status).toEqual(NO);
      }
    }
  });

  it('should track my items', () => {
    fixture.detectChanges();
    expect(Object.keys(comp.myItems).length).toEqual(2);
    expect(comp.myItems["Miss Scarlet"]).toEqual({ ME: false, Shenoa: false, Glen: false, Cindy: false });
    expect(comp.myItems["Mr. Green"]).toEqual({ ME: false, Shenoa: false, Glen: false, Cindy: false });
  });

  it('should default my notecard to NO', () => {
    fixture.detectChanges();
    let items = comp.notecardBrain.getNotecards()[0].items;
    for(var i = 2; i < items.length; i++) {
      expect(items[i].status).toEqual(NO);
    }
  });

  it('should default all other notecards to UNKNOWN', () => {
    fixture.detectChanges();
    let notecards = comp.notecardBrain.getNotecards();
    for(var i = 1; i < notecards.length; i++) {
      let items = notecards[i].items;
      for(var j = 2; j < items.length; j++) {
        expect(items[j].status).toEqual(UNKNOWN);
      }
    }
  });

  it('should mark items', () => {
    fixture.detectChanges();
    let items = comp.notecardBrain.getNotecards()[0].items;

    comp.markItems([], 0);
    for(var i = 2; i < items.length; i++) {
      expect(items[i].status).toEqual(NO);
    }

    comp.markItems(["Rope"], 0);
    fixture.detectChanges();
    expect(items[3].status).toEqual(YES);

    comp.markItems(["Kitchen", "Study"], 1);
    fixture.detectChanges();
    items = comp.notecardBrain.getNotecards()[1].items;
    expect(items[4].status).toEqual(YES);
    expect(items[5].status).toEqual(YES);
  });

  it('should toggle guessing', () => {
    const ID = "#guessComponent";

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(ID));
    expect(de).toBe(null);

    comp.toggleGuessing();
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(ID));
    expect(de).not.toBe(null);
  });

  it('should go to the next player', () => {
    const ID = "#currentPlayer";

    fixture.detectChanges();
    el = fixture.debugElement.query(By.css(ID)).nativeElement;
    expect(el.textContent).toContain("Current Player ME");

    // Going to the next player should clear all this information
    comp.guessing = true;
    comp.guessInformation.selectSuspect("Miss Scarlet");
    comp.guessInformation.selectWeapon("Wrench");
    comp.guessInformation.selectRoom("Kitchen");


    comp.nextPlayer();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css(ID)).nativeElement;
    expect(el.textContent).toContain("Current Player Shenoa");
    expect(comp.guessing).toBe(false);
    expect(comp.guessInformation.selectedSuspect).toEqual("");
    expect(comp.guessInformation.selectedWeapon).toEqual("");
    expect(comp.guessInformation.selectedRoom).toEqual("");
  });

  function getTextContent(css: string): string {
    return fixture.debugElement.query(By.css(css)).nativeElement.textContent;
  }

  it('should record when opponents have none', () => {
    fixture.detectChanges();
    comp.guessing = true;
    comp.guessInformation.selectSuspect("Miss Scarlet");
    comp.guessInformation.selectWeapon("Wrench");
    comp.guessInformation.selectRoom("Kitchen");
    fixture.detectChanges();

    expect(getTextContent("#status1-0")).toContain(NO);
    expect(getTextContent("#status1-2")).toContain(UNKNOWN);
    expect(getTextContent("#status1-4")).toContain(UNKNOWN);
    expect(getTextContent("#revealPlayer")).toContain("Shenoa");

    comp.learnOpponentHasNone();
    fixture.detectChanges();
    expect(getTextContent("#status1-0")).toContain(NO);
    expect(getTextContent("#status1-2")).toContain(NO);
    expect(getTextContent("#status1-4")).toContain(NO);
    expect(getTextContent("#revealPlayer")).toContain("Glen");
  });

  it('should record when opponents have one', () => {
    fixture.detectChanges();
    comp.guessing = true;
    fixture.detectChanges();

    expect(getTextContent("#status1-4")).toContain(UNKNOWN);

    comp.learnOpponentHasItem("Kitchen");
    fixture.detectChanges();
    expect(getTextContent("#status1-4")).toContain(YES);
    expect(getTextContent("#currentPlayer")).toContain("Shenoa");
  });

  it('should record when an opponent has an OR', () => {
    // No visible changes, but we can ensure the player gets advanced
    fixture.detectChanges();
    comp.guessing = true;
    comp.guessInformation.selectSuspect("Miss Scarlet");
    comp.guessInformation.selectWeapon("Wrench");
    comp.guessInformation.selectRoom("Kitchen");
    comp.learnOpponentHasSomething();

    fixture.detectChanges();
    expect(getTextContent("#currentPlayer")).toContain("Shenoa");
  });

  it('should display when an opponent guesses an item I have', () => {
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["", "", ""]);

    comp.guess(comp.GUESS_TYPES.SUSPECT, "Miss Scarlet");
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["You have Miss Scarlet. ", "", ""]);

    comp.guess(comp.GUESS_TYPES.WEAPON, "Wrench");
    comp.guess(comp.GUESS_TYPES.ROOM, "Kitchen");
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["You have Miss Scarlet. ", "", ""]);

    comp.myItems["Wrench"] = true;
    comp.myItems["Kitchen"] = true;
    comp.guess(comp.GUESS_TYPES.WEAPON, "Wrench");
    comp.guess(comp.GUESS_TYPES.ROOM, "Kitchen");
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["You have Miss Scarlet. ", "You have Wrench. ", "You have Kitchen. "]);

    // Test that announcements are cleared when a new guess happens
    delete comp.myItems["Mr. Green"];
    comp.guess(comp.GUESS_TYPES.SUSPECT, "Mr. Green");
    comp.guess(comp.GUESS_TYPES.WEAPON, "Rope");
    comp.guess(comp.GUESS_TYPES.ROOM, "Study");
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["", "", ""]);
  });

  it('should display when I have told an opponent one of my cards', () => {
    fixture.detectChanges();
    comp.notecardBrain.nextPlayer(); // Shenoa
    comp.notecardBrain.nextPlayer(); // Glen

    // Glen makes a guess that Cindy has none, but I have Scarlet
    comp.guess(comp.GUESS_TYPES.SUSPECT, "Miss Scarlet");
    comp.guess(comp.GUESS_TYPES.WEAPON, "Rope");
    comp.guess(comp.GUESS_TYPES.ROOM, "Study");
    comp.learnOpponentHasNone(); // Cindy doesn't have anything
    comp.learnOpponentHasItem("Miss Scarlet"); // I have Scarlet

    // Cindy guesses and also learns that I have Scarlet
    comp.learnOpponentHasItem("Miss Scarlet");
    comp.notecardBrain.nextPlayer();

    comp.guess(comp.GUESS_TYPES.SUSPECT, "Miss Scarlet");
    comp.guess(comp.GUESS_TYPES.WEAPON, "Rope");
    comp.guess(comp.GUESS_TYPES.ROOM, "Study");
    fixture.detectChanges();
    expect(comp.itemAnnouncements).toEqual(["You have Miss Scarlet and have shown it to Glen and have shown it to Cindy. ", "", ""]);
  });

  it('should calculate row styles when an item is found', () => {
    fixture.detectChanges();
    let spy = spyOn(comp.notecardBrain, "getItemStatus").and.returnValue(NotecardBrain.ONE_YES);
    expect(comp.getRowStyle("item")).toBe("danger");
  });

  it('should calculate row styles when an item is unknown', () => {
    fixture.detectChanges();
    let spy = spyOn(comp.notecardBrain, "getItemStatus").and.returnValue(NotecardBrain.UNKNOWN);
    expect(comp.getRowStyle("item")).toBe("");
  });

  it('should calculate row styles when an item is missing from all players', () => {
    fixture.detectChanges();
    let spy = spyOn(comp.notecardBrain, "getItemStatus").and.returnValue(NotecardBrain.ALL_NO);
    expect(comp.getRowStyle("item")).toBe("success");
  });
});
