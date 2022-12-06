import { rect, rrect, Skia, SkRect } from '@shopify/react-native-skia';

type GetRectPathParams =
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | { rect: SkRect };

const getRectPath = (params: GetRectPathParams) => {
  const skPath = Skia.Path.Make();
  if ('rect' in params) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { rect } = params;

    skPath.addRect(rect);
    return skPath;
  }
  const { x, y, width, height } = params;
  skPath.addRect(rect(x, y, width, height));
  return skPath;
};

type GetRoundedRectPathParams = GetRectPathParams & {
  r: number;
};

const getRoundedRectPath = (params: GetRoundedRectPathParams) => {
  const { r } = params;
  if ('rect' in params) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { rect } = params;
    return Skia.Path.Make().addRRect(rrect(rect, r, r));
  }
  const { x, y, width, height } = params;
  return Skia.Path.Make().addRRect(rrect(rect(x, y, width, height), r, r));
};

export { getRectPath, getRoundedRectPath };
