import { TimePicker, TimePrecision } from '@blueprintjs/datetime';
import * as React from 'react';

export const VideoMarkInput = ({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) => {
  const timePickerValue: Date = React.useMemo(() => {
    let seconds = value;

    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }, [value]);

  const handleTimePickerChange = React.useCallback(
    (changedTimePickerValue: Date) => {
      const changedValue =
        changedTimePickerValue.getHours() * 3600 +
        changedTimePickerValue.getMinutes() * 60 +
        changedTimePickerValue.getSeconds();
      onChange(changedValue);
    },
    [onChange],
  );

  return (
    <TimePicker
      onChange={handleTimePickerChange}
      precision={TimePrecision.SECOND}
      selectAllOnFocus
      showArrowButtons
      value={timePickerValue}
    />
  );
};
