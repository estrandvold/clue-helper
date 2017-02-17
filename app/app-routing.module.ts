import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllNotecardsComponent }   from './all-notecards.component';
import { PlayersComponent } from './players.component';
import { InitialItemsComponent} from './initial-items.component';

const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: 'game',  component: AllNotecardsComponent },
  { path: 'players', component: PlayersComponent},
  { path: 'items', component: InitialItemsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
