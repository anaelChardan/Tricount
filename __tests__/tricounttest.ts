// On a besoin d'une balance de plusieurs dépenses
// Une balance c'est savoir qui doit combien à qui
// Une dépense c'est quoi:
//   - un montant
//   - une description
//   - un créancier
//   - des débiteurs
import * as R from 'ramda';

type Expense = { creditor: string, amount: number, debtors: string[] }
type Group = {
    people: string[],
    expenses: Expense[],
}

type Debt = { creditor: string, amount: number }[];

type Debts = {
    [debtor: string]: Debt[]
}

type Balance = { credits: Expense[], debits: Expense[], sumOfCashInFlow: number, sumOfCashOutflow: number, netChangeInCash: number }

const balanceCons = (credits: Expense[] = [], debits: Expense[] = [], sumOfCashInFlow: number = 0, sumOfCashOutflow: number = 0, netChangeInCash: number = 0): Balance => {
    return {
        credits: credits,
        debits: debits,
        sumOfCashInFlow: sumOfCashInFlow,
        sumOfCashOutflow: sumOfCashOutflow,
        netChangeInCash: netChangeInCash
    }
}

type Balances = {
    [people: string]: Balance
}

const addExpense = (group: Group, expense: Expense): Group => { return { ...group, expenses: [...group.expenses, expense] } }

const calculateBalances = (group: Group): Balances => {
    return group.people.reduce((acc, people) => {
        const credits = group.expenses.filter(e => e.creditor === people);
        const debits = group.expenses.filter(e => e.debtors.includes(people))

        const sumOfCashInFlow = R.sum([0, ...credits.map(c => c.amount)])
        const sumOfCashOutflow = R.sum([0, ...debits.map(d => d.amount)])
        const netChangeInCash = sumOfCashInFlow - sumOfCashOutflow
        const balance = balanceCons(
            credits,
            debits,
            sumOfCashInFlow,
            sumOfCashOutflow,
            netChangeInCash
        )

        return {
            ...acc,
            [people]: balance
        }
    }, {})
}

const filterUsingKey = <T>(list: {[key: string]: T}, predicate: (arg: T) => boolean): {[key: string]: T} => {
    const result = {};

    for(var elem in list) {
        if (predicate(list[elem])) {
            result[elem] = list[elem]
        }
    }

    return result;
}

const giversAndReceivers = (balances: Balances) => {
    return {
        giver: filterUsingKey(balances, (balance) => balance.netChangeInCash > 0),
        receiver: filterUsingKey(balances, (balance) => balance.netChangeInCash < 0),
    }
}

// {jj: {nanou: 5}} -> jj should give 5 to Nanou
// const calculateBalance = (expenses: Expenses): Balance => {

//     const balance: Balance = {};

//     for (var debtor in expenses) {
//         if (!(debtor in balance)) {
//             balance[debtor] = {};
//         }

//         for (var credits of expenses[debtor]) {
//             if (!(credits.creditor in balance[debtor])) {
//                 balance[debtor][credits.creditor] = 0;
//             }

//             balance[debtor][credits.creditor] += credits.amount;
//         }
//     }

//     return balance;
// }

// const calculateDebts = (expenses: Expenses): Debts => {
//     const balance = calculateBalance(expenses);

//     const result = {};

//     for (var debtor in balance) {
//         result[debtor] = [];
//         for (var creditor in balance[debtor]) {
//             if (debtor in balance[creditor] && creditor in balance[debtor]) {
//                 // Si nanou doit a JJ moins que JJ doit a Nanou
//                 if (balance[debtor][creditor] > balance[creditor][debtor]) {
//                     result[debtor].push({ creditor: creditor, amount: balance[debtor][creditor] - balance[creditor][debtor] })
//                 }
//             } else {
//                 result[debtor].push({ creditor: creditor, amount: balance[debtor][creditor] })
//             }
//         }
//     }

//     return result;
// }


// [
//     {amount: 12, creditor: 'jj', debtors: ['nanou', 'arnaud']},

// ]


describe('We can simulate a debt balance', () => {
    const balances = {
        fred: {
            credits: [],
            debits: [
                { creditor: 'bob', amount: 10, debtors: ['fred'] },
                { creditor: 'charlie', amount: 30, debtors: ['fred'] },
                { creditor: 'david', amount: 10, debtors: ['fred'] },
                { creditor: 'ema', amount: 10, debtors: ['fred'] },
            ],
            sumOfCashInFlow: 0,
            sumOfCashOutflow: 60,
            netChangeInCash: -60
        },
        gabe: {
            credits: [],
            debits: [
                { creditor: 'bob', amount: 30, debtors: ['gabe'] },
                { creditor: 'david', amount: 10, debtors: ['gabe'] },
            ],
            sumOfCashInFlow: 0,
            sumOfCashOutflow: 40,
            netChangeInCash: -40
        },
        alice: {
            credits: [],
            debits: [],
            sumOfCashInFlow: 0,
            sumOfCashOutflow: 0,
            netChangeInCash: 0
        },
        bob: {
            credits: [
                { creditor: 'bob', amount: 30, debtors: ['gabe'] },
                { creditor: 'bob', amount: 10, debtors: ['fred'] }
            ],
            debits: [
                { creditor: 'charlie', amount: 40, debtors: ['bob'] }
            ],
            sumOfCashInFlow: 40,
            sumOfCashOutflow: 40,
            netChangeInCash: 0
        },
        charlie: {
            credits: [
                { creditor: 'charlie', amount: 30, debtors: ['fred'] },
                { creditor: 'charlie', amount: 40, debtors: ['bob'] }
            ],
            debits: [
                { creditor: 'david', amount: 20, debtors: ['charlie'] }
            ],
            sumOfCashInFlow: 70,
            sumOfCashOutflow: 20,
            netChangeInCash: 50
        },
        david: {
            credits: [
                { creditor: 'david', amount: 10, debtors: ['gabe'] },
                { creditor: 'david', amount: 10, debtors: ['fred'] },
                { creditor: 'david', amount: 20, debtors: ['charlie'] }
            ],
            debits: [
                { creditor: 'ema', amount: 50, debtors: ['david'] }
            ],
            sumOfCashInFlow: 40,
            sumOfCashOutflow: 50,
            netChangeInCash: -10
        },
        ema: {
            credits: [
                { creditor: 'ema', amount: 10, debtors: ['fred'] },
                { creditor: 'ema', amount: 50, debtors: ['david'] }
            ],
            debits: [],
            sumOfCashInFlow: 60,
            sumOfCashOutflow: 0,
            netChangeInCash: 60
        }
    }

    test('It computes the balance', () => {
        const group = {
            people: ['fred', 'gabe', 'alice', 'bob', 'charlie', 'david', 'ema'],
            expenses: [
                { creditor: 'bob', amount: 30, debtors: ['gabe'] },
                { creditor: 'david', amount: 10, debtors: ['gabe'] },
                { creditor: 'bob', amount: 10, debtors: ['fred'] },
                { creditor: 'charlie', amount: 30, debtors: ['fred'] },
                { creditor: 'david', amount: 10, debtors: ['fred'] },
                { creditor: 'ema', amount: 10, debtors: ['fred'] },
                { creditor: 'charlie', amount: 40, debtors: ['bob'] },
                { creditor: 'david', amount: 20, debtors: ['charlie'] },
                { creditor: 'ema', amount: 50, debtors: ['david'] },
            ]
        }

        expect(calculateBalances(group)).toEqual(balances);
    })

    test('It computes the giver and receiver', () => {
        expect(giversAndReceivers(balances)).toEqual({
            giver: {
                charlie: {
                    credits: [
                        { creditor: 'charlie', amount: 30, debtors: ['fred'] },
                        { creditor: 'charlie', amount: 40, debtors: ['bob'] }
                    ],
                    debits: [
                        { creditor: 'david', amount: 20, debtors: ['charlie'] }
                    ],
                    sumOfCashInFlow: 70,
                    sumOfCashOutflow: 20,
                    netChangeInCash: 50
                },
                ema: {
                    credits: [
                        { creditor: 'ema', amount: 10, debtors: ['fred'] },
                        { creditor: 'ema', amount: 50, debtors: ['david'] }
                    ],
                    debits: [],
                    sumOfCashInFlow: 60,
                    sumOfCashOutflow: 0,
                    netChangeInCash: 60
                }
            },
            receiver: {
                fred: {
                    credits: [],
                    debits: [
                        { creditor: 'bob', amount: 10, debtors: ['fred'] },
                        { creditor: 'charlie', amount: 30, debtors: ['fred'] },
                        { creditor: 'david', amount: 10, debtors: ['fred'] },
                        { creditor: 'ema', amount: 10, debtors: ['fred'] },
                    ],
                    sumOfCashInFlow: 0,
                    sumOfCashOutflow: 60,
                    netChangeInCash: -60
                },
                gabe: {
                    credits: [],
                    debits: [
                        { creditor: 'bob', amount: 30, debtors: ['gabe'] },
                        { creditor: 'david', amount: 10, debtors: ['gabe'] },
                    ],
                    sumOfCashInFlow: 0,
                    sumOfCashOutflow: 40,
                    netChangeInCash: -40
                },
                david: {
                    credits: [
                        { creditor: 'david', amount: 10, debtors: ['gabe'] },
                        { creditor: 'david', amount: 10, debtors: ['fred'] },
                        { creditor: 'david', amount: 20, debtors: ['charlie'] }
                    ],
                    debits: [
                        { creditor: 'ema', amount: 50, debtors: ['david'] }
                    ],
                    sumOfCashInFlow: 40,
                    sumOfCashOutflow: 50,
                    netChangeInCash: -10
                },
            }
        })
    })
    // test('An expense is done by a creditor for several debtors', () => {
    //     const expenses = { jj: [], nanou: [], arno: [] };
    //     expect(addExpense([], {creditor: 'nanou', amount: 12, debtors: ['jj', 'arno']})).toEqual({
    //         jj: [{ creditor: 'nanou', amount: 4 }],
    //         arno: [{ creditor: 'nanou', amount: 4 }],
    //         nanou: []
    //     })
    // })

    // test('A creditor can be a debtor', () => {
    //     const expenses = { jj: [], nanou: [], arno: [] };
    //     const expensesAfterStep = addExpense(expenses, 12, 'nanou', ['jj', 'arno'])

    //     expect(addExpense(expensesAfterStep, 18, 'jj', ['nanou', 'arno'])).toEqual({
    //         jj: [{ creditor: 'nanou', amount: 4 }],
    //         arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
    //         nanou: [{ creditor: 'jj', amount: 6 }]
    //     })
    // })

    // test('It calculates the debt for everyone', () => {
    //     const expenses = {
    //         jj: [{ creditor: 'nanou', amount: 4 }],
    //         arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
    //         nanou: [{ creditor: 'jj', amount: 6 }]
    //     };

    //     expect(calculateDebts(expenses)).toEqual({
    //         jj: [],
    //         arno: [{ creditor: 'nanou', amount: 4 }, { creditor: 'jj', amount: 6 }],
    //         nanou: [{ creditor: 'jj', amount: 2 }]
    //     })
    // })
})