import { connectDb } from "./tools/knex"

export const init = async () => {
    await connectDb();
}