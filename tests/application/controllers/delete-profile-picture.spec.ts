import { Controller, DeleteProfilePictureController } from '@/application/controllers';

describe('DeleteProfilePictureController', () => {
  let userId: string;
  let changeProfilePicture: jest.Mock;

  let sut: DeleteProfilePictureController;

  beforeAll(() => {
    userId = 'any_user_id';

    changeProfilePicture = jest.fn();
  });

  beforeEach(() => {
    sut = new DeleteProfilePictureController(changeProfilePicture);
  });

  it('should extends from Controller', () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId });

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('should return 204 with no content on success', async () => {
    const result = await sut.handle({ userId });

    expect(result).toEqual({
      statusCode: 204,
      data: null,
    });
  });
});
