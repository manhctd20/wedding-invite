export type TemplateId = 'bloom' | 'noir' | 'minimal' | 'velvet'
export type EffectType = 'none' | 'petals' | 'sakura' | 'sparkles' | 'lanterns' | 'hearts'
export type EffectIntensity = 'light' | 'medium' | 'heavy'

// ─── Sub-models ───────────────────────────────────────────────

export interface StoryMilestone {
  id: string
  year: string
  title: string
  description: string
  image: string | null
}

export interface WeddingPartyMember {
  id: string
  name: string
  role: string
  note: string
  image: string | null
  side: 'bride' | 'groom'
}

export interface ScheduleEvent {
  id: string
  time: string
  title: string
  description: string
  location: string
}

// ─── Main model ───────────────────────────────────────────────

export interface InvitationData {
  id: string
  editKey: string
  template: TemplateId

  // Couple
  brideFirstName: string
  brideLastName: string
  groomFirstName: string
  groomLastName: string

  // Event
  weddingDate: string
  weddingTime: string

  // Venue
  venueName: string
  venueAddress: string

  // Content
  message: string

  // RSVP
  rsvpName: string
  rsvpPhone: string
  rsvpDeadline: string

  // Media
  coverImage: string | null
  galleryImages: string[]

  // New sections
  storyMilestones: StoryMilestone[]
  weddingParty: WeddingPartyMember[]
  scheduleEvents: ScheduleEvent[]

  // Section visibility toggles
  showCountdown: boolean
  showStory: boolean
  showParty: boolean
  showSchedule: boolean
  showGallery: boolean
  showRsvp: boolean
  showGuestbook: boolean

  // Visual effects
  effectType: EffectType
  effectIntensity: EffectIntensity
  effectColor?: string

  // Music & interaction
  musicUrl?: string
  musicTitle?: string
  coupleNameFont?: 'serif' | 'script'
  showStickyToolbar?: boolean
  showLiveTicker?: boolean
  allowReactions?: boolean
  reactionCount?: number

  // Style
  accentColor: string
  createdAt: string
  updatedAt: string
}

// ─── Template theme ──────────────────────────────────────────

export interface TemplateTheme {
  bg: string
  text: string
  accent: string
  muted: string
  border: string
  soft: string
  isDark: boolean
}

export const THEMES: Record<TemplateId, TemplateTheme> = {
  bloom: {
    bg: '#FAFAF7',
    text: '#2C2420',
    accent: '#C4A882',
    muted: '#9C8C7C',
    border: '#E8DDD4',
    soft: '#F5EDE4',
    isDark: false,
  },
  noir: {
    bg: '#0A0A0A',
    text: '#F0EBE0',
    accent: '#C9A84C',
    muted: '#7A7468',
    border: '#1E1E1E',
    soft: '#141414',
    isDark: true,
  },
  minimal: {
    bg: '#FFFFFF',
    text: '#1A1A1A',
    accent: '#4A4A4A',
    muted: '#888888',
    border: '#E5E5E5',
    soft: '#F7F7F7',
    isDark: false,
  },
  velvet: {
    bg: '#100D1A',
    text: '#F0E8DC',
    accent: '#C9924A',
    muted: '#7A6E7C',
    border: '#221A30',
    soft: '#18132A',
    isDark: true,
  },
}

// ─── Template meta ────────────────────────────────────────────

export const TEMPLATE_META: Record<TemplateId, { label: string; desc: string; palette: string[] }> = {
  bloom: {
    label: 'Bloom',
    desc: 'Lãng mạn, tinh tế — tông kem và hồng nhẹ',
    palette: ['#FAFAF7', '#C4A882', '#2C2420'],
  },
  noir: {
    label: 'Noir',
    desc: 'Sang trọng tối — đen và vàng champagne',
    palette: ['#0A0A0A', '#C9A84C', '#F0EBE0'],
  },
  minimal: {
    label: 'Minimal',
    desc: 'Hiện đại, sạch sẽ — trắng và xám',
    palette: ['#FFFFFF', '#4A4A4A', '#1A1A1A'],
  },
  velvet: {
    label: 'Velvet',
    desc: 'Huyền bí, lãng mạn — tím đêm và vàng ánh',
    palette: ['#100D1A', '#C9924A', '#F0E8DC'],
  },
}

// ─── Defaults ─────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function createDefaultInvitation(id: string, editKey: string): InvitationData {
  return {
    id,
    editKey,
    template: 'bloom',
    brideFirstName: 'Ngọc',
    brideLastName: 'Linh',
    groomFirstName: 'Minh',
    groomLastName: 'Tuấn',
    weddingDate: '2026-12-20',
    weddingTime: '18:00',
    venueName: 'Grand Palace Ballroom',
    venueAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    message: 'Chúng tôi trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng tôi.',
    rsvpName: 'Minh Tuấn',
    rsvpPhone: '0912 345 678',
    rsvpDeadline: '2025-12-10',
    coverImage: null,
    galleryImages: [],
    storyMilestones: [
      { id: uid(), year: '2020', title: 'Lần đầu gặp nhau', description: 'Chúng tôi gặp nhau tại một buổi tiệc của người bạn chung. Ánh mắt đầu tiên đó, tôi biết đây là người đặc biệt.', image: null },
      { id: uid(), year: '2021', title: 'Chuyến đi đầu tiên', description: 'Chuyến du lịch Đà Lạt cùng nhau — nơi chúng tôi thực sự hiểu nhau hơn qua từng khoảnh khắc nhỏ.', image: null },
      { id: uid(), year: '2022', title: 'Lời cầu hôn', description: 'Dưới ánh hoàng hôn tại Hội An, anh ấy quỳ xuống và hỏi câu mà tôi đã chờ đợi mãi.', image: null },
      { id: uid(), year: '2025', title: 'Ngày trọng đại', description: 'Và hôm nay, chúng tôi mời bạn cùng chứng kiến bước ngoặt đẹp nhất trong cuộc đời mình.', image: null },
    ],
    weddingParty: [
      { id: uid(), name: 'Thanh Hà', role: 'Phù dâu trưởng', note: 'Người bạn thân nhất từ thời đại học', image: null, side: 'bride' },
      { id: uid(), name: 'Minh Châu', role: 'Phù dâu', note: 'Người chị họ đáng yêu nhất', image: null, side: 'bride' },
      { id: uid(), name: 'Hoàng Nam', role: 'Phù rể trưởng', note: 'Người bạn thân từ hồi còn đi học', image: null, side: 'groom' },
      { id: uid(), name: 'Đức Thịnh', role: 'Phù rể', note: 'Đồng đội tin cậy nhất', image: null, side: 'groom' },
    ],
    scheduleEvents: [
      { id: uid(), time: '16:30', title: 'Đón khách', description: 'Chào đón khách mời và chụp ảnh lưu niệm', location: 'Sảnh chờ - Tầng 1' },
      { id: uid(), time: '17:30', title: 'Lễ thành hôn', description: 'Nghi thức kết hôn trang trọng', location: 'Sảnh chính - Tầng 2' },
      { id: uid(), time: '18:00', title: 'Tiệc cưới', description: 'Tiệc mừng hạnh phúc cùng gia đình và bạn bè', location: 'Sảnh tiệc - Tầng 2' },
      { id: uid(), time: '21:00', title: 'Cắt bánh cưới', description: 'Nghi thức cắt bánh và mở rượu champagne', location: 'Sảnh tiệc' },
    ],
    showCountdown: true,
    showStory: true,
    showParty: true,
    showSchedule: true,
    showGallery: true,
    showRsvp: true,
    showGuestbook: true,
    musicUrl: undefined,
    musicTitle: undefined,
    coupleNameFont: 'serif',
    showStickyToolbar: true,
    showLiveTicker: true,
    allowReactions: true,
    reactionCount: 0,
    effectType: 'petals',
    effectIntensity: 'medium',
    effectColor: undefined,
    accentColor: '#C4A882',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
