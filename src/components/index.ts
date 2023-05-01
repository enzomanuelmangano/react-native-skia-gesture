import {
  Circle as SkiaCircle,
  RoundedRect as SkiaRoundedRect,
  Rect as SkiaRect,
  Path as SkiaPath,
} from '@shopify/react-native-skia';
import { withTouchableHandler } from '../hoc';

export { Canvas } from '../canvas';

export const Circle = withTouchableHandler(SkiaCircle);
export const RoundedRect = withTouchableHandler(SkiaRoundedRect);
export const Rect = withTouchableHandler(SkiaRect);
export const Path = withTouchableHandler(SkiaPath);
