/**
 * Get Float With Suffix
 * @description Get changed float value with suffix. You can set fixed param to get float after dot. EX. with fixed 1: 10.3K.
 * @example
 * calculate.getFloatWithSuffix(1100000,1,'short').then((value: string) => {console.log('value = 1.1M', value);});
 * @returns value: string
 */
const getFloatWithSuffix = (value: number, fixed: number, type?: string): string => {
  const originalValue = value;

  const suffixesTemplate: ISuffixesTemplate = {
    short: ['', 'K', 'M', 'B'],
    full: ['', ' thousand', ' million', ' billion'],
  };

  const suffixes = suffixesTemplate[type || 'short'];

  let iterations = 0;
  let newValue = value;

  while (newValue) {
    newValue = Math.floor(newValue / 1000);
    if (value) {
      iterations += 1;
    }
  }
  return (originalValue / 1000 ** iterations).toFixed(fixed) + suffixes[iterations];
};

/**
 * Get Small Float With Suffix
 * @description Get changed float value with suffix. You can set fixed param to get float after dot. EX. with fixed 1: 10.3K.
 * @example
 * calculate.getSmallFloatWithSuffix(1100000,1,'short').then((value: string) => {console.log('value = 1.1M', value);});
 * @returns value: string
 */
const getSmallFloatWithSuffix = (value: number, fixed = 1, type?: string): string => {
  if (value < 0.01) {
    return value.toFixed(4);
  }

  if (value < 1000) {
    return value.toFixed(2);
  }

  return getFloatWithSuffix(value, fixed, type);
};

/**
 * Get Integer With Suffix
 * @description Get changed integaer value with suffix. Triggered getFloatWithSuffix function.
 * @example
 * calculate.getIntegerWithSuffix(1000000).then((value: string) => {console.log('value = 1M', value);});
 * @returns value: string
 */
const getIntegerWithSuffix = (value: number): string => {
  return getFloatWithSuffix(value, 0);
};

interface ISuffixesTemplate {
  [index: string]: string[];
}

export { getIntegerWithSuffix, getFloatWithSuffix, getSmallFloatWithSuffix };
