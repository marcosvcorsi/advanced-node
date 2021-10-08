import { UserProfile } from '@/domain/entities';

describe('UserProfile', () => {
  let sut: UserProfile;

  beforeEach(() => {
    sut = new UserProfile('any_id');
  });

  it('should create with empty initial when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('should create with empty initial when pictureUrl and name is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('should create initials with first name and last name letters', () => {
    sut.setPicture({ name: 'john johnathan doe' });

    expect(sut).toEqual({
      id: 'any_id',
      initials: 'JD',
      pictureUrl: undefined,
    });
  });

  it('should create initials with first two letters of name', () => {
    sut.setPicture({ name: 'john' });

    expect(sut).toEqual({
      id: 'any_id',
      initials: 'JO',
      pictureUrl: undefined,
    });
  });

  it('should create initials with first letter of name', () => {
    sut.setPicture({ name: 'j' });

    expect(sut).toEqual({
      id: 'any_id',
      initials: 'J',
      pictureUrl: undefined,
    });
  });

  it('should create with empty initial when pictureUrl and name is not provided', () => {
    sut.setPicture({});

    expect(sut).toEqual({
      id: 'any_id',
      initials: undefined,
      pictureUrl: undefined,
    });
  });
});
