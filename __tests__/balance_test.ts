import { simplifyGroupExpenses, calculateBalances, giversAndReceivers } from "../src/domain/balance"

describe('We can simulate a debt balance', () => {
    test('It simplifies the expenses of a group', () => {
        const group = {
            people: ['fred', 'gabe', 'alice', 'bob', 'charlie', 'david', 'ema'],
            expenses: [
                { creditor: 'fred', amount: 10, debtor: 'alice' },
                { creditor: 'fred', amount: 12, debtor: 'alice' },
                { creditor: 'alice', amount: 14, debtor: 'charlie' },
                { creditor: 'alice', amount: 20, debtor: 'fred' },
                { creditor: 'charlie', amount: 12, debtor: 'ema' },
                { creditor: 'ema', amount: 12, debtor: 'charlie'}
            ]
        }

        expect(simplifyGroupExpenses(group)).toEqual(
            {
                people: ['fred', 'gabe', 'alice', 'bob', 'charlie', 'david', 'ema'],
                expenses: [
                    { creditor: 'fred', amount: 2, debtor: 'alice' },
                    { creditor: 'alice', amount: 14, debtor: 'charlie' },
                ]
            }
        )
    })

    const balances = {
        fred: {
            credits: [],
            debits: [
                { creditor: 'bob', amount: 10 },
                { creditor: 'charlie', amount: 30 },
                { creditor: 'david', amount: 10 },
                { creditor: 'ema', amount: 10 },
            ],
            sumOfCashInFlow: 0,
            sumOfCashOutflow: 60,
            netChangeInCash: -60
        },
        gabe: {
            credits: [],
            debits: [
                { creditor: 'bob', amount: 30 },
                { creditor: 'david', amount: 10 },
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
                { amount: 30, debtor: 'gabe' },
                { amount: 10, debtor: 'fred' }
            ],
            debits: [
                { creditor: 'charlie', amount: 40 }
            ],
            sumOfCashInFlow: 40,
            sumOfCashOutflow: 40,
            netChangeInCash: 0
        },
        charlie: {
            credits: [
                { amount: 30, debtor: 'fred' },
                { amount: 40, debtor: 'bob' }
            ],
            debits: [
                { creditor: 'david', amount: 20 }
            ],
            sumOfCashInFlow: 70,
            sumOfCashOutflow: 20,
            netChangeInCash: 50
        },
        david: {
            credits: [
                { amount: 10, debtor: 'gabe' },
                { amount: 10, debtor: 'fred' },
                { amount: 20, debtor: 'charlie' }
            ],
            debits: [
                { creditor: 'ema', amount: 50 }
            ],
            sumOfCashInFlow: 40,
            sumOfCashOutflow: 50,
            netChangeInCash: -10
        },
        ema: {
            credits: [
                { amount: 10, debtor: 'fred' },
                { amount: 50, debtor: 'david' }
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
                { creditor: 'bob', amount: 30, debtor: 'gabe' },
                { creditor: 'david', amount: 10, debtor: 'gabe' },
                { creditor: 'bob', amount: 10, debtor: 'fred' },
                { creditor: 'charlie', amount: 30, debtor: 'fred' },
                { creditor: 'david', amount: 10, debtor: 'fred' },
                { creditor: 'ema', amount: 10, debtor: 'fred' },
                { creditor: 'charlie', amount: 40, debtor: 'bob' },
                { creditor: 'david', amount: 20, debtor: 'charlie' },
                { creditor: 'ema', amount: 50, debtor: 'david' },
            ]
        }

        expect(calculateBalances(group)).toEqual(balances);
    })

    test('It computes the giver and receiver', () => {
        expect(giversAndReceivers(balances)).toEqual({
            giver: {
                charlie: {
                    credits: [
                        { amount: 30, debtor: 'fred' },
                        { amount: 40, debtor: 'bob' }
                    ],
                    debits: [
                        { creditor: 'david', amount: 20 }
                    ],
                    sumOfCashInFlow: 70,
                    sumOfCashOutflow: 20,
                    netChangeInCash: 50
                },
                ema: {
                    credits: [
                        { amount: 10, debtor: 'fred' },
                        { amount: 50, debtor: 'david' }
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
                        { creditor: 'bob', amount: 10 },
                        { creditor: 'charlie', amount: 30 },
                        { creditor: 'david', amount: 10 },
                        { creditor: 'ema', amount: 10 },
                    ],
                    sumOfCashInFlow: 0,
                    sumOfCashOutflow: 60,
                    netChangeInCash: -60
                },
                gabe: {
                    credits: [],
                    debits: [
                        { creditor: 'bob', amount: 30 },
                        { creditor: 'david', amount: 10 },
                    ],
                    sumOfCashInFlow: 0,
                    sumOfCashOutflow: 40,
                    netChangeInCash: -40
                },
                david: {
                    credits: [
                        { amount: 10, debtor: 'gabe' },
                        { amount: 10, debtor: 'fred' },
                        { amount: 20, debtor: 'charlie' }
                    ],
                    debits: [
                        { creditor: 'ema', amount: 50 }
                    ],
                    sumOfCashInFlow: 40,
                    sumOfCashOutflow: 50,
                    netChangeInCash: -10
                },
            }
        })
    })
})