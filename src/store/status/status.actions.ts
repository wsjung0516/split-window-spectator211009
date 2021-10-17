import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";

export class StatusAction {
  public static readonly type = '[Status] Add item';
  constructor(public payload: string) { }
}
export class SetIsImageLoaded {
  public static readonly type = '[Status] Is Imaged Loaeded';
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
