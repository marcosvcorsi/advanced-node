import { mock, MockProxy } from 'jest-mock-extended';

import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases';

describe('ChangeProfilePicture', () => {
  let id: string;
  let file: Buffer;
  let uuid: string;
  let pictureUrl: string;

  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepository: MockProxy<SaveUserPictureRepository & LoadUserProfileRepository>;

  let sut: ChangeProfilePicture;

  beforeAll(() => {
    id = 'any_id';
    uuid = 'any_uuid';
    pictureUrl = 'any_url';
    file = Buffer.from('any_file');

    fileStorage = mock();
    crypto = mock();
    userProfileRepository = mock();

    fileStorage.upload.mockResolvedValue(pictureUrl);
    crypto.generate.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepository);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id, file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPictureRepository with correct params', async () => {
    await sut({ id, file });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param', async () => {
    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call LoadUserProfileRepository with correct params', async () => {
    await sut({ id, file: undefined });

    expect(userProfileRepository.load).toHaveBeenCalledWith({ id });
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1);
  });
});
