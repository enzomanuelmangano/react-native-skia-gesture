import { useCallback } from 'react';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  GestureTouchEvent,
} from 'react-native-gesture-handler';

type UseGestureHandlerParams = {
  onStart?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onActive?: (
    touchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEnd?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onTap?: (touchInfo: GestureTouchEvent) => void;
};

const useGestureHandler = (gestureHandlers: UseGestureHandlerParams) => {
  const { onStart, onActive, onEnd, onTap } = gestureHandlers;

  const handleStart = useCallback(
    (touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (!onStart) return;
      return onStart(touchInfo);
    },
    [onStart]
  );

  const handleActive = useCallback(
    (extendedTouchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (!onActive) return;
      return onActive(extendedTouchInfo);
    },
    [onActive]
  );

  const handleEnd = useCallback(
    (
      extendedTouchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
    ) => {
      'worklet';
      if (!onEnd) return;
      return onEnd(extendedTouchInfo);
    },
    [onEnd]
  );

  const handleTap = useCallback(
    (touchInfo: GestureTouchEvent) => {
      'worklet';
      if (!onTap) return;
      return onTap(touchInfo);
    },
    [onTap]
  );

  return {
    onStart: handleStart,
    onActive: handleActive,
    onEnd: handleEnd,
    onTap: handleTap,
  };
};

export { useGestureHandler };
