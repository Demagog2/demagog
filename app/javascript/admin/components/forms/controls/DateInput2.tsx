import * as React from 'react';

import { Button, IInputGroupProps } from '@blueprintjs/core';
import { DateInput as BlueprintDateInput, IDatePickerLocaleUtils } from '@blueprintjs/datetime';
import { IconNames } from '@blueprintjs/icons';
import { DateTime } from 'luxon';

const DISPLAY_FORMAT = 'd. M. yyyy';
const PARSE_FORMATS = [DISPLAY_FORMAT, 'd.M.yyyy', 'd. M.yyyy', 'd.M. yyyy'];

interface IProps {
  value: string;
  id?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & IInputGroupProps;
  onChange: (value: string) => any;
}

const DateInput = (props: IProps) => (
  <BlueprintDateInput
    canClearSelection={false}
    inputProps={{
      id: props.id,
    }}
    value={DateTime.fromISO(props.value).toJSDate()}
    locale="cs"
    localeUtils={localeUtils}
    formatDate={formatDate}
    onChange={(date) => props.onChange(DateTime.fromJSDate(date).toISODate())}
    parseDate={parseDate}
    rightElement={
      <Button
        icon={IconNames.CALENDAR}
        minimal
        onClick={(e) => {
          const inputElement = e.currentTarget.parentElement.parentElement.getElementsByTagName(
            'input',
          )[0];
          inputElement.focus();
        }}
        tabIndex={-1}
      />
    }
  />
);

export default DateInput;

function formatDate(date: Date): string {
  return date ? DateTime.fromJSDate(date).toFormat(DISPLAY_FORMAT) : '';
}

function parseDate(str: string): Date {
  for (const format of PARSE_FORMATS) {
    const datetime = DateTime.fromFormat(str, format);
    if (datetime.isValid) {
      return datetime.toJSDate();
    }
  }

  return new Date();
}

const localeUtils: IDatePickerLocaleUtils = {
  formatDay,
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek,
  getMonths,
};

const WEEKDAYS_LONG = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  cs: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'],
};
const WEEKDAYS_SHORT = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  cs: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
};
const MONTHS = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  cs: [
    'Leden',
    'Únor',
    'Březen',
    'Duben',
    'Květen',
    'Červen',
    'Červenec',
    'Srpen',
    'Září',
    'Říjen',
    'Listopad',
    'Prosinec',
  ],
};

const FIRST_DAY = {
  en: 0,
  cs: 1, // Use Monday as first day of the week
};

function formatDay(d, locale = 'en') {
  return `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${
    MONTHS[locale][d.getMonth()]
  } ${d.getFullYear()}`;
}

function formatMonthTitle(d, locale = 'en') {
  return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
}

function formatWeekdayShort(i, locale) {
  return WEEKDAYS_SHORT[locale][i];
}

function formatWeekdayLong(i, locale) {
  return WEEKDAYS_SHORT[locale][i];
}

function getFirstDayOfWeek(locale) {
  return FIRST_DAY[locale];
}

function getMonths(locale) {
  return MONTHS[locale];
}
