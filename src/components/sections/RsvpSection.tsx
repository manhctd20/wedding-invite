import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateTheme } from '../../types/invitation'
import { submitRsvp } from '../../store/invitationApi'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  slug: string
  rsvpName: string
  rsvpPhone: string
  rsvpDeadline: string
  theme: TemplateTheme
}

type Status = 'yes' | 'no' | 'maybe'

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: 'yes', label: 'Tham dự' },
  { value: 'no', label: 'Vắng mặt' },
  { value: 'maybe', label: 'Chưa chắc' },
]

export default function RsvpSection({ slug, rsvpName, rsvpPhone, rsvpDeadline, theme }: Props) {
  const m = useIsMobile()
  const [guestName, setGuestName] = useState('')
  const [status, setStatus] = useState<Status>('yes')
  const [guestCount, setGuestCount] = useState(1)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const px = m ? '20px' : '80px'
  const py = m ? '56px' : '88px'

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${theme.border}`,
    background: theme.isDark ? theme.soft : '#fff',
    color: theme.text,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!guestName.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await submitRsvp(slug, {
        guestName: guestName.trim(),
        status,
        guestCount: status === 'yes' ? guestCount : undefined,
        note: note.trim() || undefined,
      })
      setSubmitted(true)
    } catch {
      setError('Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const deadlineFormatted = rsvpDeadline
    ? new Date(rsvpDeadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null

  return (
    <section style={{ padding: `${py} ${px}`, borderTop: `1px solid ${theme.border}` }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: 640, margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: m ? 36 : 48 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, marginBottom: 14 }}>
            Xác nhận tham dự
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 32 : 44, color: theme.text, lineHeight: 1.1, marginBottom: deadlineFormatted ? 12 : 0 }}>
            Vui lòng xác nhận
            <br />
            <span style={{ fontStyle: 'italic', color: theme.accent }}>trước ngày cưới</span>
          </h2>
          {deadlineFormatted && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: m ? 16 : 20, color: theme.muted, marginTop: 10 }}>
              Hạn xác nhận: {deadlineFormatted}
            </p>
          )}
        </div>

        {/* Contact info */}
        <div style={{ textAlign: 'center', marginBottom: m ? 32 : 40, padding: '16px 24px', border: `1px solid ${theme.border}`, background: theme.isDark ? theme.soft : theme.isDark ? theme.soft : `${theme.accent}08` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: theme.muted, marginBottom: 6 }}>Liên hệ xác nhận</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: theme.text, marginBottom: 4 }}>{rsvpName}</p>
          <a href={`tel:${rsvpPhone}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: m ? 20 : 18, color: theme.accent, letterSpacing: '0.05em', display: 'block', textDecoration: 'none' }}>
            {rsvpPhone}
          </a>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '36px 24px', border: `1px solid ${theme.accent}`, background: theme.isDark ? `${theme.accent}15` : `${theme.accent}10`, textAlign: 'center' }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 26, color: theme.accent, marginBottom: 10 }}>
                Cảm ơn bạn! 🎊
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: theme.muted }}>
                Xác nhận của bạn đã được ghi nhận.
                <br />Hẹn gặp bạn tại lễ cưới!
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.muted, marginBottom: 4, textAlign: 'center' }}>
                Gửi xác nhận trực tiếp
              </p>

              {/* Tên khách */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.muted, marginBottom: 6 }}>
                  Tên của bạn *
                </label>
                <input
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  maxLength={60}
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = theme.accent)}
                  onBlur={e => (e.target.style.borderColor = theme.border)}
                />
              </div>

              {/* Status buttons */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.muted, marginBottom: 8 }}>
                  Xác nhận tham dự
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {STATUS_OPTS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      style={{
                        flex: 1,
                        padding: '9px 8px',
                        border: `1px solid ${status === opt.value ? theme.accent : theme.border}`,
                        background: status === opt.value ? (theme.isDark ? `${theme.accent}30` : `${theme.accent}15`) : 'transparent',
                        color: status === opt.value ? theme.accent : theme.muted,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: status === opt.value ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số người (chỉ khi yes) */}
              {status === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.muted, marginBottom: 6 }}>
                    Số người tham dự
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    style={{ ...inp, width: 80 }}
                    onFocus={e => (e.target.style.borderColor = theme.accent)}
                    onBlur={e => (e.target.style.borderColor = theme.border)}
                  />
                </motion.div>
              )}

              {/* Ghi chú */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.muted, marginBottom: 6 }}>
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt..."
                  maxLength={200}
                  rows={2}
                  style={{ ...inp, resize: 'none', lineHeight: 1.6 }}
                  onFocus={e => (e.target.style.borderColor = theme.accent)}
                  onBlur={e => (e.target.style.borderColor = theme.border)}
                />
              </div>

              {error && <p style={{ fontSize: 12, color: '#c0392b', textAlign: 'center' }}>{error}</p>}

              <button
                type="submit"
                disabled={submitting || !guestName.trim()}
                style={{
                  padding: '12px 32px',
                  background: submitting ? theme.muted : theme.isDark ? theme.accent : theme.text,
                  color: theme.isDark ? theme.bg : theme.soft,
                  border: 'none',
                  cursor: submitting ? 'wait' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  opacity: !guestName.trim() ? 0.5 : 1,
                  transition: 'all 0.2s',
                  alignSelf: 'center',
                  minWidth: 180,
                }}
              >
                {submitting ? 'Đang gửi...' : 'Xác nhận tham dự'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
