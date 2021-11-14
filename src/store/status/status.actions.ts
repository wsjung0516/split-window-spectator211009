import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "../../app/thumbnail/series-list/series-list.component";

export class StatusAction {
  public static readonly type = '[Status] Add item';
  constructor(public payload: string) { }
}
export class SetIsImageLoaded {
  public static readonly type = '[Status] Is Imaged Loaded';
  constructor(public payload: {idx:number}) { }
}
export class SetIsSeriesLoaded {
  public static readonly type = '[Status] Is Series Loaded';
  constructor(public payload: boolean) { }
}
export class SetImageUrls {
  public static readonly type = '[Status] Cache image urls';
  constructor(public payload: string[]) { }
}
export class SetSeriesUrls {
  public static readonly type = '[Status] Cache series urls';
  constructor(public payload: string[]) { }
}
export class SetCurrentCategory {
  public static readonly type = '[Status] Current category';
  constructor(public payload: string ) { }
}
export class SetCategoryList {
  public static readonly type = '[Status] Category list';
  constructor(public payload: string[] ) { }
}
export class SetFocusedSplit {
  public static readonly type = '[Status] Focused split';
  constructor(public payload: number ) { }
}
export class SetSelectedImageById {
  public static readonly type = '[Status] Selected image id';
  constructor(public payload: ImageModel ) { }
}
export class SetSelectedImageByUrl {
  public static readonly type = '[Status] Selected image url';
  constructor(public payload: string ) { }
}
export class SetSplitMode {
  public static readonly type = '[Status] Set Window split';
  constructor(public payload: number ) { }
}
export class SetSplitState {
  public static readonly type = '[Status] Set split state';
  constructor(public payload: {idx:number, category:string} ) { }
}
export class SetSplitAction {
  public static readonly type = '[Status] Set split action';
  constructor(public payload: boolean ) { }
}
export class SetSelectedSeriesById {
  public static readonly type = '[Status] Selected series id';
  constructor(public payload: number ) { }
}
export class SetSelectedSplitWindowId {
  public static readonly type = '[Status] Selected split window id';
  constructor(public payload: string ) { }
}
export class SetWebworkerWorkingStatus {
  public static readonly type = '[Status] Set Webworker WorkingStatus';
  constructor(public payload: boolean ) { }
}
export class SetCurrentSplitOperation {
  public static readonly type = '[Status] Set current split operation';
  constructor(public payload: {element: string} ) { }
}
export class SetActiveSplit {
  public static readonly type = '[Status] Set active split ';
  constructor(public payload: number ) { }
}
