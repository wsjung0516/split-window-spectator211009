import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { SeriesListComponent } from './series-list.component';

describe('SeriesListComponent', () => {
  let spectator: Spectator<SeriesListComponent>;
  const createComponent = createComponentFactory({
    component: SeriesListComponent
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
