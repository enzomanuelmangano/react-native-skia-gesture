import { SharedValue } from 'react-native-reanimated';

const unwrapAnimatedValue = <T>(value: SharedValue<T> | T): T => {
  'worklet';

  if ((value as SharedValue<T>).value != null) {
    return (value as SharedValue<T>).value as T;
  }

  return value as T;
};

const unwrapAnimatedValueObject = <T>(
  value: Record<any, SharedValue<T> | T>
): Record<any, T> => {
  'worklet';
  return Object.keys(value).reduce((acc, key) => {
    if (value[key] == null) {
      return acc;
    }
    return { ...acc, [key]: unwrapAnimatedValue(value[key]) };
  }, {});
};

export { unwrapAnimatedValue, unwrapAnimatedValueObject };
