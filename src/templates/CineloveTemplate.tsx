import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { InvitationData, THEMES } from '../types/invitation'
import { useIsMobile } from '../hooks/useIsMobile'
import { toLunarDate } from '../utils/lunar'
import CountdownSection from '../components/sections/CountdownSection'
import ScheduleSection from '../components/sections/ScheduleSection'
import EffectOverlay from '../components/effects/EffectOverlay'

interface Props { data: InvitationData; guestName?: string }

const VN_MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
const VN_DAYS = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy']

function formatDate(d: string) {
  const dt = new Date(d)
  return {
    day: dt.getDate(),
    month: dt.getMonth() + 1,
    monthLabel: VN_MONTHS[dt.getMonth()],
    year: dt.getFullYear(),
    weekday: VN_DAYS[dt.getDay()],
  }
}

/**
 * Calendar grid: 7 cols (CN T2 T3 T4 T5 T6 T7).
 * Returns array of 42 cells (max 6 weeks). null for empty.
 */
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function CineloveTemplate({ data, guestName }: Props) {
  const m = useIsMobile()
  const theme = THEMES.cinelove
  const d = formatDate(data.weddingDate)
  const lunar = toLunarDate(data.weddingDate)
  const cover = data.coverImage || `https://picsum.photos/seed/cinelove-${data.id}/900/1400`
  const effectConfig = {
    type: data.effectType ?? 'hearts',
    intensity: data.effectIntensity ?? 'light',
    color: data.effectColor ?? '#E94560',
  }
  const calendarCells = buildCalendar(d.year, d.month)
  const weekdays = ['CN','T2','T3','T4','T5','T6','T7']

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])

  const px = m ? '20px' : '40px'

  // Base inputs/buttons style — Cinelove uses simple white/transparent
  const screenBg = '#FFFFFF'
  const inkColor = '#1A1A1A'
  const subColor = '#7A7A7A'
  const cardBorder = 'rgba(0,0,0,0.06)'
  const accent = theme.accent // #E8B4A0 (rose gold)
  const heartRed = '#C8324A'

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: screenBg,
      color: inkColor,
      maxWidth: m ? '100%' : 420,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: m ? 'none' : '0 0 60px rgba(0,0,0,0.08)',
    }}>
      <EffectOverlay config={effectConfig} accentColor={heartRed} />

      {/* ── 1. Hero — full-bleed photo + script name overlay ── */}
      <section ref={heroRef} style={{ position: 'relative', height: '100dvh', minHeight: 640, overflow: 'hidden' }}>
        {/* "Save The Date" script top-left */}
        <p style={{
          position: 'absolute', top: 18, left: 24, zIndex: 3,
          fontFamily: "'Great Vibes', cursive", fontSize: 32,
          color: inkColor, margin: 0, lineHeight: 1,
        }}>
          Save The Date
        </p>

        {/* Parallax cover photo */}
        <motion.div style={{ position: 'absolute', inset: 0, scale: imgScale }}>
          <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>

        {/* Couple names — script overlay lower-left, large */}
        <div style={{
          position: 'absolute', bottom: 110, left: 24, right: 24, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          color: inkColor,
        }}>
          {guestName && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)', margin: 0, marginBottom: 12,
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}>
              Kính mời {guestName}
            </p>
          )}
          <motion.h1
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
            style={{
              fontFamily: "'Great Vibes', cursive", fontWeight: 400,
              fontSize: 'clamp(58px, 14vw, 90px)',
              lineHeight: 1.05, margin: 0, color: inkColor,
              textShadow: '0 2px 16px rgba(255,255,255,0.7)',
            }}
          >
            {data.brideFirstName} {data.brideLastName}
          </motion.h1>
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              fontFamily: "'Great Vibes', cursive", fontSize: 36,
              color: inkColor, margin: '6px 18px', lineHeight: 1,
              textShadow: '0 2px 12px rgba(255,255,255,0.7)',
            }}
          >&amp;</motion.span>
          <motion.h1
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.9 }}
            style={{
              fontFamily: "'Great Vibes', cursive", fontWeight: 400,
              fontSize: 'clamp(58px, 14vw, 90px)',
              lineHeight: 1.05, margin: 0, color: inkColor, marginLeft: 36,
              textShadow: '0 2px 16px rgba(255,255,255,0.7)',
            }}
          >
            {data.groomFirstName} {data.groomLastName}
          </motion.h1>
        </div>

        {/* "Tháng X" script bottom-right */}
        <p style={{
          position: 'absolute', bottom: 28, right: 24, zIndex: 3,
          fontFamily: "'Great Vibes', cursive", fontSize: 32,
          color: inkColor, margin: 0,
          textShadow: '0 2px 12px rgba(255,255,255,0.6)',
        }}>
          {d.monthLabel}
        </p>
      </section>

      {/* ── 2. Calendar / Our Wedding Day ── */}
      <section style={{ padding: `40px ${px} 32px`, background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: inkColor, margin: 0 }}>
            Our wedding day
          </p>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: inkColor, margin: 0 }}>
            {d.monthLabel}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, textAlign: 'center' }}>
          {weekdays.map(w => (
            <div key={w} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: subColor, padding: '6px 0',
              letterSpacing: '0.05em',
            }}>{w}</div>
          ))}
          {calendarCells.map((c, i) => {
            const isWedding = c === d.day
            return (
              <div key={i} style={{
                position: 'relative', padding: '12px 0',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: c === null ? 'transparent' : inkColor,
                fontWeight: isWedding ? 700 : 400,
              }}>
                {isWedding && (
                  <span style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, color: heartRed, opacity: 0.85, zIndex: 0,
                  }}>♥</span>
                )}
                <span style={{ position: 'relative', zIndex: 1, color: isWedding ? '#FFF' : inkColor }}>{c ?? ''}</span>
              </div>
            )
          })}
        </div>

        <p style={{
          textAlign: 'center', fontFamily: "'Great Vibes', cursive",
          fontSize: 18, color: subColor, marginTop: 14,
        }}>
          {lunar.display}
        </p>
      </section>

      {/* ── 3. Family — 2 cột "Nhà Trai / Nhà Gái" ── */}
      {data.showFamily && (data.brideFather || data.groomFather) && (
        <section style={{ padding: `40px ${px}`, background: '#FFF', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: inkColor, margin: 0, marginBottom: 12, letterSpacing: '0.02em' }}>
                Nhà Trai
              </p>
              {data.groomFather && <p style={{ fontSize: 14, color: inkColor, margin: '4px 0' }}>Ông. {data.groomFather}</p>}
              {data.groomMother && <p style={{ fontSize: 14, color: inkColor, margin: '4px 0' }}>Bà. {data.groomMother}</p>}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: inkColor, margin: 0, marginBottom: 12, letterSpacing: '0.02em' }}>
                Nhà Gái
              </p>
              {data.brideFather && <p style={{ fontSize: 14, color: inkColor, margin: '4px 0' }}>Ông. {data.brideFather}</p>}
              {data.brideMother && <p style={{ fontSize: 14, color: inkColor, margin: '4px 0' }}>Bà. {data.brideMother}</p>}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Couple block — names script ── */}
      <section style={{ padding: `48px ${px} 36px`, background: '#FFF', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(54px, 12vw, 76px)',
          color: inkColor, margin: 0, lineHeight: 1.1,
        }}>
          {data.brideFirstName} {data.brideLastName}
        </p>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: accent, margin: '8px 0' }}>
          &amp;
        </p>
        <p style={{
          fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(54px, 12vw, 76px)',
          color: inkColor, margin: 0, lineHeight: 1.1,
        }}>
          {data.groomFirstName} {data.groomLastName}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: subColor, marginTop: 24,
        }}>
          Trân trọng kính mời lễ thành hôn
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: inkColor,
          margin: '6px 0 0',
        }}>
          Vào lúc {data.weddingTime} — {d.weekday}, {d.day}/{d.month}/{d.year}
        </p>
      </section>

      {/* ── 5. Our Story — paper notes overlapping ── */}
      {data.showStory && data.storyMilestones.length > 0 && (
        <section style={{ padding: `32px ${px} 48px`, background: '#FAF7F2' }}>
          <p style={{
            textAlign: 'center', fontFamily: "'Great Vibes', cursive",
            fontSize: 36, color: inkColor, margin: 0, marginBottom: 24,
          }}>
            Our Story
          </p>
          <div style={{ position: 'relative', minHeight: 280 }}>
            {data.storyMilestones.map((ms, i) => {
              const rot = (i % 2 === 0 ? -1 : 1) * (2 + i)
              const offset = i * 36
              return (
                <motion.div
                  key={ms.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.12, duration: 0.6 }}
                  style={{
                    position: 'relative',
                    background: '#FFFEF8',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    padding: '14px 18px',
                    marginLeft: i % 2 === 0 ? 0 : 20,
                    marginRight: i % 2 === 0 ? 20 : 0,
                    marginTop: i === 0 ? 0 : -offset / 6,
                    transform: `rotate(${rot}deg)`,
                  }}
                >
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: heartRed, margin: 0, marginBottom: 6 }}>
                    {ms.year} — {ms.title}
                  </p>
                  <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 18, color: inkColor, margin: 0, lineHeight: 1.5 }}>
                    {ms.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 6. Venue ── */}
      <section style={{ padding: `40px ${px}`, background: '#FFF', textAlign: 'center', borderTop: `1px solid ${cardBorder}` }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: subColor, margin: 0, marginBottom: 12,
        }}>
          Tại
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
          letterSpacing: '0.05em', textTransform: 'uppercase', color: inkColor,
          margin: 0, marginBottom: 8, lineHeight: 1.4,
        }}>
          {data.venueName}
        </p>
        <p style={{ fontSize: 13, color: subColor, margin: 0, lineHeight: 1.5 }}>
          Địa chỉ: {data.venueAddress}
        </p>
        {data.venueMapUrl && (
          <a href={data.venueMapUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', marginTop: 14,
              padding: '8px 18px', border: `1px solid ${heartRed}`,
              borderRadius: 4, color: heartRed, textDecoration: 'none',
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
            Xem bản đồ
          </a>
        )}
      </section>

      {/* ── 7. Timeline ── */}
      {data.showSchedule && data.scheduleEvents.length > 0 && (
        <section style={{ padding: `48px ${px} 32px`, background: '#FFF', borderTop: `1px solid ${cardBorder}` }}>
          <p style={{
            textAlign: 'center', fontFamily: "'Great Vibes', cursive",
            fontSize: 40, color: inkColor, margin: 0, marginBottom: 8,
          }}>
            Timeline
          </p>
          <ScheduleSection events={data.scheduleEvents} theme={{
            ...theme,
            bg: '#FFF', text: inkColor, accent: heartRed, muted: subColor,
            border: cardBorder, soft: '#FAF7F2', isDark: false,
          }} />
        </section>
      )}

      {/* ── 8. Hộp Yêu Thương — Countdown + thank you message on photo backdrop ── */}
      <section style={{ position: 'relative', padding: 0, background: '#FFF' }}>
        <p style={{
          textAlign: 'center', fontFamily: "'Great Vibes', cursive",
          fontSize: 32, color: inkColor, margin: 0, padding: '32px 0 16px',
        }}>
          Hộp Yêu Thương
        </p>
        {data.showCountdown && (
          <div style={{ padding: `0 ${px} 28px` }}>
            <CountdownSection weddingDate={data.weddingDate} weddingTime={data.weddingTime} theme={{
              ...theme,
              bg: '#FFF', text: inkColor, accent: heartRed, muted: subColor,
              border: cardBorder, soft: '#FAF7F2', isDark: false,
            }} />
          </div>
        )}

        <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
          <img src={cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 28, left: 24, right: 24,
            textAlign: 'center', color: 'rgba(50,50,50,0.85)',
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.7, margin: 0,
              fontStyle: 'italic',
            }}>
              Cảm ơn bạn đã dành tình cảm cho chúng mình! Sự hiện diện của bạn chính là món quà ý nghĩa nhất,
              và chúng mình vô cùng trân quý khi cùng bạn chia sẻ niềm hạnh phúc trong ngày trọng đại này.
            </p>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 26, color: heartRed, marginTop: 16 }}>
              forever
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. Bank QR (optional) ── */}
      {data.showBank && data.bankAccounts && data.bankAccounts.length > 0 && (
        <section style={{ padding: `40px ${px}`, background: '#FAF7F2', textAlign: 'center', borderTop: `1px solid ${cardBorder}` }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 32, color: inkColor, margin: 0, marginBottom: 8 }}>
            Mừng cưới
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: subColor, marginBottom: 24 }}>
            Quà mừng từ trái tim
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 320, margin: '0 auto' }}>
            {data.bankAccounts.map(acc => {
              const num = acc.accountNumber.replace(/\s/g, '')
              const qr = `https://img.vietqr.io/image/${encodeURIComponent(acc.bankName)}-${num}-compact2.png?accountName=${encodeURIComponent(acc.accountName)}`
              return (
                <div key={acc.id} style={{ background: '#FFF', border: `1px solid ${cardBorder}`, padding: 16, borderRadius: 8 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: heartRed, margin: 0, marginBottom: 8 }}>
                    {acc.side === 'bride' ? 'Nhà Gái' : acc.side === 'groom' ? 'Nhà Trai' : 'Chung'}
                  </p>
                  <img src={qr} alt="" style={{ width: 180, height: 180, margin: '0 auto', display: 'block' }} onError={e => (e.currentTarget as HTMLImageElement).style.display = 'none'} />
                  <p style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>{acc.bankName}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: heartRed, margin: '4px 0' }}>{acc.accountNumber}</p>
                  <p style={{ fontSize: 12, color: subColor, margin: 0 }}>{acc.accountName}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 10. Footer ── */}
      <footer style={{
        background: '#FFF', padding: '36px 24px 56px', textAlign: 'center',
        borderTop: `1px solid ${cardBorder}`,
      }}>
        <p style={{
          fontFamily: "'Great Vibes', cursive", fontSize: 42, color: inkColor, margin: 0, lineHeight: 1,
        }}>
          {data.brideFirstName} &amp; {data.groomFirstName}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: subColor, marginTop: 10,
        }}>
          {d.day}.{String(d.month).padStart(2, '0')}.{d.year}
        </p>
      </footer>
    </div>
  )
}
