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
  let initials: string | undefined;

  if (file) {
    const uuid = crypto.generate({ key: id });

    pictureUrl = await fileStorage.upload({ file, key: uuid });
  } else {
    const { name } = await userProfileRepository.load({ id });

    if (name) {
      let firstLetter: string;
      let lastLetter: string;

      const letters = name.match(/\b(.)/g) ?? [];

      if (letters.length > 1) {
        firstLetter = letters.shift() ?? '';
        lastLetter = letters.pop() ?? '';
      } else {
        firstLetter = name.substring(0, 1);
        lastLetter = name.substring(1, 2);
      }

      initials = `${firstLetter.toUpperCase()}${lastLetter.toUpperCase()}`;
    }
  }

  await userProfileRepository.savePicture({ pictureUrl, initials });
};
