import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AlertModule } from 'ng2-bootstrap';

import { AppComponent }  from './app.component';
import { AllNotecardsComponent } from './all-notecards.component';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AllNotecardsComponent
  ],
  providers: [
    PlayersService,
    ItemsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
