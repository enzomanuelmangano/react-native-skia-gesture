import { Blur, Image, rect, Skia, useImage } from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import Touchable, { useGestureHandler } from 'react-native-skia-gesture';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RADIUS = 80;
const RECT_WIDTH = 200;
const RECT_HEIGHT = 150;

const IMAGE_BACKGROUND =
  'https://images.unsplash.com/photo-1530669244764-0909211cd8e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80';

function App() {
  const cx = useSharedValue(100);
  const cy = useSharedValue(400);

  const circleGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      console.log('onStart');

      context.x = cx.value;
      context.y = cy.value;
    },
    onActive: ({ translationX, translationY }, context) => {
      console.log('onActive');
      cx.value = context.x + translationX;
      cy.value = context.y + translationY;
    },
  });

  const rectX = useSharedValue(100);
  const rectY = useSharedValue(100);

  const rectGesture = useGestureHandler<{ x: number; y: number }>({
    onStart: (_, context) => {
      context.x = rectX.value;
      context.y = rectY.value;
    },
    onActive: ({ translationX, translationY }, context) => {
      rectX.value = context.x + translationX;
      rectY.value = context.y + translationY;
    },
  });

  const roundedRectLayout = useSharedValue({
    x: 150,
    y: 300,
  });

  const clipPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addCircle(cx.value, cy.value, RADIUS);
    path.addRect(rect(rectX.value, rectY.value, RECT_WIDTH, RECT_HEIGHT));
    return path;
  }, [cx, cy, rectX, rectY, roundedRectLayout]);

  const image = useImage(IMAGE_BACKGROUND);

  if (!image) return <></>;

  return (
    <Touchable.Canvas
      style={{
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
      }}
    >
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
    </Touchable.Canvas>
  );
}

const AppContainer = () => {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <App />
    </GestureHandlerRootView>
  );
};

export default AppContainer;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
