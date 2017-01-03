import { Component, OnInit } from '@angular/core';

import { Notecard } from './notecard';
import { Item } from './item';

@Component({
  moduleId: module.id,
  selector: 'notecard',
  templateUrl: 'notecard.component.html'
})
export class NotecardComponent implements OnInit {
  notecard: Notecard;

  ngOnInit(): void {
    this.notecard = new Notecard();
  }
}
