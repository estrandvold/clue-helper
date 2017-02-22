import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

import { InitialItemsComponent } from './initial-items.component';
import { ItemsService } from './items.service';
import { Item } from './item';

describe('InitialItemsComponent tests', () => {

  let comp:    InitialItemsComponent;
  let fixture: ComponentFixture<InitialItemsComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let routerStub: any;
  let itemsServiceStub: any;

  beforeEach(async(() => {
    itemsServiceStub = {
      getItems: (status?: string) => {
        return [
          new Item("Miss Scarlet", status, "SUSPECT"),
          new Item("Wrench", status, "WEAPON"),
          new Item("Kitchen", status, "ROOM")
        ];
      }
    };

    routerStub = {
      navigate:(url: string[]) => {}
    };

    spyOn(routerStub, 'navigate');

    TestBed.configureTestingModule({
      declarations: [
        InitialItemsComponent
      ],
      providers: [
        {provide: ItemsService, useValue: itemsServiceStub},
        {provide: Router, useValue: routerStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialItemsComponent);

    comp = fixture.componentInstance;
  });

  it('should display all items', () => {
    const ITEM_NUMBER = 3;
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css("label"));
    expect(items.length).toBe(ITEM_NUMBER);
  });

  it('should toggle items', () => {
    let item: Item = new Item("Rope", "NO", "WEAPON");

    comp.toggleItem(item);
    expect(item.status).toBe("YES");

    comp.toggleItem(item);
    expect(item.status).toBe("NO");
  });

  it('should navigate to the correct url', () => {
    fixture.detectChanges();
    let items = fixture.debugElement.queryAll(By.css("label"));

    for(let i = 0; i < 3; i++) {
      let item = items[i];
      item.nativeElement.click();
    }
    fixture.detectChanges();

    comp.goToGame();
    fixture.detectChanges();
    expect(routerStub.navigate).toHaveBeenCalledWith(["game", "Miss Scarlet|Wrench|Kitchen"]);
  });
});
