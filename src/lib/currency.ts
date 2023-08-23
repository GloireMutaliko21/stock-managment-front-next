export const currency = {
  format: (amount: number) => {
    const formattedAmount = amount
      .toLocaleString('en-US', {
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, ' ');
    return `${formattedAmount}$`;
  },
};
