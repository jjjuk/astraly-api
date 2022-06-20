export const areKeysEqual = (key: string, key2: string): boolean => {
  return !!key && !!key2 && key.toLowerCase() === key2.toLowerCase()
}
