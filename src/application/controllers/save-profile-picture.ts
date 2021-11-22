import { Controller } from '@/application/controllers';
import { HttpResponse, ok } from '@/application/helpers';
import { Validator, ValidationBuilder } from '@/application/validation';
import { ChangeProfilePicture } from '@/domain/use-cases';

type HttpRequest = {
  userId: string;
  file: {
    buffer: Buffer;
    mimeType: string;
  };
}

type Response = Error | {
  initials?: string;
  pictureUrl?: string;
};

export class SaveProfilePictureController extends Controller {
  constructor(
    private readonly changeProfilePicture: ChangeProfilePicture,
  ) {
    super();
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Response>> {
    const data = await this.changeProfilePicture({ id: userId, file: file.buffer });

    return ok(data);
  }

  buildValidators({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build(),
    ];
  }
}
