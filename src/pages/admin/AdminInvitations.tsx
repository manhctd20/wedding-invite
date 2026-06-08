import { useEffect, useState } from 'react'
import { api, apiError } from '../../lib/api'
import { TEMPLATE_META } from '../../types/invitation'

interface Inv {
  id: string; slug: string; published: boolean; viewCount: number; createdAt: string; updatedAt: string
  content: any
  owner: { email: string; displayName: string } | null
}

export default function AdminInvitations() {
  const [invs, setInvs] = useState<Inv[]>([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/invitations').then(r => setInvs(r.data)).catch(e => setError(apiError(e)))
  }, [])

  const filtered = invs.filter(inv => {
    const q = search.toLowerCase()
    return !q || inv.content?.brideFirstName?.toLowerCase().includes(q) || inv.content?.groomFirstName?.toLowerCase().includes(q) || inv.owner?.email?.toLowerCase().includes(q) || inv.slug.includes(q)
  })

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9924A', marginBottom: 8 }}>Quản lý</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 34, color: '#1C1812' }}>
            Thiệp cưới <span style={{ fontSize: 20, color: '#9C8C7C', fontStyle: 'italic' }}>({filtered.length})</span>
          </h1>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email, slug..."
          style={{ padding: '8px 12px', border: '1px solid #E8DDD4', fontSize: 13, width: 240, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: '#2C2420' }}
        />
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={{ background: '#fff', border: '1px solid #EDE8E0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EDE8E0', background: '#FAF8F5' }}>
              {['Cô dâu & Chú rể', 'Template', 'Chủ sở hữu', 'Slug', 'Lượt xem', 'Trạng thái', 'Ngày tạo', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const tplKey = (inv.content?.template || 'bloom') as any
              const tpl = TEMPLATE_META[tplKey] || TEMPLATE_META.bloom
              return (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F0EDE8' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 500, color: '#1C1812' }}>
                      {inv.content?.brideFirstName} {inv.content?.brideLastName} &amp; {inv.content?.groomFirstName} {inv.content?.groomLastName}
                    </p>
                    <p style={{ fontSize: 11, color: '#9C8C7C', marginTop: 2 }}>{inv.content?.weddingDate ? new Date(inv.content.weddingDate).toLocaleDateString('vi-VN') : ''}</p>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 2 }}>{tpl.palette.map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />)}</div>
                      <span style={{ fontSize: 12, color: '#5C4C3C' }}>{tpl.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {inv.owner ? <p style={{ fontSize: 12, color: '#5C4C3C' }}>{inv.owner.displayName || inv.owner.email}</p> : <span style={{ color: '#CCC' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <code style={{ fontSize: 11, background: '#F5F2EE', padding: '2px 6px', color: '#5C4C3C' }}>{inv.slug}</code>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#9C8C7C' }}>{inv.viewCount}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', background: inv.published ? '#F0FAF0' : '#F5F5F5', color: inv.published ? '#2E7D32' : '#9C8C7C', border: `1px solid ${inv.published ? '#A5D6A7' : '#E8DDD4'}` }}>
                      {inv.published ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#9C8C7C', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <a href={`/invite/${inv.slug}`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: '#C9924A', textDecoration: 'none' }}>Xem →</a>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#9C8C7C', fontSize: 13 }}>
                {search ? 'Không tìm thấy thiệp phù hợp' : 'Chưa có thiệp nào'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
