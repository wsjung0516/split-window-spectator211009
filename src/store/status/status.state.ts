import { State, Action, Selector, StateContext } from '@ngxs/store';
import {
  SetCurrentCategory,
  SetCurrentImages, SetCurrentSeries,
  SetIsImageLoaded, SetIsSeriesLoaded,
  SetSelectedImageById, SetSelectedImageByUrl, SetSelectedSeriesById, SetWindowSplit,
  StatusAction
} from './status.actions';
import {Injectable} from "@angular/core";
import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "../../app/thumbnail/series-list/series-list.component";

export interface StatusStateModel {
  items: string[];
  isImageLoaded: boolean;
  isSeriesLoaded: boolean;
  currentImages: ImageModel[]; //
  currentSeries: SeriesModel[]; //
  currentCategory: string;
  selectedImageId: number;
  selectedImageUrl: string;
  windowSplit: number;
  selectedSeriesId: number
}

@State<StatusStateModel>({
  name: 'status',
  defaults: {
    items: [],
    isImageLoaded: false,
    isSeriesLoaded: false,
    currentImages: [],
    currentSeries: [],
    currentCategory: '',
    selectedImageId: 0,
    selectedImageUrl: '',
    windowSplit: 1,
    selectedSeriesId: 1
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
  @Selector()
  public static getIsSeriesLoaded(state: StatusStateModel) {
    return state.isSeriesLoaded;
  }
  @Selector()
  public static getCurrentImages(state: StatusStateModel) {
    return state.currentImages;
  }
  @Selector()
  public static getCurrentSeries(state: StatusStateModel) {
    return state.currentSeries;
  }
  @Selector()
  public static getCurrentCategory(state: StatusStateModel) {
    return state.currentCategory;
  }
  @Selector()
  public static getSelectedImageById(state: StatusStateModel) {
    return state.selectedImageId;
  }
  @Selector()
  public static getSelectedImageByUrl(state: StatusStateModel) {
    return state.selectedImageUrl;
  }
  @Selector()
  public static getWindowSplit(state: StatusStateModel) {
    return state.windowSplit;
  }
  @Selector()
  public static getSelectedSeriesById(state: StatusStateModel) {
    return state.selectedSeriesId;
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
  @Action(SetIsSeriesLoaded)
  public setIsSeriesLoaded({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetIsSeriesLoaded) {
    patchState({isSeriesLoaded: payload})
  }
  @Action(SetCurrentImages)
  public setCurrentImages({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentImages) {
    let images = getState().currentImages;
    patchState({currentImages: [...images, ...payload]});
  }
  @Action(SetCurrentCategory)
  public setCurrentCategory({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentCategory) {
    patchState({currentCategory: payload})
  }
  @Action(SetSelectedImageById)
  public setSelectedImageById({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSelectedImageById) {
    patchState({selectedImageId: payload})
  }
  @Action(SetSelectedImageByUrl)
  public setSelectedImageByUrl({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSelectedImageByUrl) {
    patchState({selectedImageUrl: payload})
  }
  @Action(SetWindowSplit)
  public setWindowSplit({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetWindowSplit) {
    patchState({windowSplit: payload})
  }
  @Action(SetCurrentSeries)
  public setCurrentSeries({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentSeries) {
    let series = getState().currentSeries;
    patchState({currentSeries: [...series, ...payload]});
  }
  @Action(SetSelectedSeriesById)
  public setSelectedSeriesById({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSelectedSeriesById) {
    patchState({selectedSeriesId: payload})
  }

}
