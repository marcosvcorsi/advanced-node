import {
  AllowedMimeTypes,
  MaxFileSize,
  Required, RequiredBuffer, RequiredString, ValidationBuilder,
} from '@/application/validation';

describe('ValidationBuilder', () => {
  describe('required', () => {
    it('should return Required', () => {
      const value = { any_name: 'value' };
      const fieldName = 'any_name';

      const validators = ValidationBuilder.of({
        value,
        fieldName,
      }).required().build();

      expect(validators).toEqual([new Required(value, fieldName)]);
    });

    it('should return RequiredString', () => {
      const value = 'any_value';

      const validators = ValidationBuilder.of({
        value,
      }).required().build();

      expect(validators).toEqual([new RequiredString(value)]);
    });

    it('should return RequiredBuffer', () => {
      const value = Buffer.from('any_value');

      const validators = ValidationBuilder.of({
        value,
      }).required().build();

      expect(validators).toEqual([new RequiredBuffer(value)]);
    });

    it('should return Required', () => {
      const buffer = Buffer.from('any_value');

      const value = { buffer };

      const validators = ValidationBuilder.of({
        value,
      }).required().build();

      expect(validators).toEqual([new Required({ buffer }), new RequiredBuffer(buffer)]);
    });
  });

  describe('image', () => {
    it('should return correct image validators with buffer', () => {
      const buffer = Buffer.from('any_value');

      const validators = ValidationBuilder
        .of({ value: { buffer } })
        .image({ allowed: ['png'], maxSizeInMb: 6 })
        .build();

      expect(validators).toEqual([
        new MaxFileSize(6, buffer),
      ]);
    });

    it('should return correct image validators with mimeType', () => {
      const mimeType = 'image/png';

      const validators = ValidationBuilder
        .of({ value: { mimeType } })
        .image({ allowed: ['png'], maxSizeInMb: 6 })
        .build();

      expect(validators).toEqual([
        new AllowedMimeTypes(['png'], mimeType),
      ]);
    });

    it('should return correct image validators with mimeType and buffer', () => {
      const buffer = Buffer.from('any_value');
      const mimeType = 'image/png';

      const validators = ValidationBuilder
        .of({ value: { mimeType, buffer } })
        .image({ allowed: ['png'], maxSizeInMb: 6 })
        .build();

      expect(validators).toEqual([
        new AllowedMimeTypes(['png'], mimeType),
        new MaxFileSize(6, buffer),
      ]);
    });
  });
});
