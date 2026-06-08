import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/auth'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◎', end: true },
  { to: '/admin/templates', label: 'Templates', icon: '❖', end: false },
  { to: '/admin/users', label: 'Người dùng', icon: '◉', end: false },
  { to: '/admin/invitations', label: 'Thiệp cưới', icon: '◈', end: false },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/') }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', fontFamily: "'DM Sans', sans-serif", background: '#F7F4F0' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1C1812', color: '#F0E8DC', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100dvh' }}>
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(240,232,220,0.08)' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: '#C9924A' }}>Thiệp Cưới</p>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,232,220,0.35)', marginTop: 4 }}>Admin Panel</p>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 24px', textDecoration: 'none',
                fontSize: 13, fontWeight: 400,
                color: isActive ? '#F0E8DC' : 'rgba(240,232,220,0.45)',
                background: isActive ? 'rgba(201,146,74,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #C9924A' : '2px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(240,232,220,0.08)' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,232,220,0.5)', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          <button
            onClick={handleLogout}
            style={{ fontSize: 12, color: 'rgba(240,232,220,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
