import {
  Circle as SkiaCircle,
  RoundedRect as SkiaRoundedRect,
  Rect as SkiaRect,
  Path as SkiaPath,
} from '@shopify/react-native-skia';

import { withTouchableHandler } from '../hoc';

export { Canvas } from '../canvas';

export const Circle = withTouchableHandler(SkiaCircle, 'Circle');
export const RoundedRect = withTouchableHandler(SkiaRoundedRect, 'RoundedRect');
export const Rect = withTouchableHandler(SkiaRect, 'Rect');
export const Path = withTouchableHandler(SkiaPath, 'Path');
