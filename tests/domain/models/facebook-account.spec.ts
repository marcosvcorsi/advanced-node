import { FacebookAccount } from '@/domain/models';

describe('FacebookAccount Tests', () => {
  const fbData = {
    name: 'anu_name',
    email: 'any_mail@mail.com',
    facebookId: 'any_fb_id',
  };

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual({
      name: 'anu_name',
      email: 'any_mail@mail.com',
      facebookId: 'any_fb_id',
    });
  });

  it('should update name if account name is empty', () => {
    const accountData = {
      id: 'any_id',
    };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: 'any_id',
      name: 'anu_name',
      email: 'any_mail@mail.com',
      facebookId: 'any_fb_id',
    });
  });

  it('should not update name if account name is not empty', () => {
    const accountData = {
      id: 'any_id',
      name: 'any_name',
    };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_mail@mail.com',
      facebookId: 'any_fb_id',
    });
  });
});
