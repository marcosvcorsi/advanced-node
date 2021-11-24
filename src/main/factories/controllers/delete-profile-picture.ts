import { DeleteProfilePictureController } from '@/application/controllers';
import { makeChangeProfilePicture } from '@/main/factories/use-cases';

export const makeDeletePictureController = (): DeleteProfilePictureController => new DeleteProfilePictureController(makeChangeProfilePicture());
