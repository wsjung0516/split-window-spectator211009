import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      RouterTestingModule
    ]
  })
  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator).toBeTruthy();
  });

  it(`should have as title 'split-window-spectator211009'`, () => {
    expect(spectator.component.title).toEqual('split-window-spectator211009');
  });
});
