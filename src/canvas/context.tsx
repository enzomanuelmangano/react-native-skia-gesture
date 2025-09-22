import React, { useContext } from 'react';
import { TouchableRefManager } from './ref-manager';

const TouchHandlerContext = React.createContext<TouchableRefManager | null>(
  null
);

const useTouchHandlerContext = () => {
  const context = useContext(TouchHandlerContext);
  if (!context) {
    throw new Error(
      'useTouchHandlerContext must be used within TouchHandlerContext.Provider'
    );
  }
  return context;
};

export { TouchHandlerContext, useTouchHandlerContext };
