import { Controller, SaveProfilePictureController } from '@/application/controllers';
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors';

describe('SaveProfilePictureController', () => {
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer, mimeType: string };
  let userId: string;
  let changeProfilePicture: jest.Mock;

  let sut: SaveProfilePictureController;

  beforeAll(() => {
    buffer = Buffer.from('any_file');
    mimeType = 'image/png';
    userId = 'any_user_id';

    file = { buffer, mimeType };

    changeProfilePicture = jest.fn().mockResolvedValue({
      initials: 'any_initials',
      pictureUrl: 'any_picture_url',
    });
  });

  beforeEach(() => {
    sut = new SaveProfilePictureController(changeProfilePicture);
  });

  it('should extends from Controller', () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: undefined, userId });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: null, userId });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is empty', async () => {
    const response = await sut.handle({ file: { buffer: Buffer.from('') }, userId });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file type is invalid', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId });

    expect(response).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type jpg', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type jpeg', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type png', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should return 400 if file size is bigger than 5mb', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024));

    const response = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId });

    expect(response).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5),
    });
  });

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ file, userId });

    expect(changeProfilePicture).toHaveBeenLastCalledWith({ id: userId, file: buffer });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('should return 200 ok with data', async () => {
    const response = await sut.handle({ file, userId });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        initials: 'any_initials',
        pictureUrl: 'any_picture_url',
      },
    });
  });
});
