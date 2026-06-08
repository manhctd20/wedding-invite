import { motion } from 'framer-motion'
import { WeddingPartyMember, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  members: WeddingPartyMember[]
  theme: TemplateTheme
}

const FALLBACK_AVATARS = [
  'https://picsum.photos/seed/party-1/300/300',
  'https://picsum.photos/seed/party-2/300/300',
  'https://picsum.photos/seed/party-3/300/300',
  'https://picsum.photos/seed/party-4/300/300',
  'https://picsum.photos/seed/party-5/300/300',
  'https://picsum.photos/seed/party-6/300/300',
]

function MemberCard({ member, index, theme }: { member: WeddingPartyMember; index: number; theme: TemplateTheme }) {
  const img = member.image || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 * (index % 4) }}
      style={{ textAlign: 'center' }}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden', marginBottom: 16, aspectRatio: '1', background: theme.soft }}
      >
        <img
          src={img}
          alt={member.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        />
      </motion.div>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: 20,
        color: theme.text,
        marginBottom: 4,
      }}>
        {member.name}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: theme.accent,
        marginBottom: member.note ? 6 : 0,
      }}>
        {member.role}
      </p>
      {member.note && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: theme.muted,
          lineHeight: 1.5,
          fontStyle: 'italic',
        }}>
          {member.note}
        </p>
      )}
    </motion.div>
  )
}

export default function WeddingPartySection({ members, theme }: Props) {
  const m = useIsMobile()
  if (!members.length) return null

  const brides = members.filter(x => x.side === 'bride')
  const grooms = members.filter(x => x.side === 'groom')

  return (
    <section style={{
      padding: m ? '64px 20px' : '96px 80px',
      background: theme.soft,
      borderTop: `1px solid ${theme.border}`,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: m ? 48 : 64 }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: 12,
        }}>
          Những người thân yêu
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: m ? 34 : 48,
          color: theme.text,
          lineHeight: 1.1,
        }}>
          Đội hình <span style={{ fontStyle: 'italic', color: theme.accent }}>hạnh phúc</span>
        </h2>
      </motion.div>

      {/* Bride side */}
      {brides.length > 0 && (
        <div style={{ marginBottom: m ? 48 : 64 }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: theme.muted,
              textAlign: 'center',
              marginBottom: 28,
              paddingBottom: 16,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            Phù dâu
          </motion.p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: m ? 'repeat(2, 1fr)' : `repeat(${Math.min(brides.length, 4)}, 1fr)`,
            gap: m ? 24 : 32,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {brides.map((mb, i) => <MemberCard key={mb.id} member={mb} index={i} theme={theme} />)}
          </div>
        </div>
      )}

      {/* Groom side */}
      {grooms.length > 0 && (
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: theme.muted,
              textAlign: 'center',
              marginBottom: 28,
              paddingBottom: 16,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            Phù rể
          </motion.p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: m ? 'repeat(2, 1fr)' : `repeat(${Math.min(grooms.length, 4)}, 1fr)`,
            gap: m ? 24 : 32,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {grooms.map((mb, i) => <MemberCard key={mb.id} member={mb} index={i + brides.length} theme={theme} />)}
          </div>
        </div>
      )}
    </section>
  )
}
