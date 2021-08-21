import { AccessToken } from '@/domain/entities';
import { AuthenticationError } from '@/domain/errors';

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string;
  }

  export type Result = AccessToken | AuthenticationError
}
