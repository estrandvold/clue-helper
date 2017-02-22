import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  private static readonly NO = "NO";
  private static readonly YES = "YES";

  constructor(
    private itemsService: ItemsService,
    private router: Router
  ) {
    this.suspects = [];
    this.weapons = [];
    this.rooms = [];
  }

  ngOnInit(): void {
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

  public toggleItem(item: Item): void {
    if(item.status === InitialItemsComponent.NO) {
      item.status = InitialItemsComponent.YES;
    } else {
      item.status = InitialItemsComponent.NO;
    }
  }

  public goToGame(): void {
    this.router.navigate(['game', this.listSelectedItems()]);
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
