import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InvitationData } from '../types/invitation'
import { getPublicInvitation, recordToData } from '../store/invitationApi'
import { BloomTemplate, NoirTemplate, MinimalTemplate, VelvetTemplate } from '../templates'
import HeartLoader from '../components/effects/HeartLoader'
import MusicToggle from '../components/mobile/MusicToggle'
import LiveCommentTicker from '../components/mobile/LiveCommentTicker'
import StickyToolbar from '../components/mobile/StickyToolbar'
import { THEMES } from '../types/invitation'

function TemplateRenderer({ data }: { data: InvitationData }) {
  switch (data.template) {
    case 'bloom': return <BloomTemplate data={data} />
    case 'noir': return <NoirTemplate data={data} />
    case 'minimal': return <MinimalTemplate data={data} />
    case 'velvet': return <VelvetTemplate data={data} />
  }
}

export default function InvitePage() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<InvitationData | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); return }
    getPublicInvitation(slug)
      .then(rec => setData(recordToData(rec)))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAF7', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 32, color: '#C4A882', marginBottom: 12 }}>Thiệp không tồn tại</p>
      <p style={{ fontSize: 14, color: '#9C8C7C' }}>Link này không hợp lệ hoặc đã bị xóa.</p>
    </div>
  )

  if (!data) return <HeartLoader />

  const theme = THEMES[data.template]
  const accentColor = data.accentColor || theme.accent

  return (
    <>
      <TemplateRenderer data={data} />

      {data.musicUrl && (
        <MusicToggle url={data.musicUrl} title={data.musicTitle} accentColor={accentColor} />
      )}

      {(data.showLiveTicker ?? true) && slug && (
        <LiveCommentTicker slug={slug} accentColor={accentColor} />
      )}

      {(data.showStickyToolbar ?? true) && slug && (
        <StickyToolbar
          slug={slug}
          initialCount={data.reactionCount ?? 0}
          allowReactions={data.allowReactions ?? true}
          accentColor={accentColor}
        />
      )}
    </>
  )
}
