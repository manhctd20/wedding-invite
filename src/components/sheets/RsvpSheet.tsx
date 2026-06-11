import { useState, FormEvent } from 'react'
import BottomSheet from './BottomSheet'
import { TemplateTheme } from '../../types/invitation'
import { submitRsvp } from '../../store/invitationApi'

interface Props {
  open: boolean
  onClose: () => void
  slug: string
  theme: TemplateTheme
  rsvpName?: string
  rsvpPhone?: string
  rsvpDeadline?: string
}

type Status = 'yes' | 'no' | 'maybe'
const OPTS: { value: Status; label: string }[] = [
  { value: 'yes', label: 'Tham dự' },
  { value: 'no', label: 'Vắng mặt' },
  { value: 'maybe', label: 'Chưa chắc' },
]

export default function RsvpSheet({ open, onClose, slug, theme, rsvpName, rsvpPhone, rsvpDeadline }: Props) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('yes')
  const [count, setCount] = useState(1)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isDark = theme.isDark
  const borderC = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'transparent', border: `1px solid ${borderC}`,
    borderRadius: 12, color: theme.text, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true); setError('')
    try {
      await submitRsvp(slug, {
        guestName: name.trim(),
        status,
        guestCount: status === 'yes' ? count : undefined,
        note: note.trim() || undefined,
      })
      setSubmitted(true)
    } catch {
      setError('Gửi thất bại, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  const deadline = rsvpDeadline ? new Date(rsvpDeadline).toLocaleDateString('vi-VN') : null

  return (
    <BottomSheet open={open} onClose={onClose} title="Xác nhận tham dự" subtitle="RSVP" theme={theme}>
      {submitted ? (
        <div style={{
          textAlign: 'center', padding: '40px 16px',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', color: theme.accent,
        }}>
          <p style={{ fontSize: 30, margin: 0 }}>Cảm ơn bạn! 🎊</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'normal', fontSize: 13, color: theme.muted, marginTop: 10 }}>
            Hẹn gặp tại lễ cưới
          </p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(rsvpName || rsvpPhone) && (
            <div style={{ textAlign: 'center', padding: '8px 0 16px', borderBottom: `1px solid ${borderC}`, marginBottom: 4 }}>
              {rsvpName && <p style={{ fontSize: 12, color: theme.muted, margin: 0 }}>Liên hệ: {rsvpName}</p>}
              {rsvpPhone && (
                <a href={`tel:${rsvpPhone}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: theme.accent, textDecoration: 'none' }}>
                  {rsvpPhone}
                </a>
              )}
              {deadline && <p style={{ fontSize: 11, color: theme.muted, margin: '6px 0 0' }}>Hạn xác nhận: {deadline}</p>}
            </div>
          )}

          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Tên của bạn" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = theme.accent)}
            onBlur={e => (e.target.style.borderColor = borderC)} />

          <div style={{ display: 'flex', gap: 6 }}>
            {OPTS.map(o => {
              const active = status === o.value
              return (
                <button key={o.value} type="button" onClick={() => setStatus(o.value)}
                  style={{
                    flex: 1, padding: '10px 6px', borderRadius: 12,
                    background: active ? theme.accent : 'transparent',
                    color: active ? (isDark ? theme.bg : '#FFF') : theme.muted,
                    border: `1px solid ${active ? theme.accent : borderC}`,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    fontWeight: active ? 600 : 400, cursor: 'pointer',
                  }}>
                  {o.label}
                </button>
              )
            })}
          </div>

          {status === 'yes' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.muted, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Số người tham dự
              </label>
              <input type="number" min={1} max={10} value={count}
                onChange={e => setCount(Number(e.target.value))}
                style={{ ...inputStyle, width: 90 }} />
            </div>
          )}

          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
            placeholder="Ghi chú (dị ứng, yêu cầu đặc biệt...)"
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = theme.accent)}
            onBlur={e => (e.target.style.borderColor = borderC)} />

          {error && <p style={{ fontSize: 12, color: '#E74C3C', textAlign: 'center', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={submitting || !name.trim()}
            style={{
              padding: '13px', borderRadius: 12, border: 'none',
              background: theme.accent, color: isDark ? theme.bg : '#FFF',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: !name.trim() ? 0.5 : 1, marginTop: 4,
            }}>
            {submitting ? 'Đang gửi...' : 'Xác nhận tham dự'}
          </button>
        </form>
      )}
    </BottomSheet>
  )
}
