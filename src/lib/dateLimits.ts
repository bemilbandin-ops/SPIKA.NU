function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getAllowedDateRange(today = new Date()): {
  min: string;
  max: string;
} {
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(minDate);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return {
    min: toDateInputValue(minDate),
    max: toDateInputValue(maxDate)
  };
}
