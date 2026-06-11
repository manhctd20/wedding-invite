import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { InvitationData, THEMES } from '../types/invitation'
import { useIsMobile } from '../hooks/useIsMobile'
import { toLunarDate } from '../utils/lunar'
import CountdownSection from '../components/sections/CountdownSection'
import OurStorySection from '../components/sections/OurStorySection'
import ScheduleSection from '../components/sections/ScheduleSection'
import WeddingPartySection from '../components/sections/WeddingPartySection'
import EffectOverlay from '../components/effects/EffectOverlay'
import GiftBoxSheet from '../components/sheets/GiftBoxSheet'
import WishWallSheet from '../components/sheets/WishWallSheet'
import RsvpSheet from '../components/sheets/RsvpSheet'

interface Props { data: InvitationData; guestName?: string }

function formatDate(d: string) {
  const dt = new Date(d)
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']
  return {
    day: String(dt.getDate()).padStart(2, '0'),
    month: String(dt.getMonth() + 1).padStart(2, '0'),
    year: String(dt.getFullYear()),
    weekday: days[dt.getDay()],
  }
}

export default function CineloveTemplate({ data, guestName }: Props) {
  const m = useIsMobile()
  const theme = THEMES.cinelove
  const date = formatDate(data.weddingDate)
  const lunar = toLunarDate(data.weddingDate)
  const cover = data.coverImage || `https://picsum.photos/seed/cinelove-${data.id}/900/1400`
  const effectConfig = {
    type: data.effectType ?? 'sakura',
    intensity: data.effectIntensity ?? 'medium',
    color: data.effectColor,
  }

  const [giftOpen, setGiftOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3])

  const px = m ? '20px' : '40px'
  const py = m ? '60px' : '88px'
  const isDark = theme.isDark
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'

  const glassCard: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    backdropFilter: 'blur(14px) saturate(160%)',
    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
    borderRadius: 22,
    padding: '24px 22px',
  }

  const actionBtn: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: `1.5px solid ${theme.accent}`,
    borderRadius: 14,
    color: theme.accent,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500, letterSpacing: '0.08em',
    cursor: 'pointer',
    textTransform: 'uppercase',
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: theme.bg,
      color: theme.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blur layer — full-page cover photo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(${cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(40px) brightness(0.55)',
        transform: 'scale(1.2)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: isDark
          ? 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.65))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.78))',
      }} />

      <EffectOverlay config={effectConfig} accentColor={theme.accent} />

      {/* Content stack — z-index above background */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <section ref={heroRef} style={{ position: 'relative', height: '100dvh', minHeight: 600, overflow: 'hidden' }}>
          <motion.div style={{ position: 'absolute', inset: 0, scale: imgScale }}>
            <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)',
          }} />

          <motion.div style={{
            position: 'absolute', inset: 0, opacity: heroOpacity,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: `0 ${px}`, textAlign: 'center', color: '#FFF',
          }}>
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}
            >
              {guestName ? `Kính mời ${guestName}` : 'Trân trọng kính mời'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
              style={{
                fontFamily: "'Great Vibes', cursive", fontWeight: 400,
                fontSize: m ? 86 : 'clamp(80px, 14vw, 140px)',
                lineHeight: 1, margin: 0, color: '#FFF',
                textShadow: '0 2px 30px rgba(0,0,0,0.4)',
              }}
            >
              {data.brideFirstName}
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55, duration: 0.5 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 28, color: theme.accent, margin: '4px 0' }}
            >
              &amp;
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9 }}
              style={{
                fontFamily: "'Great Vibes', cursive", fontWeight: 400,
                fontSize: m ? 86 : 'clamp(80px, 14vw, 140px)',
                lineHeight: 1, margin: 0, color: '#FFF',
                textShadow: '0 2px 30px rgba(0,0,0,0.4)',
              }}
            >
              {data.groomFirstName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
              style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <p style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {date.weekday.toUpperCase()}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, margin: 0, color: '#FFF' }}>
                {date.day} . {date.month} . {date.year}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                {lunar.display}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
              width: 1, height: 36,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)',
            }}
          />
        </section>

        {/* ── Save the date card ── */}
        <section style={{ padding: `${py} ${px}` }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
            style={{ ...glassCard, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}
          >
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, margin: 0, marginBottom: 18 }}>
              Save the date
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 17, lineHeight: 1.6, color: theme.muted, margin: 0 }}>
              {data.message || 'Hân hoan kính mời quý vị đến chung vui trong ngày trọng đại của chúng tôi.'}
            </p>
          </motion.div>
        </section>

        {/* ── Countdown ── */}
        {data.showCountdown && (
          <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
        )}

        {/* ── Family card ── */}
        {data.showFamily && (data.brideFather || data.groomFather) && (
          <section style={{ padding: `0 ${px} ${py}` }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
              style={{ ...glassCard, maxWidth: 560, margin: '0 auto' }}
            >
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, textAlign: 'center', margin: 0, marginBottom: 24 }}>
                Gia đình hai bên
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 24 : 32 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, color: theme.accent, margin: 0, marginBottom: 12 }}>
                    Nhà gái
                  </p>
                  {data.brideFather && <p style={{ fontSize: 14, color: theme.text, margin: '2px 0' }}>Ông: {data.brideFather}</p>}
                  {data.brideMother && <p style={{ fontSize: 14, color: theme.text, margin: '2px 0' }}>Bà: {data.brideMother}</p>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, color: theme.accent, margin: 0, marginBottom: 12 }}>
                    Nhà trai
                  </p>
                  {data.groomFather && <p style={{ fontSize: 14, color: theme.text, margin: '2px 0' }}>Ông: {data.groomFather}</p>}
                  {data.groomMother && <p style={{ fontSize: 14, color: theme.text, margin: '2px 0' }}>Bà: {data.groomMother}</p>}
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* ── Our Story ── */}
        {data.showStory && data.storyMilestones.length > 0 && (
          <OurStorySection milestones={data.storyMilestones} theme={theme} />
        )}

        {/* ── Venue card ── */}
        <section style={{ padding: `0 ${px} ${py}` }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
            style={{ ...glassCard, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}
          >
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, margin: 0, marginBottom: 16 }}>
              Địa điểm tổ chức
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: theme.text, margin: 0, marginBottom: 8 }}>
              {data.venueName}
            </p>
            <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, margin: 0 }}>
              {data.venueAddress}
            </p>
            {data.venueMapUrl && (
              <a href={data.venueMapUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block', marginTop: 18,
                  padding: '10px 22px',
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 999,
                  color: theme.accent, textDecoration: 'none',
                  fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                Xem bản đồ
              </a>
            )}
          </motion.div>
        </section>

        {/* ── Schedule ── */}
        {data.showSchedule && data.scheduleEvents.length > 0 && (
          <ScheduleSection events={data.scheduleEvents} theme={theme} />
        )}

        {/* ── Wedding Party ── */}
        {data.showParty && data.weddingParty.length > 0 && (
          <WeddingPartySection members={data.weddingParty} theme={theme} />
        )}

        {/* ── Action buttons: RSVP / Gift / Wish (in card) ── */}
        <section style={{ padding: `${py} ${px}` }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
            style={{ ...glassCard, maxWidth: 480, margin: '0 auto' }}
          >
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, textAlign: 'center', margin: 0, marginBottom: 6 }}>
              Đóng góp niềm vui
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, color: theme.text, textAlign: 'center', margin: 0, marginBottom: 22 }}>
              cùng cô dâu chú rể
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.showRsvp && (
                <button onClick={() => setRsvpOpen(true)} style={actionBtn}>
                  ✓ &nbsp; Xác nhận tham dự
                </button>
              )}
              {data.showBank && data.bankAccounts && data.bankAccounts.length > 0 && (
                <button onClick={() => setGiftOpen(true)} style={actionBtn}>
                  🎁 &nbsp; Hộp quà mừng cưới
                </button>
              )}
              {data.showGuestbook && (
                <button onClick={() => setWishOpen(true)} style={actionBtn}>
                  💌 &nbsp; Sổ lưu bút
                </button>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          padding: `28px ${px}`, textAlign: 'center',
          borderTop: `1px solid ${cardBorder}`,
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 32, color: theme.accent, margin: 0 }}>
            {data.brideFirstName} &amp; {data.groomFirstName}
          </p>
          <p style={{ fontSize: 11, color: theme.muted, letterSpacing: '0.15em', margin: '4px 0 0' }}>
            {date.year}
          </p>
        </footer>
      </div>

      {/* Sheets */}
      <GiftBoxSheet open={giftOpen} onClose={() => setGiftOpen(false)} accounts={data.bankAccounts || []} theme={theme} />
      <WishWallSheet open={wishOpen} onClose={() => setWishOpen(false)} slug={data.id} theme={theme} />
      <RsvpSheet
        open={rsvpOpen} onClose={() => setRsvpOpen(false)} slug={data.id} theme={theme}
        rsvpName={data.rsvpName} rsvpPhone={data.rsvpPhone} rsvpDeadline={data.rsvpDeadline}
      />
    </div>
  )
}
