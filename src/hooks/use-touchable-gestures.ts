import { useCallback, useMemo } from 'react';
import { Gesture, PanGesture, TapGesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import type { Vector } from '@shopify/react-native-skia';
import type { TouchableRef } from '../canvas/ref-manager';

type UseTouchableGesturesParams = {
  touchableRefs: ReturnType<
    typeof useSharedValue<Record<string, TouchableRef>>
  >;
  panGesture?: PanGesture;
  tapGesture?: TapGesture;
};

export const useTouchableGestures = ({
  touchableRefs,
  panGesture = Gesture.Pan(),
  tapGesture = Gesture.Tap(),
}: UseTouchableGesturesParams) => {
  const activeKey = useSharedValue<string[]>([]);

  // Helper function to find the first matching touchable item
  const findTouchableItem = useCallback(
    (point: Vector, handlerCallback: keyof TouchableRef) => {
      'worklet';
      const refs = touchableRefs.value;
      const keys = Object.keys(refs);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!key) continue;
        const touchableItem = refs[key];
        if (!touchableItem) continue;

        const isPointInPath = touchableItem.isPointInPath(point);
        if (isPointInPath && touchableItem[handlerCallback]) {
          return { key, touchableItem };
        }
      }
      return null;
    },
    [touchableRefs]
  );

  // Helper function to get active touchable item by handler tag
  const getActiveTouchableItem = useCallback(
    (handlerTag: number) => {
      'worklet';
      const activatedKey = activeKey.value.find((key) =>
        key.includes(handlerTag.toString())
      );
      if (!activatedKey) return null;

      const indexedKey = activatedKey.split('__')?.[0];
      if (!indexedKey) return null;

      const touchableItem = touchableRefs.value[indexedKey];
      if (!touchableItem) return null;
      return { key: indexedKey, touchableItem };
    },
    [activeKey, touchableRefs]
  );

  const mainPanGesture = useMemo(
    () =>
      panGesture
        .onBegin((event) => {
          'worklet';
          const result = findTouchableItem(event, 'onStart');
          if (result) {
            activeKey.value = [`${result.key}__${event.handlerTag}`];
            result.touchableItem.onStart?.(event);
          }
        })
        .onUpdate((event) => {
          'worklet';
          const result = getActiveTouchableItem(event.handlerTag);
          if (result) {
            result.touchableItem.onActive?.(event);
          }
        })
        .onFinalize((event) => {
          'worklet';
          const result = getActiveTouchableItem(event.handlerTag);
          if (result) {
            activeKey.value = activeKey.value.filter(
              (key) => !key.includes(event.handlerTag.toString())
            );
            result.touchableItem.onEnd?.(event);
          }
        }),
    [panGesture, findTouchableItem, getActiveTouchableItem, activeKey]
  );

  const mainTapGesture = useMemo(
    () =>
      tapGesture.onTouchesUp((event) => {
        'worklet';
        // TODO: consider handling multiple touches
        const point = {
          x: event.allTouches[0]?.x || 0,
          y: event.allTouches[0]?.y || 0,
        };
        const result = findTouchableItem(point, 'onTap');
        if (result) {
          result.touchableItem.onTap?.(event);
        }
      }),
    [tapGesture, findTouchableItem]
  );

  const gesture = useMemo(
    () => Gesture.Simultaneous(mainPanGesture, mainTapGesture),
    [mainPanGesture, mainTapGesture]
  );

  return {
    gesture,
    findTouchableItem,
    getActiveTouchableItem,
  };
};
