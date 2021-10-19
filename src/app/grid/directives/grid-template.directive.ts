import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[appGridTemplate]'
})
export class GridTemplateDirective {
  @Input('appGridTemplate') name: string;

  constructor(public template: TemplateRef<any>) { }

}
