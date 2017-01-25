import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let playersService: PlayersService;

  beforeEach(() => {
    playersService = new PlayersService();
  });

  it('should keep a list of players', () => {
    expect(playersService.getPlayers()).toEqual([]);

    playersService.addPlayer("Shenoa");
    expect(playersService.getPlayers()).toEqual(["Shenoa"]);

    playersService.addPlayers(["Glen", "Cindy"]);
    expect(playersService.getPlayers()).toEqual(["Shenoa", "Glen", "Cindy"]);
  });
});
