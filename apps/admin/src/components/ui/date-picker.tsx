'use client';

import { useState } from 'react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CustomDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<CustomDatePickerProps & DayPickerProps> = ({
  date,
  onDateChange,
  disabled,
  ...props
}) => {
  const [selected, setSelected] = useState<Date>(date);

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setSelected(day);
      onDateChange(day);
    }
  };

  return (
    <div className='rounded-md border p-2'>
      {props.mode === 'single' ? (
        <DayPicker
          {...props}
          selected={selected}
          onSelect={handleSelect}
          disabled={disabled}
        />
      ) : (
        <DayPicker mode='range' disabled={disabled} />
      )}
    </div>
  );
};
