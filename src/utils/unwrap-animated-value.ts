import type { SkiaValue } from '@shopify/react-native-skia';

const unwrapAnimatedValue = <T>(value: SkiaValue<T> | T): T => {
  if ((value as SkiaValue<T>).current != null) {
    return (value as SkiaValue<T>).current;
  }
  return value as T;
};

const unwrapAnimatedValueObject = <T>(
  value: Record<any, SkiaValue<T> | T>
): Record<any, T> => {
  return Object.keys(value).reduce((acc, key) => {
    return { ...acc, [key]: unwrapAnimatedValue(value[key]) };
  }, {});
};

export { unwrapAnimatedValue, unwrapAnimatedValueObject };
