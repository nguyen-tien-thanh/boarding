export const parseJSON = (value: any): any => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
};

export const parseNumber = (
  value: string | number,
  defaultValue = 0,
): number => {
  if (typeof value === 'number') return value;
  const num = Number(value);
  return !isNaN(num) ? num : defaultValue;
};
