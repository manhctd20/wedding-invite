import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { InvitationData, THEMES } from '../types/invitation'
import { useIsMobile } from '../hooks/useIsMobile'
import { toLunarDate } from '../utils/lunar'
import CalendarWidget from '../components/sections/CalendarWidget'
import FamilySection from '../components/sections/FamilySection'
import CoupleProfileSection from '../components/sections/CoupleProfileSection'
import BankSection from '../components/sections/BankSection'
import CountdownSection from '../components/sections/CountdownSection'
import OurStorySection from '../components/sections/OurStorySection'
import WeddingPartySection from '../components/sections/WeddingPartySection'
import ScheduleSection from '../components/sections/ScheduleSection'
import EffectOverlay from '../components/effects/EffectOverlay'
import GuestbookSection from '../components/sections/GuestbookSection'
import RsvpSection from '../components/sections/RsvpSection'

interface Props { data: InvitationData; guestName?: string }

function fmt(d: string) {
  const dt = new Date(d)
  const monthsVi = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
  const daysVi = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']
  return {
    day: String(dt.getDate()).padStart(2,'0'),
    month: monthsVi[dt.getMonth()],
    year: String(dt.getFullYear()),
    dayName: daysVi[dt.getDay()],
    full: dt.toLocaleDateString('vi-VN'),
  }
}

// Stagger word-by-word reveal for a string
function KineticText({ text, delay = 0, fontSize, color, fontStyle = 'normal', weight = 300 }: {
  text: string; delay?: number; fontSize: number | string; color: string; fontStyle?: string; weight?: number
}) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline', overflow: 'hidden' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 32, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.08 }}
          style={{ display: 'inline-block', marginRight: '0.25em', fontFamily: "'Cormorant Garamond', serif", fontSize, fontWeight: weight, fontStyle, color, lineHeight: 1.1 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Decorative SVG star/asterisk
function GoldStar({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Animated divider line
function GoldLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ height: 1, background: 'linear-gradient(to right, transparent, #C9924A, transparent)', transformOrigin: 'left', margin: '24px 0' }}
    />
  )
}

export default function VelvetTemplate({ data, guestName }: Props) {
  const m = useIsMobile()
  const theme = THEMES.velvet
  const date = fmt(data.weddingDate)
  const lunar = toLunarDate(data.weddingDate)
  const cover = data.coverImage || `https://picsum.photos/seed/wedding-velvet-${data.id}/900/1100`
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const px = m ? '24px' : '72px'
  const py = m ? '64px' : '96px'
  const effectConfig = { type: data.effectType ?? 'lanterns', intensity: data.effectIntensity ?? 'medium', color: data.effectColor }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: theme.bg, color: theme.text }}>
      <EffectOverlay config={effectConfig} accentColor={theme.accent} />

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', height: '100dvh', minHeight: 620, overflow: 'hidden' }}>

        {/* Parallax cover */}
        <motion.div style={{ position: 'absolute', inset: 0, scale: imgScale, opacity: imgOpacity }}>
          <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        </motion.div>

        {/* Multi-layer overlay for depth */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,13,26,0.82) 0%, rgba(16,13,26,0.55) 50%, rgba(16,13,26,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(201,146,74,0.08) 0%, transparent 60%)' }} />

        {/* Decorative corner elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ position: 'absolute', top: m ? 24 : 40, left: m ? 24 : 48, opacity: 0.5 }}
        >
          <GoldStar size={m ? 20 : 28} color="#C9924A" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          style={{ position: 'absolute', top: m ? 24 : 40, right: m ? 24 : 48, opacity: 0.5 }}
        >
          <GoldStar size={m ? 20 : 28} color="#C9924A" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          style={{ position: 'absolute', bottom: m ? 24 : 40, left: m ? 24 : 48, opacity: 0.3 }}
        >
          <GoldStar size={m ? 14 : 18} color="#C9924A" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          style={{ position: 'absolute', bottom: m ? 24 : 40, right: m ? 24 : 48, opacity: 0.3 }}
        >
          <GoldStar size={m ? 14 : 18} color="#C9924A" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: `0 ${m ? '28px' : '64px'}`, y: textY }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }}
            transition={{ duration: 1.2, delay: 0.1 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: theme.accent, marginBottom: m ? 24 : 36 }}
          >
            {guestName ? `Kính mời ${guestName}` : 'Trân trọng kính mời'}
          </motion.p>

          {/* Bride name - kinetic */}
          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <KineticText
              text={`${data.brideFirstName} ${data.brideLastName}`}
              delay={0.25}
              fontSize={m ? 56 : 'clamp(52px, 8vw, 88px)'}
              color={theme.text}
              weight={300}
            />
          </div>

          {/* Ampersand with sparkle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: m ? 14 : 20, margin: m ? '10px 0' : '14px 0' }}
          >
            <motion.div
              animate={{ scaleX: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ height: 1, width: m ? 32 : 56, background: `linear-gradient(to right, transparent, ${theme.accent})` }}
            />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: m ? 28 : 40, color: theme.accent, lineHeight: 1 }}>
              &amp;
            </span>
            <motion.div
              animate={{ scaleX: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1.5 }}
              style={{ height: 1, width: m ? 32 : 56, background: `linear-gradient(to left, transparent, ${theme.accent})` }}
            />
          </motion.div>

          {/* Groom name - kinetic */}
          <div style={{ overflow: 'hidden', marginBottom: m ? 36 : 48 }}>
            <KineticText
              text={`${data.groomFirstName} ${data.groomLastName}`}
              delay={0.45}
              fontSize={m ? 56 : 'clamp(52px, 8vw, 88px)'}
              color={theme.text}
              weight={300}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 12 : 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,232,220,0.6)' }}>
              {date.dayName}, {date.day} {date.month} {date.year}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 12 : 13, color: 'rgba(240,232,220,0.5)' }}>
              {data.weddingTime} &bull; {data.venueName}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: m ? 12 : 13, color: theme.accent, opacity: 0.85 }}>
              {lunar.display}
            </p>
          </motion.div>
        </motion.div>

        {/* Animated scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: 1, height: 52, background: `linear-gradient(to bottom, ${theme.accent}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      {data.showCountdown && (
        <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
      )}

      {/* ── DATE + VENUE ── */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        style={{ padding: m ? '64px 24px' : '96px 72px', background: theme.soft, position: 'relative', overflow: 'hidden' }}
      >
        {/* Large decorative year */}
        <div style={{
          position: 'absolute', right: m ? -20 : 0, bottom: -24,
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: m ? 120 : 200, lineHeight: 1, color: 'rgba(201,146,74,0.06)',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {date.year}
        </div>

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <GoldLine delay={0.1} />

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 40 : 64, alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.muted, marginBottom: 16 }}>Ngày trọng đại</p>
              <motion.p
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: m ? 44 : 64, lineHeight: 1, color: theme.text }}
              >
                {date.day}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 16, color: theme.accent, letterSpacing: '0.1em', marginTop: 4 }}
              >
                {date.month}, {date.year}
              </motion.p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: theme.muted, marginTop: 12, letterSpacing: '0.08em' }}>
                {data.weddingTime}
              </p>
            </div>

            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.muted, marginBottom: 16 }}>Địa điểm</p>
              <motion.h3
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 26 : 32, color: theme.text, marginBottom: 12, lineHeight: 1.2 }}
              >
                {data.venueName}
              </motion.h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: theme.muted, lineHeight: 1.75 }}>{data.venueAddress}</p>
              {data.venueMapUrl && (
                <a href={data.venueMapUrl} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', marginTop:16, fontFamily:"'DM Sans', sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color: theme.accent, borderBottom:`1px solid ${theme.accent}`, textDecoration:'none', paddingBottom:2 }}>
                  Xem bản đồ
                </a>
              )}
            </div>
          </div>

          <GoldLine delay={0.3} />
        </div>
      </motion.section>

      {/* ── CALENDAR ── */}
      <motion.section
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
        style={{ padding:`${m ? '48px' : '72px'} ${px} 0` }}
      >
        <CalendarWidget weddingDate={data.weddingDate} theme={theme} />
      </motion.section>

      {/* ── MESSAGE ── */}
      {data.message && (
        <motion.section
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{ padding: `${py} ${px}`, textAlign: 'center', background: theme.bg }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ height: 1, width: 48, background: theme.accent, margin: '0 auto 32px' }}
            />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: m ? 20 : 26,
              lineHeight: 1.85,
              color: 'rgba(240,232,220,0.8)',
            }}>
              "{data.message}"
            </p>
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: 1, width: 48, background: theme.accent, margin: '32px auto 0' }}
            />
          </div>
        </motion.section>
      )}

      {/* ── COUPLE PROFILE ── */}
      {data.showCoupleProfile && (
        <CoupleProfileSection data={data} theme={theme} />
      )}

      {/* ── FAMILY ── */}
      {data.showFamily && (
        <FamilySection data={data} theme={theme} />
      )}

      {/* ── OUR STORY ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── SCHEDULE ── */}
      {data.showSchedule && data.scheduleEvents.length > 0 && (
        <ScheduleSection events={data.scheduleEvents} theme={theme} />
      )}

      {/* ── WEDDING PARTY ── */}
      {data.showParty && data.weddingParty.length > 0 && (
        <WeddingPartySection members={data.weddingParty} theme={theme} />
      )}

      {/* ── GALLERY ── */}
      {data.showGallery && data.galleryImages.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9 }}
          style={{ padding: `${py} ${px}`, background: theme.soft }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.muted, marginBottom: 8 }}>Khoảnh khắc</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 28 : 40, color: theme.text, lineHeight: 1.1 }}>
                Của <span style={{ fontStyle: 'italic', color: theme.accent }}>chúng tôi</span>
              </h2>
            </div>
            <GoldStar size={20} color={theme.accent} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: m ? 6 : 8 }}>
            {data.galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                style={{ aspectRatio: i % 5 === 0 ? '1/1.3' : '1', overflow: 'hidden', cursor: 'pointer' }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', filter: 'brightness(0.92)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'brightness(0.92)' }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── RSVP ── */}
      {data.showRsvp && <RsvpSection slug={data.id} rsvpName={data.rsvpName} rsvpPhone={data.rsvpPhone} rsvpDeadline={data.rsvpDeadline} theme={theme} />}

      {/* ── BANK ── */}
      {data.showBank && data.bankAccounts && (
        <BankSection accounts={data.bankAccounts} theme={theme} />
      )}

      {/* ── GUESTBOOK ── */}
      {data.showGuestbook && <GuestbookSection slug={data.id} theme={theme} />}

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: m ? '32px 24px' : '40px 72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.soft }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: theme.accent }}>
          {data.brideFirstName} &amp; {data.groomFirstName}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GoldStar size={14} color={theme.accent} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: theme.muted, letterSpacing: '0.2em' }}>{date.year}</p>
        </div>
      </footer>
    </div>
  )
}
