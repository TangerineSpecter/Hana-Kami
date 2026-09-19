import { Texture } from 'pixi.js';
import { KLEE_W, KLEE_H, paintKlee, type KleeAction } from './kleeArt';

let cache: Texture[][] | undefined;
/** 16 standing columns followed by 16 seated columns, with the same actions. */
export function getKleeFrames(): Texture[][] {
  if (cache) return cache;
  cache = (['down', 'up', 'right'] as const).map(direction =>
    [false, true].flatMap(seated => (['walk', 'type', 'read', 'idle'] as KleeAction[]).flatMap(action =>
      Array.from({ length: 4 }, (_, frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = KLEE_W; canvas.height = KLEE_H;
        paintKlee(canvas.getContext('2d')!, direction, action, frame, seated);
        const texture = Texture.from(canvas);
        texture.source.scaleMode = 'nearest';
        return texture;
      }),
    )),
  );
  return cache;
}
