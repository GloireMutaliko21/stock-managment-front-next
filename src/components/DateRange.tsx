import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import subDays from 'date-fns/subDays';
import { DateRangePicker } from 'rsuite';
import { DateRange, RangeType } from 'rsuite/esm/DateRangePicker';

const predefinedRanges: RangeType[] = [
  {
    label: "Aujourd'hui",
    value: [new Date(), new Date()],
    placement: 'left',
  },
  {
    label: 'Hier',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left',
  },
  {
    label: 'Cette semaine',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left',
  },
  {
    label: '7 derniers jours',
    value: [subDays(new Date(), 6), new Date()],
    placement: 'left',
  },
  {
    label: '30 derniers jours',
    value: [subDays(new Date(), 29), new Date()],
    placement: 'left',
  },
  {
    label: 'Ce mois-ci',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left',
  },
  {
    label: 'Mois dernier',
    value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    placement: 'left',
  },
  {
    label: 'Cette année',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left',
  },
  {
    label: 'Année dernière',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
    placement: 'left',
  },
  {
    label: 'Tout le temps',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: 'left',
  },
];

const DateRange = ({
  startDate,
  endDate,
  handleChange,
  handleClean,
}: {
  startDate: any;
  endDate: any;
  handleChange: any;
  handleClean: any;
}) => {
  const range: DateRange | null = startDate !== null && endDate !== null ? [startDate, endDate] : null;

  return (
    <DateRangePicker
      ranges={predefinedRanges}
      value={range}
      onChange={handleChange}
      showMeridian
      format="dd MMMM yyyy"
      placeholder="Filtrer par date"
      onClean={handleClean}
      placement="auto"
      size="lg"
    />
  );
};

export default DateRange;
