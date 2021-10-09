import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { UserProfile } from '@/domain/entities';

type Input = {
  id: string;
  file?: Buffer;
}

type Output = {
  pictureUrl?: string;
  initials?: string;
}

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository,
) => ChangeProfilePicture;

export type ChangeProfilePicture = (input: Input) => Promise<Output>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ id, file }) => {
  const userProfileData: { pictureUrl?: string, name?: string } = {};

  if (file) {
    const uuid = crypto.generate({ key: id });

    userProfileData.pictureUrl = await fileStorage.upload({ file, key: uuid });
  } else {
    const userProfiledLoaded = await userProfileRepository.load({ id });

    userProfileData.name = userProfiledLoaded.name;
  }

  const userProfile = new UserProfile(id);
  userProfile.setPicture(userProfileData);

  await userProfileRepository.savePicture(userProfile);

  return userProfile;
};
