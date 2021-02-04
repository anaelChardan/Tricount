import Knex from 'knex';
import { dbConnection } from './postgres/provider';

type DbClient = {
    postgresClient: Knex;
}

var db: DbClient

const connectDb = async (): Promise<DbClient> => {
    db = {
        postgresClient: await dbConnection()
    }

    return db;
}

export { db, connectDb };
