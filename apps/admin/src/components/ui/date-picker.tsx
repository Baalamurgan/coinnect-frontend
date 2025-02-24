'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  disabled
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
      <DayPicker
        mode='single'
        selected={selected}
        onSelect={handleSelect}
        disabled={disabled}
      />
    </div>
  );
};
