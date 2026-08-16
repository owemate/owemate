const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_PATTERN = /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/;

export function parseUserDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'No date set') return null;

  if (ISO_DATE_PATTERN.test(trimmed)) {
    const date = new Date(`${trimmed}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const displayMatch = trimmed.match(DISPLAY_DATE_PATTERN);
  if (displayMatch) {
    const [, day, month, year] = displayMatch;
    const date = new Date(`${month} ${day}, ${year} 12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDatabaseDate(value: string): string | null {
  const date = parseUserDate(value);
  return date ? date.toISOString().slice(0, 10) : null;
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
