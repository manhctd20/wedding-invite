import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TemplateTheme } from '../../types/invitation'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  weddingDate: string
  weddingTime: string
  theme: TemplateTheme
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  passed: boolean
}

function calcTimeLeft(date: string, time: string): TimeLeft {
  const target = new Date(`${date}T${time || '00:00'}:00`)
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, passed: false }
}

function Digit({ value, label, theme }: { value: number; label: string; theme: TemplateTheme }) {
  const m = useIsMobile()
  const str = String(value).padStart(2, '0')
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: m ? 48 : 72,
        lineHeight: 1,
        color: theme.accent,
        letterSpacing: '-0.02em',
        minWidth: m ? 60 : 80,
      }}>
        {str}
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: theme.muted,
        marginTop: 8,
      }}>
        {label}
      </p>
    </div>
  )
}

export default function CountdownSection({ weddingDate, weddingTime, theme }: Props) {
  const m = useIsMobile()
  const [time, setTime] = useState(() => calcTimeLeft(weddingDate, weddingTime))

  useEffect(() => {
    const t = setInterval(() => setTime(calcTimeLeft(weddingDate, weddingTime)), 1000)
    return () => clearInterval(t)
  }, [weddingDate, weddingTime])

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: m ? '48px 20px' : '72px 64px',
        background: theme.soft,
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        textAlign: 'center',
      }}
    >
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: theme.muted,
        marginBottom: m ? 28 : 40,
      }}>
        {time.passed ? 'Đã tổ chức' : 'Đếm ngược đến ngày cưới'}
      </p>

      {time.passed ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: m ? 28 : 36,
          color: theme.accent,
        }}>
          Hạnh phúc mãi mãi
        </p>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: m ? 0 : 8,
          maxWidth: 480,
          margin: '0 auto',
        }}>
          <Digit value={time.days} label="Ngày" theme={theme} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 40 : 56, color: theme.border, lineHeight: 1.1, padding: '0 4px', marginTop: 4 }}>:</span>
          <Digit value={time.hours} label="Giờ" theme={theme} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 40 : 56, color: theme.border, lineHeight: 1.1, padding: '0 4px', marginTop: 4 }}>:</span>
          <Digit value={time.minutes} label="Phút" theme={theme} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 40 : 56, color: theme.border, lineHeight: 1.1, padding: '0 4px', marginTop: 4 }}>:</span>
          <Digit value={time.seconds} label="Giây" theme={theme} />
        </div>
      )}
    </motion.section>
  )
}
