import { api } from '../lib/api'
import { InvitationData, createDefaultInvitation } from '../types/invitation'

// The backend stores everything in a `content` jsonb blob + meta fields
// (id, slug, published, viewCount). We flatten that into InvitationData for
// the templates/editor, which only care about content + id.

export interface InvitationRecord {
  id: string
  slug: string
  published: boolean
  viewCount: number
  content: Omit<InvitationData, 'id' | 'editKey'>
  createdAt: string
  updatedAt: string
}

// Convert API record → InvitationData used by templates
// Merge defaults for fields added after invitation was created (migration)
export function recordToData(rec: InvitationRecord): InvitationData {
  return {
    effectType: 'petals',
    effectIntensity: 'medium',
    showGuestbook: true,
    showFamily: true,
    showBank: true,
    showCoupleProfile: true,
    coupleNameFont: 'serif',
    showStickyToolbar: true,
    showLiveTicker: true,
    allowReactions: true,
    bankAccounts: [],
    groomFather: '',
    groomMother: '',
    brideFather: '',
    brideMother: '',
    brideBio: '',
    groomBio: '',
    brideImage: null,
    groomImage: null,
    reactionCount: (rec as any).reactionCount ?? 0,
    ...(rec.content as any),
    id: rec.slug,
    editKey: rec.id,
  }
}

function dataToContent(data: InvitationData) {
  const { id, editKey, ...content } = data
  return content
}

export async function createInvitation(): Promise<InvitationRecord> {
  const def = createDefaultInvitation('tmp', 'tmp')
  const res = await api.post('/invitations', { content: dataToContent(def) })
  return res.data
}

export async function getMyInvitations(): Promise<InvitationRecord[]> {
  const res = await api.get('/invitations/mine')
  return res.data
}

export async function getInvitationOwned(id: string): Promise<InvitationRecord> {
  const res = await api.get(`/invitations/${id}`)
  return res.data
}

export async function saveInvitation(id: string, data: InvitationData, published?: boolean): Promise<InvitationRecord> {
  const res = await api.put(`/invitations/${id}`, { content: dataToContent(data), published })
  return res.data
}

export async function deleteInvitation(id: string): Promise<void> {
  await api.delete(`/invitations/${id}`)
}

// Public view by slug
export async function getPublicInvitation(slug: string): Promise<InvitationRecord> {
  const res = await api.get(`/public/invitations/${slug}`)
  return res.data
}

// Guestbook
export async function listGuestbook(slug: string) {
  const res = await api.get(`/public/invitations/${slug}/guestbook`)
  return res.data
}
export async function addGuestbook(slug: string, guestName: string, message: string) {
  const res = await api.post(`/public/invitations/${slug}/guestbook`, { guestName, message })
  return res.data
}

// Reactions
export async function sendReaction(slug: string): Promise<{ count: number }> {
  const res = await api.post(`/public/invitations/${slug}/reactions`)
  return res.data
}

// RSVP
export async function submitRsvp(slug: string, payload: { guestName: string; status: 'yes' | 'no' | 'maybe'; guestCount?: number; note?: string }) {
  const res = await api.post(`/public/invitations/${slug}/rsvp`, payload)
  return res.data
}
export async function listRsvps(id: string) {
  const res = await api.get(`/invitations/${id}/rsvps`)
  return res.data
}
