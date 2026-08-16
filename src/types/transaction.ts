export type TransactionType = 'lent' | 'owed';
export type TransactionStatus = 'pending' | 'settled';

export type Transaction = {
  id: string;
  person: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  dueDate: string;
  note: string;
  createdAt: string;
};
