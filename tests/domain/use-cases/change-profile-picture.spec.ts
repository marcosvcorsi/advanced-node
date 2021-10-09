import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { UserProfile } from '@/domain/entities';
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases';

jest.mock('@/domain/entities/user-profile');

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

    userProfileRepository.load.mockResolvedValue({ name: 'John Doe' });
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

  it('should call LoadUserProfileRepository with correct params', async () => {
    await sut({ id, file: undefined });

    expect(userProfileRepository.load).toHaveBeenCalledWith({ id });
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should not call LoadUserProfileRepository when file is passed', async () => {
    await sut({ id, file });

    expect(userProfileRepository.load).not.toHaveBeenCalled();
  });

  it('should call SaveUserPictureRepository with correct params', async () => {
    await sut({ id, file });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0]);
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(() => ({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'AI',
      setPicture: jest.fn(),
    }));

    const result = await sut({ id, file });

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'AI',
    });
  });
});
