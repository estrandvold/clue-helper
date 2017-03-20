import { Component, Input } from '@angular/core';
import { ArrayViewItem } from './array-view-item';

@Component({
  moduleId: module.id,
  selector: 'array-view',
  templateUrl: 'array-view.component.html'
})

export class ArrayViewComponent {
  @Input() strings: ArrayViewItem[];

  delete(index: number): void {
    this.strings.splice(index, 1);
  }

  add(): void {
    this.strings.push(new ArrayViewItem(""));
  }
}
