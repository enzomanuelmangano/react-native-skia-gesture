import {
  Canvas as SkiaCanvas,
  CanvasProps,
  useTouchHandler,
  useValue,
} from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { TouchHandlerContext, TouchableHandlerContextType } from './context';

const Canvas: React.FC<CanvasProps> = ({ children, onTouch, ...props }) => {
  const touchableRefs = useValue<TouchableHandlerContextType['current']>({});

  const activeKey = useValue<string | null>(null);

  const touchHandler = useTouchHandler(
    {
      onStart: (event) => {
        const keys = Object.keys(touchableRefs.current);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i] as string;
          const touchableItem = touchableRefs.current[key];

          if (touchableItem?.isPointInPath(event)) {
            activeKey.current = key;
            touchableItem.onStart?.(event);
            return;
          }
        }
      },
      onActive: (event) => {
        if (!activeKey.current) return;
        const touchableItem = touchableRefs.current[activeKey.current];
        return touchableItem?.onActive?.(event);
      },
      onEnd: (event) => {
        if (!activeKey.current) return;
        const touchableItem = touchableRefs.current[activeKey.current];
        activeKey.current = null;
        return touchableItem?.onEnd?.(event);
      },
    },
    [touchableRefs, activeKey]
  );

  useEffect(() => {
    return () => {
      touchableRefs.current = {};
    };
  }, [touchableRefs]);

  return (
    <SkiaCanvas
      {...props}
      onTouch={(touchInfo) => {
        touchHandler(touchInfo);
        return onTouch?.(touchInfo);
      }}
    >
      <TouchHandlerContext.Provider value={touchableRefs}>
        {children}
      </TouchHandlerContext.Provider>
    </SkiaCanvas>
  );
};

export { Canvas };
