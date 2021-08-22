import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationUseCase } from '@/main/factories/use-cases';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthenticationUseCase = makeFacebookAuthenticationUseCase();

  return new FacebookLoginController(facebookAuthenticationUseCase);
};
