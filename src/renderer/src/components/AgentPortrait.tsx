import { SpritePortrait } from './SpritePortrait';
import type { OfficeCharacterName } from '@/scene/office/cast';
import feilenAvatar from '@/assets/feilen.png';

export interface AgentPortraitProps {
  character: OfficeCharacterName;
  isGod?: boolean;
  name?: string;
  scale?: number;
  /** Square display size for replacement portraits in a known-size tile. */
  portraitSize?: number;
  background?: string;
}

/**
 * Identity-aware agent portrait.
 *
 * `michael` remains a legacy character/action key shared by the original cast
 * slot and the god bootstrap record. It must never decide the god's visible
 * identity: `isGod` does. Character-only pickers should keep using
 * SpritePortrait directly; every surface rendering a real Agent uses this
 * component so Feilen cannot accidentally inherit a worker portrait again.
 */
export function AgentPortrait({
  character,
  isGod = false,
  name = '',
  scale = 1,
  portraitSize,
  background = 'transparent'
}: AgentPortraitProps) {
  if (!isGod) {
    return (
      <SpritePortrait
        character={character}
        scale={scale}
        portraitSize={portraitSize}
        background={background}
      />
    );
  }

  return (
    <img
      src={feilenAvatar}
      alt={name ? `${name} avatar` : '菲伦头像'}
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        imageRendering: 'pixelated',
        clipPath: 'inset(7% 5% 5% 5%)',
        transform: 'scale(1.08)'
      }}
    />
  );
}
