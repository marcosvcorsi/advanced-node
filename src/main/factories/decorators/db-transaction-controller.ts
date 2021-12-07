import { Controller } from '@/application/controllers';
import { DbTransactionController } from '@/application/decorators';
import { PgConnection } from '@/infra/repositories/postgres/helpers';

export const makePgTransactionController = (controller: Controller): DbTransactionController => {
  const pgConnection = PgConnection.getInstance();

  return new DbTransactionController(controller, pgConnection);
};
