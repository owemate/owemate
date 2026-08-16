import type { Transaction } from '../types/transaction';

export type PersonSummary = {
  person: string;
  lent: number;
  owed: number;
  balance: number;
  transactionCount: number;
  pendingCount: number;
};

/**
 * Builds each person's CURRENT outstanding position.
 * Settled transactions remain in the record count/history but must not affect
 * the amount currently owed or the person's balance.
 */
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
      pendingCount: 0,
    };

    existing.transactionCount += 1;

    // Settled records are historical only. They must never contribute to the
    // current person balance or outstanding lent/owed totals.
    if (transaction.status !== 'settled') {
      existing.pendingCount += 1;
      if (transaction.type === 'lent') {
        existing.lent += transaction.amount;
      } else {
        existing.owed += transaction.amount;
      }
      existing.balance = existing.lent - existing.owed;
    }

    byPerson.set(key, existing);
  }

  return Array.from(byPerson.values()).sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
}
