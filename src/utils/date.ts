const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/;
const SLASH_DATE_PATTERN = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;

function createLocalDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function parseUserDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'No date set') return null;

  const isoMatch = trimmed.match(ISO_DATE_PATTERN);
  if (isoMatch) return createLocalDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));

  const displayMatch = trimmed.match(DISPLAY_DATE_PATTERN);
  if (displayMatch) {
    const [, day, monthName, year] = displayMatch;
    const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      .indexOf(monthName.slice(0, 3).toLowerCase());
    return monthIndex >= 0 ? createLocalDate(Number(year), monthIndex + 1, Number(day)) : null;
  }

  // Accept dates produced by older builds/locales, e.g. 18/12/2026.
  const slashMatch = trimmed.match(SLASH_DATE_PATTERN);
  if (slashMatch) return createLocalDate(Number(slashMatch[3]), Number(slashMatch[2]), Number(slashMatch[1]));

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDatabaseDate(value: string): string | null {
  const date = parseUserDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDatabaseDate(value: string | null): string {
  if (!value) return 'No date set';
  const date = parseUserDate(value);
  if (!date) return value;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isValidUserDate(value: string): boolean {
  const trimmed = value.trim();
  return !trimmed || trimmed === 'No date set' || parseUserDate(trimmed) !== null;
}
