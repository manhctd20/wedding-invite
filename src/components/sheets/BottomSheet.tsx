import { useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateTheme } from '../../types/invitation'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  theme: TemplateTheme
  children: ReactNode
  maxHeight?: string
}

export default function BottomSheet({ open, onClose, title, subtitle, theme, children, maxHeight = '85vh' }: Props) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, onClose])

  const isDark = theme.isDark
  const sheetBg = isDark ? 'rgba(20,20,20,0.78)' : 'rgba(255,255,255,0.75)'
  const handleBg = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)'
  const borderC = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-end',
          }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            style={{
              width: '100%',
              maxHeight,
              background: sheetBg,
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              borderTop: `1px solid ${borderC}`,
              borderRadius: '28px 28px 0 0',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              color: theme.text,
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
              <div style={{ width: 42, height: 4, borderRadius: 2, background: handleBg }} />
            </div>

            {(title || subtitle) && (
              <div style={{ textAlign: 'center', padding: '8px 24px 16px' }}>
                {title && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500, fontSize: 26, color: theme.text,
                    margin: 0, lineHeight: 1.2,
                  }}>
                    {title}
                  </p>
                )}
                {subtitle && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, color: theme.muted,
                    marginTop: 4, letterSpacing: '0.05em',
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            <div style={{ overflowY: 'auto', padding: '0 20px 24px', flex: 1 }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
