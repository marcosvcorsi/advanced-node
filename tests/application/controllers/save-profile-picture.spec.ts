import { Controller } from '@/application/controllers';
import { RequiredFieldError } from '@/application/errors';
import { badRequest, HttpResponse } from '@/application/helpers';

type HttpRequest = {
  file: unknown;
}

type Response = Error;

class SaveProfilePictureController extends Controller {
  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Response>> {
    console.log(httpRequest);
    return badRequest(new RequiredFieldError('file'));
  }
}

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController;

  beforeEach(() => {
    sut = new SaveProfilePictureController();
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: undefined });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: null });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is empty', async () => {
    const response = await sut.handle({ file: { buffer: Buffer.from('') } });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });
});
