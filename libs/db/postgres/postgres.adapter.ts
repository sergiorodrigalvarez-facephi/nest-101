import { Client, DatabaseError } from 'pg';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TransactionDto, CreateTransactionResult } from "../../dto";
import { TransactionAdapter } from "../interfaces";

@Injectable()
export class PostgresAdapter implements TransactionAdapter {

    private client: Client;

    constructor() {
        this.client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'password',
            port: 5432,
        });
        this.client.connect();
    }

    async createTransaction(transactionDto: TransactionDto): Promise<CreateTransactionResult> {
        try {
            const uuid = uuidv4();
            await this.client.query(`INSERT INTO transactions VALUES ($1, $2, $3)`, [uuid, transactionDto.time, transactionDto.customId]);
            return {
                ok: true,
                uuid,
            }
        } catch(e) {
            if (e instanceof DatabaseError) {
                if (e.detail) {
                    return {
                        ok: false,
                        errorMessage: e.detail
                    }
                }
            }
            console.error(e)
            throw e;
        }
    }
}