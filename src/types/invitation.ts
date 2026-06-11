export type TemplateId = 'bloom' | 'noir' | 'minimal' | 'velvet' | 'heritage' | 'garden' | 'cinematic' | 'cinelove'
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

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  side: 'bride' | 'groom' | 'both'
}

// ─── Main model ───────────────────────────────────────────────

export interface InvitationData {
  id: string
  editKey: string
  template: TemplateId

  // Couple
  brideFirstName: string
  brideLastName: string
  brideBio?: string
  brideImage?: string | null
  groomFirstName: string
  groomLastName: string
  groomBio?: string
  groomImage?: string | null

  // Family
  groomFather: string
  groomMother: string
  brideFather: string
  brideMother: string

  // Event
  weddingDate: string
  weddingTime: string

  // Venue
  venueName: string
  venueAddress: string
  venueMapUrl?: string

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
  bankAccounts: BankAccount[]

  // Section visibility toggles
  showCountdown: boolean
  showStory: boolean
  showParty: boolean
  showSchedule: boolean
  showGallery: boolean
  showRsvp: boolean
  showGuestbook: boolean
  showFamily: boolean
  showBank: boolean
  showCoupleProfile: boolean

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
  heritage: {
    bg: '#FAF3E0',
    text: '#4A1C1C',
    accent: '#D4AF37',
    muted: '#8B5A5A',
    border: '#E5C99F',
    soft: '#F4E8D1',
    isDark: false,
  },
  garden: {
    bg: '#F7FCF5',
    text: '#1C3B2B',
    accent: '#6B8E7B',
    muted: '#5C7A68',
    border: '#D0E3D3',
    soft: '#EAF3EB',
    isDark: false,
  },
  cinematic: {
    bg: '#111111',
    text: '#F5F5F5',
    accent: '#D4D4D4',
    muted: '#888888',
    border: '#333333',
    soft: '#222222',
    isDark: true,
  },
  cinelove: {
    bg: '#1B1422',
    text: '#F5E9DC',
    accent: '#E8B4A0',
    muted: 'rgba(245,233,220,0.6)',
    border: 'rgba(245,233,220,0.15)',
    soft: 'rgba(255,255,255,0.06)',
    isDark: true,
  },
}

// ─── Template meta ────────────────────────────────────────────

export const TEMPLATE_META: Record<TemplateId, { label: string; desc: string; palette: string[]; isPremium?: boolean }> = {
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
  heritage: {
    label: 'Heritage',
    desc: 'Truyền thống, trang trọng — đỏ đô và vàng đồng',
    palette: ['#FAF3E0', '#D4AF37', '#4A1C1C'],
    // isPremium: true,
  },
  garden: {
    label: 'Garden',
    desc: 'Tươi mát, thiên nhiên — xanh rêu và mộc mạc',
    palette: ['#F7FCF5', '#6B8E7B', '#1C3B2B'],
    // isPremium: true,
  },
  cinematic: {
    label: 'Cinematic',
    desc: 'Điện ảnh, hiện đại — đen tuyền, chữ nổi bật',
    palette: ['#111111', '#F5F5F5', '#888888'],
    // isPremium: true,
  },
  cinelove: {
    label: 'Cinelove',
    desc: 'Glass UI mobile-first — bottom sheet hộp quà, lưu bút, RSVP',
    palette: ['#1B1422', '#E8B4A0', '#F5E9DC'],
    // isPremium: true,
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
    brideBio: 'Một cô gái yêu thích sự nhẹ nhàng và lãng mạn. Với tôi, tình yêu là một chuyến đi dài.',
    brideImage: null,
    groomFirstName: 'Minh',
    groomLastName: 'Tuấn',
    groomBio: 'Người đàn ông trưởng thành, trầm tính, thích đi phượt và muốn là chỗ dựa vững chắc cho gia đình.',
    groomImage: null,
    groomFather: 'Ông Trần Văn A',
    groomMother: 'Bà Nguyễn Thị B',
    brideFather: 'Ông Lê Văn C',
    brideMother: 'Bà Phạm Thị D',
    weddingDate: '2026-12-20',
    weddingTime: '18:00',
    venueName: 'Grand Palace Ballroom',
    venueAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    venueMapUrl: '',
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
    bankAccounts: [
      { id: uid(), bankName: 'Vietcombank', accountNumber: '1234567890', accountName: 'LE NGOC LINH', side: 'bride' },
      { id: uid(), bankName: 'MB Bank', accountNumber: '0987654321', accountName: 'TRAN MINH TUAN', side: 'groom' }
    ],
    showCountdown: true,
    showStory: true,
    showParty: true,
    showSchedule: true,
    showGallery: true,
    showRsvp: true,
    showGuestbook: true,
    showFamily: true,
    showBank: true,
    showCoupleProfile: true,
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
