import { Injectable }    from '@angular/core';

@Injectable()
export class PlayersService {

  private players: string[] = [];

  getPlayers(): string[] {
    return this.players;
  }

  addPlayer(name: string) {
    this.players.push(name);
  }

  addPlayers(names: string[]) {
    this.players.push(...names);
  }
}
