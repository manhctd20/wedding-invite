import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateTheme } from '../../types/invitation'
import { listGuestbook, addGuestbook } from '../../store/invitationApi'
import { useIsMobile } from '../../hooks/useIsMobile'

interface GuestEntry {
  id: string
  guestName: string
  message: string
  createdAt: string
}

interface Props {
  slug: string   // public slug của thiệp — dùng để gọi API
  theme: TemplateTheme
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d} ngày trước`
  if (h > 0) return `${h} giờ trước`
  if (m > 0) return `${m} phút trước`
  return 'Vừa xong'
}

export default function GuestbookSection({ slug, theme }: Props) {
  const m = useIsMobile()
  const [entries, setEntries] = useState<GuestEntry[]>([])
  const [loadError, setLoadError] = useState(false)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    listGuestbook(slug)
      .then(data => setEntries(data))
      .catch(() => setLoadError(true))
  }, [slug])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const entry = await addGuestbook(slug, name.trim(), msg.trim())
      setEntries(prev => [entry, ...prev])
      setName('')
      setMsg('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setSubmitError('Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

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

  return (
    <section style={{
      padding: `${py} ${px}`,
      background: theme.soft,
      borderTop: `1px solid ${theme.border}`,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: m ? 36 : 52 }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: theme.accent, marginBottom: 12,
        }}>
          Lời chúc
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, fontSize: m ? 32 : 48,
          lineHeight: 1.1, color: theme.text,
        }}>
          Sổ lưu bút
          <br />
          <span style={{ fontStyle: 'italic', color: theme.accent }}>của khách mời</span>
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: m ? '1fr' : '1fr 1fr',
        gap: m ? 36 : 56,
        alignItems: 'start',
      }}>

        {/* ── Form gửi lời chúc ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: theme.muted, marginBottom: 20,
          }}>
            Để lại lời chúc của bạn
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '28px 24px',
                  border: `1px solid ${theme.accent}`,
                  background: theme.isDark ? `${theme.accent}15` : `${theme.accent}10`,
                  textAlign: 'center',
                }}
              >
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic', fontSize: 22,
                  color: theme.accent, marginBottom: 8,
                }}>
                  Cảm ơn bạn! 🎊
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, color: theme.muted,
                }}>
                  Lời chúc của bạn đã được ghi nhận.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label style={{
                    display: 'block', fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, fontWeight: 500,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: theme.muted, marginBottom: 6,
                  }}>
                    Tên của bạn
                  </label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    maxLength={60}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = theme.accent)}
                    onBlur={e => (e.target.style.borderColor = theme.border)}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block', fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, fontWeight: 500,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: theme.muted, marginBottom: 6,
                  }}>
                    Lời chúc mừng
                  </label>
                  <textarea
                    required
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                    maxLength={300}
                    rows={4}
                    style={{ ...inp, resize: 'vertical', minHeight: 96, lineHeight: 1.6 }}
                    onFocus={e => (e.target.style.borderColor = theme.accent)}
                    onBlur={e => (e.target.style.borderColor = theme.border)}
                  />
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10, color: theme.muted,
                    textAlign: 'right', marginTop: 4,
                  }}>
                    {msg.length}/300
                  </p>
                </div>

                {submitError && (
                  <p style={{ fontSize: 12, color: '#c0392b' }}>{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !msg.trim()}
                  style={{
                    padding: '11px 28px',
                    background: submitting ? theme.muted : theme.isDark ? theme.accent : theme.text,
                    color: theme.isDark ? theme.bg : theme.soft,
                    border: 'none',
                    cursor: submitting ? 'wait' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 500,
                    letterSpacing: '0.06em',
                    opacity: !name.trim() || !msg.trim() ? 0.5 : 1,
                    transition: 'all 0.2s',
                    alignSelf: 'flex-start',
                  }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi lời chúc'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Danh sách lời chúc ── */}
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: theme.muted, marginBottom: 20,
          }}>
            {entries.length > 0 ? `${entries.length} lời chúc` : 'Chưa có lời chúc'}
          </p>

          {loadError ? (
            <p style={{ fontSize: 13, color: theme.muted }}>Không thể tải lời chúc.</p>
          ) : entries.length === 0 ? (
            <div style={{
              padding: '32px 24px', border: `1px dashed ${theme.border}`,
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic', fontSize: 18, color: theme.muted,
              }}>
                Hãy là người đầu tiên gửi lời chúc!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence initial={false}>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i < 5 ? i * 0.06 : 0 }}
                    style={{
                      padding: '16px 18px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'baseline', marginBottom: 8,
                    }}>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 17, fontWeight: 400, color: theme.accent,
                      }}>
                        {entry.guestName}
                      </p>
                      <p style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10, color: theme.muted, flexShrink: 0, marginLeft: 8,
                      }}>
                        {timeAgo(entry.createdAt)}
                      </p>
                    </div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, color: theme.text,
                      lineHeight: 1.7, fontStyle: 'italic',
                    }}>
                      "{entry.message}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
