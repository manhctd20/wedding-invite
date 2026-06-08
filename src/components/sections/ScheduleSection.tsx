import { motion } from 'framer-motion'
import { ScheduleEvent, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  events: ScheduleEvent[]
  theme: TemplateTheme
}

export default function ScheduleSection({ events, theme }: Props) {
  const m = useIsMobile()
  if (!events.length) return null

  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time))

  // Column widths
  const timeW = m ? 52 : 88   // time column
  const dotW  = m ? 32 : 40   // dot + line column (line is centered here)

  return (
    <section style={{
      padding: m ? '64px 20px' : '96px 80px',
      background: theme.bg,
      borderTop: `1px solid ${theme.border}`,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: m ? 40 : 56 }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: theme.accent, marginBottom: 12,
        }}>
          Chương trình
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, fontSize: m ? 34 : 48,
          lineHeight: 1.1, color: theme.text,
        }}>
          Lịch trình <span style={{ fontStyle: 'italic' }}>trong ngày</span>
        </h2>
      </motion.div>

      {/* Timeline — 3-column grid so line & dots always align */}
      <div style={{ maxWidth: 640, position: 'relative' }}>

        {/* Continuous vertical line — sits in the center of the dot column */}
        <div style={{
          position: 'absolute',
          left: timeW + dotW / 2,
          top: 8,
          bottom: 8,
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${theme.accent}55 15%, ${theme.accent}55 85%, transparent)`,
          transform: 'translateX(-50%)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: m ? 28 : 36 }}>
          {sorted.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
              style={{
                display: 'grid',
                gridTemplateColumns: `${timeW}px ${dotW}px 1fr`,
                alignItems: 'flex-start',
              }}
            >
              {/* Time */}
              <div style={{ paddingTop: 3, textAlign: 'right', paddingRight: m ? 8 : 12 }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: m ? 12 : 14,
                  color: theme.accent,
                  lineHeight: 1,
                  fontWeight: 400,
                }}>
                  {ev.time}
                </p>
              </div>

              {/* Dot — centered in this column, on top of the line */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 4,
                position: 'relative',
                zIndex: 1,
              }}>
                <div style={{
                  width: m ? 9 : 10,
                  height: m ? 9 : 10,
                  borderRadius: '50%',
                  background: i === 0 ? theme.accent : theme.bg,
                  border: `2px solid ${theme.accent}`,
                  flexShrink: 0,
                  boxShadow: i === 0 ? `0 0 0 3px ${theme.accent}22` : 'none',
                  transition: 'background 0.2s',
                }} />
              </div>

              {/* Content */}
              <div style={{ paddingBottom: 4 }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: m ? 20 : 24,
                  color: theme.text,
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}>
                  {ev.title}
                </h3>
                {ev.description && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: theme.muted,
                    lineHeight: 1.65,
                    marginBottom: ev.location ? 5 : 0,
                  }}>
                    {ev.description}
                  </p>
                )}
                {ev.location && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: theme.accent,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
                      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor" />
                    </svg>
                    {ev.location}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
