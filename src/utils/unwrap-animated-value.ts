import type { SkiaValue } from '@shopify/react-native-skia';

type SkiaValueWithSelector<T> = {
  value: SkiaValue<T>;
  selector: (v: T) => T;
};
const unwrapAnimatedValue = <T>(
  value: SkiaValue<T> | SkiaValueWithSelector<T> | T
): T => {
  if ((value as SkiaValue<T>).current != null) {
    return (value as SkiaValue<T>).current;
  }

  if ((value as SkiaValueWithSelector<T>).selector != null) {
    const skiaValueWithSelector = value as SkiaValueWithSelector<T>;
    return skiaValueWithSelector.selector(skiaValueWithSelector.value.current);
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
