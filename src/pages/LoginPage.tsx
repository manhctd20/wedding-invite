import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { apiError } from '../lib/api'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      navigate(u.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 28, color: '#C4A882', textDecoration: 'none' }}>Thiệp Cưới</Link>
          <p style={{ fontSize: 14, color: '#9C8C7C', marginTop: 8 }}>Đăng nhập để quản lý thiệp cưới</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 6 }}>Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8DDD4', background: '#fff', fontSize: 14, color: '#2C2420', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }}
              placeholder="ten@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 6 }}>Mật khẩu</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8DDD4', background: '#fff', fontSize: 14, color: '#2C2420', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }}
              placeholder="••••••"
            />
          </div>

          {error && <p style={{ fontSize: 13, color: '#c0392b', background: '#fdf2f0', padding: '10px 12px', borderLeft: '3px solid #c0392b' }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{ padding: '12px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: loading ? 'wait' : 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.06em', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9C8C7C' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#C4A882', textDecoration: 'none', fontWeight: 500 }}>Đăng ký miễn phí</Link>
        </p>
      </div>
    </div>
  )
}
