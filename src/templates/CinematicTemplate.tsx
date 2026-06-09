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

export default function CinematicTemplate({ data, guestName }: { data: InvitationData, guestName?: string }) {
  const m = useIsMobile()
  const theme = THEMES.cinematic
  const nameFont = data.coupleNameFont === 'script' ? "'Great Vibes', cursive" : "'DM Sans', sans-serif"
  const date = toLunarDate(data.weddingDate)
  const px = m ? '24px' : '48px'
  const py = m ? '80px' : '120px'

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <EffectOverlay config={{ type: data.effectType, intensity: data.effectIntensity, color: data.effectColor }} accentColor={theme.accent} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: px }}>
        {data.coverImage && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={data.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, filter: 'grayscale(50%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,17,17,1), rgba(17,17,17,0))' }} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', zIndex: 1, paddingBottom: 64 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase', color: theme.accent, marginBottom: 16 }}>THE WEDDING OF</p>
            <h1 style={{ fontFamily: nameFont, fontSize: m ? 48 : 96, fontWeight: 700, color: '#FFF', lineHeight: 1, margin: 0, textTransform: data.coupleNameFont === 'script' ? 'none' : 'uppercase' }}>
              {data.brideFirstName}
            </h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: theme.accent, margin: '8px 0' }}>AND</p>
            <h1 style={{ fontFamily: nameFont, fontSize: m ? 48 : 96, fontWeight: 700, color: '#FFF', lineHeight: 1, margin: 0, textTransform: data.coupleNameFont === 'script' ? 'none' : 'uppercase' }}>
              {data.groomFirstName}
            </h1>
            <div style={{ width: 60, height: 2, background: theme.accent, margin: '40px 0 24px 0' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: theme.muted, letterSpacing: '0.2em' }}>
              {date.day} . {date.month} . {date.year}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MESSAGE ── */}
      {data.message && (
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1 }}
          style={{ padding: `${py} ${px}`, textAlign: 'center', background: theme.bg }}
        >
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {guestName && (
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#FFF', marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                FOR {guestName}
              </h2>
            )}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 18 : 24, lineHeight: 1.6, color: theme.text, fontWeight: 300 }}>
              {data.message}
            </p>
          </div>
        </motion.section>
      )}

      {/* ── COUNTDOWN ── */}
      {data.showCountdown && (
        <div style={{ borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
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

      {/* ── FAMILY ── */}
      {data.showFamily && (
        <FamilySection data={data} theme={theme} />
      )}

      {/* ── VENUE ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
        style={{ padding: `${py} ${px}`, background: theme.soft }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: '0.2em', color: theme.accent, marginBottom: 16 }}>LOCATION</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: m ? 32 : 48, color: '#FFF', marginBottom: 16, textTransform: 'uppercase' }}>{data.venueName}</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: theme.muted, maxWidth: 400, marginBottom: 32 }}>{data.venueAddress}</p>
            {data.venueMapUrl && (
              <a href={data.venueMapUrl} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', padding: '12px 32px', border: `1px solid ${theme.accent}`, color: theme.accent, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                OPEN MAP
              </a>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── SCHEDULE ── */}
      {data.showSchedule && data.scheduleEvents.length > 0 && (
        <ScheduleSection events={data.scheduleEvents} theme={theme} />
      )}

      {/* ── OUR STORY ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── WEDDING PARTY ── */}
      {data.showParty && data.weddingParty.length > 0 && (
        <WeddingPartySection members={data.weddingParty} theme={theme} />
      )}

      {/* ── GALLERY ── */}
      {data.showGallery && data.galleryImages.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}
          style={{ padding: `${py} ${px}` }}
        >
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent, marginBottom: 28, textAlign: 'center' }}>GALLERY</p>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(240px,1fr))', gap: 4, maxWidth: 1000, margin: '0 auto' }}>
            {data.galleryImages.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }} style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
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
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          {data.brideFirstName} & {data.groomFirstName}
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: theme.muted, marginTop: 6 }}>{date.year}</p>
      </footer>
    </div>
  )
}
