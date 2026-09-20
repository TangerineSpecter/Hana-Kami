import { useTranslation } from 'react-i18next';
import { colors, hex, type AccentColorName } from '@/design/tokens';

export const DEFAULT_JOB_COLOR: AccentColorName = 'sky';
export const JOB_COLORS: AccentColorName[] = ['sky', 'mint', 'lilac', 'coral', 'peach', 'lemon'];

/** A display-only job label; it never changes hive roles or agent prompts. */
export function AgentJobBadge({ title, color = DEFAULT_JOB_COLOR }: {
  title?: string;
  color?: AccentColorName;
}) {
  const { t } = useTranslation();
  const label = title?.trim() || t('agentJob.employee');
  const resolvedColor = JOB_COLORS.includes(color) ? color : DEFAULT_JOB_COLOR;
  return (
    <span
      title={label}
      style={{
        display: 'inline-block', verticalAlign: 'middle',
        fontFamily: 'var(--cth-font-ui)', fontSize: 12, lineHeight: '18px',
        background: `var(--cth-${resolvedColor})`,
        // Accent fills stay light in both themes, so their ink must stay dark.
        color: hex(colors.ink[900]),
        padding: '1px 6px 0', flexShrink: 0, maxWidth: 72,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}
    >{label}</span>
  );
}
