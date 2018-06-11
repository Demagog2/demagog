import { format } from 'date-fns';

export function formatDate(date: string) {
  return format(date, 'DD.MM.YYYY');
}
