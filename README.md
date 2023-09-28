<h1 align="center">
React Native Skia Gesture 🤌🏽
</h1>

_A detection system for React Native Skia components._

<div align="center">
    <img src="https://github.com/enzomanuelmangano/react-native-skia-gesture/blob/main/.assets/example.gif" title="react-native-skia-gesture">
</div>

### Motivation

React Native Skia, provides many declarative APIs for building screens using React Components. However, [Skia components are not real components, but abstract representations of a part of a drawing](https://github.com/Shopify/react-native-skia/issues/513#issuecomment-1290126304).
Therefore direct interactions with individual Skia components can only be achieved indirectly from the Canvas (trying to figure out if the point on the screen that was clicked is within the element we want to interact with).

This package, simply provides a set of APIs to be able to interact directly with individual components.

## Installation

**You need to have already installed [@shopify/react-native-skia (>= 0.1.157)](https://shopify.github.io/react-native-skia/docs/getting-started/installation)**

Open a Terminal in your project's folder and install the library using `yarn`:

```sh
yarn add react-native-skia-gesture
```

or with `npm`:

```sh
npm install react-native-skia-gesture
```

## Usage

```jsx
import {
  useValue,
} from '@shopify/react-native-skia';

import Touchable, {
  useGestureHandler,
} from 'react-native-skia-gesture';

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

  return (
    <Touchable.Canvas style={styles.fill}>
      <Touchable.Circle cx={cx} cy={cy} r={50} color="red" {...circleGesture} />
    </Touchable.Canvas>
  );
}
```

If the element is a **Circle**, **Rect**, **RoundedRect**, or a **Path** the package will automatically derive its **touchablePath**. Alternatively it will have to be passed as a parameter to the TouchableComponent.

```jsx
...
const touchablePath = useComputedValue(() => {
  const path = new Path();
  path.addCircle(cx.current, cy.current, 50);
  return path;
}, [cx, cy]);

return (
  <Touchable.Canvas style={styles.fill}>
    <Touchable.Circle cx={cx} cy={cy} r={50} color="red" touchablePath={touchablePath} {...circleGesture} />
  </Touchable.Canvas>
);
...
```

## Ingredients

### `Canvas`

It's simply a Wrapper of Skia's Canvas.

---

### `withTouchableHandler`

It's a HOC with which to wrap all Skia components with which you want to interact directly. You will need to pass a `touchablePath` to the component.

```jsx
import { Image } from '@shopify/react-native-skia';
import { withTouchableHandler } from 'react-native-skia-gesture';

const TouchableImage = withTouchableHandler(Image);
const touchablePath = Skia.Path.Make().addCircle(x, y, 50);

return (
  <Touchable.Canvas style={styles.fill}>
    <TouchableImage
      image={image}
      x={x}
      y={y}
      width={50}
      height={50}
      touchablePath={touchablePath}
      {...circleGesture} 
    />
  </Touchable.Canvas>
);
```

---

### `useGestureHandler`

It's a hook from which _onStart_, _onActive_, _onEnd_ interactions can be managed. The hook provides as the second parameter of each callback a context that can be optionally used (strongly inspired by the [useAnimatedGestureHandler](https://docs.swmansion.com/react-native-reanimated/docs/2.3.x/api/hooks/useAnimatedGestureHandler/) hook).

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
