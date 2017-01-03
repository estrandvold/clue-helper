import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AlertModule } from 'ng2-bootstrap';

import { AppComponent }  from './app.component';
import { NotecardComponent } from './notecard.component';

@NgModule({
  imports: [
    BrowserModule,
    AlertModule.forRoot()
  ],
  declarations: [
    AppComponent,
    NotecardComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
