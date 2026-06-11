import { useEffect, useRef, useState } from 'react'
import { TemplateTheme } from '../../types/invitation'

interface Props {
  url: string
  title?: string
  theme: TemplateTheme
  coverImage?: string | null
}

export default function MusicCard({ url, title, theme, coverImage }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    function onPlay() { setPlaying(true) }
    function onPause() { setPlaying(false) }
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    return () => {
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [])

  async function toggle() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { try { await a.play() } catch {} } else { a.pause() }
  }

  const isDark = theme.isDark
  const cardBg = isDark ? 'rgba(20,20,20,0.65)' : 'rgba(255,255,255,0.65)'
  const borderC = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)'
  const accent = theme.accent

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="metadata" />
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          position: 'fixed',
          top: 'max(12px, env(safe-area-inset-top))',
          right: 12, zIndex: 1001,
          display: 'flex', alignItems: 'center', gap: expanded ? 10 : 0,
          padding: expanded ? '6px 14px 6px 6px' : 6,
          background: cardBg,
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: `1px solid ${borderC}`,
          borderRadius: 999,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          cursor: 'pointer', userSelect: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          maxWidth: expanded ? 260 : 44,
          overflow: 'hidden',
        }}
      >
        <button
          onClick={e => { e.stopPropagation(); toggle() }}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: accent, color: isDark ? theme.bg : '#FFF',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, position: 'relative', overflow: 'hidden',
          }}
        >
          {coverImage && (
            <img src={coverImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
          )}
          <span style={{ position: 'relative', fontSize: 11, lineHeight: 1 }}>
            {playing ? '❚❚' : '▶'}
          </span>
        </button>

        {expanded && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: theme.muted, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Nhạc nền</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic',
              color: theme.text, margin: 0, lineHeight: 1.1,
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{title || 'Đang phát'}</p>
          </div>
        )}

        {playing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 3,
                background: accent, borderRadius: 2,
                animation: `mc-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }} />
            ))}
            <style>{`
              @keyframes mc-bar {
                0%   { height: 6px; }
                100% { height: 16px; }
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  )
}
