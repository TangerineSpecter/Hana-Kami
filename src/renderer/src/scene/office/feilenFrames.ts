import { Texture } from 'pixi.js';
import { FEILEN_W, FEILEN_H, paintFeilen, type FeilenAction } from './feilenArt';

let cache: Texture[][] | undefined;
/** 16 standing columns followed by 16 seated columns, with the same actions. */
export function getFeilenFrames(): Texture[][] {
  if (cache) return cache;
  cache = (['down', 'up', 'right'] as const).map(direction =>
    [false, true].flatMap(seated => (['walk', 'type', 'read', 'idle'] as FeilenAction[]).flatMap(action =>
      Array.from({ length: 4 }, (_, frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = FEILEN_W; canvas.height = FEILEN_H;
        paintFeilen(canvas.getContext('2d')!, direction, action, frame, seated);
        const texture = Texture.from(canvas);
        texture.source.scaleMode = 'nearest';
        return texture;
      }),
    )),
  );
  return cache;
}
