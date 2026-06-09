import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { InvitationData } from '../types/invitation'
import { getPublicInvitation, recordToData } from '../store/invitationApi'
import { BloomTemplate, NoirTemplate, MinimalTemplate, VelvetTemplate, HeritageTemplate, GardenTemplate, CinematicTemplate } from '../templates'
import HeartLoader from '../components/effects/HeartLoader'
import MusicToggle from '../components/mobile/MusicToggle'
import LiveCommentTicker from '../components/mobile/LiveCommentTicker'
import StickyToolbar from '../components/mobile/StickyToolbar'
import { THEMES } from '../types/invitation'

function TemplateRenderer({ data, guestName }: { data: InvitationData; guestName?: string }) {
  switch (data.template) {
    case 'bloom': return <BloomTemplate data={data} guestName={guestName} />
    case 'noir': return <NoirTemplate data={data} guestName={guestName} />
    case 'minimal': return <MinimalTemplate data={data} guestName={guestName} />
    case 'velvet': return <VelvetTemplate data={data} guestName={guestName} />
    case 'heritage': return <HeritageTemplate data={data} guestName={guestName} />
    case 'garden': return <GardenTemplate data={data} guestName={guestName} />
    case 'cinematic': return <CinematicTemplate data={data} guestName={guestName} />
  }
}

export default function InvitePage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const guestName = searchParams.get('guest') ?? undefined
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
      <TemplateRenderer data={data} guestName={guestName} />

      {data.musicUrl && (
        <MusicToggle url={data.musicUrl} title={data.musicTitle} accentColor={accentColor} />
      )}

      {(data.showLiveTicker ?? true) && slug && (
        <LiveCommentTicker slug={slug} theme={theme} />
      )}

      {(data.showStickyToolbar ?? true) && slug && (
        <StickyToolbar
          slug={slug}
          initialCount={data.reactionCount ?? 0}
          allowReactions={data.allowReactions ?? true}
          theme={theme}
        />
      )}
    </>
  )
}
