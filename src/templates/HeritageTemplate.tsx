import { motion } from 'framer-motion'
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
import GuestbookSection from '../components/sections/GuestbookSection'
import RsvpSection from '../components/sections/RsvpSection'
import EffectOverlay from '../components/effects/EffectOverlay'

export default function HeritageTemplate({ data, guestName }: { data: InvitationData, guestName?: string }) {
  const m = useIsMobile()
  const theme = THEMES.heritage
  const nameFont = data.coupleNameFont === 'script' ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif"
  const date = toLunarDate(data.weddingDate)
  const px = m ? '24px' : '64px'
  const py = m ? '64px' : '96px'

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <EffectOverlay config={{ type: data.effectType, intensity: data.effectIntensity, color: data.effectColor }} accentColor={theme.accent} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: px }}>
        <div style={{ position: 'absolute', inset: 16, border: `2px double ${theme.accent}`, opacity: 0.6, pointerEvents: 'none' }} />

        {data.coverImage && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            <img src={data.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 24 }}>
              Lễ Thành Hôn
            </p>
            <h1 style={{ fontFamily: nameFont, fontSize: m ? 48 : 80, fontWeight: 500, color: theme.text, lineHeight: 1.1, margin: '0 0 16px 0' }}>
              {data.brideFirstName}
              <br />&<br />
              {data.groomFirstName}
            </h1>
            <div style={{ width: 40, height: 2, background: theme.accent, margin: '24px auto' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', color: theme.muted }}>
              {date.day} . {date.month} . {date.year}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      {data.showCountdown && (
        <div style={{ background: theme.soft }}>
          <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
        </div>
      )}

      {/* ── CALENDAR ── */}
      <motion.section
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
        style={{ padding:`${py} ${px} 0` }}
      >
        <CalendarWidget weddingDate={data.weddingDate} theme={theme} />
      </motion.section>

      {/* ── COUPLE PROFILE ── */}
      {data.showCoupleProfile && (
        <CoupleProfileSection data={data} theme={theme} />
      )}

      {/* ── MESSAGE ── */}
      {data.message && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{ padding: `${py} ${px}`, textAlign: 'center' }}
        >
          <div style={{ maxWidth: 600, margin: '0 auto', padding: m ? 32 : 48, background: '#FFF', border: `1px solid ${theme.border}`, boxShadow: `0 10px 30px rgba(74,28,28,0.05)` }}>
            {guestName ? (
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: theme.accent, marginBottom: 24 }}>
                Kính mời {guestName}
              </h2>
            ) : (
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: theme.accent, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Trân Trọng Kính Mời
              </h2>
            )}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.8, color: theme.text }}>
              {data.message}
            </p>
          </div>
        </motion.section>
      )}

      {/* ── FAMILY ── */}
      {data.showFamily && (
        <FamilySection data={data} theme={theme} />
      )}

      {/* ── OUR STORY ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── VENUE ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        style={{ padding: `${py} ${px}`, textAlign: 'center', background: theme.soft }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 24 }}>Địa Điểm Tổ Chức</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 32 : 48, color: theme.text, marginBottom: 16 }}>{data.venueName}</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: theme.muted, maxWidth: 500, margin: '0 auto 32px' }}>
          {data.venueAddress}
        </p>
        {data.venueMapUrl && (
          <a href={data.venueMapUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '12px 32px', background: theme.accent, color: '#FFF', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Xem Bản Đồ
          </a>
        )}
      </motion.section>

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
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}
          style={{ padding: `${py} ${px}`, borderTop: `1px solid ${theme.border}` }}
        >
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.accent, marginBottom: 28, textAlign: 'center' }}>Khoảnh khắc của chúng tôi</p>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(220px,1fr))', gap: 6, maxWidth: 900, margin: '0 auto' }}>
            {data.galleryImages.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── BANK ── */}
      {data.showBank && data.bankAccounts && (
        <BankSection accounts={data.bankAccounts} theme={theme} />
      )}

      {/* ── GUESTBOOK ── */}
      {data.showGuestbook && <GuestbookSection slug={data.id} theme={theme} />}

      {/* ── RSVP ── */}
      {data.showRsvp && <RsvpSection slug={data.id} rsvpName={data.rsvpName} rsvpPhone={data.rsvpPhone} rsvpDeadline={data.rsvpDeadline} theme={theme} />}

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: `28px ${px}`, textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: theme.accent }}>
          {data.brideFirstName} & {data.groomFirstName}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: theme.muted, marginTop: 6, letterSpacing: '0.1em' }}>{date.year}</p>
      </footer>
    </div>
  )
}
