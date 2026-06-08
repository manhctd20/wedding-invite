import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { api, setToken, clearToken, getToken } from '../lib/api'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'couple'
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (email: string, password: string, displayName: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session
  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.accessToken)
    setUser(res.data.user)
    return res.data.user as AuthUser
  }, [])

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const res = await api.post('/auth/register', { email, password, displayName })
    setToken(res.data.accessToken)
    setUser(res.data.user)
    return res.data.user as AuthUser
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
