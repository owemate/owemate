import { CURRENCY } from '../constants/app';

export function formatCurrency(value: number): string {
  return `${CURRENCY}${value.toLocaleString('en-IN')}`;
}
