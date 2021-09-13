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

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param', async () => {
    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JD' });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param and lower case name', async () => {
    userProfileRepository.load.mockResolvedValue({ name: 'john doe' });

    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JD' });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param and only first name', async () => {
    userProfileRepository.load.mockResolvedValue({ name: 'john' });

    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'JO' });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param and only one letter name', async () => {
    userProfileRepository.load.mockResolvedValue({ name: 'j' });

    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'J' });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPictureRepository with undefined file param and user has no name', async () => {
    userProfileRepository.load.mockResolvedValue({});

    await sut({ id, file: undefined });

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined });
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1);
  });
});
