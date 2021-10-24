import { State, Action, Selector, StateContext } from '@ngxs/store';
import {
  SetCurrentCategory,
  SetCurrentImages,
  SetCurrentSeries,
  SetIsImageLoaded,
  SetIsSeriesLoaded,
  SetSelectedImageById,
  SetSelectedImageByUrl,
  SetSelectedSeriesById,
  SetSelectedSplitWindowId,
  SetSplitMode,
  SetSplitState, SetWebworkerWorkingStatus,
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
  splitMode: number;
  splitState: string[];
  selectedSeriesById: number;
  selectedSplitWindowId: number;
  webworkerWorkingStatus: boolean;
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
    splitMode: 1,
    splitState: ['animal'],
    selectedSeriesById: 0,
    selectedSplitWindowId: 0,
    webworkerWorkingStatus: false
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
  public static getSplitMode(state: StatusStateModel) {
    return state.splitMode;
  }
  @Selector()
  public static getSplitState(state: StatusStateModel) {
    return state.splitState;
  }
  @Selector()
  public static getSelectedSeriesById(state: StatusStateModel) {
    return state.selectedSeriesById;
  }
  @Selector()
  public static getSelectedSplitWindowId(state: StatusStateModel) {
    return state.selectedSplitWindowId;
  }
  @Selector()
  public static getWebworkerWorkingStatus(state: StatusStateModel) {
    return state.webworkerWorkingStatus;
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
  @Action(SetSplitMode)
  public setSplitMode({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSplitMode) {
    patchState({splitMode: payload})
  }
  @Action(SetSplitState)
  public setSplitState({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSplitState) {
    const state = getState().splitState;
    patchState({splitState: [...state, ...payload]})
  }
  @Action(SetCurrentSeries)
  public setCurrentSeries({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentSeries) {
    let series = getState().currentSeries;
    patchState({currentSeries: [...series, ...payload]});
  }
  @Action(SetSelectedSeriesById)
  public setSelectedSeriesById({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSelectedSeriesById) {
    patchState({selectedSeriesById: payload})
  }
  @Action(SetSelectedSplitWindowId)
  public setSelectedSplitWindowId({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSelectedSplitWindowId) {
    patchState({selectedSplitWindowId: payload})
  }
  @Action(SetWebworkerWorkingStatus)
  public setWebworkerWorkingStatus({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetWebworkerWorkingStatus) {
    patchState({webworkerWorkingStatus: payload})
  }
}
