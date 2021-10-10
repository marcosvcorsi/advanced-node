import { v4 } from 'uuid';

import { UUIDGenerator } from '@/domain/contracts/gateways';

export class UUIDHandler implements UUIDGenerator {
  generate({ key }: UUIDGenerator.Params): UUIDGenerator.Result {
    return `${key}_${v4()}`;
  }
}
