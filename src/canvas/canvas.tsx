import { Canvas as SkiaCanvas } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Gesture,
  GestureDetector,
  PanGesture,
} from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';

import {
  TouchHandlerContext,
  type TouchableHandlerContextType,
} from './context';

import type { CanvasProps } from '@shopify/react-native-skia';

type TouchableCanvasProps = CanvasProps & {
  panGesture?: PanGesture;
  runOnJS?: boolean;
};

const Canvas: React.FC<TouchableCanvasProps> = ({
  children,
  panGesture = Gesture.Pan(),
  ...props
}) => {
  // Instead of value, provide a subscribe method and reload the refs
  const touchableRefs: TouchableHandlerContextType = useMemo(() => {
    return { value: {} };
  }, []);

  const activeKey = useSharedValue<string[]>([]);

  const [loadedRefs, prepareLoadedRefs] = useState<
    TouchableHandlerContextType['value']
  >({});

  setTimeout(() => {
    prepareLoadedRefs(touchableRefs.value);
  }, 1000);

  const mainGesture = panGesture
    .onBegin((event) => {
      const keys = Object.keys(loadedRefs);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as string;
        const touchableItem = loadedRefs[key];
        const isPointInPath = touchableItem?.isPointInPath(event);
        if (isPointInPath && touchableItem?.onStart) {
          activeKey.value.push(`${key}__${event.handlerTag}`);
          touchableItem.onStart?.(event);
        }
      }
    })
    .onUpdate((event) => {
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
      const touchableItem = loadedRefs[indexedKey];

      return touchableItem?.onActive?.(event);
    })
    .onFinalize((event) => {
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
      const touchableItem = loadedRefs[indexedKey];
      activeKey.value = activeKey.value.filter(
        (key) => !key.includes(event.handlerTag.toString())
      );
      return touchableItem?.onEnd?.(event as any);
    });

  useEffect(() => {
    return () => {
      touchableRefs.value = {};
    };
  }, [touchableRefs]);

  return (
    <GestureDetector gesture={mainGesture}>
      <Animated.View>
        <SkiaCanvas {...props}>
          <TouchHandlerContext.Provider value={touchableRefs}>
            {children}
          </TouchHandlerContext.Provider>
        </SkiaCanvas>
      </Animated.View>
    </GestureDetector>
  );
};

export { Canvas };
