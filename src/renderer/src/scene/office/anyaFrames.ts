import { Texture } from 'pixi.js';
import { ANYA_W, ANYA_H, paintAnya, type AnyaAction } from './anyaArt';

let cache: Texture[][] | undefined;
/** 16 standing columns followed by 16 seated columns, with the same actions. */
export function getAnyaFrames(): Texture[][] {
  if (cache) return cache;
  cache = (['down', 'up', 'right'] as const).map(direction =>
    [false, true].flatMap(seated => (['walk', 'type', 'read', 'idle'] as AnyaAction[]).flatMap(action =>
      Array.from({ length: 4 }, (_, frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = ANYA_W; canvas.height = ANYA_H;
        paintAnya(canvas.getContext('2d')!, direction, action, frame, seated);
        const texture = Texture.from(canvas);
        texture.source.scaleMode = 'nearest';
        return texture;
      }),
    )),
  );
  return cache;
}
