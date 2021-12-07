import { mock, MockProxy } from 'jest-mock-extended';

import { DbTransaction } from '@/application/contracts';
import { Controller } from '@/application/controllers';
import { DbTransactionController } from '@/application/decorators';
import { HttpResponse } from '@/application/helpers';

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>;
  let decorate: MockProxy<Controller>;
  let params: Record<string, unknown>;
  let result: HttpResponse;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
    decorate = mock();

    params = {
      any: 'any',
    };

    result = {
      statusCode: 200,
      data: {
        any: 'value',
      },
    };

    decorate.perform.mockResolvedValue(result);
  });

  beforeEach(() => {
    sut = new DbTransactionController(decorate, db);
  });

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller);
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

    sut.perform(params).catch(() => {
      expect(db.commit).not.toHaveBeenCalled();
      expect(db.rollback).toHaveBeenCalled();
      expect(db.rollback).toHaveBeenCalledTimes(1);
      expect(db.closeTransaction).toHaveBeenCalled();
      expect(db.closeTransaction).toHaveBeenCalledTimes(1);
    });
  });

  it('should return same result as decorate on success', async () => {
    const httpResponse = await sut.perform(params);

    expect(httpResponse).toEqual(result);
  });

  it('should rethrow if decorate throws', async () => {
    const error = new Error('any_error');

    decorate.perform.mockRejectedValueOnce(error);

    await expect(sut.perform(params)).rejects.toEqual(error);
  });
});
