import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { InvitationData, THEMES } from '../types/invitation'
import { useIsMobile } from '../hooks/useIsMobile'
import CountdownSection from '../components/sections/CountdownSection'
import OurStorySection from '../components/sections/OurStorySection'
import WeddingPartySection from '../components/sections/WeddingPartySection'
import ScheduleSection from '../components/sections/ScheduleSection'
import EffectOverlay from '../components/effects/EffectOverlay'
import GuestbookSection from '../components/sections/GuestbookSection'

interface Props { data: InvitationData }

function fmt(d: string) {
  const dt = new Date(d)
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const daysVi = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']
  return { day: String(dt.getDate()).padStart(2,'0'), month: months[dt.getMonth()], year: String(dt.getFullYear()), dayName: daysVi[dt.getDay()], full: dt.toLocaleDateString('vi-VN') }
}

export default function NoirTemplate({ data }: Props) {
  const m = useIsMobile()
  const theme = THEMES.noir
  const date = fmt(data.weddingDate)
  const effectConfig = { type: data.effectType ?? 'sparkles', intensity: data.effectIntensity ?? 'medium', color: data.effectColor }
  const cover = data.coverImage || `https://picsum.photos/seed/wedding-noir-${data.id}/900/1100`
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0,1], ['0%','22%'])
  const px = m ? '24px' : '64px'
  const py = m ? '56px' : '88px'

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background: theme.bg, color: theme.text }}>
      <EffectOverlay config={effectConfig} accentColor={theme.accent} />

      {/* ── Hero ── */}
      {m ? (
        <section ref={heroRef} style={{ position:'relative', minHeight:'100dvh', display:'flex', flexDirection:'column' }}>
          <div style={{ position:'relative', height:'48vh', minHeight:280, overflow:'hidden', flexShrink:0 }}>
            <motion.div style={{ position:'absolute', inset:'-12%', y: imgY }}>
              <img src={cover} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.72) contrast(1.1)' }} />
            </motion.div>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }} />
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'36px 24px 56px' }}>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.3 }}
              style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color: theme.muted, marginBottom:36 }}>
              {date.dayName} / {date.day}.{date.month}.{date.year}
            </motion.p>
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.4 }}
              style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:54, lineHeight:1.1, color: theme.text, marginBottom:10 }}>
              {data.brideFirstName} <span style={{ color: theme.accent }}>{data.brideLastName}</span>
            </motion.h1>
            <div style={{ display:'flex', alignItems:'center', gap:14, margin:'16px 0' }}>
              <div style={{ height:1, width:28, background: theme.accent }} />
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', color: theme.accent, fontSize:16 }}>và</span>
              <div style={{ height:1, width:28, background: theme.accent }} />
            </div>
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.5 }}
              style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:54, lineHeight:1.1, color: theme.text, marginBottom:36 }}>
              {data.groomFirstName} <span style={{ color: theme.accent }}>{data.groomLastName}</span>
            </motion.h1>
            <div style={{ borderLeft:`2px solid ${theme.accent}`, paddingLeft:18 }}>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color: theme.muted, marginBottom:4 }}>{data.weddingTime}</p>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color: theme.text }}>{data.venueName}</p>
            </div>
          </div>
        </section>
      ) : (
        <section ref={heroRef} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100dvh' }}>
          <div style={{ position:'relative', overflow:'hidden' }}>
            <motion.div style={{ position:'absolute', inset:'-12%', y: imgY }}>
              <img src={cover} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.72) contrast(1.1)' }} />
            </motion.div>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 60%, #0A0A0A 100%)' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 52px 80px 40px' }}>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.3 }}
              style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color: theme.muted, marginBottom:52 }}>
              {date.dayName} / {date.day}.{date.month}.{date.year}
            </motion.p>
            <motion.h1 initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.4 }}
              style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:'clamp(40px,5vw,68px)', lineHeight:1.1, marginBottom:14 }}>
              {data.brideFirstName}<br /><span style={{ color: theme.accent }}>{data.brideLastName}</span>
            </motion.h1>
            <div style={{ display:'flex', alignItems:'center', gap:16, margin:'22px 0' }}>
              <div style={{ height:1, width:32, background: theme.accent }} />
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', color: theme.accent, fontSize:18 }}>và</span>
              <div style={{ height:1, width:32, background: theme.accent }} />
            </div>
            <motion.h1 initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.52 }}
              style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:'clamp(40px,5vw,68px)', lineHeight:1.1, marginBottom:52 }}>
              {data.groomFirstName}<br /><span style={{ color: theme.accent }}>{data.groomLastName}</span>
            </motion.h1>
            <div style={{ borderLeft:`1px solid ${theme.accent}`, paddingLeft:22 }}>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color: theme.muted, marginBottom:4 }}>{data.weddingTime}</p>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color: theme.text }}>{data.venueName}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Countdown ── */}
      {data.showCountdown && (
        <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
      )}

      {/* ── Date strip ── */}
      <motion.section
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.8 }}
        style={{ borderTop:`1px solid ${theme.border}`, borderBottom:`1px solid ${theme.border}`, padding: m ? '36px 24px':'52px 64px', display:'flex', flexDirection: m ? 'column':'row', justifyContent:'space-between', alignItems: m ? 'flex-start':'center', gap: m ? 20:0 }}
      >
        <div>
          <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.muted, marginBottom:6 }}>Ngày cưới</p>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: m ? 38:50, fontWeight:300, color: theme.text, lineHeight:1 }}>{date.day} {date.month}</p>
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize: m ? 50:60, fontWeight:300, color: theme.accent, lineHeight:1 }}>{date.year}</p>
        <div style={{ textAlign: m ? 'left':'right' }}>
          <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.muted, marginBottom:6 }}>Giờ tổ chức</p>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize: m ? 38:50, fontWeight:300, color: theme.text, lineHeight:1 }}>{data.weddingTime}</p>
        </div>
      </motion.section>

      {/* ── Message ── */}
      {data.message && (
        <motion.section
          initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
          style={{ padding:`${py} ${px}` }}
        >
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontWeight:300, fontSize: m ? 18:'clamp(20px,2.5vw,26px)', lineHeight:1.8, color:'#C8C2B8', borderLeft:`2px solid ${theme.accent}`, paddingLeft: m ? 20:32 }}>
            "{data.message}"
          </p>
        </motion.section>
      )}

      {/* ── Our Story ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── Venue + RSVP ── */}
      <motion.section
        initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7 }}
        style={{ padding:`0 ${px} ${py}` }}
      >
        <div style={{ border:`1px solid ${theme.border}`, padding: m ? '28px 20px':'48px' }}>
          <div style={{ display:'grid', gridTemplateColumns: m ? '1fr':'1fr 1fr', gap: m ? 28:48 }}>
            <div>
              <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color: theme.accent, marginBottom:14 }}>Địa điểm</p>
              <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 24:28, color: theme.text, marginBottom:10 }}>{data.venueName}</h3>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color: theme.muted, lineHeight:1.7 }}>{data.venueAddress}</p>
            </div>
            {data.showRsvp && (
              <div style={{ borderTop: m ? `1px solid ${theme.border}`:'none', paddingTop: m ? 24:0 }}>
                <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color: theme.accent, marginBottom:14 }}>RSVP</p>
                <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color: theme.text, marginBottom:6 }}>{data.rsvpName}</p>
                <a href={`tel:${data.rsvpPhone}`} style={{ fontFamily:"'DM Mono', monospace", fontSize: m ? 20:17, color: theme.accent, letterSpacing:'0.05em', display:'block', marginBottom:10 }}>{data.rsvpPhone}</a>
                {data.rsvpDeadline && <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color: theme.muted }}>Xác nhận trước {new Date(data.rsvpDeadline).toLocaleDateString('vi-VN')}</p>}
              </div>
            )}
          </div>
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
          style={{ padding:`${py} ${px}` }}
        >
          <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color: theme.muted, marginBottom:20 }}>Gallery</p>
          <div style={{ display:'grid', gridTemplateColumns: m ? 'repeat(2,1fr)':'repeat(3,1fr)', gap:2 }}>
            {data.galleryImages.map((src,i) => (
              <motion.div key={i} initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.5, delay: i*0.05 }} style={{ aspectRatio:'1', overflow:'hidden' }}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(15%)', transition:'all 0.5s' }} onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.filter='grayscale(0%)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.filter='grayscale(15%)'}} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Guestbook ── */}
      {data.showGuestbook && <GuestbookSection slug={data.id} theme={theme} />}

      {/* ── Footer ── */}
      <footer style={{ borderTop:`1px solid ${theme.border}`, padding: m ? '28px 24px':'40px 64px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:18, color: theme.accent }}>
          {data.brideFirstName} &amp; {data.groomFirstName}
        </p>
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:'#3A3A3A', letterSpacing:'0.2em' }}>{date.year}</p>
      </footer>
    </div>
  )
}
