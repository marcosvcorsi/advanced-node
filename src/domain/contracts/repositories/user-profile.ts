export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Params)
    => Promise<SaveUserPictureRepository.Result>;
}

export namespace SaveUserPictureRepository {
  export type Params = {
    pictureUrl?: string;
    initials?: string;
  }

  export type Result = void;
}

export interface LoadUserProfileRepository {
  load: (params: LoadUserProfileRepository.Params)
    => Promise<LoadUserProfileRepository.Result>;
}

export namespace LoadUserProfileRepository {
  export type Params = {
    id: string;
  }

  export type Result = {
    name?: string;
  };
}
