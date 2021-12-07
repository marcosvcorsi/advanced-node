import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { UploadFile, UUIDGenerator, DeleteFile } from '@/domain/contracts/gateways';
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { UserProfile } from '@/domain/entities';
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases';

jest.mock('@/domain/entities/user-profile');

describe('ChangeProfilePicture', () => {
  let id: string;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let uuid: string;
  let pictureUrl: string;

  let fileStorage: MockProxy<UploadFile & DeleteFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepository: MockProxy<SaveUserPictureRepository & LoadUserProfileRepository>;

  let sut: ChangeProfilePicture;

  beforeAll(() => {
    id = 'any_id';
    uuid = 'any_uuid';
    pictureUrl = 'any_url';
    mimeType = 'image/png';
    buffer = Buffer.from('any_file');

    file = {
      buffer,
      mimeType,
    };

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

  it('should call UploadFile with correct input with png', async () => {
    await sut({ id, file: { buffer, mimeType: 'image/png' } });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, filename: `${uuid}.png` });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should call UploadFile with correct input with jpeg', async () => {
    await sut({ id, file: { buffer, mimeType: 'image/jpeg' } });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, filename: `${uuid}.jpeg` });
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

  it('should call SaveUserPictureRepository with correct params', async () => {
    userProfileRepository.load.mockRejectedValueOnce(undefined);

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

  it('should call DeleteFile when file exists and SaveUserPictureRepository throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('any_error'));
    expect.assertions(2);

    sut({ id, file: { buffer, mimeType: 'image/png' } }).catch(() => {
      expect(fileStorage.delete).toHaveBeenLastCalledWith({ filename: `${uuid}.png` });
      expect(fileStorage.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call DeleteFile when file does not exists and SaveUserPictureRepository throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('any_error'));
    expect.assertions(1);

    sut({ id, file: undefined }).catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled();
    });
  });

  it('should throws if SaveUserPictureRepository throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('any_error'));

    await expect(sut({ id, file: undefined })).rejects.toThrow('any_error');
  });
});
