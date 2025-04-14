export function parseBoolean(value: string): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lowerCase = value.toLowerCase();

    if (lowerCase === 'true') {
      return true;
    }

    if (lowerCase === 'false') {
      return false;
    }
  }

  throw new Error('Failed to parse boolean');
}
