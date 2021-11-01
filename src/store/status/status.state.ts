import { State, Action, Selector, StateContext } from '@ngxs/store';
import {
  SetCurrentCategory, SetCurrentSplitOperation, SetFocusedSplit,
  SetImageUrls,
  SetIsImageLoaded,
  SetIsSeriesLoaded,
  SetSelectedImageById,
  SetSelectedImageByUrl,
  SetSelectedSeriesById,
  SetSelectedSplitWindowId, SetSeriesUrls,
  SetSplitMode,
  SetSplitState, SetWebworkerWorkingStatus,
  StatusAction
} from './status.actions';
import {Injectable} from "@angular/core";
import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "../../app/thumbnail/series-list/series-list.component";

export interface StatusStateModel {
  items: string[];
  isImageLoaded: {} ; // from 0
  isSeriesLoaded: boolean;
  imageUrls: string[]; //
  seriesUrls: string[]; //
  currentCategory: string;
  focusedSplit: number;
  selectedImageId: number;
  selectedImageUrl: string;
  splitMode: number;
  splitState: string[];
  selectedSeriesById: number;
  selectedSplitWindowId: number;
  webworkerWorkingStatus: boolean;
  currentSplitOperation: {}
}

@State<StatusStateModel>({
  name: 'status',
  defaults: {
    items: [],
    isImageLoaded: { idx: 0},
    isSeriesLoaded: false,
    imageUrls: [],
    seriesUrls: [],
    currentCategory: '',
    focusedSplit: 0, // 0: split1, 1: split2, 2: split3, 3: split4
    selectedImageId: 0,
    selectedImageUrl: '',
    splitMode: 1, // 1: active --> split1, 2: active --> split1, split2
    splitState: ['animal','mountain','banana', 'house'],
    selectedSeriesById: 0,
    selectedSplitWindowId: 0,
    webworkerWorkingStatus: false,
    currentSplitOperation: {
      element: ''
    }
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
  public static getImageUrls(state: StatusStateModel) {
    return state.imageUrls;
  }
  @Selector()
  public static getSeriesUrls(state: StatusStateModel) {
    return state.seriesUrls;
  }
  @Selector()
  public static getCurrentCategory(state: StatusStateModel) {
    return state.currentCategory;
  }
  @Selector()
  public static getFocusedSplit(state: StatusStateModel) {
    return state.focusedSplit;
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
  @Selector()
  public static getCurrentSplitOperation(state: StatusStateModel) {
    return state.currentSplitOperation;
  }

  @Action(StatusAction)
  public add(ctx: StateContext<StatusStateModel>, { payload }: StatusAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
  @Action(SetIsImageLoaded)
  public setIsImageLoaded({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetIsImageLoaded) {
    const obj = getState().isImageLoaded;
    patchState({isImageLoaded: {...obj, ...payload}})
  }
  @Action(SetIsSeriesLoaded)
  public setIsSeriesLoaded({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetIsSeriesLoaded) {
    patchState({isSeriesLoaded: payload})
  }
  @Action(SetImageUrls)
  public setImageUrls({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetImageUrls) {
    let urls = getState().imageUrls;
    patchState({imageUrls: [...urls, ...payload]});
  }
  @Action(SetSeriesUrls)
  public setSeriesUrls({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetSeriesUrls) {
    let urls = getState().seriesUrls;
    patchState({seriesUrls: [...urls, ...payload]});
  }
  @Action(SetCurrentCategory)
  public setCurrentCategory({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentCategory) {
    patchState({currentCategory: payload})
  }
  @Action(SetFocusedSplit)
  public setFocusedSplit({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetFocusedSplit) {
    patchState({focusedSplit: payload})
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
    const idx = payload.idx;
    const category = payload.category
    state[idx] = category
    patchState({splitState: [...state]})
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
  @Action(SetCurrentSplitOperation)
  public setCurrentSplitOperation({patchState,getState}: StateContext<StatusStateModel>, { payload }: SetCurrentSplitOperation) {
    const obj = getState().currentSplitOperation;
    patchState({currentSplitOperation: { ...obj, ...payload }})
  }
}
