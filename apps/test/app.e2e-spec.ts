import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../app.module';

import { SIMPLE_HAPPY_PATH, CONCURRENT_HAPPY_PATH } from './app.e2e-fixture';

import { TRANSACTION_PORT, EVENT_PORT } from '../../libs/src/db/interfaces';

jest.setTimeout(8000);

async function sleep(timeInMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeInMs);
  });
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = await app.getHttpServer();
    await sleep(1000);
  });

  it('Simple happy path', async () => {
    let transactionId: string;

    await request(app.getHttpServer())
      .post('/transaction')
      .send({
        time: SIMPLE_HAPPY_PATH.time,
        customId: SIMPLE_HAPPY_PATH.customId,
      })
      .expect((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.transactionId).not.toBe(undefined);
        transactionId = res.body.transactionId;
      });

    for (const event of SIMPLE_HAPPY_PATH.events) {
      await request(app.getHttpServer())
        .post('/event')
        .send({
          transactionId,
          time: event.time,
          type: event.type,
          data: event.data,
        })
        .expect(201);
    }
  });

  it('Concurrent happy path', async () => {
    for (const transaction of CONCURRENT_HAPPY_PATH) {
      await request(app.getHttpServer())
        .post('/transaction')
        .send({
          time: transaction.time,
          customId: transaction.customId,
        })
        .expect(async (res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body.transactionId).not.toBe(undefined);
          const transactionId = res.body.transactionId;

          for (const event of transaction.events) {
            await request(app.getHttpServer())
              .post('/event')
              .send({
                transactionId,
                time: event.time,
                type: event.type,
                data: event.data,
              })
              .expect((res) => {
                expect(res.statusCode).toBe(201);
              });
          }
        });
    }
  });

  afterAll(async () => {
    await sleep(7000);
    await (server as any).close();
    await app.get(TRANSACTION_PORT).close();
    await app.get(EVENT_PORT).close();
    await app.close();
  });
});
