import { motion } from 'framer-motion'
import { InvitationData, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  data: InvitationData
  theme: TemplateTheme
}

export default function FamilySection({ data, theme }: Props) {
  const m = useIsMobile()

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: m ? '48px 24px' : '72px 64px',
        textAlign: 'center',
        background: theme.bg,
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.accent,
          marginBottom: 32,
        }}>
          Gia đình hai bên
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: m ? '1fr' : '1fr 1fr',
          gap: m ? 40 : 64,
        }}>
          {/* Nhà Gái */}
          <div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: theme.text,
              borderBottom: `1px solid ${theme.accent}`,
              paddingBottom: 12,
              marginBottom: 20,
              display: 'inline-block',
            }}>
              Nhà Gái
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: theme.muted,
            }}>
              <p>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8, color: theme.text }}>Ông</span>
                {data.brideFather || '...'}
              </p>
              <p>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8, color: theme.text }}>Bà</span>
                {data.brideMother || '...'}
              </p>
            </div>
          </div>

          {/* Nhà Trai */}
          <div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: theme.text,
              borderBottom: `1px solid ${theme.accent}`,
              paddingBottom: 12,
              marginBottom: 20,
              display: 'inline-block',
            }}>
              Nhà Trai
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: theme.muted,
            }}>
              <p>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8, color: theme.text }}>Ông</span>
                {data.groomFather || '...'}
              </p>
              <p>
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8, color: theme.text }}>Bà</span>
                {data.groomMother || '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
