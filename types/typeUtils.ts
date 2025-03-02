export const getTypedKeyForString = <T extends Record<string, string | number>>(
  value: string | number,
  constantObject: T,
): keyof T | undefined => {
  const entry = Object.keys(constantObject).find(([, val]) => val === value);
  return entry ? (entry[0] as keyof T) : undefined;
};