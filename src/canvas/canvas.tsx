import { Canvas as SkiaCanvas } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  timeoutBeforeCollectingRefs?: number;
};

const AnimatedSkiaCanvas = Animated.createAnimatedComponent(SkiaCanvas);

const Canvas: React.FC<TouchableCanvasProps> = ({
  children,
  panGesture = Gesture.Pan(),
  timeoutBeforeCollectingRefs = 100,
  ...props
}) => {
  // Instead of value, provide a subscribe method and reload the refs
  const touchableRefs: TouchableHandlerContextType = useMemo(() => {
    return { value: {} };
  }, []);

  const activeKey = useSharedValue<string[]>([]);

  // This must be improved, it's a hack to wait for the refs to be loaded
  const [loadedRefs, prepareLoadedRefs] = useState<
    TouchableHandlerContextType['value']
  >({});

  const ref = useRef<NodeJS.Timeout>();

  useEffect(() => {
    ref.current = setTimeout(() => {
      prepareLoadedRefs(touchableRefs.value);
    }, timeoutBeforeCollectingRefs);

    return () => {
      clearTimeout(ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutBeforeCollectingRefs]);

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
      <AnimatedSkiaCanvas {...props}>
        <TouchHandlerContext.Provider value={touchableRefs}>
          {children}
        </TouchHandlerContext.Provider>
      </AnimatedSkiaCanvas>
    </GestureDetector>
  );
};

export { Canvas };
