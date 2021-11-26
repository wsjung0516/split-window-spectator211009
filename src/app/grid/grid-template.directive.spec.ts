import { GridTemplateDirective } from './directives/grid-template.directive';
import {TemplateRef} from "@angular/core";
import {createDirectiveFactory, SpectatorDirective} from "@ngneat/spectator";

xdescribe('GridTemplateDirective', () => {
  let spectator: SpectatorDirective<GridTemplateDirective>;
  const createDirective = createDirectiveFactory({
    directive: GridTemplateDirective,
    providers: [TemplateRef]
  })
  beforeEach(() => spectator = createDirective(`<div *appGridTemplate></div>`))

  xit('should create an instance', () => {
    expect(spectator.element).toBeTruthy();
  });
});
