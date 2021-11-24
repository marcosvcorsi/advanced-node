import { Controller, SaveProfilePictureController } from '@/application/controllers';
import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer,
} from '@/application/validation';

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

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId });

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer),
    ]);
  });

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ file, userId });

    expect(changeProfilePicture).toHaveBeenLastCalledWith({ id: userId, file });
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
