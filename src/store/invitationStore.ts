import { InvitationData, createDefaultInvitation } from '../types/invitation'

const PREFIX = 'wi_'
const INDEX_KEY = 'wi_index'

interface IndexEntry {
  id: string
  brideName: string
  groomName: string
  createdAt: string
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function createInvitation(): InvitationData {
  const id = randomId()
  const editKey = randomId() + randomId()
  const data = createDefaultInvitation(id, editKey)
  saveInvitation(data)
  return data
}

export function saveInvitation(data: InvitationData): void {
  const updated = { ...data, updatedAt: new Date().toISOString() }
  localStorage.setItem(PREFIX + data.id, JSON.stringify(updated))

  const index: IndexEntry[] = getIndex()
  const exists = index.findIndex(e => e.id === data.id)
  const entry: IndexEntry = {
    id: data.id,
    brideName: `${data.brideFirstName} ${data.brideLastName}`,
    groomName: `${data.groomFirstName} ${data.groomLastName}`,
    createdAt: data.createdAt,
  }
  if (exists >= 0) {
    index[exists] = entry
  } else {
    index.push(entry)
  }
  localStorage.setItem(INDEX_KEY, JSON.stringify(index))
}

export function getInvitation(id: string): InvitationData | null {
  const raw = localStorage.getItem(PREFIX + id)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as InvitationData
    // Migrate old invitations missing new fields
    return {
      storyMilestones: [],
      weddingParty: [],
      scheduleEvents: [],
      showCountdown: true,
      showStory: true,
      showParty: true,
      showSchedule: true,
      showGallery: true,
      showRsvp: true,
      ...parsed,
    }
  } catch {
    return null
  }
}

export function getIndex(): IndexEntry[] {
  const raw = localStorage.getItem(INDEX_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as IndexEntry[]
  } catch {
    return []
  }
}

export function deleteInvitation(id: string): void {
  localStorage.removeItem(PREFIX + id)
  const index = getIndex().filter(e => e.id !== id)
  localStorage.setItem(INDEX_KEY, JSON.stringify(index))
}
