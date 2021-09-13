import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';

type Input = {
  id: string;
  file?: Buffer;
}

type Output = Promise<void>

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository,
) => ChangeProfilePicture;

export type ChangeProfilePicture = (input: Input) => Output;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ id, file }) => {
  let pictureUrl: string | undefined;

  if (file) {
    const uuid = crypto.generate({ key: id });

    pictureUrl = await fileStorage.upload({ file, key: uuid });
  } else {
    await userProfileRepository.load({ id });
  }

  await userProfileRepository.savePicture({ pictureUrl });
};
