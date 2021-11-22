import {
  Validator, RequiredString, RequiredBuffer, Required, AllowedMimeTypes, Extension, MaxFileSize,
} from '@/application/validation';

type ValidationBuilderParams = {
  value: any,
  fieldName?: string;
}

type ImageInput = {
  allowed: Extension[],
  maxSizeInMb: number,
}

export class ValidationBuilder {
  private constructor(
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = [],
  ) {}

  static of({ value, fieldName }: ValidationBuilderParams): ValidationBuilder {
    return new ValidationBuilder(value, fieldName);
  }

  required(): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName));
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName));
    } else if (typeof this.value === 'object') {
      this.validators.push(new Required(this.value, this.fieldName));

      if (this.value.buffer) {
        this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName));
      }
    }

    return this;
  }

  image({ allowed, maxSizeInMb }: ImageInput): ValidationBuilder {
    if (this.value.mimeType) {
      this.validators.push(new AllowedMimeTypes(allowed, this.value.mimeType));
    }

    if (this.value.buffer) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer));
    }

    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
