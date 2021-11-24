import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases';

import { makeAWS3FileStorage } from '../gateways';
import { makeUUIDHandler } from '../gateways/uuid';
import { makePgUserProfileRepository } from '../repositories';

export const makeChangeProfilePicture = (): ChangeProfilePicture => setupChangeProfilePicture(
  makeAWS3FileStorage(),
  makeUUIDHandler(),
  makePgUserProfileRepository(),
);
