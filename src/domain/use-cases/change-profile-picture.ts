import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPictureRepository } from '@/domain/contracts/repositories';

type Input = {
  id: string;
  file?: Buffer;
}

type Output = Promise<void>

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository
) => ChangeProfilePicture;

export type ChangeProfilePicture = (input: Input) => Output;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ id, file }) => {
  if (!file) {
    return;
  }

  const uuid = crypto.generate({ key: id });

  const pictureUrl = await fileStorage.upload({ file, key: uuid });

  await userProfileRepository.savePicture({ pictureUrl });
};
