import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllNotecardsComponent }   from './all-notecards.component';
import { PlayersComponent } from './players.component';

const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: 'game',  component: AllNotecardsComponent },
  { path: 'players', component: PlayersComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
