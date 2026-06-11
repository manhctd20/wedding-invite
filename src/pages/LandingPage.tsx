import { useNavigate, Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../store/auth'
import { createInvitation } from '../store/invitationApi'

const TEMPLATES = [
  {
    id: 'bloom',
    label: 'Bloom',
    tagline: 'Lãng mạn & Tinh tế',
    bg: '#F5EDE4',
    accent: '#C4A882',
    text: '#2C2420',
    img: 'https://picsum.photos/seed/bloom-preview/400/520',
  },
  {
    id: 'noir',
    label: 'Noir',
    tagline: 'Sang trọng & Tối giản',
    bg: '#0A0A0A',
    accent: '#C9A84C',
    text: '#F0EBE0',
    img: 'https://picsum.photos/seed/noir-preview/400/520',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    tagline: 'Sạch sẽ & Hiện đại',
    bg: '#FFFFFF',
    accent: '#1A1A1A',
    text: '#1A1A1A',
    img: 'https://picsum.photos/seed/minimal-preview/400/520',
  },
  {
    id: 'velvet',
    label: 'Velvet',
    tagline: 'Huyền bí & Lãng mạn',
    bg: '#100D1A',
    accent: '#C9924A',
    text: '#F0E8DC',
    img: 'https://picsum.photos/seed/velvet-preview/400/520',
  },
  {
    id: 'heritage',
    label: 'Heritage',
    tagline: 'Truyền thống & Trang trọng',
    bg: '#FAF3E0',
    accent: '#D4AF37',
    text: '#4A1C1C',
    img: 'https://picsum.photos/seed/heritage-preview/400/520',
  },
  {
    id: 'garden',
    label: 'Garden',
    tagline: 'Tươi mát & Thiên nhiên',
    bg: '#F7FCF5',
    accent: '#6B8E7B',
    text: '#1C3B2B',
    img: 'https://picsum.photos/seed/garden-preview/400/520',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    tagline: 'Điện ảnh & Hiện đại',
    bg: '#111111',
    accent: '#D4D4D4',
    text: '#F5F5F5',
    img: 'https://picsum.photos/seed/cinematic-preview/400/520',
  },
  {
    id: 'cinelove',
    label: 'Cinelove',
    tagline: 'Glass UI & Bottom sheets',
    bg: '#1B1422',
    accent: '#E8B4A0',
    text: '#F5E9DC',
    img: 'https://picsum.photos/seed/cinelove-preview/400/520',
  },
]

const FEATURES = [
  { icon: '✦', title: '8 template đẹp', desc: 'Bloom, Noir, Minimal, Velvet, Heritage, Garden, Cinematic, Cinelove — mỗi phong cách một vẻ riêng' },
  { icon: '✦', title: 'Chỉnh sửa trực tiếp', desc: 'Preview realtime khi bạn gõ, không cần reload' },
  { icon: '✦', title: 'Link chia sẻ', desc: 'Gửi link cho khách mời, không cần app, không cần tài khoản' },
  { icon: '✦', title: 'Upload ảnh cưới', desc: 'Thêm ảnh bìa và album ảnh vào thiệp của bạn' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const m = useIsMobile()
  const { user } = useAuth()
  const px = m ? '20px' : '80px'

  async function handleCreate() {
    if (!user) { navigate('/register'); return }
    try {
      const inv = await createInvitation()
      navigate(`/editor/${inv.id}`)
    } catch {
      navigate('/login')
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFAF7', color: '#2C2420', minHeight: '100dvh' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(232,221,212,0.7)',
        background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(12px)',
        padding: m ? '0 20px' : '0 40px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: '#2C2420', textDecoration: 'none' }}>Thiệp Cưới</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <Link to="/dashboard" style={{ padding: '7px 16px', border: '1px solid #E8DDD4', color: '#2C2420', fontFamily: "'DM Sans', sans-serif", fontSize: 12, textDecoration: 'none' }}>
              {m ? 'Dashboard' : `Xin chào, ${user.displayName || user.email.split('@')[0]}`}
            </Link>
          ) : (
            <Link to="/login" style={{ padding: '7px 16px', border: '1px solid #E8DDD4', color: '#2C2420', fontFamily: "'DM Sans', sans-serif", fontSize: 12, textDecoration: 'none' }}>Đăng nhập</Link>
          )}
          <button
            onClick={handleCreate}
            style={{ padding: m ? '7px 16px' : '8px 20px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em' }}
          >
            Tạo thiệp
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 56,
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: m ? '1fr' : '1fr 1fr',
      }}>
        {/* Text side */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: m ? '48px 20px 40px' : '80px 64px 80px 80px' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 24 }}>
            Thiệp cưới online
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: m ? 48 : 'clamp(40px, 5vw, 72px)', lineHeight: 1.08, color: '#2C2420', marginBottom: 20 }}>
            Thiệp cưới đẹp,<br />
            <span style={{ fontStyle: 'italic', color: '#C4A882' }}>chỉnh sửa dễ dàng</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: m ? 14 : 16, lineHeight: 1.7, color: '#7C6C5C', maxWidth: 400, marginBottom: 36 }}>
            Chọn template, điền thông tin, lấy link chia sẻ. Không cần tài khoản, không cần cài app.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleCreate}
              style={{ padding: m ? '12px 28px' : '14px 32px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: '0.06em' }}
            >
              Tạo thiệp miễn phí
            </button>
            <a
              href="#templates"
              style={{ padding: m ? '12px 20px' : '14px 32px', border: '1px solid #E8DDD4', color: '#2C2420', fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: '0.06em', textDecoration: 'none', display: 'inline-block' }}
            >
              Xem mẫu thiệp
            </a>
          </div>

          <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid #E8DDD4', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: m ? 16 : 24 }}>
            {[['8', 'Template'], ['100%', 'Miễn phí'], ['∞', 'Khách mời']].map(([num, label]) => (
              <div key={label}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 28 : 36, fontWeight: 300, color: '#C4A882', lineHeight: 1 }}>{num}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview side — hide on mobile to keep hero clean */}
        {!m && (
          <div style={{ position: 'relative', overflow: 'hidden', background: '#F0E8DF' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
                {TEMPLATES.slice().reverse().map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      position: i === 0 ? 'relative' : 'absolute',
                      top: i === 0 ? 0 : `${(2 - i) * -16}px`,
                      left: i === 0 ? 0 : `${(2 - i) * 10}px`,
                      width: '100%',
                      boxShadow: '0 8px 48px rgba(44,36,32,0.18)',
                      transform: i === 0 ? 'none' : `rotate(${(2 - i) * -1.5}deg)`,
                      zIndex: i,
                    }}
                  >
                    <div style={{ background: t.bg, padding: 20, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ height: 100, background: `url(${t.img}) center/cover`, opacity: 0.8 }} />
                      <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: t.accent }}>Ngọc Linh &amp; Minh Tuấn</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.text, opacity: 0.5, marginTop: 6 }}>20 . 12 . 2025</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.accent }}>{t.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Template showcase */}
      <section id="templates" style={{ padding: m ? '64px 20px' : '100px 80px' }}>
        <div style={{ marginBottom: m ? 40 : 56 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 14 }}>Bộ sưu tập</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 36 : 48, color: '#2C2420', lineHeight: 1.1 }}>
            Bốn phong cách,<br /><span style={{ fontStyle: 'italic' }}>một kỷ niệm</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(4, 1fr)', gap: m ? 12 : 2 }}>
          {TEMPLATES.map(t => (
            <div key={t.id} style={{ background: t.bg, cursor: 'pointer' }} onClick={handleCreate}>
              <div style={{ aspectRatio: m ? '4/3' : '3/4', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={t.img}
                  alt={t.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${t.bg}cc 0%, transparent 50%)` }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 24, color: t.text, marginBottom: 4 }}>{t.label}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.accent }}>{t.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: m ? '0 20px 64px' : '0 80px 100px', borderTop: '1px solid #E8DDD4', paddingTop: m ? 48 : 72 }}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 2fr', gap: m ? 32 : 80, alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 14 }}>Tính năng</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 32 : 40, color: '#2C2420', lineHeight: 1.15 }}>
              Đơn giản từ<br /><span style={{ fontStyle: 'italic' }}>đầu đến cuối</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr 1fr', gap: m ? 20 : 32 }}>
            {FEATURES.map(f => (
              <div key={f.title}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#C4A882', display: 'block', marginBottom: 10 }}>{f.icon}</span>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: '#2C2420', marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: m ? '56px 20px' : '80px', background: '#2C2420', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 20 }}>Bắt đầu ngay hôm nay</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: m ? 36 : 48, color: '#FAFAF7', lineHeight: 1.1, marginBottom: 32 }}>
          Thiệp cưới của bạn<br />
          <span style={{ fontStyle: 'italic', color: '#C4A882' }}>chỉ mất vài phút</span>
        </h2>
        <button
          onClick={handleCreate}
          style={{ padding: m ? '14px 36px' : '16px 48px', background: '#C4A882', color: '#2C2420', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: '0.08em', fontWeight: 500 }}
        >
          Tạo thiệp miễn phí
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: m ? '24px 20px' : '28px 80px', borderTop: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: '#C4A882' }}>Thiệp Cưới</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#C4A882', letterSpacing: '0.08em' }}>Handcrafted with love</span>
      </footer>
    </div>
  )
}
