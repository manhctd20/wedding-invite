import { useEffect, useState } from 'react'
import { api, apiError } from '../../lib/api'

interface User { id: string; email: string; displayName: string; role: string; isActive: boolean; createdAt: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => { load() }, [])
  async function load() {
    try { setUsers((await api.get('/admin/users')).data) } catch (e) { setError(apiError(e)) }
  }
  async function toggleActive(u: User) {
    setToggling(u.id)
    try { await api.patch(`/admin/users/${u.id}/active`, { isActive: !u.isActive }); await load() }
    catch (e) { alert(apiError(e)) }
    finally { setToggling(null) }
  }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9924A', marginBottom: 8 }}>Quản lý</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 34, color: '#1C1812' }}>Người dùng <span style={{ fontSize: 20, color: '#9C8C7C', fontStyle: 'italic' }}>({users.length})</span></h1>
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16 }}>{error}</p>}
      <div style={{ background: '#fff', border: '1px solid #EDE8E0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EDE8E0', background: '#FAF8F5' }}>
              {['Tên / Email', 'Vai trò', 'Ngày tạo', 'Trạng thái', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F0EDE8', opacity: u.isActive ? 1 : 0.5 }}>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: 500, color: '#1C1812', marginBottom: 2 }}>{u.displayName || '—'}</p>
                  <p style={{ fontSize: 12, color: '#9C8C7C' }}>{u.email}</p>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', background: u.role === 'admin' ? '#FFF8E8' : '#F5F2EE', color: u.role === 'admin' ? '#C9924A' : '#5C4C3C', border: `1px solid ${u.role === 'admin' ? '#F0D898' : '#E8DDD4'}` }}>
                    {u.role === 'admin' ? 'Admin' : 'Couple'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#9C8C7C', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', background: u.isActive ? '#F0FAF0' : '#FDF5F5', color: u.isActive ? '#2E7D32' : '#c0392b', border: `1px solid ${u.isActive ? '#A5D6A7' : '#FEDAD7'}` }}>
                    {u.isActive ? 'Hoạt động' : 'Đã khoá'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleActive(u)} disabled={toggling === u.id}
                      style={{ fontSize: 12, color: u.isActive ? '#c0392b' : '#2E7D32', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {toggling === u.id ? '...' : u.isActive ? 'Khoá' : 'Mở khoá'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
