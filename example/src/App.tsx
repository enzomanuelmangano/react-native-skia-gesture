import {
  Blur,
  Circle,
  Image,
  rect,
  Rect,
  RoundedRect,
  rrect,
  Skia,
  useComputedValue,
  useImage,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import {
  withTouchableHandler,
  Canvas,
  useGestureHandler,
} from 'react-native-skia-gesture';

const TouchableCircle = withTouchableHandler(Circle);
const TouchableRect = withTouchableHandler(Rect);
const TouchableRoundedRect = withTouchableHandler(RoundedRect);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RADIUS = 80;
const RECT_WIDTH = 200;
const RECT_HEIGHT = 150;
const ROUNDED_RECT_RADIUS = 20;
const IMAGE_BACKGROUND =
  'https://images.unsplash.com/photo-1530669244764-0909211cd8e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80';

export default function App() {
  const cx = useValue(100);
  const cy = useValue(400);

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

  const clipPath = useComputedValue(() => {
    const path = Skia.Path.Make();
    path.addCircle(cx.current, cy.current, RADIUS);
    path.addRect(rect(rectX.current, rectY.current, RECT_WIDTH, RECT_HEIGHT));
    path.addRRect(
      rrect(
        rect(
          roundedRectX.current,
          roundedRectY.current,
          RECT_WIDTH,
          RECT_HEIGHT
        ),
        ROUNDED_RECT_RADIUS,
        ROUNDED_RECT_RADIUS
      )
    );
    return path;
  }, [cx, cy, rectX, rectY, roundedRectX, roundedRectY]);

  const image = useImage(IMAGE_BACKGROUND);

  if (!image) return <></>;

  return (
    <Canvas style={styles.fill}>
      <Image
        image={image}
        fit="cover"
        x={0}
        y={0}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
      >
        <Blur blur={10} mode="mirror" />
      </Image>
      <Image
        image={image}
        clip={clipPath}
        invertClip
        fit="cover"
        x={0}
        y={0}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
      />

      <TouchableCircle
        cx={cx}
        cy={cy}
        r={RADIUS}
        color="rgba(255, 255, 255,0.2)"
        {...circleGesture}
      />
      <TouchableRect
        x={rectX}
        y={rectY}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        color="rgba(255, 255, 255,0.2)"
        {...rectGesture}
      />
      <TouchableRoundedRect
        x={roundedRectX}
        y={roundedRectY}
        r={ROUNDED_RECT_RADIUS}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        color="rgba(255, 255, 255,0.2)"
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
