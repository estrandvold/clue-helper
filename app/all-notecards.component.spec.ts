import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

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
          new Item("Wrench", status, "WEAPON"),
          new Item("Kitchen", status, "ROOM")
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

    TestBed.configureTestingModule({
      declarations: [
        AllNotecardsComponent
      ],
      providers: [
        {provide: PlayersService, useValue: playersServiceStub},
        {provide: ItemsService, useValue: itemsServiceStub}
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

  it('should default my notecard to NO', () => {
    fixture.detectChanges();
    let items = comp.notecardBrain.getNotecards()[0].items;
    for(var i = 0; i < items.length; i++) {
      expect(items[i].status).toEqual(NO);
    }
  });

  it('should default all other notecards to UNKNOWN', () => {
    fixture.detectChanges();
    let notecards = comp.notecardBrain.getNotecards();
    for(var i = 1; i < notecards.length; i++) {
      let items = notecards[i].items;
      for(var j = 0; j < items.length; j++) {
        expect(items[j].status).toEqual(UNKNOWN);
      }
    }
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

  it('should toggle player status', () => {
    const MY_ID = "#status0-1";

    fixture.detectChanges();
    let notecards = comp.notecardBrain.getNotecards();

    // Check my element is set to NO
    let myElement = fixture.debugElement.query(By.css(MY_ID)).nativeElement;
    expect(myElement.textContent).toContain(NO);

    // After toggling my element should be set to YES
    comp.toggleStatus(notecards[0], 1);
    fixture.detectChanges();
    expect(myElement.textContent).toContain(YES);

    // After toggling my element should be set to NO
    comp.toggleStatus(notecards[0], 1);
    fixture.detectChanges();
    expect(myElement.textContent).toContain(NO);
  });

  it('should not toggle other players status', () => {
    const OTHER_ID = "#status1-1";

    fixture.detectChanges();
    let notecards = comp.notecardBrain.getNotecards();

    // Check other player's element is set to UNKNOWN
    let otherElement = fixture.debugElement.query(By.css(OTHER_ID)).nativeElement;
    expect(otherElement.textContent).toContain(UNKNOWN);

    // After toggling other player's element should not be allowed to change
    comp.toggleStatus(notecards[1], 1);
    fixture.detectChanges();
    expect(otherElement.textContent).toContain(UNKNOWN);
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

    expect(getTextContent("#status1-0")).toContain(UNKNOWN);
    expect(getTextContent("#status1-1")).toContain(UNKNOWN);
    expect(getTextContent("#status1-2")).toContain(UNKNOWN);
    expect(getTextContent("#revealPlayer")).toContain("Shenoa");

    comp.learnOpponentHasNone();
    fixture.detectChanges();
    expect(getTextContent("#status1-0")).toContain(NO);
    expect(getTextContent("#status1-1")).toContain(NO);
    expect(getTextContent("#status1-2")).toContain(NO);
    expect(getTextContent("#revealPlayer")).toContain("Glen");
  });

  it('should record when opponents have one', () => {
    fixture.detectChanges();
    comp.guessing = true;
    fixture.detectChanges();

    expect(getTextContent("#status1-2")).toContain(UNKNOWN);

    comp.learnOpponentHasItem("Kitchen");
    fixture.detectChanges();
    expect(getTextContent("#status1-2")).toContain(YES);
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
