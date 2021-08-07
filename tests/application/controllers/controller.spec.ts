import { mocked } from 'ts-jest/utils';

import { Controller } from '@/application/controllers';
import { ServerError } from '@/application/errors';
import { HttpResponse } from '@/application/helpers';
import { ValidationComposite } from '@/application/validation';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: {
      any: 'any',
    },
  }

  perform(): Promise<HttpResponse> {
    return Promise.resolve(this.result);
  }
}

describe('Controller', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('should return 400 if validator fails', async () => {
    const error = new Error('any_error');

    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy);

    const httpResponse = await sut.handle({});

    expect(ValidationComposite).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('should return 500 if perform throws', async () => {
    const error = new Error('perform');

    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  it('should return same result if as perform', async () => {
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(sut.result);
  });
});
