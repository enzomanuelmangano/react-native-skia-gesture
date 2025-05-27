import { SharedValue } from 'react-native-reanimated';

const unwrapAnimatedValue = <T>(value: SharedValue<T> | T): T => {
  'worklet';

  if ((value as SharedValue<T>).value != null) {
    return (value as SharedValue<T>).value as T;
  }

  return value as T;
};

const unwrapAnimatedValueObject = <T>(
  value: Record<string, SharedValue<T> | T>
): Record<string, T> => {
  'worklet';
  return Object.keys(value).reduce((acc, key) => {
    const val = value[key];
    if (val !== undefined) {
      return { ...acc, [key]: unwrapAnimatedValue(val) };
    }
    return acc;
  }, {} as Record<string, T>);
};

export { unwrapAnimatedValue, unwrapAnimatedValueObject };
