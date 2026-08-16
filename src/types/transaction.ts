export type TransactionType = 'lent' | 'owed';

export type Transaction = {
  id: string;
  person: string;
  amount: number;
  type: TransactionType;
  dueDate: string;
  note: string;
  createdAt: string;
};
