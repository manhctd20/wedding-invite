import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { BankAccount, TemplateTheme } from '../../types/invitation'

interface Props {
  open: boolean
  onClose: () => void
  accounts: BankAccount[]
  theme: TemplateTheme
}

const SIDE_LABEL: Record<BankAccount['side'], string> = {
  bride: 'Nhà Gái',
  groom: 'Nhà Trai',
  both: 'Chung',
}

export default function GiftBoxSheet({ open, onClose, accounts, theme }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const isDark = theme.isDark

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1600)
    } catch {}
  }

  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'

  return (
    <BottomSheet open={open} onClose={onClose} title="Hộp quà mừng cưới" subtitle="QUÀ TỪ ĐÁY LÒNG" theme={theme}>
      {accounts.length === 0 ? (
        <p style={{ textAlign: 'center', color: theme.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: '40px 0' }}>
          Cô dâu chú rể chưa thêm tài khoản nhận quà.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {accounts.map(acc => {
            const qrUrl = `https://img.vietqr.io/image/${encodeURIComponent(acc.bankName)}-${encodeURIComponent(acc.accountNumber.replace(/\s/g, ''))}-compact2.png?accountName=${encodeURIComponent(acc.accountName)}`
            return (
              <div key={acc.id} style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 18,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: theme.accent, margin: 0,
                }}>{SIDE_LABEL[acc.side]}</p>

                <img src={qrUrl} alt="QR" style={{ width: 180, height: 180, borderRadius: 12, background: '#FFF' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />

                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500,
                  color: theme.text, margin: 0,
                }}>{acc.bankName}</p>

                <button
                  onClick={() => copy(acc.accountNumber, acc.id)}
                  style={{
                    background: 'none', border: 'none',
                    fontFamily: "'DM Mono', monospace", fontSize: 16,
                    color: theme.accent, letterSpacing: '0.06em',
                    cursor: 'pointer', padding: '4px 8px',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {acc.accountNumber}
                  <span style={{ fontSize: 11, color: theme.muted }}>
                    {copiedId === acc.id ? '✓ Đã chép' : '⧉ Chép'}
                  </span>
                </button>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: theme.muted, margin: 0, textAlign: 'center',
                }}>{acc.accountName}</p>
              </div>
            )
          })}
        </div>
      )}
    </BottomSheet>
  )
}
