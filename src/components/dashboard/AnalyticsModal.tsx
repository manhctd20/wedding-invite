import { useState, useEffect } from 'react'
import { listRsvps } from '../../store/invitationApi'
import { InvitationRecord } from '../../store/invitationApi'

interface RsvpEntry {
  id: string
  guestName: string
  status: 'yes' | 'no' | 'maybe'
  guestCount?: number
  note?: string
  createdAt: string
}

interface Props {
  inv: InvitationRecord
  onClose: () => void
}

const STATUS_LABELS = { yes: 'Tham dự', no: 'Vắng mặt', maybe: 'Chưa chắc' }
const STATUS_COLORS = { yes: '#2E7D32', no: '#c0392b', maybe: '#E67E22' }
const STATUS_BG = { yes: '#F0FAF0', no: '#FFF5F5', maybe: '#FFF8EE' }

export default function AnalyticsModal({ inv, onClose }: Props) {
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listRsvps(inv.id)
      .then(setRsvps)
      .catch(() => setError('Không tải được danh sách RSVP'))
      .finally(() => setLoading(false))
  }, [inv.id])

  const total = rsvps.length
  const yes = rsvps.filter(r => r.status === 'yes')
  const totalGuests = yes.reduce((acc, r) => acc + (r.guestCount ?? 1), 0)
  const no = rsvps.filter(r => r.status === 'no').length
  const maybe = rsvps.filter(r => r.status === 'maybe').length

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#FAFAF7', width: '100%', maxWidth: 720, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #E8DDD4' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 4 }}>Thống kê thiệp</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#2C2420', fontWeight: 400 }}>
              {(inv.content as any)?.brideFirstName} & {(inv.content as any)?.groomFirstName}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C7C', fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        {/* Stats row */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8DDD4', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
          {[
            { label: 'Lượt xem', value: inv.viewCount ?? 0, icon: '👁', color: '#2C2420' },
            { label: 'Tham dự', value: yes.length, icon: '✓', color: '#2E7D32' },
            { label: 'Số khách', value: totalGuests, icon: '👥', color: '#C4A882' },
            { label: 'Chưa xác nhận', value: maybe, icon: '?', color: '#E67E22' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#FFF', padding: 16, border: '1px solid #E8DDD4', textAlign: 'center' }}>
              <p style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: stat.color, marginBottom: 2 }}>{stat.value}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#9C8C7C', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* RSVP list */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#2C2420', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Danh sách phản hồi ({total})
          </p>

          {loading && <p style={{ color: '#9C8C7C', fontSize: 13, textAlign: 'center', padding: 32 }}>Đang tải...</p>}
          {error && <p style={{ color: '#c0392b', fontSize: 13, textAlign: 'center', padding: 32 }}>{error}</p>}

          {!loading && rsvps.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, border: '1px dashed #E8DDD4' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: '#C4A882', marginBottom: 8 }}>Chưa có phản hồi</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C' }}>Khách mời chưa xác nhận tham dự qua thiệp.</p>
            </div>
          )}

          {rsvps.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0EBE4' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#C4A882' }}>{r.guestName.charAt(0)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#2C2420' }}>{r.guestName}</p>
                  <span style={{ fontSize: 10, padding: '2px 8px', background: STATUS_BG[r.status], color: STATUS_COLORS[r.status], border: `1px solid ${STATUS_COLORS[r.status]}33` }}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  {r.guestCount && r.guestCount > 1 && (
                    <span style={{ fontSize: 10, color: '#9C8C7C', padding: '2px 6px', background: '#F5F5F5' }}>
                      {r.guestCount} người
                    </span>
                  )}
                </div>
                {r.note && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C', fontStyle: 'italic' }}>{r.note}</p>}
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#C4A882', marginTop: 2 }}>
                  {new Date(r.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
