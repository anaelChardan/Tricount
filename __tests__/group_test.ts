import { addGroupExpense, Group } from "../src/domain/group";

describe("We can simulate a debt group", () => {
  test("It is possible to a expenses to a group", () => {
    const group: Group = {
      people: ["fred", "gabe", "alice", "bob", "charlie", "david", "ema"],
      expenses: [],
    };

    expect(
      addGroupExpense(group, {
        creditor: "fred",
        amount: 30,
        debtors: ["gabe", "alice"],
      })
    ).toEqual({
      people: ["fred", "gabe", "alice", "bob", "charlie", "david", "ema"],
      expenses: [
        { creditor: "fred", amount: 10, debtor: "gabe" },
        { creditor: "fred", amount: 10, debtor: "alice" },
      ],
    });
  });
});
