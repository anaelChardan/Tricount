import { filterUsingKey } from "../../src/tools/ramda_extensions";

test("it filters with key", () => {
  const test = {
    nanou: 5,
    jj: 6,
  };

  expect(
    filterUsingKey(test, (key: string, value: number) => value === 5)
  ).toEqual({ nanou: 5 });
});
