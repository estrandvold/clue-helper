import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';

import { ArrayViewComponent } from './array-view.component';
import { ArrayViewItem } from './array-view-item';
import { ItemsService } from './items.service';
import { Item } from './item';

@Component({
  moduleId: module.id,
  selector: 'initial-items',
  templateUrl: 'initial-items.component.html'
})

export class InitialItemsComponent implements OnInit {
  private items: Item[];
  private suspects: Item[];
  private weapons: Item[];
  private rooms: Item[];
  public suspectNames: ArrayViewItem[];
  public weaponNames: ArrayViewItem[];
  public roomNames: ArrayViewItem[];
  private static readonly NO = "NO";
  private static readonly YES = "YES";

  @ViewChild('childModal') public childModal: ModalDirective;

  constructor(
    private itemsService: ItemsService,
    private router: Router) {}

  ngOnInit(): void {
    this.initializeItems();
  }

  public toggleItem(item: Item): void {
    if(item.status === InitialItemsComponent.NO) {
      item.status = InitialItemsComponent.YES;
    } else {
      item.status = InitialItemsComponent.NO;
    }
  }

  public editItems(): void {
    this.childModal.show();
  }

  public closeChildModal():void {
    this.initializeItems();
    this.childModal.hide();
  }

  public updateItemsFromModal():void {
    this.itemsService.updateSuspects(ArrayViewItem.convertFromArrayViewItems(this.suspectNames));
    this.itemsService.updateWeapons(ArrayViewItem.convertFromArrayViewItems(this.weaponNames));
    this.itemsService.updateRooms(ArrayViewItem.convertFromArrayViewItems(this.roomNames));
    this.closeChildModal();
  }

  public goToGame(): void {
    this.router.navigate(['game', this.listSelectedItems()]);
  }

  private initializeItems(): void {
    this.suspects = [];
    this.weapons = [];
    this.rooms = [];

    this.suspectNames = ArrayViewItem.convertToArrayViewItems(this.itemsService.getSuspects());
    this.weaponNames = ArrayViewItem.convertToArrayViewItems(this.itemsService.getWeapons());
    this.roomNames = ArrayViewItem.convertToArrayViewItems(this.itemsService.getRooms());

    this.items = this.itemsService.getItems(InitialItemsComponent.NO);
    for(let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if(item.type === ItemsService.SUSPECT) {
        this.suspects.push(item);
      } else if(item.type === ItemsService.WEAPON) {
        this.weapons.push(item);
      } else if(item.type === ItemsService.ROOM) {
        this.rooms.push(item);
      }
    }
  }

  private listSelectedItems(): string {
    let selectedItems: string[] = [];
    for(let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if(item.status === InitialItemsComponent.YES) {
        selectedItems.push(item.name);
      }
    }

    return selectedItems.join("|");
  }
}
