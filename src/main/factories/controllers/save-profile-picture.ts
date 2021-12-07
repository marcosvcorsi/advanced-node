import { Controller, SaveProfilePictureController } from '@/application/controllers';
import { makeChangeProfilePicture } from '@/main/factories/use-cases';

import { makePgTransactionController } from '../decorators';

export const makeSaveProfilePictureController = (): Controller => {
  const saveProfilePictureController = new SaveProfilePictureController(makeChangeProfilePicture());

  return makePgTransactionController(saveProfilePictureController);
};
