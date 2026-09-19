import { Texture } from 'pixi.js';
import { HUTAO_W, HUTAO_H, paintHutao, type HutaoAction } from './hutaoArt';

let cache: Texture[][] | undefined;
/** 16 standing columns followed by 16 seated columns, with the same actions. */
export function getHutaoFrames(): Texture[][] {
  if (cache) return cache;
  cache = (['down', 'up', 'right'] as const).map(direction =>
    [false, true].flatMap(seated => (['walk', 'type', 'read', 'idle'] as HutaoAction[]).flatMap(action =>
      Array.from({ length: 4 }, (_, frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = HUTAO_W; canvas.height = HUTAO_H;
        paintHutao(canvas.getContext('2d')!, direction, action, frame, seated);
        const texture = Texture.from(canvas);
        texture.source.scaleMode = 'nearest';
        return texture;
      }),
    )),
  );
  return cache;
}
