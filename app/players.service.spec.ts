import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let playersService: PlayersService;

  beforeEach(() => {
    playersService = new PlayersService();
  });

  it('should return a static list of players', () => {
    expect(playersService.getPlayers()).toEqual(["Shenoa", "Glen", "Cindy", "Diane", "Chester"]);
  });
});
