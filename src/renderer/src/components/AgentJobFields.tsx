import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccentColorName } from '@/design/tokens';
import { AgentJobBadge, JOB_COLORS } from './AgentJobBadge';

/** Shared by hiring and editing so the preview matches the actual card. */
export function AgentJobFields({ title, color, onTitleChange, onColorChange }: {
  title: string;
  color: AccentColorName;
  onTitleChange: (title: string) => void;
  onColorChange: (color: AccentColorName) => void;
}) {
  const { t } = useTranslation();
  const id = useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor={id} style={{ fontSize: 12, color: 'var(--cth-ink-700)' }}>
        {t('agentJob.title')}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          id={id}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('agentJob.placeholder')}
          maxLength={24}
          aria-describedby={`${id}-hint`}
          style={{
            flex: 1, minWidth: 0, width: '100%', padding: '6px 8px 4px',
            background: 'var(--cth-paper-100)', border: 'none',
            boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
            fontFamily: 'var(--cth-font-ui)', fontSize: 16, color: 'var(--cth-ink-900)'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>{t('agentJob.preview')}</span>
          <AgentJobBadge title={title} color={color} />
        </div>
      </div>
      <div role="group" aria-label={t('agentJob.color')} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--cth-ink-500)', marginInlineEnd: 2 }}>{t('agentJob.color')}</span>
        {JOB_COLORS.map((choice) => (
          <button
            key={choice}
            type="button"
            aria-label={t(`agentJob.colors.${choice}`)}
            aria-pressed={color === choice}
            title={t(`agentJob.colors.${choice}`)}
            onClick={() => onColorChange(choice)}
            style={{
              width: 24, height: 24, padding: 0, border: 'none', cursor: 'pointer',
              background: `var(--cth-${choice})`,
              boxShadow: color === choice
                ? 'inset 0 0 0 2px var(--cth-cream-50), 0 0 0 2px var(--cth-ink-700)'
                : 'inset 0 0 0 1px var(--cth-ink-300)'
            }}
          />
        ))}
      </div>
      <span id={`${id}-hint`} style={{ fontSize: 12, lineHeight: '16px', color: 'var(--cth-ink-500)' }}>
        {t('agentJob.hint')}
      </span>
    </div>
  );
}
