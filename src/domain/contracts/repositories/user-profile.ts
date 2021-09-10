export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Params)
    => Promise<SaveUserPictureRepository.Result>;
}

export namespace SaveUserPictureRepository {
  export type Params = {
    pictureUrl: string;
  }

  export type Result = void;
}
