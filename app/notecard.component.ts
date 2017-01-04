import { Component, OnInit, Input } from '@angular/core';

import { Notecard } from './notecard';

@Component({
  moduleId: module.id,
  selector: 'notecard',
  templateUrl: 'notecard.component.html'
})
export class NotecardComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  defaultStatus: string;

  notecard: Notecard;

  ngOnInit(): void {
    this.notecard = new Notecard(this.name, this.defaultStatus);
  }

  toggleStatus(status: string): string {
    if(status === "NO") {
      return "YES";
    } else {
      return "NO";
    }
  }
}
