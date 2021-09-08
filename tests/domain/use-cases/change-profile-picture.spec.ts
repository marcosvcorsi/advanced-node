import { mock, MockProxy } from 'jest-mock-extended';

namespace UploadFile {
  export type Params = {

  }

  export type Result = Promise<void>;
}

interface UploadFile {
  upload: (input: UploadFile.Params) => UploadFile.Result;
}

namespace UUIDGenerator {
  export type Params = {
    key: string
  }

  export type Result = string;
}

interface UUIDGenerator {
  generate: (params: UUIDGenerator.Params) => UUIDGenerator.Result;
}

type Input = {
  id: string;
  file: Buffer;
}

type Output = Promise<void>

type ChangeProfilePicture = (input: Input) => Output;
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  const uuid = crypto.generate({ key: id });

  await fileStorage.upload({ file, key: uuid });
};

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
});
