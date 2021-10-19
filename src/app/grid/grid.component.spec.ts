import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let spectator: Spectator<GridComponent>;
  const createComponent = createComponentFactory(GridComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
