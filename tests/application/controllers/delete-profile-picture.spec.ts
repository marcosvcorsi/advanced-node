import { Controller } from '@/application/controllers';
import { HttpResponse } from '@/application/helpers';
import { ChangeProfilePicture } from '@/domain/use-cases';

type HttpRequest = {
  userId: string;
}

class DeleteProfilePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse<any>> {
    await this.changeProfilePicture({ id: userId });

    return {} as any;
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
});
