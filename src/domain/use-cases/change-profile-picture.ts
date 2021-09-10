import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';

type Input = {
  id: string;
  file?: Buffer;
}

type Output = Promise<void>

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;

export type ChangeProfilePicture = (input: Input) => Output;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  if (!file) {
    return;
  }

  const uuid = crypto.generate({ key: id });

  await fileStorage.upload({ file, key: uuid });
};
