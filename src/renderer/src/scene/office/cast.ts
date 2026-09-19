// The Office cast — roster metadata + sprite frames.
//
// Both the static portraits (cards / picker) and the in-scene walking sprites are
// now fully custom-drawn from the same per-character recipes in portraitArt.ts:
// the scene sprite reuses the portrait's exact head/face/clothing and adds legs,
// so an agent on the office floor looks identical to its card. The LimeZu base
// sheets are no longer used for the cast. See assets/ATTRIBUTION.md.

import { Texture } from 'pixi.js';
import { paintPortrait, sceneFrameBufs, SCENE_W, SCENE_H } from './portraitArt';
import { getAnyaFrames } from './anyaFrames';
import { getKleeFrames } from './kleeFrames';
import { getHutaoFrames } from './hutaoFrames';
import anyaPortrait from '@/assets/Anya.png';
import hutaoPortrait from '@/assets/Hutao.png';
import kleePortrait from '@/assets/Klee.png';
import sunnaPortrait from '@/assets/Sunna.png';
import robinPortrait from '@/assets/Robin.png';
import furinaPortrait from '@/assets/Furina.png';
import maomaoPortrait from '@/assets/Maomao.png';
import kitagawaPortrait from '@/assets/Kitagawa.png';
import yinyuePortrait from '@/assets/Yinyue.png';
import yaniNekoPortrait from '@/assets/YaniNeko.png';
import remPortrait from '@/assets/Rem.png';
import hoshimiPortrait from '@/assets/Hoshimi.png';

export type OfficeCharacterName =
  | 'michael' | 'jim' | 'pam' | 'dwight' | 'kevin' | 'angela'
  | 'oscar' | 'stanley' | 'phyllis' | 'andy' | 'kelly' | 'ryan'
  | 'toby' | 'creed' | 'meredith';

export interface CastMember {
  name: OfficeCharacterName;
  displayName: string;
  /** Optional static portrait used by the picker/cards. Scene animation stays
   *  keyed by `name`, so a character can get a new face before its action
   *  frames are redrawn. */
  portrait?: string;
  /** Signature accent color (hex) — used for the in-scene selection glow. */
  shirt: string;
  /** Blurb shown when this character is picked / has no description yet. */
  blurb: string;
}

/** Selectable roster, in display order. */
export const OFFICE_CAST: CastMember[] = [
  // Preserve saved agents' internal key while using Anya's custom action frames.
  { name: 'michael',  displayName: '阿尼亚',   portrait: anyaPortrait, shirt: '#426b80', blurb: '阿尼亚' },
  // Preserve saved agents' internal key while using Hutao's custom action frames.
  { name: 'jim',      displayName: '胡桃',     portrait: hutaoPortrait, shirt: '#6fa8dc', blurb: '胡桃' },
  // Preserve saved agents' internal key while using Klee's custom action frames.
  { name: 'pam',      displayName: '可莉',     portrait: kleePortrait, shirt: '#9caf88', blurb: '可莉' },
  { name: 'dwight',   displayName: '千夏',     portrait: sunnaPortrait, shirt: '#b89b3e', blurb: '千夏' },
  { name: 'kevin',    displayName: '知更鸟',   portrait: robinPortrait, shirt: '#4a7ab5', blurb: '知更鸟' },
  { name: 'angela',   displayName: '芙芙',     portrait: furinaPortrait, shirt: '#8a86a6', blurb: '芙芙' },
  { name: 'oscar',    displayName: '猫猫',     portrait: maomaoPortrait, shirt: '#7a4b6b', blurb: '猫猫' },
  { name: 'stanley',  displayName: '喜多川海梦', portrait: kitagawaPortrait, shirt: '#8c5a4b', blurb: '喜多川海梦' },
  { name: 'phyllis',  displayName: '银月',     portrait: yinyuePortrait, shirt: '#b08bbf', blurb: '银月' },
  { name: 'andy',     displayName: '尼古喵喵', portrait: yaniNekoPortrait, shirt: '#6fae6f', blurb: '尼古喵喵' },
  { name: 'kelly',    displayName: '雷姆',     portrait: remPortrait, shirt: '#d16ba5', blurb: '雷姆' },
  { name: 'ryan',     displayName: '星见雅',   portrait: hoshimiPortrait, shirt: '#3a3a44', blurb: '星见雅' },
  { name: 'toby',     displayName: 'Toby',     shirt: '#9a8c5a', blurb: 'Human resources' },
  { name: 'creed',    displayName: 'Creed',    shirt: '#6b7a4b', blurb: 'Quality assurance' },
  { name: 'meredith', displayName: 'Meredith', shirt: '#b5544a', blurb: 'Supplier relations' },
];

export const CAST_BY_NAME: Record<OfficeCharacterName, CastMember> =
  Object.fromEntries(OFFICE_CAST.map((c) => [c.name, c])) as Record<OfficeCharacterName, CastMember>;

export const DEFAULT_CHARACTER: OfficeCharacterName = 'jim';

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

// ─── scene frames ────────────────────────────────────────────────────────────
const frameCache = new Map<OfficeCharacterName, Texture[][]>();

function bufToTexture(buf: Uint8ClampedArray): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = SCENE_W; canvas.height = SCENE_H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(SCENE_W, SCENE_H);
  img.data.set(buf);
  ctx.putImageData(img, 0, 0);
  const tex = Texture.from(canvas);
  tex.source.scaleMode = 'nearest';
  return tex;
}

/**
 * Frame grid CharacterSprite expects: 3 rows (down, up, right) × 7 frames
 * [walk1, walk2, walk3, type1, type2, read1, read2]. We provide a front view
 * (down — and reused for the side row, so left/right walkers still show a face)
 * and a back view (up — agents seated facing their desk show their back). The
 * three walk frames are stand / step-left / step-right.
 */
export async function getCastFrames(name: OfficeCharacterName): Promise<Texture[][]> {
  if (name === 'michael') return getAnyaFrames();
  if (name === 'pam') return getKleeFrames();
  if (name === 'jim') return getHutaoFrames();
  const cached = frameCache.get(name);
  if (cached) return cached;
  const { front, back } = sceneFrameBufs(name);
  const toRow = (bufs: Uint8ClampedArray[]): Texture[] => {
    const [stand, stepL, stepR] = bufs.map(bufToTexture);
    return [stand, stepL, stepR, stand, stand, stand, stand];
  };
  const frontRow = toRow(front);
  const frames: Texture[][] = [frontRow, toRow(back), frontRow]; // down, up, right
  frameCache.set(name, frames);
  return frames;
}

/**
 * Paint a character's static portrait for cards / the picker (delegates to the
 * custom procedural composer in portraitArt.ts).
 */
export async function paintCastPortrait(
  ctx: CanvasRenderingContext2D,
  name: OfficeCharacterName,
  scale = 2,
): Promise<void> {
  paintPortrait(ctx, name, scale);
}
