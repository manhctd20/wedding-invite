import { motion } from 'framer-motion'
import { InvitationData, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  data: InvitationData
  theme: TemplateTheme
}

export default function CoupleProfileSection({ data, theme }: Props) {
  const m = useIsMobile()

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: m ? '64px 24px' : '96px 64px',
        textAlign: 'center',
        background: theme.bg,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.accent,
          marginBottom: 16,
        }}>
          Cô dâu & Chú rể
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: m ? 32 : 48,
          fontWeight: 300,
          color: theme.text,
          marginBottom: m ? 48 : 64,
        }}>
          Hồ sơ cặp đôi
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: m ? '1fr' : '1fr 1fr',
          gap: m ? 48 : 80,
          alignItems: 'start'
        }}>
          {/* Cô dâu */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: m ? 160 : 200,
              height: m ? 160 : 200,
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: 24,
              border: `2px solid ${theme.border}`,
              padding: 6,
              background: theme.soft
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#E8DDD4' }}>
                {data.brideImage ? (
                  <img src={data.brideImage} alt="Cô dâu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 40, fontFamily: "'Cormorant Garamond', serif" }}>
                    {data.brideFirstName.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: theme.text, marginBottom: 4 }}>
              {data.brideLastName} {data.brideFirstName}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.accent, marginBottom: 16 }}>
              Cô dâu
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: theme.muted, maxWidth: 300, textAlign: 'center' }}>
              {data.brideBio || "Một cô gái yêu thích sự nhẹ nhàng và lãng mạn. Với tôi, tình yêu là một chuyến đi dài."}
            </p>
          </div>

          {/* Chú rể */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: m ? 160 : 200,
              height: m ? 160 : 200,
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: 24,
              border: `2px solid ${theme.border}`,
              padding: 6,
              background: theme.soft
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#E8DDD4' }}>
                {data.groomImage ? (
                  <img src={data.groomImage} alt="Chú rể" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 40, fontFamily: "'Cormorant Garamond', serif" }}>
                    {data.groomFirstName.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: theme.text, marginBottom: 4 }}>
              {data.groomLastName} {data.groomFirstName}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.accent, marginBottom: 16 }}>
              Chú rể
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: theme.muted, maxWidth: 300, textAlign: 'center' }}>
              {data.groomBio || "Người đàn ông trưởng thành, trầm tính, thích đi phượt và muốn là chỗ dựa vững chắc cho gia đình."}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
