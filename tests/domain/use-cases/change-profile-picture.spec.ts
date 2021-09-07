import { mock, MockProxy } from 'jest-mock-extended';

namespace UploadFile {
  export type Params = {

  }

  export type Result = Promise<void>;
}

interface UploadFile {
  upload: (input: UploadFile.Params) => UploadFile.Result;
}

type Input = {
  id: string;
  file: Buffer;
}

type Output = Promise<void>

type ChangeProfilePicture = (input: Input) => Output;
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture;

const setupChangeProfilePicture: Setup = (fileStorage) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: id });
};

describe('ChangeProfilePicture', () => {
  let id: string;
  let file: Buffer;

  let fileStorage: MockProxy<UploadFile>;

  let sut: ChangeProfilePicture;

  beforeAll(() => {
    id = 'any_id';
    file = Buffer.from('any_file');

    fileStorage = mock();
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: id });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
