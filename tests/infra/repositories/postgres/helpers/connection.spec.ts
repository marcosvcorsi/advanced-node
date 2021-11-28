import { mocked } from 'ts-jest/utils';
import {
  createConnection, getConnection, getConnectionManager, QueryRunner,
} from 'typeorm';

class PgConnection {
  private static instance?: PgConnection;
  private query?: QueryRunner;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
    }

    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection();

    this.query = connection.createQueryRunner();
  }

  async disconnect(): Promise<void> {
    await getConnection().close();

    this.query = undefined;
  }
}

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;
  let hasSpy: jest.Mock;
  let closeSpy: jest.Mock;

  let sut: PgConnection;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    closeSpy = jest.fn();

    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy,
    });

    createQueryRunnerSpy = jest.fn();

    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy,
    });

    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy,
    });

    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    mocked(createConnection).mockImplementation(createConnectionSpy);
    mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sut = PgConnection.getInstance();
  });

  it('should be a singleton', () => {
    const newInstance = PgConnection.getInstance();

    expect(sut).toBe(newInstance);
  });

  it('should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false);

    await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalled();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalled();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('should use an existing connection', async () => {
    await sut.connect();

    expect(getConnectionSpy).toHaveBeenCalled();
    expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalled();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('should close connection', async () => {
    await sut.connect();
    await sut.disconnect();

    expect(closeSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
