import { mocked } from 'ts-jest/utils';
import { v4 } from 'uuid';

import { UUIDHandler } from '@/infra/gateways';

jest.mock('uuid');

describe('UUIDHandler', () => {
  let sut: UUIDHandler;
  let key: string;

  beforeAll(() => {
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new UUIDHandler();
  });

  it('should call uuid v4', () => {
    sut.generate({ key });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it('should return a uuid', () => {
    const uuid = 'any_uuid';
    mocked(v4).mockReturnValueOnce(uuid);

    const result = sut.generate({ key });

    expect(result).toBe(`${key}_${uuid}`);
  });
});
