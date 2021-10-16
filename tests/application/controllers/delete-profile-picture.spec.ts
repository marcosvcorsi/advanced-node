import { Controller } from '@/application/controllers';
import { HttpResponse, noContent } from '@/application/helpers';
import { ChangeProfilePicture } from '@/domain/use-cases';

type HttpRequest = {
  userId: string;
}

class DeleteProfilePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId });

    return noContent();
  }
}

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

  it('should return 204 with no content on sucess', async () => {
    const result = await sut.handle({ userId });

    expect(result).toEqual({
      statusCode: 204,
      data: null,
    });
  });
});
