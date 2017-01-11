import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { DropdownModule } from 'ng2-bootstrap';
import { ButtonsModule } from 'ng2-bootstrap';

import { AppComponent }  from './app.component';
import { AllNotecardsComponent } from './all-notecards.component';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DropdownModule.forRoot(),
    ButtonsModule.forRoot()
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
