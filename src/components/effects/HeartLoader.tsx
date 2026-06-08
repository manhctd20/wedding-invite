// Full-screen loading state — hearts floating up instead of a spinner

function rnd(seed: number, min = 0, max = 1): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const r = x - Math.floor(x)
  return min + r * (max - min)
}

const COUNT = 7

export default function HeartLoader() {
  const css = `
    @keyframes hl-rise {
      0%   { transform: translateY(0) scale(0.3); opacity: 0; }
      15%  { transform: translateY(-15px) scale(1); opacity: 1; }
      85%  { opacity: 0.7; }
      100% { transform: translateY(-55vh) scale(0.6); opacity: 0; }
    }
    @keyframes hl-sway {
      0%,100% { margin-left: 0; }
      50%      { margin-left: 14px; }
    }
    .hl-heart {
      animation:
        hl-rise var(--dur) ease-out var(--delay) infinite,
        hl-sway calc(var(--dur) * 0.8) ease-in-out var(--delay) infinite;
    }
  `

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#FAFAF7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, overflow: 'hidden',
    }}>
      <style>{css}</style>

      {Array.from({ length: COUNT }, (_, i) => {
        const left  = rnd(i * 5 + 1, 25, 75)
        const dur   = rnd(i * 5 + 2, 1.6, 2.8)
        const delay = rnd(i * 5 + 3, 0, 1.4)
        const size  = rnd(i * 5 + 4, 18, 38)
        const color = ['#FF6B8A', '#FFB7C5', '#E8899A', '#FF8FAB'][i % 4]

        return (
          <div
            key={i}
            className="hl-heart"
            style={{
              position: 'absolute',
              bottom: '30%',
              left: `${left}%`,
              width: size,
              height: size,
              opacity: 0,
              pointerEvents: 'none',
              ['--dur' as any]:   `${dur}s`,
              ['--delay' as any]: `${delay}s`,
            }}
          >
            <svg viewBox="0 0 32 30" fill="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M16 27 C16 27 3 18 3 10 C3 5.5 6.5 2 11 2 C13.5 2 15.5 3.5 16 5 C16.5 3.5 18.5 2 21 2 C25.5 2 29 5.5 29 10 C29 18 16 27 16 27Z"
                fill={color}
              />
            </svg>
          </div>
        )
      })}

      <p style={{
        position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: 15, color: '#C4A882', letterSpacing: '0.08em', whiteSpace: 'nowrap',
      }}>
        Đang tải thiệp cưới...
      </p>
    </div>
  )
}
