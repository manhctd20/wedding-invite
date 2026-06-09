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

export default function GardenTemplate({ data, guestName }: { data: InvitationData, guestName?: string }) {
  const m = useIsMobile()
  const theme = THEMES.garden
  const nameFont = data.coupleNameFont === 'script' ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif"
  const date = toLunarDate(data.weddingDate)
  const px = m ? '24px' : '48px'
  const py = m ? '64px' : '96px'

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <EffectOverlay config={{ type: data.effectType, intensity: data.effectIntensity, color: data.effectColor }} accentColor={theme.accent} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: px, textAlign: 'center' }}>
        {data.coverImage && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
            <img src={data.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ width: '100%', maxWidth: 600, padding: m ? 32 : 64, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderRadius: 200, border: `1px solid ${theme.border}`, zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.accent, marginBottom: 24 }}>Lễ Thành Hôn</p>
            <h1 style={{ fontFamily: nameFont, fontSize: m ? 56 : 80, fontWeight: 400, color: theme.text, lineHeight: 1.1, margin: 0 }}>
              {data.brideFirstName}
            </h1>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 32, color: theme.accent, margin: '8px 0' }}>&</p>
            <h1 style={{ fontFamily: nameFont, fontSize: m ? 56 : 80, fontWeight: 400, color: theme.text, lineHeight: 1.1, margin: 0 }}>
              {data.groomFirstName}
            </h1>
            <div style={{ width: 1, height: 40, background: theme.accent, margin: '32px auto' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: theme.muted, letterSpacing: '0.1em' }}>
              {date.day} . {date.month} . {date.year}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      {data.showCountdown && (
        <div style={{ background: '#FFF' }}>
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

      {/* ── MESSAGE ── */}
      {data.message && (
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1 }}
          style={{ padding: `${py} ${px}`, textAlign: 'center', background: theme.soft }}
        >
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {guestName ? (
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: theme.text, marginBottom: 32 }}>
                Thân mời {guestName}
              </h2>
            ) : (
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: theme.accent, marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Lời Ngỏ
              </h2>
            )}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: theme.text, fontStyle: 'italic' }}>
              "{data.message}"
            </p>
          </div>
        </motion.section>
      )}

      {/* ── COUPLE PROFILE ── */}
      {data.showCoupleProfile && (
        <CoupleProfileSection data={data} theme={theme} />
      )}

      {/* ── FAMILY ── */}
      {data.showFamily && (
        <div style={{ background: theme.soft }}>
          <FamilySection data={data} theme={theme} />
        </div>
      )}

      {/* ── OUR STORY ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── VENUE ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
        style={{ padding: `${py} ${px}`, textAlign: 'center', background: theme.soft }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 24 }}>Địa Điểm</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 56, color: theme.text, marginBottom: 16 }}>{data.venueName}</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: theme.muted, maxWidth: 500, margin: '0 auto 32px' }}>{data.venueAddress}</p>
        {data.venueMapUrl && (
          <a href={data.venueMapUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '12px 32px', border: `1px solid ${theme.accent}`, color: theme.accent, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 30 }}>
            Chỉ Đường
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
          style={{ padding: `${py} ${px}` }}
        >
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.accent, marginBottom: 28, textAlign: 'center' }}>Khoảnh khắc</p>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(220px,1fr))', gap: 8, maxWidth: 900, margin: '0 auto' }}>
            {data.galleryImages.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 8 }}>
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
