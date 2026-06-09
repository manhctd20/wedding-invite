import { motion } from 'framer-motion'
import { BankAccount, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  accounts: BankAccount[]
  theme: TemplateTheme
}

export default function BankSection({ accounts, theme }: Props) {
  const m = useIsMobile()

  if (accounts.length === 0) return null

  // Function to generate VietQR url
  const getQrUrl = (acc: BankAccount) => {
    return `https://img.vietqr.io/image/${acc.bankName}-${acc.accountNumber}-compact2.png?amount=0&addInfo=Mung%20Cuoi&accountName=${encodeURIComponent(acc.accountName)}`
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      style={{
        padding: m ? '48px 24px' : '72px 64px',
        textAlign: 'center',
        background: theme.soft,
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.accent,
          marginBottom: 12,
        }}>
          Gửi lời chúc
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: m ? 28 : 36,
          color: theme.text,
          marginBottom: m ? 32 : 48,
        }}>
          Hộp mừng cưới
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: m ? '1fr' : `repeat(${Math.min(accounts.length, 2)}, 1fr)`,
          gap: 32,
          justifyContent: 'center'
        }}>
          {accounts.map(acc => (
            <div key={acc.id} style={{
              background: theme.bg,
              padding: '24px',
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: theme.accent,
                marginBottom: 16
              }}>
                {acc.side === 'bride' ? 'Nhà Gái' : acc.side === 'groom' ? 'Nhà Trai' : 'Chung'}
              </p>
              
              <div style={{ background: '#FFF', padding: 8, borderRadius: 8, marginBottom: 16, width: 200, height: 200 }}>
                <img src={getQrUrl(acc)} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: theme.text, marginBottom: 4 }}>
                {acc.bankName}
              </p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: theme.muted, marginBottom: 4 }}>
                {acc.accountNumber}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: theme.muted }}>
                {acc.accountName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
