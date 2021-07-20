export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params)
    => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = any;
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params)
    => Promise<CreateFacebookAccountRepository.Result>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }

  export type Result = any;
}
