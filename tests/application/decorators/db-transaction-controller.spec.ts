import { mock } from 'jest-mock-extended';

interface DbTransaction {
  openTransaction: () => Promise<void>
}

class DbTransactionController {
  constructor(
    private readonly db: DbTransaction,
  ) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
    console.log(httpRequest);
  }
}

describe('DbTransactionController', () => {
  let db: jest.Mocked<DbTransaction>;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
  });

  beforeEach(() => {
    sut = new DbTransactionController(db);
  });

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' });

    expect(db.openTransaction).toHaveBeenCalled();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });
});
