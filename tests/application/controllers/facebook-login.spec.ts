type HttpResponse = {
  statusCode: number;
  data: any
}

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    console.log(httpRequest);

    return {
      statusCode: 400,
      data: new Error('The field token is required'),
    };
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;

  beforeEach(() => {
    sut = new FacebookLoginController();
  });

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });
});
