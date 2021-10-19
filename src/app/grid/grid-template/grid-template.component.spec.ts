import {Spectator, createComponentFactory, byTestId} from '@ngneat/spectator';

import { GridTemplateComponent } from './grid-template.component';
import {CarouselMainComponent} from "../../carousel/carousel-main/carousel-main.component";
import {GridTemplateDirective} from "../directives/grid-template.directive";
import {MockComponents, ngMocks} from "ng-mocks";
import {TemplateRef} from "@angular/core";


describe('GridTemplateComponent', () => {
  let spectator: Spectator<GridTemplateComponent>;
  const createComponent = createComponentFactory({
    component: GridTemplateComponent,
    declarations: [GridTemplateDirective],
    componentMocks: [CarouselMainComponent],

  });

  beforeEach(()=> spectator = createComponent())
  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
  it('show template length 4 ', () => {
    const templates = spectator.component.templateRef;
    expect(templates.length).toEqual(4)
  })
  xit('get the template by name', () => {
    const name = 'element1'
    let template:any = `<ng-template></ng-template>`
    let rname = spectator.component.getTemplate(name)
    expect(rname).toEqual(template)
  })
});
