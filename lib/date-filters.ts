/**
 * Date filters of the matches page.
 *
 * Days are "local" (the visitor's calendar), but the API groups fixtures by UTC
 * day. To show every match of a local day we therefore request all the UTC days
 * that overlap it, then keep only the fixtures whose kick-off falls on that
 * local day.
 */

export type DateFilter = 'All' | 'Today' | 'Tomorrow' | 'This Week' | 'Custom';

/** Inclusive range of local calendar days, as YYYY-MM-DD keys */
export interface DateKeyRange {
  from: string;
  to: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** YYYY-MM-DD of a date in the visitor's local calendar */
export function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Adds (or removes) whole calendar days to a YYYY-MM-DD key */
export function shiftDateKey(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number);
  return toLocalDateKey(new Date(year, month - 1, day + days));
}

/**
 * Local days covered by a date filter.
 * - All: yesterday to tomorrow (what the API serves fastest)
 * - This Week: today and the six following days
 */
export function getDateKeyRange(filter: DateFilter, customDate: string, now: Date = new Date()): DateKeyRange {
  const today = toLocalDateKey(now);

  switch (filter) {
    case 'Today':
      return { from: today, to: today };
    case 'Tomorrow': {
      const tomorrow = shiftDateKey(today, 1);
      return { from: tomorrow, to: tomorrow };
    }
    case 'This Week':
      return { from: today, to: shiftDateKey(today, 6) };
    case 'Custom':
      return customDate ? { from: customDate, to: customDate } : { from: today, to: today };
    case 'All':
    default:
      return { from: shiftDateKey(today, -1), to: shiftDateKey(today, 1) };
  }
}

/** UTC days (YYYY-MM-DD) that overlap a range of local days, in order */
export function getUtcDatesCovering(range: DateKeyRange): string[] {
  const [fromYear, fromMonth, fromDay] = range.from.split('-').map(Number);
  const [toYear, toMonth, toDay] = range.to.split('-').map(Number);

  const start = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0).toISOString().slice(0, 10);
  const end = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999).toISOString().slice(0, 10);

  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/** True when the kick-off falls on one of the local days of the range */
export function isInDateKeyRange(startTime: string | null | undefined, fallbackDate: string, range: DateKeyRange): boolean {
  const kickoff = startTime ? new Date(startTime) : null;
  const key = kickoff && !Number.isNaN(kickoff.getTime()) ? toLocalDateKey(kickoff) : fallbackDate;
  return key >= range.from && key <= range.to;
}
