import { useEffect, useRef, useState } from 'react'
import { addGuestbook, sendReaction } from '../../store/invitationApi'
import EffectOverlay from '../effects/EffectOverlay'

interface Props {
  slug: string
  initialCount?: number
  allowReactions?: boolean
  accentColor?: string
}

export default function StickyToolbar({ slug, initialCount = 0, allowReactions = true, accentColor = '#C4A882' }: Props) {
  const [count, setCount] = useState(initialCount)
  const [showBurst, setShowBurst] = useState(false)
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hide toolbar when soft keyboard opens (mobile)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport!
    function onResize() {
      const keyboardOpen = vv.height < window.innerHeight * 0.75
      setToolbarVisible(!keyboardOpen || showModal)
    }
    vv.addEventListener('resize', onResize)
    return () => vv.removeEventListener('resize', onResize)
  }, [showModal])

  async function handleReaction() {
    if (!allowReactions) return
    setCount(c => c + 1)
    setShowBurst(true)
    if (burstTimer.current) clearTimeout(burstTimer.current)
    burstTimer.current = setTimeout(() => setShowBurst(false), 2200)
    try {
      const res = await sendReaction(slug)
      setCount(res.count)
    } catch {}
  }

  async function handleSubmitWish(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    setSubmitting(true)
    try {
      await addGuestbook(slug, name.trim(), msg.trim())
      setSubmitted(true)
      setName('')
      setMsg('')
      setTimeout(() => {
        setSubmitted(false)
        setShowModal(false)
      }, 2500)
    } catch {}
    setSubmitting(false)
  }

  if (!toolbarVisible && !showModal) return null

  return (
    <>
      {/* Heart burst overlay */}
      {showBurst && (
        <EffectOverlay
          config={{ type: 'hearts', intensity: 'medium', color: accentColor }}
          burst
        />
      )}

      {/* Wish modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1010,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            width: '100%', background: '#fff', borderRadius: '20px 20px 0 0',
            padding: '24px 20px 32px', boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{ width: 40, height: 4, background: '#E5E5E5', borderRadius: 2, margin: '0 auto 20px' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, textAlign: 'center', marginBottom: 20, color: '#2C2420' }}>
              Gửi lời chúc mừng 💌
            </p>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: accentColor, fontSize: 15 }}>
                Cảm ơn bạn! Lời chúc đã được gửi 🎊
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  required
                  style={{
                    padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E8DDD4',
                    fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Viết lời chúc của bạn..."
                  required
                  rows={3}
                  style={{
                    padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E8DDD4',
                    fontSize: 14, resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '13px', borderRadius: 12, border: 'none',
                    background: accentColor, color: '#fff', fontSize: 15,
                    fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi lời chúc'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sticky toolbar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 16px 10px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {/* Wish input pill */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            flex: 1, height: 42, borderRadius: 21,
            background: '#F5F0EB', border: 'none',
            textAlign: 'left', paddingLeft: 16, paddingRight: 16,
            fontSize: 13, color: '#9C8C7C', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>✍️</span>
          <span>Gửi lời chúc...</span>
        </button>

        {/* Heart reaction button */}
        {allowReactions && (
          <button
            onClick={handleReaction}
            style={{
              height: 42, padding: '0 16px', borderRadius: 21,
              background: `linear-gradient(135deg, #FF6B8A, #FF8FAB)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: '#fff', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 12px rgba(255,107,138,0.35)',
              transition: 'transform 0.12s',
              flexShrink: 0,
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.94)')}
            onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: 16 }}>💗</span>
            <span>Bắn tim</span>
            {count > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.25)', borderRadius: 10,
                padding: '1px 7px', fontSize: 11,
              }}>
                {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )
}
