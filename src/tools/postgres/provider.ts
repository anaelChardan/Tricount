import Knex from "knex";
import config from "../../../knexfile";

export const dbConnection = async (): Promise<Knex> => {
  const knex = Knex(config);

  try {
    await knex.raw("SELECT now()");

    return knex;
  } catch (error) {
    throw new Error("[DB] connection impossible via Knex.");
  }
};
