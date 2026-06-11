import { useEffect, useState, FormEvent } from 'react'
import BottomSheet from './BottomSheet'
import { TemplateTheme } from '../../types/invitation'
import { addGuestbook, listGuestbook } from '../../store/invitationApi'

interface Entry {
  id: string
  guestName: string
  message: string
  createdAt?: string
}

interface Props {
  open: boolean
  onClose: () => void
  slug: string
  theme: TemplateTheme
}

export default function WishWallSheet({ open, onClose, slug, theme }: Props) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    listGuestbook(slug).then(data => Array.isArray(data) && setEntries(data)).catch(() => {})
  }, [open, slug])

  const isDark = theme.isDark
  const glassBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)'
  const glassBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)'
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'transparent',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}`,
    borderRadius: 12, color: theme.text, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box',
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    setSubmitting(true)
    try {
      await addGuestbook(slug, name.trim(), msg.trim())
      setSubmitted(true)
      setName(''); setMsg('')
      const fresh = await listGuestbook(slug)
      if (Array.isArray(fresh)) setEntries(fresh)
      setTimeout(() => setSubmitted(false), 2500)
    } catch {}
    setSubmitting(false)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Sổ lưu bút" subtitle="LỜI CHÚC TỪ KHÁCH MỜI" theme={theme}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <input
          value={name} onChange={e => setName(e.target.value)} required
          placeholder="Tên của bạn"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = theme.accent)}
          onBlur={e => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)')}
        />
        <textarea
          value={msg} onChange={e => setMsg(e.target.value)} required rows={3}
          placeholder="Viết lời chúc của bạn..."
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => (e.target.style.borderColor = theme.accent)}
          onBlur={e => (e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)')}
        />
        <button
          type="submit" disabled={submitting}
          style={{
            padding: '12px', borderRadius: 12, border: 'none',
            background: theme.accent, color: isDark ? theme.bg : '#FFF',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            letterSpacing: '0.05em', cursor: submitting ? 'wait' : 'pointer',
            opacity: submitting ? 0.6 : 1, marginTop: 4,
          }}
        >
          {submitted ? '✓ Đã gửi lời chúc' : submitting ? 'Đang gửi...' : 'Gửi lời chúc'}
        </button>
      </form>

      <div style={{ borderTop: `1px solid ${glassBorder}`, paddingTop: 16 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.muted, margin: '0 0 12px', textAlign: 'center' }}>
          {entries.length > 0 ? `${entries.length} lời chúc` : 'Chưa có lời chúc'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map(e => (
            <div key={e.id} style={{
              background: glassBg,
              border: `1px solid ${glassBorder}`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 14, padding: '12px 14px',
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                color: theme.accent, margin: 0, marginBottom: 4,
              }}>{e.guestName}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 15, color: theme.text, margin: 0, lineHeight: 1.5,
              }}>"{e.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
