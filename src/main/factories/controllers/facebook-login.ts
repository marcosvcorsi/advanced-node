import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthentication } from '@/main/factories/use-cases';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthentication = makeFacebookAuthentication();

  return new FacebookLoginController(facebookAuthentication);
};
