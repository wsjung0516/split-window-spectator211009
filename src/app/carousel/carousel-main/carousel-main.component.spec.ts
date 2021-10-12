import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { CarouselMainComponent } from './carousel-main.component';

describe('CarouselMainComponent', () => {
  let spectator: Spectator<CarouselMainComponent>;
  const createComponent = createComponentFactory(CarouselMainComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
