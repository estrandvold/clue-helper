import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AlertModule } from 'ng2-bootstrap';

import { AppComponent }  from './app.component';
import { NotecardComponent } from './notecard.component';
import { PlayersService } from './players.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot()
  ],
  declarations: [
    AppComponent,
    NotecardComponent
  ],
  providers: [
    PlayersService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
