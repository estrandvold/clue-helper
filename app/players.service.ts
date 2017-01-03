import { Injectable }    from '@angular/core';

@Injectable()
export class PlayersService {
  getPlayers(): string[] {
    return ["Shenoa", "Glen", "Cindy"];
  }
}
