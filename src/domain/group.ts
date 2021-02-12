type Expense = { creditor: string; amount: number; debtor: string };
type GroupExpense = { creditor: string; amount: number; debtors: string[] };

export type Group = {
  people: string[];
  expenses: Expense[];
};

export const addGroupExpense = (
  group: Group,
  groupExpense: GroupExpense
): Group => {
  const expenses = groupExpense.debtors.map((debtor) => {
    return {
      creditor: groupExpense.creditor,
      amount: groupExpense.amount / (groupExpense.debtors.length + 1),
      debtor: debtor,
    };
  });

  return { ...group, expenses: [...group.expenses, ...expenses] };
};
