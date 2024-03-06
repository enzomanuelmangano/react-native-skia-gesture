import React, { useContext } from 'react';

import type { Vector } from '@shopify/react-native-skia';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

export type TouchableHandlerContextType = {
  value: Record<
    string,
    {
      onStart: (
        touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
      ) => void;
      onActive: (
        touchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>
      ) => void;
      onEnd: (
        touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
      ) => void;
      isPointInPath: (point: Vector) => boolean;
    }
  >;
};

const TouchHandlerContext = React.createContext<TouchableHandlerContextType>({
  value: {},
});

const useTouchHandlerContext = () => {
  return useContext(TouchHandlerContext);
};

export { TouchHandlerContext, useTouchHandlerContext };
