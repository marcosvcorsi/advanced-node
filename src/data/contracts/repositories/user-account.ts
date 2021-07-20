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
