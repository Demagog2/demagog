import { DateTime } from 'luxon';

export function displayDate(date: string): string {
  return DateTime.fromISO(date)
    .setLocale('cs')
    .toLocaleString(DateTime.DATE_FULL);
}

export function newlinesToBrTags(text: string): string {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

export function normalizeNewLines(text: string): string {
  return text.replace(/(?:\r\n)/g, '\n');
}

export function pluralize(count: number, one: string, twoToFour: string, others: string): string {
  if (count === 1) {
    return one;
  } else if (count >= 2 && count <= 4) {
    return twoToFour;
  } else {
    return others;
  }
}
