import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiError } from '../../lib/api'

interface Stats { userCount: number; invCount: number; publishedCount: number; templateCount: number }

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EDE8E0', padding: '28px 24px' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 12 }}>{label}</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: '#9C8C7C', marginTop: 8 }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(e => setError(apiError(e)))
  }, [])

  return (
    <div style={{ padding: '40px 40px' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9924A', marginBottom: 8 }}>Tổng quan</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 36, color: '#1C1812' }}>Dashboard</h1>
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 24 }}>{error}</p>}

      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          <StatCard label="Người dùng" value={stats.userCount} color="#1C1812" />
          <StatCard label="Thiệp cưới" value={stats.invCount} sub={`${stats.publishedCount} đã đăng`} color="#C9924A" />
          <StatCard label="Templates" value={stats.templateCount} color="#1C1812" />
          <StatCard label="Đã publish" value={stats.publishedCount} color="#2E7D32" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 120, background: '#F0EDE8', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { to: '/admin/templates', title: 'Quản lý Templates', desc: 'Thêm, sửa, bật/tắt các mẫu thiệp. Đặt premium, thứ tự hiển thị.', icon: '❖' },
          { to: '/admin/users', title: 'Quản lý Users', desc: 'Xem danh sách người dùng, khoá/mở tài khoản.', icon: '◉' },
          { to: '/admin/invitations', title: 'Tất cả thiệp', desc: 'Xem toàn bộ thiệp cưới đã tạo trong hệ thống.', icon: '◈' },
        ].map(item => (
          <Link key={item.to} to={item.to} style={{ background: '#fff', border: '1px solid #EDE8E0', padding: '24px', textDecoration: 'none', display: 'block', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9924A')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDE8E0')}
          >
            <span style={{ fontSize: 20, display: 'block', marginBottom: 12 }}>{item.icon}</span>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#1C1812', marginBottom: 6 }}>{item.title}</p>
            <p style={{ fontSize: 12, color: '#9C8C7C', lineHeight: 1.6 }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}
