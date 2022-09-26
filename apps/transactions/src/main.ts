import { NestFactory } from '@nestjs/core';

import { TransactionModule } from './transaction.module';
//import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  //app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000);
}
bootstrap();
