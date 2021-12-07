import { mock, MockProxy } from 'jest-mock-extended';

import { Controller } from '@/application/controllers';

interface DbTransaction {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

class DbTransactionController {
  constructor(
    private readonly decorate: Controller,
    private readonly db: DbTransaction,
  ) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();

    try {
      await this.decorate.perform(httpRequest);

      await this.db.commit();
    } catch {
      await this.db.rollback();
    } finally {
      await this.db.closeTransaction();
    }
  }
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>;
  let decorate: MockProxy<Controller>;
  let params: Record<string, unknown>;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
    decorate = mock();

    params = {
      any: 'any',
    };
  });

  beforeEach(() => {
    sut = new DbTransactionController(decorate, db);
  });

  it('should open transaction', async () => {
    await sut.perform(params);

    expect(db.openTransaction).toHaveBeenCalled();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });

  it('should execute decorate', async () => {
    await sut.perform(params);

    expect(decorate.perform).toHaveBeenCalledWith(params);
    expect(decorate.perform).toHaveBeenCalledTimes(1);
  });

  it('should call commit and close transaction on success', async () => {
    await sut.perform(params);

    expect(db.rollback).not.toHaveBeenCalled();
    expect(db.commit).toHaveBeenCalled();
    expect(db.commit).toHaveBeenCalledTimes(1);
    expect(db.closeTransaction).toHaveBeenCalled();
    expect(db.closeTransaction).toHaveBeenCalledTimes(1);
  });

  it('should call rollback and close transaction on failure', async () => {
    decorate.perform.mockRejectedValueOnce(new Error('any_error'));

    await sut.perform(params);

    expect(db.commit).not.toHaveBeenCalled();
    expect(db.rollback).toHaveBeenCalled();
    expect(db.rollback).toHaveBeenCalledTimes(1);
    expect(db.closeTransaction).toHaveBeenCalled();
    expect(db.closeTransaction).toHaveBeenCalledTimes(1);
  });
});
