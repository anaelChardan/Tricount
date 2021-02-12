import Knex from "knex";
import { db } from "../src/tools/knex";
import {init} from './../src/tricount';

var knex: Knex;

async function setup(): Promise<Knex> {
    await init()
    
    knex = db.postgresClient;

    return knex;
}

function teardown(): void {
    if (knex !== undefined) {
        knex.destroy();
    }
}

export { setup, teardown }