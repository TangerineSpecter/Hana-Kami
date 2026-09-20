import { Texture } from 'pixi.js';
import { YINYUE_W, YINYUE_H, paintYinyue, type YinyueAction } from './yinyueArt';

let cache: Texture[][] | undefined;
/** 16 standing columns followed by 16 seated columns, with the same actions. */
export function getYinyueFrames(): Texture[][] {
  if (cache) return cache;
  cache = (['down', 'up', 'right'] as const).map(direction =>
    [false, true].flatMap(seated => (['walk', 'type', 'read', 'idle'] as YinyueAction[]).flatMap(action =>
      Array.from({ length: 4 }, (_, frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = YINYUE_W; canvas.height = YINYUE_H;
        paintYinyue(canvas.getContext('2d')!, direction, action, frame, seated);
        const texture = Texture.from(canvas);
        texture.source.scaleMode = 'nearest';
        return texture;
      }),
    )),
  );
  return cache;
}
