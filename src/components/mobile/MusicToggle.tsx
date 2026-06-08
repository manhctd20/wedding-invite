import { useEffect, useRef, useState } from 'react'

interface Props {
  url: string
  title?: string
  accentColor?: string
}

export default function MusicToggle({ url, accentColor = '#C4A882' }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0.5
    const onReady = () => setReady(true)
    el.addEventListener('canplay', onReady)
    return () => el.removeEventListener('canplay', onReady)
  }, [])

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const size = 44

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="metadata" />
      <button
        onClick={toggle}
        title={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          border: `1.5px solid rgba(255,255,255,0.2)`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: 0,
          opacity: ready ? 1 : 0.5,
          transition: 'opacity 0.3s, transform 0.15s',
          transform: 'scale(1)',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.92)')}
        onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {playing ? (
          // Bars animation (playing)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="5" width="3" height="10" rx="1.5" fill={accentColor}>
              <animate attributeName="height" values="10;4;10" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="y" values="5;8;5" dur="0.8s" repeatCount="indefinite" />
            </rect>
            <rect x="8.5" y="5" width="3" height="10" rx="1.5" fill={accentColor}>
              <animate attributeName="height" values="10;7;10" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" values="5;6.5;5" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="14" y="5" width="3" height="10" rx="1.5" fill={accentColor}>
              <animate attributeName="height" values="10;5;10" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="y" values="5;7.5;5" dur="0.9s" repeatCount="indefinite" />
            </rect>
          </svg>
        ) : (
          // Music note (paused)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 14V5l8-2v9" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="14" r="2" fill={accentColor} />
            <circle cx="14" cy="12" r="2" fill={accentColor} />
          </svg>
        )}
      </button>
    </>
  )
}
