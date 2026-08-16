import type { Transaction } from '../types/transaction';

export const seedTransactions: Transaction[] = [
  {
    id: '1',
    person: 'Aarav',
    amount: 2500,
    type: 'lent',
    dueDate: '28 Aug 2026',
    note: 'Dinner & travel',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: '2',
    person: 'Priya',
    amount: 1200,
    type: 'owed',
    dueDate: '02 Sep 2026',
    note: 'Shared shopping',
    createdAt: '2026-08-02T10:00:00.000Z',
  },
  {
    id: '3',
    person: 'Rohan',
    amount: 800,
    type: 'lent',
    dueDate: '10 Sep 2026',
    note: 'Tickets',
    createdAt: '2026-08-03T10:00:00.000Z',
  },
];
