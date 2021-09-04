export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUser.Params)
    => Promise<LoadFacebookUser.Result>;
}

export namespace LoadFacebookUser {
  export type Params = {
    token: string;
  }

  export type Result = undefined | {
    facebookId: string;
    name: string;
    email: string;
  };
}
