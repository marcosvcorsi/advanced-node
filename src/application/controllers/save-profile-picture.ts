import { Controller } from '@/application/controllers';
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors';
import { badRequest, HttpResponse, ok } from '@/application/helpers';
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
    if (!file?.buffer?.length) {
      return badRequest(new RequiredFieldError('file'));
    }

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['jpg', 'jpeg', 'png']));
    }

    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5));
    }

    const data = await this.changeProfilePicture({ id: userId, file: file.buffer });

    return ok(data);
  }
}
