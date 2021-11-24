import { UUIDHandler } from '@/infra/gateways';

export const makeUUIDHandler = (): UUIDHandler => new UUIDHandler();
