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
  it('should be a singleton', () => {
    const sut = PgConnection.getInstance();
    const newInstance = PgConnection.getInstance();

    expect(sut).toBe(newInstance);
  });

  it('should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
      has: jest.fn().mockRejectedValueOnce(false),
    });

    const createQueryRunnerSpy = jest.fn();

    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy,
    });

    mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy);
    mocked(createConnection).mockImplementationOnce(createConnectionSpy);

    const sut = PgConnection.getInstance();

    await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalled();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalled();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });
});
