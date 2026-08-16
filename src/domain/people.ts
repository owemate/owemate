import type { Transaction } from '../types/transaction';

export type PersonSummary = {
  person: string;
  lent: number;
  owed: number;
  balance: number;
  transactionCount: number;
};

export function buildPeopleSummary(transactions: Transaction[]): PersonSummary[] {
  const byPerson = new Map<string, PersonSummary>();

  for (const transaction of transactions) {
    const key = transaction.person.trim();
    if (!key) continue;

    const existing = byPerson.get(key) ?? {
      person: key,
      lent: 0,
      owed: 0,
      balance: 0,
      transactionCount: 0,
    };

    if (transaction.type === 'lent') {
      existing.lent += transaction.amount;
    } else {
      existing.owed += transaction.amount;
    }

    existing.balance = existing.lent - existing.owed;
    existing.transactionCount += 1;
    byPerson.set(key, existing);
  }

  return Array.from(byPerson.values()).sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
}
