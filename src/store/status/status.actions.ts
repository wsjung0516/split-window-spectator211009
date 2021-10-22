import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "../../app/thumbnail/series-list/series-list.component";

export class StatusAction {
  public static readonly type = '[Status] Add item';
  constructor(public payload: string) { }
}
export class SetIsImageLoaded {
  public static readonly type = '[Status] Is Imaged Loaded';
  constructor(public payload: boolean) { }
}
export class SetIsSeriesLoaded {
  public static readonly type = '[Status] Is Series Loaded';
  constructor(public payload: boolean) { }
}
export class SetCurrentImages {
  public static readonly type = '[Status] Current cached images';
  constructor(public payload: ImageModel[]) { }
}
export class SetCurrentCategory {
  public static readonly type = '[Status] Current category';
  constructor(public payload: string ) { }
}
export class SetSelectedImageById {
  public static readonly type = '[Status] Selected image id';
  constructor(public payload: number ) { }
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
  constructor(public payload: string[] ) { }
}
export class SetCurrentSeries {
  public static readonly type = '[Status] Current saved series';
  constructor(public payload: SeriesModel[]) { }
}
export class SetSelectedSeriesById {
  public static readonly type = '[Status] Selected series id';
  constructor(public payload: number ) { }
}
export class SetSelectedSplitWindowId {
  public static readonly type = '[Status] Selected split window id';
  constructor(public payload: number ) { }
}
export class SetWebworkerWorkingStatus {
  public static readonly type = '[Status] Set Webworker WorkingStatus';
  constructor(public payload: boolean ) { }
}
