import { useEffect, useState } from 'react';

const useDateRange = (start?: Date | null, end?: Date | null) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  }, [start, end]);

  return {
    startDate,
    endDate,
  };
};

export default useDateRange;
