import { useEffect, useRef, useState } from 'react'
import { addGuestbook, sendReaction } from '../../store/invitationApi'
import EffectOverlay from '../effects/EffectOverlay'
import { TemplateTheme } from '../../types/invitation'

interface Props {
  slug: string
  initialCount?: number
  allowReactions?: boolean
  theme: TemplateTheme
}

export default function StickyToolbar({ slug, initialCount = 0, allowReactions = true, theme }: Props) {
  const [count, setCount] = useState(initialCount)
  const [showBurst, setShowBurst] = useState(false)
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const isDark = theme.isDark
  const toolbarBg = isDark ? 'rgba(15,15,15,0.85)' : 'rgba(255,255,255,0.92)'
  const pillBg = isDark ? 'rgba(255,255,255,0.1)' : '#F5F0EB'
  const pillText = isDark ? '#FFF' : '#9C8C7C'
  const modalBg = isDark ? theme.bg : '#fff'
  const inputBg = isDark ? theme.soft : '#fff'

  return (
    <>
      {showBurst && (
        <EffectOverlay
          config={{ type: 'hearts', intensity: 'medium', color: theme.accent }}
          burst
        />
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1010,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'flex-end',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            width: '100%', background: modalBg, borderRadius: '24px 24px 0 0',
            padding: '24px 20px 32px', boxShadow: '0 -4px 32px rgba(0,0,0,0.2)',
            borderTop: `1px solid ${theme.border}`
          }}>
            <div style={{ width: 40, height: 4, background: theme.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, textAlign: 'center', marginBottom: 24, color: theme.text }}>
              Gửi lời chúc mừng 💌
            </p>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: theme.accent, fontSize: 16 }}>
                Cảm ơn bạn! Lời chúc đã được gửi 🎊
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  required
                  style={{
                    padding: '14px 18px', borderRadius: 14, border: `1px solid ${theme.border}`,
                    background: inputBg, color: theme.text,
                    fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = theme.accent)}
                  onBlur={e => (e.target.style.borderColor = theme.border)}
                />
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Viết lời chúc của bạn..."
                  required
                  rows={3}
                  style={{
                    padding: '14px 18px', borderRadius: 14, border: `1px solid ${theme.border}`,
                    background: inputBg, color: theme.text,
                    fontSize: 15, resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = theme.accent)}
                  onBlur={e => (e.target.style.borderColor = theme.border)}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '15px', borderRadius: 14, border: 'none', marginTop: 8,
                    background: theme.accent, color: isDark ? theme.bg : '#fff', fontSize: 16,
                    fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.05em'
                  }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi lời chúc'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: toolbarBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            flex: 1, height: 46, borderRadius: 23,
            background: pillBg, border: 'none',
            textAlign: 'left', paddingLeft: 20, paddingRight: 20,
            fontSize: 14, color: pillText, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'background 0.2s'
          }}
        >
          <span style={{ fontSize: 18 }}>✍️</span>
          <span>Gửi lời chúc...</span>
        </button>

        {allowReactions && (
          <button
            onClick={handleReaction}
            style={{
              height: 46, padding: '0 20px', borderRadius: 23,
              background: `linear-gradient(135deg, #FF5B7E, #FF8FAB)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, color: '#fff', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isDark ? '0 4px 16px rgba(255,91,126,0.2)' : '0 4px 16px rgba(255,91,126,0.3)',
              transition: 'transform 0.1s',
              flexShrink: 0,
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: 18 }}>💗</span>
            <span>Bắn tim</span>
            {count > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.25)', borderRadius: 12,
                padding: '2px 8px', fontSize: 12, marginLeft: 2
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
