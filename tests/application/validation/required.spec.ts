import { RequiredFieldError } from '@/application/errors';
import { Required, RequiredString, RequiredBuffer } from '@/application/validation';

describe('Required', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should return an RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return an RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError());
  });

  it('should return undefined if value is truthy', () => {
    const sut = new Required('any_value', fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});

describe('RequiredString', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should extend Required', () => {
    const sut = new RequiredString('', fieldName);

    expect(sut).toBeInstanceOf(Required);
  });

  it('should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return undefined if value is truthy', () => {
    const sut = new RequiredString('any_value', fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});

describe('RequiredBuffer', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should extend Required', () => {
    const sut = new RequiredBuffer(Buffer.from(''));

    expect(sut).toBeInstanceOf(Required);
  });

  it('should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''), fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return undefined if value is truthy', () => {
    const sut = new RequiredBuffer(Buffer.from('any_value'), fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});
