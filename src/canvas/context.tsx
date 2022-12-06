import type {
  ExtendedTouchInfo,
  TouchInfo,
  Vector,
} from '@shopify/react-native-skia';
import React, { useContext } from 'react';

export type TouchableHandlerContextType = {
  current: Record<
    string,
    {
      onStart: (touchInfo: TouchInfo) => void;
      onActive: (touchInfo: ExtendedTouchInfo) => void;
      onEnd: (touchInfo: ExtendedTouchInfo) => void;
      isPointInPath: (point: Vector) => boolean;
    }
  >;
};
const TouchHandlerContext = React.createContext<TouchableHandlerContextType>({
  current: {},
});

const useTouchHandlerContext = () => {
  return useContext(TouchHandlerContext);
};

export { TouchHandlerContext, useTouchHandlerContext };
