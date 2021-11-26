import { Controller } from '@/application/controllers';
import { HttpResponse, ok } from '@/application/helpers';
import { Validator, ValidationBuilder } from '@/application/validation';
import { ChangeProfilePicture } from '@/domain/use-cases';

type HttpRequest = {
  userId: string;
  file?: {
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
    const { initials, pictureUrl } = await this.changeProfilePicture({ id: userId, file });

    return ok({ initials, pictureUrl });
  }

  buildValidators({ file }: HttpRequest): Validator[] {
    if (!file) {
      return [];
    }

    return [
      ...ValidationBuilder
        .of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build(),
    ];
  }
}
