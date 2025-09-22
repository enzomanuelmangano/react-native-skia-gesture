import { Canvas as SkiaCanvas } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import {
  Gesture,
  GestureDetector,
  PanGesture,
  TapGesture,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { TouchHandlerContext } from './context';
import { TouchableRefManager, type TouchableRef } from './ref-manager';
import { useTouchableGestures } from '../hooks/use-touchable-gestures';

import type { CanvasProps } from '@shopify/react-native-skia';

type TouchableCanvasProps = CanvasProps & {
  panGesture?: PanGesture;
  tapGesture?: TapGesture;
};

const Canvas: React.FC<TouchableCanvasProps> = ({
  children,
  panGesture = Gesture.Pan(),
  tapGesture = Gesture.Tap(),
  ...props
}) => {
  const touchableRefs = useSharedValue<Record<string, TouchableRef>>({});
  const refManager = useMemo(
    () => new TouchableRefManager(touchableRefs),
    [touchableRefs]
  );

  const gestureProps = useMemo(
    () => ({
      touchableRefs,
      panGesture,
      tapGesture,
    }),
    [touchableRefs, panGesture, tapGesture]
  );

  const { gesture } = useTouchableGestures(gestureProps);

  return (
    <GestureDetector gesture={gesture}>
      <SkiaCanvas {...props}>
        <TouchHandlerContext.Provider value={refManager}>
          {children}
        </TouchHandlerContext.Provider>
      </SkiaCanvas>
    </GestureDetector>
  );
};

export { Canvas };
