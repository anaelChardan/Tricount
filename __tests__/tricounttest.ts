// On a besoin d'une balance de plusieurs dépenses
// Une balance c'est savoir qui doit combien à qui
// Une dépense c'est quoi:
//   - un montant
//   - une description
//   - un créancier
//   - des débiteurs

type Expense = { creditor: string, amount: number }



type Expenses = {
    [debtor: string]: Expense[]
}

type Debt = { creditor: string, amount: number }[];

type Debts = {
    [debtor: string]: Debt[]
}

type Balance = {
    [debtor: string]: { [creditor: string]: number }
}

const addExpense = (expenses: Expenses, amount: number, creditor: string, debtors: string[]): Expenses => {
    const concernedPeople = 1 + debtors.length;
    const debtAmount = amount / concernedPeople;

    const result = {};

    result[creditor] = expenses[creditor]

    debtors.forEach(debtor => {
        result[debtor] = [...expenses[debtor], { creditor: creditor, amount: debtAmount }]
    })

    return result;
}

// {jj: {nanou: 5}} -> jj should give 5 to Nanou
const calculateBalance = (expenses: Expenses): Balance => {

    const balance: Balance = {};

    for (var debtor in expenses) {
        if (!(debtor in balance)) {
            balance[debtor] = {};
        }

        for (var credits of expenses[debtor]) {
            if (!(credits.creditor in balance[debtor])) {
                balance[debtor][credits.creditor] = 0;
            }

            balance[debtor][credits.creditor] += credits.amount;
        }
    }

    return balance;
}

const calculateDebts = (expenses: Expenses): Debts => {
    const balance = calculateBalance(expenses);

    const result = {};

    for (var debtor in balance) {
        result[debtor] = [];
        for (var creditor in balance[debtor]) {
            if (debtor in balance[creditor] && creditor in balance[debtor]) {
                // Si nanou doit a JJ moins que JJ doit a Nanou
                if (balance[debtor][creditor] > balance[creditor][debtor]) {
                    result[debtor].push({ creditor: creditor, amount: balance[debtor][creditor] - balance[creditor][debtor] })
                }
            } else {
                result[debtor].push({ creditor: creditor, amount: balance[debtor][creditor] })
            }
        }
    }

    return result;
}


// [
//     {amount: 12, creditor: 'jj', debtors: ['nanou', 'arnaud']},

// ]


describe('We can simulate a debt balance', () => {
    test('An expense is done by a creditor for several debtors', () => {
        const expenses = { jj: [], nanou: [], arno: [] };
        expect(addExpense(expenses, 12, 'nanou', ['jj', 'arno'])).toEqual({
            jj: [{ creditor: 'nanou', amount: 4 }],
            arno: [{ creditor: 'nanou', amount: 4 }],
            nanou: []
        })
    })

    test('A creditor can be a debtor', () => {
        const expenses = { jj: [], nanou: [], arno: [] };
        const expensesAfterStep = addExpense(expenses, 12, 'nanou', ['jj', 'arno'])

        expect(addExpense(expensesAfterStep, 18, 'jj', ['nanou', 'arno'])).toEqual({
            jj: [{ creditor: 'nanou', amount: 4 }],
            arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
            nanou: [{ creditor: 'jj', amount: 6 }]
        })
    })

    test('It calculates the debt for everyone', () => {
        const expenses = {
            jj: [{ creditor: 'nanou', amount: 4 }],
            arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
            nanou: [{ creditor: 'jj', amount: 6 }]
        };

        expect(calculateDebts(expenses)).toEqual({
            jj: [],
            arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
            nanou: [{ creditor: 'jj', amount: 2 }]
        })
    })
})