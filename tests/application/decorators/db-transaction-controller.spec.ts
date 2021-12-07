import { mock, MockProxy } from 'jest-mock-extended';

import { Controller } from '@/application/controllers';

interface DbTransaction {
  openTransaction: () => Promise<void>
}

class DbTransactionController {
  constructor(
    private readonly decorate: Controller,
    private readonly db: DbTransaction,
  ) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();

    await this.decorate.perform(httpRequest);
  }
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>;
  let decorate: MockProxy<Controller>;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
    decorate = mock();
  });

  beforeEach(() => {
    sut = new DbTransactionController(decorate, db);
  });

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' });

    expect(db.openTransaction).toHaveBeenCalled();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });

  it('should execute decorate', async () => {
    const params = { any: 'any' };

    await sut.perform(params);

    expect(decorate.perform).toHaveBeenCalledWith(params);
    expect(decorate.perform).toHaveBeenCalledTimes(1);
  });
});
