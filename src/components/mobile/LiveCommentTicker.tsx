import { useEffect, useRef, useState } from 'react'
import { listGuestbook } from '../../store/invitationApi'
import { useIsMobile } from '../../hooks/useIsMobile'
import { TemplateTheme } from '../../types/invitation'

interface Entry {
  id: string
  guestName: string
  message: string
}

interface Props {
  slug: string
  theme: TemplateTheme
}

export default function LiveCommentTicker({ slug, theme }: Props) {
  const isMobile = useIsMobile()
  const [entries, setEntries] = useState<Entry[]>([])
  const [paused, setPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  async function fetchEntries() {
    try {
      const data = await listGuestbook(slug)
      if (Array.isArray(data) && data.length > 0) {
        setEntries(data.slice(0, 20))
      }
    } catch {}
  }

  useEffect(() => {
    fetchEntries()
    const interval = setInterval(fetchEntries, 15000)
    return () => clearInterval(interval)
  }, [slug])

  if (!isMobile || entries.length === 0) return null

  const items = [...entries, ...entries]
  const itemH = 46
  const totalH = entries.length * itemH

  const visibleRows = Math.min(entries.length, 4)
  const isDark = theme.isDark

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        bottom: 85,
        width: 'min(65vw, 280px)',
        zIndex: 998,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        height: visibleRows * itemH,
        overflow: 'hidden',
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${totalH}px); }
        }
        .ticker-inner {
          animation: ticker-scroll ${entries.length * 4}s linear infinite;
          animation-play-state: running;
        }
        .ticker-inner.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div
        ref={tickerRef}
        className={`ticker-inner${paused ? ' paused' : ''}`}
        style={{ pointerEvents: 'auto' }}
      >
        {items.map((e, i) => (
          <div
            key={`${e.id}-${i}`}
            style={{
              height: itemH,
              display: 'flex',
              alignItems: 'center',
              paddingRight: 8,
            }}
          >
            <div style={{
              background: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
              borderRadius: 24,
              padding: '8px 14px',
              fontSize: 13,
              lineHeight: 1.3,
              color: isDark ? '#FFF' : '#2C2420',
              boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ color: theme.accent, fontWeight: 500 }}>{e.guestName}</span>
              <span style={{ color: theme.muted }}>{' '}•{' '}</span>
              <span style={{ opacity: isDark ? 0.9 : 1 }}>{e.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
