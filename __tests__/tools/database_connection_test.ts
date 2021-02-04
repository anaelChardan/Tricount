import { db } from "../../src/tools/knex";
import { setup, teardown } from "../testcase";

beforeAll(async () => {
    await setup();
})

afterAll(async () => {
    teardown()
})

test('It can talk to the databse', async () => {
    const result = await db.postgresClient.raw('SELECT NOW()')

    expect(result).toBeDefined();
});