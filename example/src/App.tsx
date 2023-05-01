import {
  Blur,
  Image,
  rect,
  rrect,
  Selector,
  Skia,
  useComputedValue,
  useImage,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import Touchable, { useGestureHandler } from 'react-native-skia-gesture';

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

  const roundedRectLayout = useValue({
    x: 150,
    y: 300,
  });

  const roundedRectGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      context.x = roundedRectLayout.current.x;
      context.y = roundedRectLayout.current.y;
    },
    onActive: ({ translationX, translationY }, context) => {
      roundedRectLayout.current = {
        x: context.x + translationX,
        y: context.y + translationY,
      };
    },
  });

  const clipPath = useComputedValue(() => {
    const path = Skia.Path.Make();
    path.addCircle(cx.current, cy.current, RADIUS);
    path.addRect(rect(rectX.current, rectY.current, RECT_WIDTH, RECT_HEIGHT));
    path.addRRect(
      rrect(
        rect(
          roundedRectLayout.current.x,
          roundedRectLayout.current.y,
          RECT_WIDTH,
          RECT_HEIGHT
        ),
        ROUNDED_RECT_RADIUS,
        ROUNDED_RECT_RADIUS
      )
    );
    return path;
  }, [cx, cy, rectX, rectY, roundedRectLayout]);

  const image = useImage(IMAGE_BACKGROUND);

  if (!image) return <></>;

  return (
    <Touchable.Canvas style={styles.fill}>
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
      <Touchable.Circle
        cx={cx}
        cy={cy}
        r={RADIUS}
        color="rgba(255, 255, 255,0.2)"
        {...circleGesture}
      />
      <Touchable.Rect
        x={rectX}
        y={rectY}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        color="rgba(255, 255, 255,0.2)"
        {...rectGesture}
      />
      <Touchable.RoundedRect
        x={Selector(roundedRectLayout, (r) => r.x)}
        y={Selector(roundedRectLayout, (r) => r.y)}
        r={ROUNDED_RECT_RADIUS}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        color="rgba(255, 255, 255,0.2)"
        {...roundedRectGesture}
      />
    </Touchable.Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
