import { type SkPath, type Vector } from '@shopify/react-native-skia';
import { useCallback, useEffect, useId } from 'react';

import { useTouchHandlerContext } from '../canvas/context';
import { getCirclePath } from '../utils/get-circle-path';
import { getRectPath, getRoundedRectPath } from '../utils/get-rect-path';
import {
  unwrapAnimatedValue,
  unwrapAnimatedValueObject,
} from '../utils/unwrap-animated-value';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export type TouchableHandlerProps = {
  onStart: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onActive: (
    touchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEnd: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  touchablePath: SkPath | SharedValue<SkPath>;
};

type WithTouchableHandlerProps<T> = T & Partial<TouchableHandlerProps>;

export const getSkiaPath = (key: string, props: any) => {
  'worklet';

  const unwrappedProps = unwrapAnimatedValueObject(props) as any;
  switch (key) {
    case 'Circle':
      return getCirclePath(unwrappedProps);
    case 'Rect':
      return getRectPath(unwrappedProps);
    case 'RoundedRect':
      return getRoundedRectPath(unwrappedProps);
    case 'Path':
      return unwrappedProps.path;
    default:
      return null;
  }
};

const withTouchableHandler = <T,>(
  Component: (props: WithTouchableHandlerProps<T>) => JSX.Element,
  componentName?: string
) => {
  return ({
    onStart: onStartProp,
    onActive: onActiveProp,
    onEnd: onEndProp,
    touchablePath,
    ...props
  }: WithTouchableHandlerProps<T>) => {
    const id = useId();
    const ref = useTouchHandlerContext();

    const onStart: TouchableHandlerProps['onStart'] = useCallback(
      (event) => {
        'worklet';
        return onStartProp?.(event);
      },
      [onStartProp]
    );
    const onActive: TouchableHandlerProps['onActive'] = useCallback(
      (event) => {
        'worklet';
        return onActiveProp?.(event);
      },
      [onActiveProp]
    );
    const onEnd: TouchableHandlerProps['onEnd'] = useCallback(
      (event) => {
        'worklet';
        return onEndProp?.(event);
      },
      [onEndProp]
    );

    const isPointInPath = useCallback(
      (point: Vector) => {
        'worklet';
        if (touchablePath) {
          return unwrapAnimatedValue(touchablePath).contains(point.x, point.y);
        }

        if (!componentName) return false;
        const path = getSkiaPath(componentName, props);

        if (!path) {
          throw Error('No touchablePath provided');
        }
        return path.contains(point.x, point.y);
      },
      [props, touchablePath]
    );

    useEffect(() => {
      ref.value = {
        [`id:${id}`]: {
          isPointInPath,
          onStart,
          onActive,
          onEnd,
        },
        ...ref.value,
      } as any;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isPointInPath, onActive, onEnd, onStart]);

    useEffect(() => {
      return () => {
        delete ref.value?.[`id:${id}`];
      };
    }, [id, props, ref, touchablePath]);

    return Component(props as any);
  };
};

export { withTouchableHandler };
