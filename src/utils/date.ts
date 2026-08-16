const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/;
const SLASH_DATE_PATTERN = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function createLocalDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseDisplayDate(value: string): Date | null {
  const match = value.match(DISPLAY_DATE_PATTERN);
  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = MONTHS.indexOf(monthName.slice(0, 3).toLowerCase());

  return month >= 0 ? createLocalDate(Number(year), month + 1, Number(day)) : null;
}

function parseSlashDate(value: string): Date | null {
  const match = value.match(SLASH_DATE_PATTERN);
  if (!match) return null;

  const [, day, month, year] = match;
  return createLocalDate(Number(year), Number(month), Number(day));
}

export function parseUserDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'No date set') return null;

  const isoMatch = trimmed.match(ISO_DATE_PATTERN);
  if (isoMatch) {
    return createLocalDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3]),
    );
  }

  const displayDate = parseDisplayDate(trimmed);
  if (displayDate) return displayDate;

  // Keep compatibility with dates saved by older builds/locales.
  const slashDate = parseSlashDate(trimmed);
  if (slashDate) return slashDate;

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

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isValidUserDate(value: string): boolean {
  const trimmed = value.trim();
  return !trimmed || trimmed === 'No date set' || parseUserDate(trimmed) !== null;
}
