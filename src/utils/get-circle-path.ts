import { Skia } from '@shopify/react-native-skia';

type GetCirclePathParams = { cx: number; cy: number; r: number };

export const getCirclePath = ({ cx, cy, r }: GetCirclePathParams) => {
  return Skia.Path.Make().addCircle(cx, cy, r);
};
