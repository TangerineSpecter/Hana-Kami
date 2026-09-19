import { useEffect, useRef } from 'react';
import { CAST_BY_NAME, paintCastPortrait, type OfficeCharacterName } from '@/scene/office/cast';
import { PORTRAIT_W, PORTRAIT_H } from '@/scene/office/portraitArt';

const FRAME_W = PORTRAIT_W;
const FRAME_H = PORTRAIT_H;

export interface SpritePortraitProps {
  character: OfficeCharacterName;
  /** Pixels per source pixel. Whole numbers are exact; half-steps (1.5, 2.5)
   *  double every other row, which pixel art survives. The blit runs with
   *  smoothing off, so nothing here is ever interpolated. */
  scale?: number;
  background?: string;
  /** Override the square size of a replacement portrait without changing the
   *  legacy sprite frame dimensions used by the scene and action system. */
  portraitSize?: number;
}

/** Static standing portrait of an Office cast member (recolored LimeZu sprite). */
export function SpritePortrait({
  character,
  scale = 2,
  background = 'transparent',
  portraitSize
}: SpritePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let cancelled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (background !== 'transparent') {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    paintCastPortrait(ctx, character, scale).catch(() => { /* asset load race */ });
    return () => { cancelled = true; void cancelled; };
  }, [character, scale, background]);

  // A fractional scale can land on a fractional pixel count; the canvas
  // attributes are integers either way, so round once and use the same number
  // for the backing store and the CSS box (a mismatch is what makes pixel art
  // blurry).
  const w = Math.round(FRAME_W * scale);
  const h = Math.round(FRAME_H * scale);

  // A cast member may temporarily have a replacement static portrait while
  // still using the original scene/action frames. Keep this branch here so
  // the picker, cards, and detail views all agree without changing the scene
  // animation contract.
  const portrait = CAST_BY_NAME[character]?.portrait;
  if (portrait) {
    const replacementSize = portraitSize ?? w;
    return (
      <img
        src={portrait}
        alt=""
        draggable={false}
        style={{
          width: replacementSize,
          height: replacementSize,
          objectFit: 'contain',
          objectPosition: 'bottom center',
          imageRendering: 'pixelated',
          display: 'block'
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      style={{
        width: w,
        height: h,
        imageRendering: 'pixelated'
      }}
    />
  );
}
