import { InvalidMimeTypeError } from '@/application/errors';

export type Extension = 'jpg' | 'png';

export class AllowedMimeTypes {
  constructor(
    private readonly allowed: Extension[],
    private readonly mimeType: string,
  ) {}

  validate(): Error | undefined {
    if (!this.isPng() && !this.isJpg()) {
      return new InvalidMimeTypeError(this.allowed);
    }
  }

  private isPng(): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png';
  }

  private isJpg(): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType);
  }
}
