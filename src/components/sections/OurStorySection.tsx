import { motion } from 'framer-motion'
import { StoryMilestone, TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  milestones: StoryMilestone[]
  theme: TemplateTheme
}

const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/story-a/600/400',
  'https://picsum.photos/seed/story-b/600/400',
  'https://picsum.photos/seed/story-c/600/400',
  'https://picsum.photos/seed/story-d/600/400',
  'https://picsum.photos/seed/story-e/600/400',
]

function MilestoneCard({
  milestone,
  index,
  theme,
  isMobile,
}: {
  milestone: StoryMilestone
  index: number
  theme: TemplateTheme
  isMobile: boolean
}) {
  const isRight = !isMobile && index % 2 === 1
  const img = milestone.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 * (index % 3) }}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 16 : 48,
        alignItems: 'center',
        direction: isRight ? 'rtl' : 'ltr',
      }}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '4/3',
        overflow: 'hidden',
        direction: 'ltr',
      }}>
        <motion.img
          src={img}
          alt={milestone.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Text */}
      <div style={{ direction: 'ltr', padding: isMobile ? '0' : isRight ? '0 0 0 16px' : '0 16px 0 0' }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.2em',
          color: theme.accent,
          marginBottom: 12,
        }}>
          {milestone.year}
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: isMobile ? 26 : 32,
          lineHeight: 1.15,
          color: theme.text,
          marginBottom: 12,
        }}>
          {milestone.title}
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          lineHeight: 1.75,
          color: theme.muted,
        }}>
          {milestone.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function OurStorySection({ milestones, theme }: Props) {
  const m = useIsMobile()
  if (!milestones.length) return null

  return (
    <section style={{
      padding: m ? '64px 20px' : '96px 80px',
      background: theme.bg,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: m ? 48 : 72, textAlign: m ? 'center' : 'left' }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.accent,
          marginBottom: 12,
        }}>
          Câu chuyện tình yêu
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: m ? 36 : 52,
          lineHeight: 1.1,
          color: theme.text,
        }}>
          Hành trình của<br />
          <span style={{ fontStyle: 'italic', color: theme.accent }}>chúng tôi</span>
        </h2>
      </motion.div>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        {/* Center line — desktop only */}
        {!m && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${theme.border} 10%, ${theme.border} 90%, transparent)`,
            transform: 'translateX(-50%)',
            zIndex: 0,
          }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: m ? 40 : 72, position: 'relative', zIndex: 1 }}>
          {milestones.map((ms, i) => (
            <MilestoneCard key={ms.id} milestone={ms} index={i} theme={theme} isMobile={m} />
          ))}
        </div>
      </div>
    </section>
  )
}
