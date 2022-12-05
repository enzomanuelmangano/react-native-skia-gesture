import {
  ExtendedTouchInfo,
  SkiaProps,
  SkiaValue,
  SkPath,
  TouchInfo,
  useValue,
  Vector,
} from '@shopify/react-native-skia';
import { useCallback, useEffect, useId } from 'react';
import { useTouchHandlerContext } from './context';

type TranslationInfo = {
  translationX: number;
  translationY: number;
};

export type TouchableHandlerProps = {
  onStart: (touchInfo: TouchInfo) => void;
  onActive: (touchInfo: ExtendedTouchInfo & TranslationInfo) => void;
  onEnd: (touchInfo: ExtendedTouchInfo & TranslationInfo) => void;
  touchablePath: SkPath | SkiaValue<SkPath>;
};

type WithTouchableHandlerProps<T> = SkiaProps<T> &
  Partial<TouchableHandlerProps> &
  Pick<TouchableHandlerProps, 'touchablePath'>;

const withTouchableHandler = <T,>(
  Component: (props: WithTouchableHandlerProps<T>) => JSX.Element
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

    const startingPoint = useValue<Vector | null>(null);

    const onStart: TouchableHandlerProps['onStart'] = useCallback(
      (event) => {
        startingPoint.current = { x: event.x, y: event.y };
        return onStartProp?.(event);
      },
      [onStartProp, startingPoint]
    );
    const onActive: TouchableHandlerProps['onActive'] = useCallback(
      (event) => {
        const translationX = event.x - (startingPoint.current?.x ?? 0);
        const translationY = event.y - (startingPoint.current?.y ?? 0);
        return onActiveProp?.({
          ...event,
          translationX,
          translationY,
        });
      },
      [onActiveProp, startingPoint]
    );
    const onEnd: TouchableHandlerProps['onEnd'] = useCallback(
      (event) => {
        const translationX = event.x - (startingPoint.current?.x ?? 0);
        const translationY = event.y - (startingPoint.current?.y ?? 0);
        return onEndProp?.({ ...event, translationX, translationY });
      },
      [onEndProp, startingPoint]
    );

    useEffect(() => {
      ref.current = {
        [`id:${id}`]: {
          isPointInPath: (point: Vector) => {
            const path = (
              (touchablePath as any)?.current
                ? (touchablePath as any).current
                : touchablePath
            ) as SkPath;

            return path?.contains(point.x, point.y);
          },
          onStart,
          onActive,
          onEnd,
        },
        ...ref.current,
      } as any;

      return () => {
        delete ref.current?.[id];
      };
    }, [id, onActive, onEnd, onStart, ref, touchablePath]);

    return Component(props as any);
  };
};

export { withTouchableHandler };
