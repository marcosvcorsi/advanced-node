import { mock, MockProxy } from 'jest-mock-extended';

import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases';

describe('ChangeProfilePicture', () => {
  let id: string;
  let file: Buffer;
  let uuid: string;

  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;

  let sut: ChangeProfilePicture;

  beforeAll(() => {
    id = 'any_id';
    uuid = 'any_uuid';
    file = Buffer.from('any_file');

    fileStorage = mock();
    crypto = mock();

    crypto.generate.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto);
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
});
