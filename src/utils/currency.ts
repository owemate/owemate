import { CURRENCY } from '../constants/app';

export function formatCurrency(value: number): string {
  const absoluteValue = Math.abs(value).toLocaleString('en-IN');
  return `${CURRENCY}${absoluteValue}`;
}
