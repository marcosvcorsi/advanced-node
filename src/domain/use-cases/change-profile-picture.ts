import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { UserProfile } from '@/domain/entities';

type Input = {
  id: string;
  file?: {
    buffer: Buffer;
    mimeType: string;
  };
}

type Output = {
  pictureUrl?: string;
  initials?: string;
}

type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository,
) => ChangeProfilePicture;

export type ChangeProfilePicture = (input: Input) => Promise<Output>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ id, file }) => {
  const userProfileData: { pictureUrl?: string, name?: string } = {};

  let filename: string | undefined;

  if (file) {
    const uuid = crypto.generate({ key: id });
    filename = `${uuid}.${file.mimeType.split('/').pop()}`;

    userProfileData.pictureUrl = await fileStorage.upload({ file: file.buffer, filename });
  } else {
    const userProfiledLoaded = await userProfileRepository.load({ id });

    userProfileData.name = userProfiledLoaded?.name;
  }

  const userProfile = new UserProfile(id);
  userProfile.setPicture(userProfileData);

  try {
    await userProfileRepository.savePicture(userProfile);
  } catch (error) {
    if (filename) {
      await fileStorage.delete({ filename });
    }

    throw error;
  }

  return userProfile;
};
