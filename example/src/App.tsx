import {
  Circle,
  Rect,
  RoundedRect,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

import {
  withTouchableHandler,
  Canvas,
  useGestureHandler,
} from 'react-native-skia-handler';

const TouchableCircle = withTouchableHandler(Circle);
const TouchableRect = withTouchableHandler(Rect);
const TouchableRoundedRect = withTouchableHandler(RoundedRect);

export default function App() {
  const cx = useValue(100);
  const cy = useValue(100);

  const circleGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      context.x = cx.current;
      context.y = cy.current;
    },
    onActive: ({ translationX, translationY }, context) => {
      cx.current = context.x + translationX;
      cy.current = context.y + translationY;
    },
  });

  const rectX = useValue(100);
  const rectY = useValue(100);

  const rectGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      context.x = rectX.current;
      context.y = rectY.current;
    },
    onActive: ({ translationX, translationY }, context) => {
      rectX.current = context.x + translationX;
      rectY.current = context.y + translationY;
    },
  });

  const roundedRectX = useValue(150);
  const roundedRectY = useValue(300);

  const roundedRectGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      context.x = roundedRectX.current;
      context.y = roundedRectY.current;
    },
    onActive: ({ translationX, translationY }, context) => {
      roundedRectX.current = context.x + translationX;
      roundedRectY.current = context.y + translationY;
    },
  });

  return (
    <Canvas style={styles.fill}>
      <TouchableCircle cx={cx} cy={cy} r={50} color="red" {...circleGesture} />
      <TouchableRect
        x={rectX}
        y={rectY}
        width={150}
        height={100}
        color="blue"
        {...rectGesture}
      />
      <TouchableRoundedRect
        x={roundedRectX}
        y={roundedRectY}
        r={20}
        width={150}
        height={100}
        color="green"
        {...roundedRectGesture}
      />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
