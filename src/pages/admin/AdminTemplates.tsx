import { useEffect, useState, useRef } from 'react'
import { api, apiError } from '../../lib/api'

interface TemplateTheme {
  bg: string
  text: string
  accent: string
  muted: string
  border: string
  soft: string
  isDark: boolean
}

interface Tpl {
  id: string
  slug: string
  label: string
  description: string
  palette: string[]
  theme: TemplateTheme | null
  isPremium: boolean
  isActive: boolean
  sortOrder: number
  usageCount: number
}

type EditState = Partial<Tpl> & { _isNew?: boolean }

// ─── Helpers ──────────────────────────────────────────────────

const DEFAULT_THEME: TemplateTheme = {
  bg: '#FAFAF7', text: '#2C2420', accent: '#C4A882',
  muted: '#9C8C7C', border: '#E8DDD4', soft: '#F5EDE4', isDark: false,
}

function isValidHex(v: string) { return /^#[0-9A-Fa-f]{6}$/.test(v) }

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: 36, height: 20, borderRadius: 10, background: checked ? '#C9924A' : '#D0C8C0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

// Color swatch + hex input combo
function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [raw, setRaw] = useState(value)
  useEffect(() => setRaw(value), [value])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9C8C7C', fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0, border: '1px solid #E8DDD4', cursor: 'pointer', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: isValidHex(value) ? value : '#ccc' }} />
          <input
            type="color"
            value={isValidHex(value) ? value : '#cccccc'}
            onChange={e => { setRaw(e.target.value); onChange(e.target.value) }}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />
        </div>
        <input
          value={raw}
          onChange={e => { setRaw(e.target.value); if (isValidHex(e.target.value)) onChange(e.target.value) }}
          onBlur={() => { if (!isValidHex(raw)) setRaw(value) }}
          maxLength={7}
          style={{ flex: 1, padding: '6px 8px', border: '1px solid #E8DDD4', background: '#fff', fontSize: 12, color: '#2C2420', outline: 'none', fontFamily: "'DM Mono', monospace", boxSizing: 'border-box' }}
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  )
}

// Mini invite preview card
function TemplatePreview({ tpl }: { tpl: Partial<Tpl> }) {
  const theme = tpl.theme || DEFAULT_THEME
  const palette = tpl.palette || [theme.bg, theme.accent, theme.text]

  return (
    <div style={{ border: `1px solid ${theme.border || '#E8DDD4'}`, overflow: 'hidden', background: theme.bg }}>
      {/* Cover area */}
      <div style={{ height: 80, background: `linear-gradient(135deg, ${palette[0] || theme.bg}, ${palette[1] || theme.accent})`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: theme.isDark ? theme.text : palette[2] || theme.text, lineHeight: 1.2, textAlign: 'center' }}>
            Ngọc Linh &amp; Minh Tuấn
          </p>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '14px 16px', background: theme.soft || theme.bg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: theme.text }}>{tpl.label || 'Template'}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: theme.muted || '#888', marginTop: 2 }}>{tpl.description || ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {palette.map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
            ))}
          </div>
        </div>

        {/* Simulated sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Ngày 20 / 12 / 2026', 'Grand Palace Ballroom', 'RSVP: 0912 345 678'].map((line, i) => (
            <div key={i} style={{ height: 8, background: i === 0 ? theme.accent : theme.border || '#E8DDD4', width: `${70 - i * 12}%`, opacity: i === 0 ? 0.8 : 0.5 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #E8DDD4',
  background: '#fff', fontSize: 13, color: '#2C2420', outline: 'none',
  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Tpl[]>([])
  const [editing, setEditing] = useState<EditState | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'theme' | 'palette' | 'ai'>('basic')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setTemplates((await api.get('/admin/templates')).data) }
    catch (e) { setError(apiError(e)) }
  }

  function openNew() {
    setEditing({
      _isNew: true, isPremium: false, isActive: true, sortOrder: templates.length + 1,
      palette: ['#FAFAF7', '#C4A882', '#2C2420'],
      theme: { ...DEFAULT_THEME },
    })
    setActiveTab('basic')
  }

  function openEdit(t: Tpl) {
    setEditing({
      ...t,
      palette: t.palette?.length ? t.palette : ['#FAFAF7', '#C4A882', '#2C2420'],
      theme: t.theme || { ...DEFAULT_THEME },
    })
    setActiveTab('basic')
  }

  function patchEdit(patch: Partial<EditState>) {
    setEditing(prev => prev ? { ...prev, ...patch } : prev)
  }

  function patchTheme(patch: Partial<TemplateTheme>) {
    setEditing(prev => prev ? { ...prev, theme: { ...(prev.theme || DEFAULT_THEME), ...patch } } : prev)
  }

  function setPaletteColor(idx: number, color: string) {
    setEditing(prev => {
      if (!prev) return prev
      const p = [...(prev.palette || ['#fff', '#ccc', '#000'])]
      p[idx] = color
      return { ...prev, palette: p }
    })
  }

  async function save() {
    if (!editing) return
    setSaving(true); setError('')
    try {
      const payload = {
        slug: editing.slug,
        label: editing.label,
        description: editing.description || '',
        palette: editing.palette || [],
        theme: editing.theme || null,
        isPremium: editing.isPremium ?? false,
        isActive: editing.isActive ?? true,
        sortOrder: editing.sortOrder ?? 0,
      }
      if (editing._isNew) {
        await api.post('/admin/templates', payload)
      } else {
        await api.put(`/admin/templates/${editing.id}`, payload)
      }
      await load(); setEditing(null)
    } catch (e) { setError(apiError(e)) }
    finally { setSaving(false) }
  }

  async function toggleField(t: Tpl, field: 'isActive' | 'isPremium') {
    try {
      await api.put(`/admin/templates/${t.id}`, { [field]: !t[field] })
      await load()
    } catch (e) { alert(apiError(e)) }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Xoá template "${label}"?`)) return
    try { await api.delete(`/admin/templates/${id}`); await load() }
    catch (e) { alert(apiError(e)) }
  }

  async function generateAiTheme() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      // TODO: gọi /api/admin/ai/generate-theme khi có endpoint
      // Tạm thời mock một theme dựa trên từ khoá
      await new Promise(r => setTimeout(r, 1200))
      const keywords = aiPrompt.toLowerCase()
      let mockTheme: TemplateTheme
      if (keywords.includes('tối') || keywords.includes('dark') || keywords.includes('đêm')) {
        mockTheme = { bg: '#0D0D0D', text: '#F0EAE0', accent: '#D4A843', muted: '#7A7060', border: '#1A1A1A', soft: '#141414', isDark: true }
      } else if (keywords.includes('xanh') || keywords.includes('thiên nhiên') || keywords.includes('forest')) {
        mockTheme = { bg: '#F4F8F4', text: '#1A2E1A', accent: '#4A8C4A', muted: '#6B8C6B', border: '#D4E8D4', soft: '#E8F4E8', isDark: false }
      } else if (keywords.includes('hồng') || keywords.includes('pink') || keywords.includes('romantic')) {
        mockTheme = { bg: '#FFF8F8', text: '#2E1A1A', accent: '#C4607A', muted: '#9C7A80', border: '#F0D8DC', soft: '#FCF0F0', isDark: false }
      } else if (keywords.includes('tím') || keywords.includes('purple') || keywords.includes('lavender')) {
        mockTheme = { bg: '#FAF8FF', text: '#1E1A2E', accent: '#8B5CF6', muted: '#7C70A0', border: '#E0D8F0', soft: '#F4F0FF', isDark: false }
      } else {
        mockTheme = { bg: '#FAFAF7', text: '#2C2420', accent: '#C4A882', muted: '#9C8C7C', border: '#E8DDD4', soft: '#F5EDE4', isDark: false }
      }
      patchTheme(mockTheme)
      patchEdit({ palette: [mockTheme.bg, mockTheme.accent, mockTheme.text] })
      setAiPrompt('')
    } catch (e) { alert('AI generate thất bại') }
    finally { setAiLoading(false) }
  }

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: active ? 500 : 400,
    background: active ? '#1C1812' : 'transparent',
    color: active ? '#F0E8DC' : '#9C8C7C',
    borderBottom: active ? 'none' : '1px solid #EDE8E0',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ padding: 40, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9924A', marginBottom: 8 }}>Quản lý</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 34, color: '#1C1812' }}>Templates</h1>
        </div>
        <button onClick={openNew} style={{ padding: '9px 20px', background: '#1C1812', color: '#F0E8DC', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          + Thêm template
        </button>
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {/* Template cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        {templates.map(t => (
          <div key={t.id} style={{ background: '#fff', border: '1px solid #EDE8E0', overflow: 'hidden', opacity: t.isActive ? 1 : 0.55 }}>

            {/* Preview */}
            <TemplatePreview tpl={t} />

            {/* Footer */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid #EDE8E0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {t.isPremium && (
                    <span style={{ fontSize: 10, padding: '2px 7px', background: '#FFF8E8', color: '#C9924A', border: '1px solid #F0D898', letterSpacing: '0.1em' }}>PREMIUM</span>
                  )}
                  {!t.isActive && (
                    <span style={{ fontSize: 10, padding: '2px 7px', background: '#F5F5F5', color: '#9C8C7C', border: '1px solid #E8DDD4', letterSpacing: '0.1em' }}>ẨN</span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: '#9C8C7C' }}>dùng: {t.usageCount}</span>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(t)} style={{ flex: 2, padding: '7px', background: '#1C1812', color: '#F0E8DC', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                  Chỉnh sửa
                </button>
                <button onClick={() => toggleField(t, 'isActive')} style={{ flex: 1, padding: '7px', border: '1px solid #EDE8E0', background: 'none', cursor: 'pointer', fontSize: 11, color: '#5C4C3C' }}>
                  {t.isActive ? 'Ẩn' : 'Hiện'}
                </button>
                <button onClick={() => toggleField(t, 'isPremium')} style={{ flex: 1, padding: '7px', border: '1px solid #EDE8E0', background: 'none', cursor: 'pointer', fontSize: 11, color: '#5C4C3C' }}>
                  {t.isPremium ? 'Free' : 'Pro'}
                </button>
                <button onClick={() => remove(t.id, t.label)} style={{ padding: '7px 10px', border: '1px solid #FEDAD7', color: '#c0392b', background: 'none', cursor: 'pointer', fontSize: 12 }}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,24,18,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}
        >
          <div style={{ background: '#FAF8F5', width: '100%', maxWidth: 860, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #EDE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#1C1812', fontWeight: 400 }}>
                {editing._isNew ? 'Thêm template mới' : `Chỉnh sửa: ${editing.label}`}
              </h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9C8C7C', lineHeight: 1 }}>✕</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EDE8E0', background: '#fff' }}>
              {([
                { key: 'basic', label: 'Thông tin chung' },
                { key: 'theme', label: 'Theme màu sắc' },
                { key: 'palette', label: 'Bảng màu' },
                { key: 'ai', label: '✨ AI Generate' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={TAB_STYLE(activeTab === tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', flex: 1, overflow: 'hidden' }}>

              {/* Form */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Tab: Basic */}
                {activeTab === 'basic' && (
                  <>
                    {editing._isNew && (
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: '#9C8C7C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>
                          Slug <span style={{ color: '#c0392b' }}>*</span>
                          <span style={{ color: '#BBB', marginLeft: 8, letterSpacing: 0, textTransform: 'none' }}>(phải khớp với TemplateId trong code)</span>
                        </label>
                        <input style={inp} value={editing.slug || ''} onChange={e => patchEdit({ slug: e.target.value })} placeholder="bloom / noir / my-new-template" />
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: '#9C8C7C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>Tên hiển thị <span style={{ color: '#c0392b' }}>*</span></label>
                      <input style={inp} value={editing.label || ''} onChange={e => patchEdit({ label: e.target.value })} placeholder="Bloom" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: '#9C8C7C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>Mô tả ngắn</label>
                      <input style={inp} value={editing.description || ''} onChange={e => patchEdit({ description: e.target.value })} placeholder="Lãng mạn, tinh tế — tông kem và hồng nhẹ" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: '#9C8C7C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>Thứ tự hiển thị</label>
                        <input type="number" style={inp} value={editing.sortOrder ?? 0} onChange={e => patchEdit({ sortOrder: +e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 24, paddingTop: 4 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1C1812' }}>
                        <Toggle checked={!!editing.isPremium} onChange={v => patchEdit({ isPremium: v })} /> Premium
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1C1812' }}>
                        <Toggle checked={editing.isActive !== false} onChange={v => patchEdit({ isActive: v })} /> Hiển thị công khai
                      </label>
                    </div>
                  </>
                )}

                {/* Tab: Theme */}
                {activeTab === 'theme' && (
                  <>
                    <p style={{ fontSize: 12, color: '#9C8C7C', lineHeight: 1.6, padding: '10px 14px', background: '#F5F2EE', borderLeft: '3px solid #C9924A' }}>
                      Theme xác định màu sắc chi tiết của template khi render. Thay đổi ở đây sẽ ảnh hưởng cách section components (Countdown, OurStory, ...) render màu sắc.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {([
                        ['bg', 'Background chính'],
                        ['text', 'Text chính'],
                        ['accent', 'Accent (nhấn)'],
                        ['muted', 'Text phụ'],
                        ['border', 'Đường viền'],
                        ['soft', 'Background nhẹ'],
                      ] as [keyof TemplateTheme, string][]).map(([key, label]) => (
                        <ColorInput
                          key={key}
                          label={label}
                          value={(editing.theme as any)?.[key] || '#cccccc'}
                          onChange={v => patchTheme({ [key]: v })}
                        />
                      ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1C1812', paddingTop: 4 }}>
                      <Toggle checked={!!editing.theme?.isDark} onChange={v => patchTheme({ isDark: v })} />
                      Dark mode (text sáng trên nền tối)
                    </label>
                  </>
                )}

                {/* Tab: Palette */}
                {activeTab === 'palette' && (
                  <>
                    <p style={{ fontSize: 12, color: '#9C8C7C', lineHeight: 1.6, padding: '10px 14px', background: '#F5F2EE', borderLeft: '3px solid #C9924A' }}>
                      Palette là 3 màu đại diện hiển thị trên landing page và dashboard. Thường là: nền, accent, và text chính.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {['Màu nền (background)', 'Màu nhấn (accent)', 'Màu chữ (text)'].map((label, i) => (
                        <ColorInput
                          key={i}
                          label={`Màu ${i + 1}: ${label}`}
                          value={(editing.palette || [])[i] || '#cccccc'}
                          onChange={v => setPaletteColor(i, v)}
                        />
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontSize: 10, color: '#9C8C7C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Preview palette</p>
                      <div style={{ display: 'flex', gap: 0, height: 48, border: '1px solid #EDE8E0', overflow: 'hidden' }}>
                        {(editing.palette || []).map((c, i) => (
                          <div key={i} style={{ flex: 1, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: i === 2 ? '#fff' : '#000', opacity: 0.6, mixBlendMode: 'difference' }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#9C8C7C', marginTop: 4 }}>
                      💡 Tip: Nhấn vào ô màu để mở color picker, hoặc gõ mã hex trực tiếp.
                    </p>
                  </>
                )}

                {/* Tab: AI */}
                {activeTab === 'ai' && (
                  <>
                    <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #1C1812, #2E2418)', borderRadius: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: '#C9924A', marginBottom: 6 }}>AI Theme Generator</p>
                      <p style={{ fontSize: 12, color: 'rgba(240,232,220,0.6)', lineHeight: 1.6 }}>
                        Mô tả phong cách bạn muốn, AI sẽ tự động tạo bộ màu sắc phù hợp.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: '#9C8C7C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Mô tả phong cách</label>
                      <textarea
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder={`Ví dụ:\n- "Tối giản, sang trọng, tông đen vàng"\n- "Lãng mạn mùa hè, hồng và cam nhẹ"\n- "Thiên nhiên, xanh lá, tươi sáng"\n- "Huyền bí, tím đêm, ánh bạc"`}
                        style={{ ...inp, minHeight: 120, resize: 'vertical', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}
                      />
                    </div>

                    <button
                      onClick={generateAiTheme}
                      disabled={aiLoading || !aiPrompt.trim()}
                      style={{
                        padding: '12px 24px', background: aiLoading ? '#9C8C7C' : '#1C1812',
                        color: '#F0E8DC', border: 'none', cursor: aiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                        fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 8,
                        opacity: !aiPrompt.trim() ? 0.5 : 1,
                      }}
                    >
                      {aiLoading ? (
                        <>
                          <div style={{ width: 14, height: 14, border: '2px solid rgba(240,232,220,0.3)', borderTopColor: '#F0E8DC', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Đang tạo theme...
                        </>
                      ) : '✨ Generate Theme'}
                    </button>

                    {editing.theme && (
                      <div style={{ padding: '12px 14px', background: '#F0FAF0', border: '1px solid #A5D6A7', fontSize: 12, color: '#2E7D32' }}>
                        ✓ Theme đã được tạo — xem kết quả ở tab "Theme màu sắc" và "Preview" bên phải.
                      </div>
                    )}

                    <div style={{ padding: '12px 14px', background: '#FFF8E8', border: '1px solid #F0D898', fontSize: 12, color: '#8B6914' }}>
                      <strong>Lưu ý:</strong> Hiện đang dùng mock AI. Để tích hợp AI thật, implement endpoint{' '}
                      <code style={{ fontFamily: "'DM Mono', monospace", background: 'rgba(0,0,0,0.05)', padding: '1px 4px' }}>POST /api/admin/ai/generate-theme</code>{' '}
                      nhận prompt → gọi Claude/OpenAI → trả về TemplateTheme object.
                    </div>
                  </>
                )}

                {error && <p style={{ fontSize: 12, color: '#c0392b', padding: '8px 12px', background: '#fdf2f0', borderLeft: '3px solid #c0392b' }}>{error}</p>}
              </div>

              {/* Live preview panel */}
              <div style={{ borderLeft: '1px solid #EDE8E0', padding: '24px 20px', overflowY: 'auto', background: '#F7F4F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8C7C' }}>Preview trực tiếp</p>
                <TemplatePreview tpl={editing} />

                {/* Theme color chips */}
                {editing.theme && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(Object.entries(editing.theme) as [string, any][])
                      .filter(([k]) => k !== 'isDark')
                      .map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 20, height: 20, background: val, border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C8C7C' }}>{key}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#5C4C3C', marginLeft: 'auto' }}>{val}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid #EDE8E0', display: 'flex', gap: 10, justifyContent: 'flex-end', background: '#fff' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '9px 20px', border: '1px solid #E8DDD4', background: 'none', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                Huỷ
              </button>
              <button
                onClick={save} disabled={saving}
                style={{ padding: '9px 24px', background: saving ? '#9C8C7C' : '#1C1812', color: '#F0E8DC', border: 'none', cursor: saving ? 'wait' : 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                {saving ? 'Đang lưu...' : 'Lưu template'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
