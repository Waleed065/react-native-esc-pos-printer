export function remapConstants<T extends Record<string, string | number>>(
  constants: T
): Record<string, string> {
  return Object.keys(constants).reduce(
    (acc, key) => {
      const value = constants[key as keyof T];
      acc[String(value)] = key;
      return acc;
    },
    {} as Record<string, string>
  );
}
