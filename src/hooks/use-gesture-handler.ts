import {
  type ExtendedTouchInfo,
  type TouchInfo,
  useValue,
} from '@shopify/react-native-skia';
import { useCallback } from 'react';
import type { TranslationInfo } from '../hoc';

type UseGestureHandlerParams<ContextType> = {
  onStart?: (touchInfo: TouchInfo, context: ContextType) => void;
  onActive?: (
    extendedTouchInfo: ExtendedTouchInfo & TranslationInfo,
    context: ContextType
  ) => void;
  onEnd?: (
    extendedTouchInfo: ExtendedTouchInfo & TranslationInfo,
    context: ContextType
  ) => void;
};

const useGestureHandler = <ContextType>(
  gestureHandlers: UseGestureHandlerParams<ContextType>
) => {
  const { onStart, onActive, onEnd } = gestureHandlers;

  const context = useValue<ContextType>({} as any);

  const handleStart = useCallback(
    (touchInfo: TouchInfo) => {
      if (!onStart) return;
      return onStart(touchInfo, context.current);
    },
    [context, onStart]
  );

  const handleActive = useCallback(
    (extendedTouchInfo: ExtendedTouchInfo & TranslationInfo) => {
      if (!onActive) return;
      return onActive(extendedTouchInfo, context.current);
    },
    [context, onActive]
  );

  const handleEnd = useCallback(
    (extendedTouchInfo: ExtendedTouchInfo & TranslationInfo) => {
      if (!onEnd) return;
      return onEnd(extendedTouchInfo, context.current);
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
