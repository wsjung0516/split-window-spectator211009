import { State, Action, Selector, StateContext } from '@ngxs/store';
import {SetIsImageLoaded, StatusAction} from './status.actions';
import {Injectable} from "@angular/core";

export interface StatusStateModel {
  items: string[];
  isImageLoaded: boolean;
}

@State<StatusStateModel>({
  name: 'status',
  defaults: {
    items: [],
    isImageLoaded: false
  }
})
@Injectable()
export class StatusState {

  @Selector()
  public static getState(state: StatusStateModel) {
    return state;
  }
  @Selector()
  public static getIsImageLoaded(state: StatusStateModel) {
    return state.isImageLoaded;
  }

  @Action(StatusAction)
  public add(ctx: StateContext<StatusStateModel>, { payload }: StatusAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
  @Action(SetIsImageLoaded)
  public setIsImageLoaded({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetIsImageLoaded) {
    patchState({isImageLoaded: payload})
  }
}
