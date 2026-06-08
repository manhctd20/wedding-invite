import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { getMyInvitations, createInvitation, deleteInvitation, InvitationRecord } from '../store/invitationApi'
import { apiError } from '../lib/api'
import { TEMPLATE_META } from '../types/invitation'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [invs, setInvs] = useState<InvitationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyInvitations().then(setInvs).catch(e => setError(apiError(e))).finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    setCreating(true)
    try {
      const inv = await createInvitation()
      navigate(`/editor/${inv.id}`)
    } catch (e) {
      setError(apiError(e))
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Xoá thiệp này?')) return
    try {
      await deleteInvitation(id)
      setInvs(prev => prev.filter(i => i.id !== id))
    } catch (e) {
      alert(apiError(e))
    }
  }

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100dvh', background: '#FAFAF7', fontFamily: "'DM Sans', sans-serif" },
    nav: { height: 56, borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#FAFAF7' },
    logo: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, color: '#C4A882', textDecoration: 'none' },
    main: { maxWidth: 900, margin: '0 auto', padding: '48px 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
    card: { background: '#fff', border: '1px solid #E8DDD4', padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: 12 },
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.logo}>Thiệp Cưới</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#9C8C7C' }}>{user?.displayName || user?.email}</span>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ fontSize: 12, color: '#C4A882', textDecoration: 'none', border: '1px solid #C4A882', padding: '5px 12px' }}>Admin</Link>
          )}
          <button onClick={logout} style={{ fontSize: 12, color: '#9C8C7C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Đăng xuất</button>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.header}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 8 }}>Trang quản lý</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 36, color: '#2C2420', lineHeight: 1.1 }}>
              Thiệp cưới của bạn
            </h1>
          </div>
          <button
            onClick={handleCreate} disabled={creating}
            style={{ padding: '10px 24px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, opacity: creating ? 0.7 : 1 }}
          >
            {creating ? 'Đang tạo...' : '+ Tạo thiệp mới'}
          </button>
        </div>

        {error && <p style={{ fontSize: 13, color: '#c0392b', marginBottom: 24 }}>{error}</p>}

        {loading ? (
          <p style={{ color: '#9C8C7C', fontSize: 14 }}>Đang tải...</p>
        ) : invs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #E8DDD4' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 24, color: '#C4A882', marginBottom: 12 }}>Chưa có thiệp nào</p>
            <p style={{ fontSize: 13, color: '#9C8C7C', marginBottom: 28 }}>Tạo thiệp đầu tiên của bạn nhé!</p>
            <button onClick={handleCreate} style={{ padding: '10px 28px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontSize: 13 }}>
              Tạo thiệp ngay
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {invs.map(inv => {
              const tplMeta = TEMPLATE_META[(inv.content?.template as any) || 'bloom']
              const date = inv.content?.weddingDate ? new Date(inv.content.weddingDate).toLocaleDateString('vi-VN') : ''
              return (
                <div key={inv.id} style={s.card}>
                  {/* Color strip */}
                  <div style={{ height: 4, background: `linear-gradient(to right, ${tplMeta.palette[0]}, ${tplMeta.palette[1]})`, margin: '-24px -24px 0', borderBottom: `1px solid #E8DDD4` }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 4 }}>{tplMeta.label}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#2C2420', fontWeight: 400, lineHeight: 1.2 }}>
                        {inv.content?.brideFirstName} &amp; {inv.content?.groomFirstName}
                      </p>
                      {date && <p style={{ fontSize: 12, color: '#9C8C7C', marginTop: 4 }}>{date}</p>}
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 8px', background: inv.published ? '#F0FAF0' : '#F5F5F5', color: inv.published ? '#2E7D32' : '#9C8C7C', border: `1px solid ${inv.published ? '#A5D6A7' : '#E8DDD4'}` }}>
                      {inv.published ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9C8C7C' }}>
                    <span>👁 {inv.viewCount}</span>
                    <span style={{ color: '#E8DDD4' }}>|</span>
                    <span>Sửa: {new Date(inv.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => navigate(`/editor/${inv.id}`)}
                      style={{ flex: 1, padding: '8px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Chỉnh sửa
                    </button>
                    <a
                      href={`/invite/${inv.slug}`} target="_blank" rel="noreferrer"
                      style={{ flex: 1, padding: '8px', border: '1px solid #E8DDD4', color: '#2C2420', fontSize: 12, textDecoration: 'none', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Xem thiệp
                    </a>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      style={{ padding: '8px 12px', border: '1px solid #FEDAD7', color: '#c0392b', background: 'none', cursor: 'pointer', fontSize: 12 }}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
