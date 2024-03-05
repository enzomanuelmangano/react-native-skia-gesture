import { Skia, type SkRect } from '@shopify/react-native-skia';

type GetRectPathParams =
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | { rect: SkRect };

const getRectPath = (params: GetRectPathParams) => {
  'worklet';

  const skPath = Skia.Path.Make();
  if ('rect' in params) {
    const { rect } = params;

    skPath.addRect(rect);
    return skPath;
  }
  const { x, y, width, height } = params;

  skPath.addRect(Skia.XYWHRect(x, y, width, height));
  return skPath;
};

type GetRoundedRectPathParams = GetRectPathParams & {
  r: number;
};

const getRoundedRectPath = (params: GetRoundedRectPathParams) => {
  'worklet';

  const { r } = params;
  const skPath = Skia.Path.Make();
  if ('rect' in params) {
    const { rect } = params;

    skPath.addRRect(Skia.RRectXY(rect, r, r));
    return skPath;
  }
  const { x, y, width, height } = params;

  const roundedRect = Skia.RRectXY(Skia.XYWHRect(x, y, width, height), r, r);
  skPath.addRRect(roundedRect);
  return skPath;
};

export { getRectPath, getRoundedRectPath };
