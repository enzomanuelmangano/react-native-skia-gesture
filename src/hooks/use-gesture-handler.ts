import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

type UseGestureHandlerParams<ContextType> = {
  onStart?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
    context: ContextType
  ) => void;
  onActive?: (
    touchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>,
    context: ContextType
  ) => void;
  onEnd?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
    context: ContextType
  ) => void;
};

const useGestureHandler = <ContextType>(
  gestureHandlers: UseGestureHandlerParams<ContextType>
) => {
  const { onStart, onActive, onEnd } = gestureHandlers;

  const context = useSharedValue<ContextType>({} as any);

  const handleStart = useCallback(
    (touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (!onStart) return;
      return onStart(touchInfo, context.value);
    },
    [context, onStart]
  );

  const handleActive = useCallback(
    (extendedTouchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (!onActive) return;
      return onActive(extendedTouchInfo, context.value);
    },
    [context, onActive]
  );

  const handleEnd = useCallback(
    (
      extendedTouchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
    ) => {
      'worklet';
      if (!onEnd) return;
      return onEnd(extendedTouchInfo, context.value);
    },
    [context, onEnd]
  );

  return {
    onStart: handleStart,
    onActive: handleActive,
    onEnd: handleEnd,
  };
};

export { useGestureHandler };
