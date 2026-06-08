import { useEffect, useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

export type EffectType = 'none' | 'petals' | 'sakura' | 'sparkles' | 'lanterns'

export interface EffectConfig {
  type: EffectType
  intensity: 'light' | 'medium' | 'heavy'
  color?: string // override accent color
}

// Deterministic pseudo-random by seed (no re-render jitter)
function rnd(seed: number, min = 0, max = 1): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const r = x - Math.floor(x)
  return min + r * (max - min)
}

const COUNTS: Record<string, Record<string, number>> = {
  petals:   { light: 18, medium: 32, heavy: 55 },
  sakura:   { light: 22, medium: 40, heavy: 65 },
  sparkles: { light: 20, medium: 38, heavy: 60 },
  lanterns: { light: 8,  medium: 14, heavy: 24 },
  hearts:   { light: 12, medium: 22, heavy: 38 },
}

// ─── SVG shapes ───────────────────────────────────────────────

function PetalSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 28 36" fill="none" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="14" cy="20" rx="8" ry="14" fill={color} opacity="0.82" transform="rotate(-10 14 20)" />
      <ellipse cx="14" cy="16" rx="6" ry="12" fill={color} opacity="0.5" transform="rotate(18 14 16)" />
    </svg>
  )
}

function SparkleSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M20 0 L22 16 L38 20 L22 24 L20 40 L18 24 L2 20 L18 16 Z" fill={color} opacity="0.9" />
      <circle cx="20" cy="20" r="3" fill="#fff" opacity="0.6" />
    </svg>
  )
}

function LanternSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 52" fill="none" style={{ width: '100%', height: '100%' }}>
      {/* String */}
      <line x1="18" y1="0" x2="18" y2="8" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Top cap */}
      <rect x="10" y="6" width="16" height="5" rx="2" fill={color} opacity="0.9" />
      {/* Body */}
      <rect x="7" y="11" width="22" height="28" rx="8" fill={color} opacity="0.85" />
      {/* Glow */}
      <rect x="10" y="14" width="16" height="22" rx="6" fill="#fff" opacity="0.25" />
      {/* Bottom cap */}
      <rect x="10" y="39" width="16" height="5" rx="2" fill={color} opacity="0.9" />
      {/* Tassel */}
      <line x1="18" y1="44" x2="18" y2="52" stroke={color} strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

function HeartSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 30" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M16 27 C16 27 3 18 3 10 C3 5.5 6.5 2 11 2 C13.5 2 15.5 3.5 16 5 C16.5 3.5 18.5 2 21 2 C25.5 2 29 5.5 29 10 C29 18 16 27 16 27Z" fill={color} opacity="0.9" />
    </svg>
  )
}

function SakuraSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" style={{ width: '100%', height: '100%' }}>
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse key={i} cx="16" cy="9" rx="5" ry="8" fill={color} opacity="0.78"
          transform={`rotate(${deg} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="3.5" fill="#fff" opacity="0.85" />
      <circle cx="16" cy="16" r="1.5" fill="#FFB7C5" opacity="0.9" />
    </svg>
  )
}

// ─── Keyframe CSS strings ──────────────────────────────────────

function getStyles(type: EffectType, color: string): string {
  const glow = color + 'aa'
  switch (type) {
    case 'petals':
    case 'sakura':
      return `
        @keyframes wi-fall {
          0%   { transform: translateY(-80px) rotate(0deg)   translateX(0px);   opacity: 0; }
          8%   { opacity: 1; }
          50%  { transform: translateY(45vh)  rotate(200deg) translateX(40px);  opacity: 0.85; }
          100% { transform: translateY(110vh) rotate(390deg) translateX(-30px); opacity: 0; }
        }
        @keyframes wi-sway {
          0%,100% { margin-left: 0; }
          50%      { margin-left: 28px; }
        }
        .wi-particle { animation: wi-fall var(--dur) ease-in-out var(--delay) infinite, wi-sway calc(var(--dur)*0.6) ease-in-out var(--delay) infinite; }
      `
    case 'sparkles':
      return `
        @keyframes wi-sparkle {
          0%,100% { transform: scale(0) rotate(0deg);   opacity: 0; }
          25%      { transform: scale(1) rotate(45deg);  opacity: 1; }
          75%      { transform: scale(0.6) rotate(90deg); opacity: 0.6; }
        }
        @keyframes wi-drift {
          0%,100% { transform: translateY(0) translateX(0); }
          33%      { transform: translateY(-18px) translateX(10px); }
          66%      { transform: translateY(10px)  translateX(-12px); }
        }
        .wi-particle { animation: wi-sparkle var(--dur) ease-in-out var(--delay) infinite, wi-drift calc(var(--dur)*1.4) ease-in-out var(--delay) infinite; }
      `
    case 'lanterns':
      return `
        @keyframes wi-rise {
          0%   { transform: translateY(0)      translateX(0)    rotate(0deg);  opacity: 0; }
          8%   { opacity: 1; }
          80%  { opacity: 0.9; }
          100% { transform: translateY(-110vh) translateX(30px) rotate(8deg);  opacity: 0; }
        }
        @keyframes wi-swing {
          0%,100% { margin-left: 0; }
          50%      { margin-left: 20px; }
        }
        .wi-particle { animation: wi-rise var(--dur) ease-in var(--delay) infinite, wi-swing calc(var(--dur)*0.5) ease-in-out var(--delay) infinite; }
      `
    case 'hearts':
      return `
        @keyframes wi-burst {
          0%   { transform: translateY(0) scale(0.4); opacity: 0; }
          15%  { transform: translateY(-20px) scale(1.1); opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(var(--travel)) scale(0.7) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes wi-sway-heart {
          0%,100% { margin-left: 0; }
          50%      { margin-left: 16px; }
        }
        .wi-particle { animation: wi-burst var(--dur) ease-out var(--delay) var(--iter), wi-sway-heart calc(var(--dur)*0.7) ease-in-out var(--delay) var(--iter); }
      `
    default:
      return ''
  }
}

// ─── Particle renderer ────────────────────────────────────────

interface ParticleProps {
  type: EffectType
  color: string
  count: number
  isMobile: boolean
  burst?: boolean
}

function Particles({ type, color, count, isMobile, burst }: ParticleProps) {
  const actualCount = isMobile ? Math.ceil(count * 0.55) : count

  return (
    <>
      {Array.from({ length: actualCount }, (_, i) => {
        const left    = rnd(i * 7 + 1, burst ? 20 : 2, burst ? 80 : 96)
        const isFall  = type === 'petals' || type === 'sakura'
        const isRise  = type === 'lanterns'
        const isFloat = type === 'sparkles'
        const isHeart = type === 'hearts'

        const durMin  = isRise ? 7 : isFloat ? 3 : isHeart ? 1.2 : 4
        const durMax  = isRise ? 13 : isFloat ? 7 : isHeart ? 2.5 : 9
        const dur     = rnd(i * 7 + 2, durMin, durMax)
        const delay   = burst ? rnd(i * 7 + 3, 0, 0.6) : rnd(i * 7 + 3, 0, dur)

        const sizeMin = type === 'sparkles' ? 12 : type === 'lanterns' ? 22 : isHeart ? 16 : 12
        const sizeMax = type === 'sparkles' ? 28 : type === 'lanterns' ? 44 : isHeart ? 36 : 28
        const size    = rnd(i * 7 + 4, sizeMin, sizeMax)
        const opacity = rnd(i * 7 + 5, isFloat ? 0.6 : 0.55, 1.0)

        const topVal    = isFall  ? `-${size + 10}px`
                        : isFloat ? `${rnd(i * 7 + 6, 5, 88)}vh`
                        : isHeart ? undefined
                        : undefined
        const bottomVal = isRise  ? `${rnd(i * 7 + 6, -8, 8)}%`
                        : isHeart ? `${rnd(i * 7 + 6, burst ? 4 : -5, burst ? 12 : 5)}%`
                        : undefined

        const travelVh = rnd(i * 7 + 8, 40, 90)
        const rotDeg   = rnd(i * 7 + 9, -20, 20)
        const iter     = burst ? '1' : 'infinite'

        const style: React.CSSProperties = {
          position: 'fixed',
          left:    `${left}%`,
          top:     topVal,
          bottom:  bottomVal,
          width:   size,
          height:  isFall ? size * 1.3 : size,
          opacity,
          pointerEvents: 'none',
          zIndex: 999,
          ['--dur' as any]:    `${dur}s`,
          ['--delay' as any]:  burst ? `${delay}s` : `-${delay}s`,
          ['--travel' as any]: `-${travelVh}vh`,
          ['--rot' as any]:    `${rotDeg}deg`,
          ['--iter' as any]:   iter,
        }

        const shape = (() => {
          switch (type) {
            case 'petals':   return <PetalSVG color={color} />
            case 'sakura':   return <SakuraSVG color={color} />
            case 'sparkles': return <SparkleSVG color={color} />
            case 'lanterns': return <LanternSVG color={color} />
            case 'hearts':   return <HeartSVG color={color} />
            default:         return null
          }
        })()

        return (
          <div key={i} className="wi-particle" style={style}>
            {shape}
          </div>
        )
      })}
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────

interface Props {
  config: EffectConfig
  accentColor?: string
  burst?: boolean
}

export default function EffectOverlay({ config, accentColor = '#C4A882', burst }: Props) {
  const isMobile = useIsMobile()
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  if (config.type === 'none' || reduced) return null

  const color = config.color || accentColor
  const count = COUNTS[config.type]?.[config.intensity] ?? 20
  const css   = getStyles(config.type, color)

  const EFFECT_COLORS: Record<EffectType, string> = {
    none:     color,
    petals:   config.color || '#E8899A',
    sakura:   config.color || '#FFB7C5',
    sparkles: config.color || '#F5C842',
    lanterns: config.color || '#E84545',
    hearts:   config.color || '#FF6B8A',
  }

  const effectColor = config.color ? color : EFFECT_COLORS[config.type]

  return (
    <>
      <style>{css}</style>
      <Particles
        type={config.type}
        color={effectColor}
        count={count}
        isMobile={isMobile}
        burst={burst}
      />
    </>
  )
}

export const EFFECT_META: Record<EffectType, { label: string; emoji: string; desc: string; defaultColor: string }> = {
  none:     { label: 'Không có',      emoji: '—',  desc: 'Không dùng hiệu ứng',                       defaultColor: '#ccc' },
  petals:   { label: 'Cánh hoa hồng', emoji: '🌹', desc: 'Cánh hoa hồng rơi nhẹ nhàng từ trên xuống', defaultColor: '#E8899A' },
  sakura:   { label: 'Hoa anh đào',   emoji: '🌸', desc: 'Hoa anh đào 5 cánh rơi lãng mạn',           defaultColor: '#FFB7C5' },
  sparkles: { label: 'Ánh sao vàng',  emoji: '✨', desc: 'Các ngôi sao nhỏ nhấp nháy khắp màn hình',  defaultColor: '#F5C842' },
  lanterns: { label: 'Đèn lồng',      emoji: '🏮', desc: 'Đèn lồng đỏ từ từ bay lên trời',            defaultColor: '#E84545' },
  hearts:   { label: 'Trái tim',      emoji: '💗', desc: 'Trái tim hồng bay lên lãng mạn',             defaultColor: '#FF6B8A' },
}
