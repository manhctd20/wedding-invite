import { useEffect, useRef, useState } from 'react'
import { listGuestbook } from '../../store/invitationApi'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Entry {
  id: string
  guestName: string
  message: string
}

interface Props {
  slug: string
  accentColor?: string
}

export default function LiveCommentTicker({ slug, accentColor = '#C4A882' }: Props) {
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

  // Only render on mobile, and only if we have entries
  if (!isMobile || entries.length === 0) return null

  const items = [...entries, ...entries]
  const itemH = 42
  const totalH = entries.length * itemH

  const visibleRows = Math.min(entries.length, 4)

  return (
    <div
      style={{
        position: 'fixed',
        left: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(62vw, 260px)',
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
          animation: ticker-scroll ${entries.length * 3}s linear infinite;
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
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              lineHeight: 1.3,
              color: '#2C2420',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ color: accentColor, fontWeight: 500 }}>{e.guestName}</span>
              <span style={{ color: '#9C8C7C' }}>{' '}&bull;{' '}</span>
              <span>{e.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
