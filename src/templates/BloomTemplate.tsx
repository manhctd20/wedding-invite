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

function formatDate(d: string) {
  const dt = new Date(d)
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']
  const months = ['Tháng 01','Tháng 02','Tháng 03','Tháng 04','Tháng 05','Tháng 06','Tháng 07','Tháng 08','Tháng 09','Tháng 10','Tháng 11','Tháng 12']
  return {
    day: String(dt.getDate()).padStart(2,'0'),
    month: months[dt.getMonth()],
    year: String(dt.getFullYear()),
    full: `${days[dt.getDay()]}, ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`,
    rsvpFull: dt.toLocaleDateString('vi-VN'),
  }
}

export default function BloomTemplate({ data }: Props) {
  const m = useIsMobile()
  const theme = THEMES.bloom
  const date = formatDate(data.weddingDate)
  const effectConfig = { type: data.effectType ?? 'petals', intensity: data.effectIntensity ?? 'medium', color: data.effectColor }
  const cover = data.coverImage || `https://picsum.photos/seed/wedding-bloom-${data.id}/900/1100`
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const px = m ? '20px' : '24px'
  const py = m ? '56px' : '88px'

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background: theme.bg, color: theme.text }}>
      <EffectOverlay config={effectConfig} accentColor={theme.accent} />

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position:'relative', height:'100dvh', minHeight:600, overflow:'hidden' }}>
        {/* Parallax image */}
        <motion.div style={{ position:'absolute', inset:'-15%', y: imgY }}>
          <img src={cover} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
        </motion.div>

        {/* Gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(250,250,247,0.05) 0%, rgba(250,250,247,0.5) 55%, rgba(250,250,247,1) 100%)' }} />

        {/* Text */}
        <motion.div
          style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:`0 ${px}`, textAlign:'center', y: textY, opacity }}
        >
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.2 }}
            style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color: theme.muted, marginBottom: m ? 20:32 }}
          >
            Trân trọng kính mời
          </motion.p>

          <motion.h1
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.35 }}
            style={{
              fontFamily: data.coupleNameFont === 'script' ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif",
              fontWeight: data.coupleNameFont === 'script' ? 400 : 400,
              fontSize: data.coupleNameFont === 'script' ? (m ? 64 : 'clamp(64px,12vw,110px)') : (m ? 58 : 'clamp(52px,10vw,92px)'),
              lineHeight: 1.1, color: theme.text, marginBottom: 10,
            }}
          >
            {data.brideFirstName}&nbsp;{data.brideLastName}
          </motion.h1>

          <motion.div
            initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.6, delay:0.6 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:10 }}
          >
            <div style={{ height:1, width:40, background: theme.accent }} />
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:22, color: theme.accent, fontWeight:300 }}>&amp;</span>
            <div style={{ height:1, width:40, background: theme.accent }} />
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.45 }}
            style={{
              fontFamily: data.coupleNameFont === 'script' ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: data.coupleNameFont === 'script' ? (m ? 64 : 'clamp(64px,12vw,110px)') : (m ? 58 : 'clamp(52px,10vw,92px)'),
              lineHeight: 1.1, color: theme.text, marginBottom: m ? 32 : 44,
            }}
          >
            {data.groomFirstName}&nbsp;{data.groomLastName}
          </motion.h1>

          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.7 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
          >
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize: m ? 12:13, letterSpacing:'0.12em', textTransform:'uppercase', color: theme.muted }}>{date.full}</p>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize: m ? 12:13, color: theme.muted }}>{data.weddingTime} &bull; {data.venueName}</p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2, duration:0.8 }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
        >
          <motion.div
            animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}
            style={{ width:1, height:44, background:`linear-gradient(to bottom, ${theme.accent}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ── Countdown ── */}
      {data.showCountdown && (
        <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={theme} />
      )}

      {/* ── Date block ── */}
      <motion.section
        initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7 }}
        style={{ padding:`${py} ${px}`, textAlign:'center' }}
      >
        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.accent, marginBottom: m ? 28:40 }}>Ngày trọng đại</p>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', maxWidth:480, margin:'0 auto' }}>
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize: m ? 60:76, lineHeight:1, color: theme.text }}>{date.day}</p>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color: theme.muted, marginTop:8 }}>{date.month}</p>
          </div>
          <div style={{ width:1, height:70, background: theme.border, margin:'0 28px' }} />
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize: m ? 60:76, lineHeight:1, color: theme.text }}>{date.year}</p>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color: theme.muted, marginTop:8 }}>{data.weddingTime}</p>
          </div>
        </div>
      </motion.section>

      {/* ── Message ── */}
      {data.message && (
        <motion.section
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
          style={{ padding:`0 ${px} ${py}`, textAlign:'center' }}
        >
          <div style={{ maxWidth:560, margin:'0 auto', borderTop:`1px solid ${theme.border}`, paddingTop: m ? 36:52 }}>
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontWeight:300, fontSize: m ? 18:22, lineHeight:1.8, color:'#5C4C3C' }}>
              "{data.message}"
            </p>
          </div>
        </motion.section>
      )}

      {/* ── Our Story ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <OurStorySection milestones={data.storyMilestones} theme={theme} />
      )}

      {/* ── Venue ── */}
      <motion.section
        initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.7 }}
        style={{ padding:`0 ${px} ${py}` }}
      >
        <div style={{ maxWidth:640, margin:'0 auto', background: theme.soft, padding: m ? '32px 24px':'52px 44px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.accent, marginBottom:20 }}>Địa điểm tổ chức</p>
          <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 26:32, color: theme.text, marginBottom:10 }}>{data.venueName}</h3>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color: theme.muted, lineHeight:1.7 }}>{data.venueAddress}</p>
          <div style={{ marginTop:24, paddingTop:24, borderTop:`1px solid ${theme.border}` }}>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color: theme.muted }}>
              {data.weddingTime} &mdash; Vui lòng đến đúng giờ
            </p>
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
          style={{ padding:`0 ${px} ${py}`, borderTop:`1px solid ${theme.border}` }}
        >
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.accent, marginBottom:28, textAlign:'center', paddingTop: py }}>Khoảnh khắc của chúng tôi</p>
          <div style={{ display:'grid', gridTemplateColumns: m ? 'repeat(2,1fr)':'repeat(auto-fill,minmax(220px,1fr))', gap:6, maxWidth:900, margin:'0 auto' }}>
            {data.galleryImages.map((src,i) => (
              <motion.div key={i} initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.5, delay: i*0.06 }} style={{ aspectRatio:'3/4', overflow:'hidden' }}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='none'} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── RSVP ── */}
      {data.showRsvp && (
        <motion.section
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.4 }} transition={{ duration:0.7 }}
          style={{ padding:`0 ${px} ${m ? 64:100}px`, textAlign:'center' }}
        >
          <div style={{ maxWidth:480, margin:'0 auto' }}>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color: theme.accent, marginBottom:20 }}>Xác nhận tham dự</p>
            <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize: m ? 22:28, color: theme.text, marginBottom:8 }}>Vui lòng xác nhận trước</h3>
            {data.rsvpDeadline && (
              <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize: m ? 18:22, color: theme.accent, marginBottom:28 }}>
                {formatDate(data.rsvpDeadline).rsvpFull}
              </p>
            )}
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color:'#5C4C3C', marginBottom:6 }}>{data.rsvpName}</p>
            <a href={`tel:${data.rsvpPhone}`} style={{ fontFamily:"'DM Mono', monospace", fontSize: m ? 20:18, color: theme.text, letterSpacing:'0.05em', display:'block' }}>{data.rsvpPhone}</a>
          </div>
        </motion.section>
      )}

      {/* ── Guestbook ── */}
      {data.showGuestbook && <GuestbookSection slug={data.id} theme={theme} />}

      {/* ── Footer ── */}
      <footer style={{ borderTop:`1px solid ${theme.border}`, padding:`28px ${px}`, textAlign:'center' }}>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontWeight:300, fontSize:20, color: theme.accent }}>
          {data.brideFirstName} &amp; {data.groomFirstName}
        </p>
        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:'#C8BDB4', marginTop:6, letterSpacing:'0.1em' }}>{date.year}</p>
      </footer>
    </div>
  )
}
