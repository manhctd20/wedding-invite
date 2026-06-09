import { TemplateTheme } from '../../types/invitation'
import { toLunarDate } from '../../utils/lunar'

interface Props {
  weddingDate: string
  theme: TemplateTheme
}

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function CalendarWidget({ weddingDate, theme }: Props) {
  const date = new Date(weddingDate)
  if (isNaN(date.getTime())) return null

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const blanks = Array.from({ length: firstDay })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const lunar = toLunarDate(weddingDate)

  return (
    <div style={{
      maxWidth: 320,
      margin: '0 auto',
      background: theme.isDark ? 'rgba(255,255,255,0.03)' : '#FFF',
      border: `1px solid ${theme.border}`,
      padding: '24px 20px',
      borderRadius: 4,
      boxShadow: theme.isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: theme.accent,
          marginBottom: 4
        }}>
          Tháng {month + 1}
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
          color: theme.muted
        }}>
          {year}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        textAlign: 'center',
        marginBottom: 8
      }}>
        {DAYS.map(d => (
          <div key={d} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: theme.muted,
            paddingBottom: 8,
            borderBottom: `1px solid ${theme.border}`
          }}>
            {d}
          </div>
        ))}

        {blanks.map((_, i) => <div key={`b-${i}`} />)}

        {days.map(d => {
          const isWedding = d === day
          return (
            <div key={d} style={{
              position: 'relative',
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: isWedding ? (theme.isDark ? '#000' : '#FFF') : theme.text,
              background: isWedding ? theme.accent : 'transparent',
              borderRadius: '50%',
              fontWeight: isWedding ? 500 : 400,
            }}>
              {d}
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${theme.border}` }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 14,
          color: theme.text
        }}>
          {lunar.display}
        </p>
      </div>
    </div>
  )
}
