import {
  Canvas as SkiaCanvas,
  type CanvasProps,
  useMultiTouchHandler,
  useValue,
} from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import {
  TouchHandlerContext,
  type TouchableHandlerContextType,
} from './context';

const Canvas: React.FC<CanvasProps> = ({ children, onTouch, ...props }) => {
  const touchableRefs = useValue<TouchableHandlerContextType['current']>({});

  const activeKey = useValue<string[]>([]);

  const touchHandler = useMultiTouchHandler(
    {
      onStart: (event) => {
        const keys = Object.keys(touchableRefs.current);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i] as string;
          const touchableItem = touchableRefs.current[key];
          if (touchableItem?.isPointInPath(event)) {
            activeKey.current.push(`${key}__${event.id}`);
            touchableItem.onStart?.(event);
            return;
          }
        }
      },
      onActive: (event) => {
        const activatedKey = activeKey.current.find((key) =>
          key.includes(event.id.toString())
        );
        if (!activatedKey) {
          return;
        }
        const indexedKey = activatedKey.split('__')?.[0];
        if (!indexedKey) {
          return;
        }
        const touchableItem = touchableRefs.current[indexedKey];
        return touchableItem?.onActive?.(event);
      },
      onEnd: (event) => {
        const activatedKey = activeKey.current.find((key) =>
          key.includes(event.id.toString())
        );
        if (!activatedKey) {
          return;
        }
        const indexedKey = activatedKey.split('__')?.[0];
        if (!indexedKey) {
          return;
        }
        const touchableItem = touchableRefs.current[indexedKey];
        activeKey.current = activeKey.current.filter(
          (key) => !key.includes(event.id.toString())
        );
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
