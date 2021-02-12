import { filterUsingKey } from "../tools/ramda_extensions";
import * as R from "ramda";
import { Group } from "./group";

type Credit = { amount: number; debtor: string };
type Debit = { creditor: string; amount: number };

type Balances = {
  [people: string]: Balance;
};

type Balance = {
  credits: Credit[];
  debits: Debit[];
  sumOfCashInFlow: number;
  sumOfCashOutflow: number;
  netChangeInCash: number;
};

const balanceCons = (
  credits: Credit[] = [],
  debits: Debit[] = [],
  sumOfCashInFlow = 0,
  sumOfCashOutflow = 0,
  netChangeInCash = 0
): Balance => {
  return {
    credits: credits,
    debits: debits,
    sumOfCashInFlow: sumOfCashInFlow,
    sumOfCashOutflow: sumOfCashOutflow,
    netChangeInCash: netChangeInCash,
  };
};

export const simplifyGroupExpenses = (group: Group): Group => {
  const expenses = group.expenses.reduce((previousExpenses, currentExpense) => {
    const previousAmount =
      previousExpenses?.[currentExpense.debtor]?.[currentExpense.creditor] ?? 0;

    const oldExpenseForDebtor = previousExpenses[currentExpense.debtor] ?? {};

    const newExpense = {
      ...oldExpenseForDebtor,
      [currentExpense.creditor]: previousAmount + currentExpense.amount,
    };

    return {
      ...previousExpenses,
      [currentExpense.debtor]: newExpense,
    };
  }, {});

  const simplifiedExpenses = [];

  for (const debtor in expenses) {
    for (const creditor in expenses[debtor]) {
      const debtorShouldGiveToCreditor = expenses[debtor][creditor];
      const creditorShouldGiveInReturn = expenses?.[creditor]?.[debtor] ?? 0;

      if (debtorShouldGiveToCreditor > creditorShouldGiveInReturn) {
        simplifiedExpenses.push({
          creditor: creditor,
          amount: debtorShouldGiveToCreditor - creditorShouldGiveInReturn,
          debtor: debtor,
        });
      }
    }
  }

  return {
    people: group.people,
    expenses: simplifiedExpenses,
  };
};

export const calculateBalances = (group: Group): Balances => {
  const simplifiedGroup = simplifyGroupExpenses(group);

  return group.people.reduce((acc, people) => {
    const credits = simplifiedGroup.expenses
      .filter((e) => e.creditor === people)
      .map((c) => {
        return { amount: c.amount, debtor: c.debtor };
      });
    const debits = simplifiedGroup.expenses
      .filter((e) => e.debtor === people)
      .map((d) => {
        return { creditor: d.creditor, amount: d.amount };
      });

    const sumOfCashInFlow = R.sum([0, ...credits.map((c) => c.amount)]);
    const sumOfCashOutflow = R.sum([0, ...debits.map((d) => d.amount)]);
    const netChangeInCash = sumOfCashInFlow - sumOfCashOutflow;

    const balance = balanceCons(
      credits,
      debits,
      sumOfCashInFlow,
      sumOfCashOutflow,
      netChangeInCash
    );

    return {
      ...acc,
      [people]: balance,
    };
  }, {});
};

export const giversAndReceivers = (balances: Balances) => {
  return {
    giver: filterUsingKey(
      balances,
      (key, balance) => balance.netChangeInCash > 0
    ),
    receiver: filterUsingKey(
      balances,
      (key, balance) => balance.netChangeInCash < 0
    ),
  };
};
