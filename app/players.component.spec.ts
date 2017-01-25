import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

import { PlayersComponent } from './players.component';
import { PlayersService } from './players.service';

describe('PlayersComponent tests', () => {
  let comp:    PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let routerStub: any;
  let playersServiceStub: any;

  beforeEach(async(() => {
    playersServiceStub = {
      addPlayers: (players: string[]) => {}
    };

    routerStub = {
      navigate:(url: string) => {}
    };

    spyOn(routerStub, 'navigate');
    spyOn(playersServiceStub, 'addPlayers');

    TestBed.configureTestingModule({
      declarations: [
        PlayersComponent
      ],
      providers: [
        {provide: PlayersService, useValue: playersServiceStub},
        {provide: Router, useValue: routerStub}
      ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersComponent);

    comp = fixture.componentInstance;
  });

  it('should start with six empty players', () => {
    const PLAYER_NUMBER = 6;

    fixture.detectChanges();
    let inputs = fixture.debugElement.queryAll(By.css("input"));

    expect(inputs.length).toBe(PLAYER_NUMBER);

    for(let i = 0; i < PLAYER_NUMBER; i++) {
      expect(inputs[i].nativeElement.textContent).toBe("");
    }
  });

  it('should dynamically create placeholder text', () => {
    expect(comp.getPlaceholderText(0)).toEqual("Add the Main Player...");
    for(let i = 1; i < 10; i++) {
      expect(comp.getPlaceholderText(i)).toEqual("Add a Player...");
    }
  });

  it('should only allow continuing when the entered players are valid', () => {
    function getButton(): DebugElement {
      return fixture.debugElement.query(By.css("#continueButton"));
    }

    fixture.detectChanges();

    // No players added
    let continueButton = getButton();
    expect(continueButton).toBeNull();

    // Three players, but no main player
    comp.players[1].value = "Eric";
    comp.players[2].value = "Shenoa";
    comp.players[4].value = "Glen";
    fixture.detectChanges();
    continueButton = getButton();
    expect(continueButton).toBeNull();

    // Four players, including main players
    comp.players[0].value = "Cindy";
    fixture.detectChanges();
    continueButton = getButton();
    expect(continueButton).not.toBeNull();

    // Three players
    comp.players[2].value = "";
    fixture.detectChanges();
    continueButton = getButton();
    expect(continueButton).not.toBeNull();

    // Two players
    comp.players[1].value = "";
    fixture.detectChanges();
    continueButton = getButton();
    expect(continueButton).toBeNull();
  });

  it('should navigate to the next screen', () => {
    fixture.detectChanges();
    comp.players[0].value = "Eric";
    comp.players[2].value = "Shenoa";
    comp.players[4].value = "Glen";
    comp.goToGame();
    fixture.detectChanges();

    expect(routerStub.navigate).toHaveBeenCalledWith(["game"]);
    expect(playersServiceStub.addPlayers).toHaveBeenCalledWith(["Eric", "Shenoa", "Glen"]);
  });

});
