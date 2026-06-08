import { useState } from 'react'

interface Props {
  inviteUrl: string
  editUrl: string
  onClose: () => void
}

export default function ShareModal({ inviteUrl, editUrl, onClose }: Props) {
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [copiedEdit, setCopiedEdit] = useState(false)

  function copy(text: string, which: 'invite' | 'edit') {
    navigator.clipboard.writeText(text).then(() => {
      if (which === 'invite') { setCopiedInvite(true); setTimeout(() => setCopiedInvite(false), 2000) }
      else { setCopiedEdit(true); setTimeout(() => setCopiedEdit(false), 2000) }
    })
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(44,36,32,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#FAFAF7', maxWidth: 520, width: '100%', padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 28, color: '#2C2420', marginBottom: 6 }}>Chia sẻ thiệp cưới</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#9C8C7C' }}>Gửi link xem cho khách mời hoặc giữ link chỉnh sửa cho riêng bạn</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C7C', fontSize: 20, lineHeight: 1, padding: 4 }}>x</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Invite link */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 8 }}>
              Link gửi khách mời
            </p>
            <div style={{ display: 'flex', gap: 0, border: '1px solid #E8DDD4' }}>
              <input
                readOnly
                value={inviteUrl}
                style={{ flex: 1, padding: '10px 12px', border: 'none', background: 'white', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#5C4C3C', outline: 'none', minWidth: 0 }}
              />
              <button
                onClick={() => copy(inviteUrl, 'invite')}
                style={{ padding: '10px 16px', background: copiedInvite ? '#C4A882' : '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, whiteSpace: 'nowrap', transition: 'background 0.2s' }}
              >
                {copiedInvite ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* Edit link */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 8 }}>
              Link chỉnh sửa (giữ bí mật)
            </p>
            <div style={{ display: 'flex', gap: 0, border: '1px solid #E8DDD4' }}>
              <input
                readOnly
                value={editUrl}
                style={{ flex: 1, padding: '10px 12px', border: 'none', background: '#F5EDE4', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#5C4C3C', outline: 'none', minWidth: 0 }}
              />
              <button
                onClick={() => copy(editUrl, 'edit')}
                style={{ padding: '10px 16px', background: copiedEdit ? '#C4A882' : '#9C8C7C', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, whiteSpace: 'nowrap', transition: 'background 0.2s' }}
              >
                {copiedEdit ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#C4A882', marginTop: 8 }}>
              Lưu link này lại. Bạn cần link này để chỉnh sửa thiệp sau này.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #E8DDD4', display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#2C2420', color: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textDecoration: 'none', transition: 'opacity 0.2s' }}
          >
            Xem thiệp cưới
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
