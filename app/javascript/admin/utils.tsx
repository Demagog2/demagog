import * as React from 'react';

import { DateTime } from 'luxon';

export function displayDate(date: string): string {
  return DateTime.fromISO(date)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toLocaleString(DateTime.DATE_FULL);
}

export function displayDateTime(datetime: string): string {
  return DateTime.fromISO(datetime)
    .setLocale('cs')
    .setZone('Europe/Prague')
    .toLocaleString(DateTime.DATETIME_MED);
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

export function newlinesToBr(str: string): React.ReactNode {
  const parts = str.split(/(?:\r\n|\r|\n)/);

  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index !== parts.length - 1 && <br />}
    </React.Fragment>
  ));
}
