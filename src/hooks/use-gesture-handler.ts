import { useCallback } from 'react';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
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
};

const useGestureHandler = (gestureHandlers: UseGestureHandlerParams) => {
  const { onStart, onActive, onEnd } = gestureHandlers;

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

  return {
    onStart: handleStart,
    onActive: handleActive,
    onEnd: handleEnd,
  };
};

export { useGestureHandler };
