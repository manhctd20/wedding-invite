import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
  const monthsVi = ['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai']
  return { day: String(dt.getDate()).padStart(2,'0'), monthVi: monthsVi[dt.getMonth()], year: String(dt.getFullYear()), iso: `${dt.getFullYear()}.${months[dt.getMonth()]}.${String(dt.getDate()).padStart(2,'0')}`, full: dt.toLocaleDateString('vi-VN') }
}

export default function MinimalTemplate({ data, guestName }: Props) {
  const m = useIsMobile()
  const theme = THEMES.minimal
  const date = fmt(data.weddingDate)
  const lunar = toLunarDate(data.weddingDate)
  const cover = data.coverImage || `https://picsum.photos/seed/wedding-min-${data.id}/900/700`
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0,1], ['0%','20%'])
  const px = m ? '20px' : '64px'
  const py = m ? '56px' : '88px'
  const effectConfig = { type: data.effectType ?? 'sakura', intensity: data.effectIntensity ?? 'medium', color: data.effectColor }

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background: theme.bg, color: theme.text }}>
      <EffectOverlay config={effectConfig} accentColor={theme.accent} />

      {/* ── Top bar ── */}
      <header style={{ padding: m ? '18px 20px':'28px 64px', borderBottom:`1px solid ${theme.border}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color: theme.muted, letterSpacing:'0.15em' }}>WEDDING INVITATION</span>
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color: theme.muted, letterSpacing:'0.1em' }}>{date.iso}</span>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ display:'grid', gridTemplateColumns: m ? '1fr':'1fr 1fr', minHeight: m ? 'auto':'88vh' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', padding: m ? '44px 20px 36px':'80px 64px' }}>
          <div>
            <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.2 }}
              style={{ fontSize:10, letterSpacing:'0.28em', textTransform:'uppercase', color: theme.muted, marginBottom: m ? 28:44 }}>
              {guestName ? `Kính mời ${guestName}` : 'Trân trọng kính mời'}
            </motion.p>
            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.35 }}>
              <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 58:'clamp(48px,6vw,84px)', lineHeight:1.0, marginBottom:4 }}>{data.brideFirstName}</h1>
              <h2 style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300, fontSize: m ? 12:'clamp(12px,1.5vw,16px)', letterSpacing:'0.22em', textTransform:'uppercase', color: theme.muted, marginBottom: m ? 24:40 }}>{data.brideLastName}</h2>
            </motion.div>
            <motion.div initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }} transition={{ duration:0.5, delay:0.55 }}
              style={{ display:'flex', alignItems:'center', gap:12, marginBottom: m ? 24:40 }}>
              <div style={{ height:1, width:20, background: theme.border }} />
              <span style={{ fontSize:10, color: theme.muted, letterSpacing:'0.2em', textTransform:'uppercase' }}>và</span>
              <div style={{ height:1, width:20, background: theme.border }} />
            </motion.div>
            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.45 }}>
              <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 58:'clamp(48px,6vw,84px)', lineHeight:1.0, marginBottom:4 }}>{data.groomFirstName}</h1>
              <h2 style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300, fontSize: m ? 12:'clamp(12px,1.5vw,16px)', letterSpacing:'0.22em', textTransform:'uppercase', color: theme.muted }}>{data.groomLastName}</h2>
            </motion.div>
          </div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.7 }}
            style={{ paddingTop: m ? 32:48, borderTop:`1px solid ${theme.border}`, display:'grid', gridTemplateColumns:'1fr 1fr', gap: m ? 20:28, marginTop: m ? 36:0 }}>
            <div>
              <p style={{ fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color: theme.muted, marginBottom:6 }}>Ngày</p>
              <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: m ? 18:22, color: theme.text }}>{date.day} {date.monthVi}</p>
              <p style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color: theme.muted }}>{date.year}</p>
              <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:11, color: theme.accent, marginTop:6, opacity:0.85 }}>{lunar.display}</p>
            </div>
            <div>
              <p style={{ fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color: theme.muted, marginBottom:6 }}>Giờ</p>
              <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: m ? 18:22, color: theme.text }}>{data.weddingTime}</p>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color: theme.muted }}>Đúng giờ</p>
            </div>
          </motion.div>
        </div>

        {/* Image — parallax on desktop, above text on mobile */}
        {m ? (
          <div style={{ height:'45vh', overflow:'hidden', order:-1 }}>
            <img src={cover} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        ) : (
          <div style={{ position:'relative', overflow:'hidden' }}>
            <motion.div style={{ position:'absolute', inset:'-12%', y: imgY }}>
              <img src={cover} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </motion.div>
          </div>
        )}
      </section>

      {/* ── Countdown ── */}
      {data.showCountdown && (
        <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
      )}

      {/* ── Calendar ── */}
      <motion.section
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
        style={{ padding:`${m ? '48px' : '72px'} ${px}` }}
      >
        <CalendarWidget weddingDate={data.weddingDate} theme={theme} />
      </motion.section>

      {/* ── Message ── */}
      {data.message && (
        <motion.section
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
          style={{ padding:`${py} ${px}`, borderTop:`1px solid ${theme.border}`, borderBottom:`1px solid ${theme.border}` }}
        >
          <p style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.muted, marginBottom:20 }}>Lời nhắn</p>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontWeight:300, fontSize: m ? 18:22, lineHeight:1.85, color:'#3A3A3A', maxWidth:640 }}>"{data.message}"</p>
        </motion.section>
      )}

      {/* ── Couple Profile ── */}
      {data.showCoupleProfile && (
        <CoupleProfileSection data={data} theme={theme} />
      )}

      {/* ── Family ── */}
      {data.showFamily && (
        <FamilySection data={data} theme={theme} />
      )}

      {/* ── Our Story ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── Venue + RSVP ── */}
      <motion.section
        initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7 }}
        style={{ padding:`${py} ${px}`, display:'grid', gridTemplateColumns: m ? '1fr':'1fr 1fr', gap: m ? 32:64 }}
      >
        <div>
          <p style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.muted, marginBottom:20 }}>Địa điểm</p>
          <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 24:28, marginBottom:10 }}>{data.venueName}</h3>
          <p style={{ fontSize:14, color: theme.muted, lineHeight:1.7 }}>{data.venueAddress}</p>
          {data.venueMapUrl && (
            <a href={data.venueMapUrl} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', marginTop:12, fontFamily:"'DM Sans', sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color: theme.text, borderBottom:`1px solid ${theme.text}`, textDecoration:'none', paddingBottom:2 }}>
              Xem bản đồ
            </a>
          )}
        </div>
      </motion.section>

      {/* ── Schedule ── */}
      {data.showSchedule && data.scheduleEvents.length > 0 && (
        <ScheduleSection events={data.scheduleEvents} theme={theme} />
      )}

      {/* ── Wedding Party ── */}
      {data.showParty && data.weddingParty.length > 0 && (
        <WeddingPartySection members={data.weddingParty} theme={theme} />
      )}

      {/* ── Gallery ── */}
      {data.showGallery && data.galleryImages.length > 0 && (
        <motion.section
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true, amount:0.2 }} transition={{ duration:0.8 }}
          style={{ padding:`${py} ${px}`, borderTop:`1px solid ${theme.border}` }}
        >
          <p style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.muted, marginBottom:20 }}>Hình ảnh</p>
          <div style={{ display:'grid', gridTemplateColumns: m ? 'repeat(2,1fr)':'repeat(auto-fill,minmax(200px,1fr))', gap:4 }}>
            {data.galleryImages.map((src,i) => (
              <motion.div key={i} initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.45, delay: i*0.06 }} style={{ aspectRatio:'1', overflow:'hidden', background: theme.soft }}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='none'} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Bank ── */}
      {data.showBank && data.bankAccounts && (
        <BankSection accounts={data.bankAccounts} theme={theme} />
      )}

      {/* ── RSVP ── */}
      {data.showRsvp && <RsvpSection slug={data.id} rsvpName={data.rsvpName} rsvpPhone={data.rsvpPhone} rsvpDeadline={data.rsvpDeadline} theme={theme} />}

      {/* ── Guestbook ── */}
      {data.showGuestbook && <GuestbookSection slug={data.id} theme={theme} />}

      {/* ── Footer ── */}
      <footer style={{ borderTop:`1px solid ${theme.border}`, padding: m ? '24px 20px':'32px 64px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:18, color: theme.text }}>
          {data.brideFirstName} &amp; {data.groomFirstName}
        </p>
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:'#CCC', letterSpacing:'0.2em' }}>{date.year}</p>
      </footer>
    </div>
  )
}
