import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { InvitationData } from '../types/invitation'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../store/auth'
import { getInvitationOwned, saveInvitation, recordToData, InvitationRecord } from '../store/invitationApi'
import { apiError } from '../lib/api'
import EditorSidebar from '../components/editor/EditorSidebar'
import ShareModal from '../components/ShareModal'
import { BloomTemplate, NoirTemplate, MinimalTemplate, VelvetTemplate, HeritageTemplate, GardenTemplate, CinematicTemplate } from '../templates'

function TemplateRenderer({ data }: { data: InvitationData }) {
  switch (data.template) {
    case 'bloom': return <BloomTemplate data={data} />
    case 'noir': return <NoirTemplate data={data} />
    case 'minimal': return <MinimalTemplate data={data} />
    case 'velvet': return <VelvetTemplate data={data} />
    case 'heritage': return <HeritageTemplate data={data} />
    case 'garden': return <GardenTemplate data={data} />
    case 'cinematic': return <CinematicTemplate data={data} />
  }
}

type MobileTab = 'edit' | 'preview'

function Spinner() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7' }}>
      <div style={{ width: 24, height: 24, border: '2px solid #E8DDD4', borderTopColor: '#C4A882', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const m = useIsMobile()

  const [record, setRecord] = useState<InvitationRecord | null>(null)
  const [data, setData] = useState<InvitationData | null>(null)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [showShare, setShowShare] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit')
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (!id) return
    getInvitationOwned(id)
      .then(rec => {
        setRecord(rec)
        setData(recordToData(rec))
      })
      .catch(e => setError(apiError(e)))
  }, [id])

  const handleChange = useCallback((patch: Partial<InvitationData>) => {
    setData(prev => { if (!prev) return prev; return { ...prev, ...patch } })
    setSaveState('unsaved')
  }, [])

  // Auto-save debounced — deps: data + record only
  // Root cause of "stuck saving": setSaveState('saving') inside effect body
  // triggers re-render → cleanup cancels timer before it fires.
  // Fix: only set 'saving' inside the async callback (after debounce), never before.
  useEffect(() => {
    if (!data || !record) return
    if (saveState === 'saved') return   // nothing pending

    const t = setTimeout(async () => {
      setSaveState('saving')
      try {
        const updated = await saveInvitation(record.id, data)
        setRecord(updated)
        setSaveState('saved')
      } catch {
        setSaveState('unsaved')
      }
    }, 900)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, record]) // intentionally omit saveState — including it cancels the timer

  if (error) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7', fontFamily: "'DM Sans', sans-serif", padding: 24, textAlign: 'center' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: '#2C2420', marginBottom: 10 }}>Không thể mở thiệp</p>
      <p style={{ fontSize: 14, color: '#9C8C7C', marginBottom: 28 }}>{error}</p>
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 24px', background: '#2C2420', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontSize: 13 }}>Quay lại</button>
    </div>
  )

  if (!data || !record) return <Spinner />

  async function handleTogglePublished() {
    if (!data || !record || publishing) return
    setPublishing(true)
    try {
      const updated = await saveInvitation(record.id, data, !record.published)
      setRecord(updated)
    } finally {
      setPublishing(false)
    }
  }

  const origin = window.location.origin
  const inviteUrl = `${origin}/invite/${record.slug}`
  const editUrl = `${origin}/editor/${record.id}`

  const TopBar = ({ children }: { children?: React.ReactNode }) => (
    <header style={{ height: 52, borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#FAFAF7', flexShrink: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C7C', fontFamily: "'DM Sans', sans-serif", fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Dashboard
        </button>
        {!m && (
          <>
            <div style={{ width: 1, height: 16, background: '#E8DDD4' }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, color: '#2C2420' }}>
              {data.brideFirstName} &amp; {data.groomFirstName}
            </span>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: saveState === 'saved' ? '#C4A882' : '#9C8C7C' }}>
          {saveState === 'saved' ? 'Đã lưu' : saveState === 'saving' ? 'Đang lưu...' : '●'}
        </span>
        {children}
        <button
          onClick={handleTogglePublished}
          disabled={publishing}
          style={{
            padding: '5px 12px',
            border: `1px solid ${record.published ? '#A5D6A7' : '#E8DDD4'}`,
            background: record.published ? '#F0FAF0' : 'transparent',
            color: record.published ? '#2E7D32' : '#9C8C7C',
            cursor: publishing ? 'wait' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            opacity: publishing ? 0.6 : 1,
            transition: 'all 0.15s',
          }}
        >
          {publishing ? '...' : record.published ? 'Đã đăng' : 'Đăng thiệp'}
        </button>
        <button onClick={() => setShowShare(true)} style={{ padding: '6px 14px', background: '#C4A882', color: '#FAFAF7', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>
          Chia sẻ
        </button>
      </div>
    </header>
  )

  if (m) return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#FAFAF7', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ display: 'flex', borderBottom: '1px solid #E8DDD4', background: '#FAFAF7', flexShrink: 0 }}>
        {(['edit', 'preview'] as MobileTab[]).map(tab => (
          <button key={tab} onClick={() => setMobileTab(tab)} style={{ flex: 1, height: 40, border: 'none', cursor: 'pointer', background: mobileTab === tab ? '#2C2420' : 'transparent', color: mobileTab === tab ? '#FAFAF7' : '#9C8C7C', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {tab === 'edit' ? 'Chỉnh sửa' : 'Xem trước'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mobileTab === 'edit'
          ? <div style={{ height: '100%', overflowY: 'auto' }}><EditorSidebar data={data} onChange={handleChange} /></div>
          : <div style={{ height: '100%', overflowY: 'auto', background: '#EDE5DC' }}><div style={{ background: '#FAFAF7' }}><TemplateRenderer data={data} /></div></div>
        }
      </div>
      {showShare && <ShareModal inviteUrl={inviteUrl} editUrl={editUrl} onClose={() => setShowShare(false)} />}
    </div>
  )

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#FAFAF7', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <aside style={{ width: 320, flexShrink: 0, borderRight: '1px solid #E8DDD4', overflow: 'hidden' }}>
          <EditorSidebar data={data} onChange={handleChange} />
        </aside>
        <main style={{ flex: 1, overflow: 'auto', background: '#EDE5DC' }}>
          <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900, background: '#FAFAF7', boxShadow: '0 4px 40px rgba(44,36,32,0.12)' }}>
              <TemplateRenderer data={data} />
            </div>
          </div>
        </main>
      </div>
      {showShare && <ShareModal inviteUrl={inviteUrl} editUrl={editUrl} onClose={() => setShowShare(false)} />}
    </div>
  )
}
