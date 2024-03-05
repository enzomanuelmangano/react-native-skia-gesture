import type { SkiaValue } from '@shopify/react-native-skia';
import type Animated from 'react-native-reanimated';

type SkiaValueWithSelector<T> = {
  value: SkiaValue<T>;
  selector: (v: T) => T;
};
const unwrapAnimatedValue = <T>(
  value: SkiaValue<T> | SkiaValueWithSelector<T> | Animated.SharedValue<T> | T
): T => {
  'worklet';

  if ((value as Animated.SharedValue<T>).value != null) {
    return (value as Animated.SharedValue<T>).value as T;
  }

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
  'worklet';
  return Object.keys(value).reduce((acc, key) => {
    return { ...acc, [key]: unwrapAnimatedValue(value[key]) };
  }, {});
};

export { unwrapAnimatedValue, unwrapAnimatedValueObject };
