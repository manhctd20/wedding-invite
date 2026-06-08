import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { apiError } from '../lib/api'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', displayName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.password, form.displayName)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E8DDD4', background: '#fff', fontSize: 14, color: '#2C2420', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 28, color: '#C4A882', textDecoration: 'none' }}>Thiệp Cưới</Link>
          <p style={{ fontSize: 14, color: '#9C8C7C', marginTop: 8 }}>Tạo tài khoản để bắt đầu</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={lbl}>Tên hiển thị</label><input required style={inp} value={form.displayName} onChange={set('displayName')} placeholder="Ngọc Linh & Minh Tuấn" /></div>
          <div><label style={lbl}>Email</label><input type="email" required style={inp} value={form.email} onChange={set('email')} placeholder="ten@email.com" /></div>
          <div><label style={lbl}>Mật khẩu (tối thiểu 6 ký tự)</label><input type="password" required minLength={6} style={inp} value={form.password} onChange={set('password')} placeholder="••••••" /></div>

          {error && <p style={{ fontSize: 13, color: '#c0392b', background: '#fdf2f0', padding: '10px 12px', borderLeft: '3px solid #c0392b' }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ padding: '12px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: loading ? 'wait' : 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.06em', opacity: loading ? 0.7 : 1, marginTop: 6 }}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký miễn phí'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9C8C7C' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#C4A882', textDecoration: 'none', fontWeight: 500 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
