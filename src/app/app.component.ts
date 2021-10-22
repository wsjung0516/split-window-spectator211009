import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngxs/store";
import {SetSplitMode} from "../store/status/status.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'split-window-spectator211009';
  queryUrl = 'assets/json/animal.json';
  constructor(private store: Store) {
  }
  onClickWindowSplit(no: number) {
    this.store.dispatch(new SetSplitMode(no));
  }
  isAriaExpanded( id: string) {
    var element = document.getElementById(id)
    var x = element.getAttribute('aria-expanded');

    return x === 'true'?
      `assets/icon_split/${id}_black.svg`
      : `assets/icon_split/${id}_white.svg`;

  }
  isAriaExpandedForCaret(id:string) {
    var element = document.getElementById(id);
    var x = element.getAttribute('aria-expanded');

    return x === 'true'? {'selectedBtn': true} : {'selectedBtn': false};
  }

}
