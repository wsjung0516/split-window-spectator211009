export class StatusAction {
  public static readonly type = '[Status] Add item';
  constructor(public payload: string) { }
}
export class SetIsImageLoaded {
  public static readonly type = '[Status] Is Imaged Loaeded';
  constructor(public payload: boolean) { }
}
