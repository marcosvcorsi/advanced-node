import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationService } from '@/main/factories/services';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationService = makeFacebookAuthenticationService();

  return new FacebookLoginController(facebookAuthenticationService);
};
