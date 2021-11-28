import { mocked } from 'ts-jest/utils';
import { createConnection, getConnectionManager } from 'typeorm';

class PgConnection {
  private static instance?: PgConnection;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
    }

    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const connection = await createConnection();

    connection.createQueryRunner();
  }
}

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;

  let sut: PgConnection;

  beforeAll(() => {
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: jest.fn().mockRejectedValueOnce(false),
    });

    createQueryRunnerSpy = jest.fn();

    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy,
    });

    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    mocked(createConnection).mockImplementation(createConnectionSpy);
  });

  beforeEach(() => {
    sut = PgConnection.getInstance();
  });

  it('should be a singleton', () => {
    const newInstance = PgConnection.getInstance();

    expect(sut).toBe(newInstance);
  });

  it('should create a new connection', async () => {
    await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalled();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalled();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });
});
