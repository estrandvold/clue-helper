import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <notecard [name]="'ME'" [defaultStatus]="'NO'"></notecard>`,
})
export class AppComponent  { }
