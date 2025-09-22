import { Canvas as SkiaCanvas } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import {
  Gesture,
  GestureDetector,
  PanGesture,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { TouchHandlerContext } from './context';
import { TouchableRefManager, type TouchableRef } from './ref-manager';

import type { CanvasProps } from '@shopify/react-native-skia';

type TouchableCanvasProps = CanvasProps & {
  panGesture?: PanGesture;
};

const Canvas: React.FC<TouchableCanvasProps> = ({
  children,
  panGesture = Gesture.Pan(),
  ...props
}) => {
  const touchableRefs = useSharedValue<Record<string, TouchableRef>>({});
  const refManager = useMemo(
    () => new TouchableRefManager(touchableRefs),
    [touchableRefs]
  );
  const activeKey = useSharedValue<string[]>([]);

  const mainGesture = panGesture
    .onBegin((event) => {
      'worklet';
      const refs = touchableRefs.value;
      const keys = Object.keys(refs);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!key) continue;
        const touchableItem = refs[key];
        if (!touchableItem) continue;

        const isPointInPath = touchableItem.isPointInPath(event);
        if (isPointInPath && touchableItem.onStart) {
          activeKey.value = [`${key}__${event.handlerTag}`];
          touchableItem.onStart(event);
          break; // Only handle the first matching element
        }
      }
    })
    .onUpdate((event) => {
      'worklet';
      const activatedKey = activeKey.value.find((key) =>
        key.includes(event.handlerTag.toString())
      );

      if (!activatedKey) {
        return;
      }
      const indexedKey = activatedKey.split('__')?.[0];

      if (!indexedKey) {
        return;
      }
      const touchableItem = touchableRefs.value[indexedKey];

      return touchableItem?.onActive?.(event);
    })
    .onFinalize((event) => {
      'worklet';
      const activatedKey = activeKey.value.find((key) =>
        key.includes(event.handlerTag.toString())
      );
      if (!activatedKey) {
        return;
      }
      const indexedKey = activatedKey.split('__')?.[0];
      if (!indexedKey) {
        return;
      }
      const touchableItem = touchableRefs.value[indexedKey];
      activeKey.value = activeKey.value.filter(
        (key) => !key.includes(event.handlerTag.toString())
      );
      return touchableItem?.onEnd?.(event);
    });

  return (
    <GestureDetector gesture={mainGesture}>
      <SkiaCanvas {...props}>
        <TouchHandlerContext.Provider value={refManager}>
          {children}
        </TouchHandlerContext.Provider>
      </SkiaCanvas>
    </GestureDetector>
  );
};

export { Canvas };
