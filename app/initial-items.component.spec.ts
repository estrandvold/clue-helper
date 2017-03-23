import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';

import { InitialItemsComponent } from './initial-items.component';
import { ArrayViewComponent } from './array-view.component';
import { ArrayViewItem } from './array-view-item';
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
      },
      getSuspects: () => {
        return ["Miss Scarlet"]
      },
      getWeapons: () => {
        return ["Wrench"]
      },
      getRooms: () => {
        return ["Kitchen"]
      },
      updateSuspects: (suspects: string[]) => {},
      updateWeapons: (weapons: string[]) => {},
      updateRooms: (rooms: string[]) => {}
    };

    routerStub = {
      navigate:(url: string[]) => {}
    };

    spyOn(routerStub, 'navigate');
    spyOn(itemsServiceStub, 'updateSuspects');
    spyOn(itemsServiceStub, 'updateWeapons');
    spyOn(itemsServiceStub, 'updateRooms');
    spyOn(itemsServiceStub, 'getSuspects').and.callThrough();
    spyOn(itemsServiceStub, 'getWeapons').and.callThrough();
    spyOn(itemsServiceStub, 'getRooms').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [
        InitialItemsComponent,
        ArrayViewComponent
      ],
      providers: [
        {provide: ItemsService, useValue: itemsServiceStub},
        {provide: Router, useValue: routerStub}
      ],
      imports: [
        FormsModule,
        ModalModule.forRoot()
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

  it('should show a modal to edit items', () => {
    spyOn(comp.childModal, 'show');

    fixture.detectChanges();
    comp.editItems();
    fixture.detectChanges();
    expect(comp.childModal.show).toHaveBeenCalled();
  });

  it('should allow cancelling from the modal', () => {
    spyOn(comp.childModal, 'hide');

    fixture.detectChanges();
    comp.closeChildModal();
    fixture.detectChanges();

    // Expect modal to be closed
    expect(comp.childModal.hide).toHaveBeenCalled();

    // Expect updates to have NOT been called
    expect(itemsServiceStub.updateSuspects).not.toHaveBeenCalled();
    expect(itemsServiceStub.updateWeapons).not.toHaveBeenCalled();
    expect(itemsServiceStub.updateRooms).not.toHaveBeenCalled();
  });

  it('should update the item service after editing in the modal', () => {
    spyOn(comp.childModal, 'hide');

    fixture.detectChanges();
    comp.suspectNames = [new ArrayViewItem("Bob")];
    comp.weaponNames = [new ArrayViewItem("Angry Moose")];
    comp.roomNames = [new ArrayViewItem("Basement")];
    comp.updateItemsFromModal();
    fixture.detectChanges();

    // Expect service to have been called to update items
    expect(itemsServiceStub.updateSuspects).toHaveBeenCalledWith(["Bob"]);
    expect(itemsServiceStub.updateWeapons).toHaveBeenCalledWith(["Angry Moose"]);
    expect(itemsServiceStub.updateRooms).toHaveBeenCalledWith(["Basement"]);

    // Expect modal to be closed
    expect(comp.childModal.hide).toHaveBeenCalled();

    // Expect item list to be updated
    expect(itemsServiceStub.getSuspects).toHaveBeenCalled();
    expect(itemsServiceStub.getWeapons).toHaveBeenCalled();
    expect(itemsServiceStub.getRooms).toHaveBeenCalled();
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
