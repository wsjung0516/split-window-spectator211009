import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { SplitService } from './split.service';

describe('SplitService', () => {
  let spectator: SpectatorService<SplitService>;
  const createService = createServiceFactory(SplitService);

  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});