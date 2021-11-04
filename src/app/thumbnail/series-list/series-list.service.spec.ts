import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { SeriesListService } from './series-list.service';

describe('SeriesListService', () => {
  let spectator: SpectatorService<SeriesListService>;
  const createService = createServiceFactory(SeriesListService);

  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});