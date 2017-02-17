import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { DropdownModule } from 'ng2-bootstrap';
import { ButtonsModule } from 'ng2-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { AllNotecardsComponent } from './all-notecards.component';
import { PlayersComponent } from './players.component';
import { InitialItemsComponent} from './initial-items.component';
import { PlayersService } from './players.service';
import { ItemsService } from './items.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AllNotecardsComponent,
    PlayersComponent,
    InitialItemsComponent
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
