# Wedding Invite — Frontend (Vite + React + TypeScript)

> Cập nhật lần cuối: Session tháng 6/2026

---

## Khởi động nhanh

```bash
# Cách 1 — chạy tất cả 1 lệnh:
D:\wedding-invite\start-dev.bat

# Cách 2 — từng bước:
docker start wedding-postgres          # Postgres (cần Docker Desktop mở trước)
cd D:\wedding-invite-be && npm run start:dev   # Backend :4000
cd D:\wedding-invite && npm run dev -- --port 5173 --host  # Frontend :5173
```

**URLs:** http://localhost:5173 | Admin: http://localhost:5173/admin | API: http://localhost:4000/api

**Tài khoản test:**
| Role | Email | Password |
|---|---|---|
| Admin | `admin@wedding.local` | `admin123` |
| Couple | `couple@wedding.local` | `couple123` |

---

## Tech stack

- **Vite 5 + React 18 + TypeScript** — inline styles xuyên suốt (không dùng Tailwind class trong component, chỉ `index.css` dùng `@tailwind`)
- **React Router v6** — routing
- **Framer Motion** — parallax, scroll-reveal, kinetic typography
- **Axios** — HTTP client (`src/lib/api.ts`)
- **Fonts:** Cormorant Garamond (serif) · DM Sans (sans) · DM Mono (mono) — load từ Google Fonts qua `<link>` trong `index.html`

---

## Cấu trúc src/

```
src/
├── lib/api.ts              Axios instance + setToken/clearToken/apiError()
├── store/
│   ├── auth.tsx            AuthContext, AuthProvider, useAuth() — token key: 'wi_token'
│   ├── invitationApi.ts    CRUD API + recordToData() + InvitationRecord type
│   └── invitationStore.ts  ⚠️ CŨ (localStorage) — giữ làm tham khảo, KHÔNG dùng
├── types/invitation.ts     InvitationData, TemplateId, EffectType, THEMES, TEMPLATE_META
├── hooks/useIsMobile.ts    breakpoint 768px, dùng MediaQueryList
├── templates/
│   ├── BloomTemplate.tsx   Cream/rose · parallax hero · EffectOverlay
│   ├── NoirTemplate.tsx    Dark/gold · asymmetric hero · EffectOverlay
│   ├── MinimalTemplate.tsx White/charcoal · Swiss editorial · EffectOverlay
│   ├── VelvetTemplate.tsx  Deep plum/gold · kinetic typography · EffectOverlay
│   └── index.ts            re-export tất cả
├── components/
│   ├── editor/EditorSidebar.tsx   Accordion: template, sections toggle, couple, date/venue,
│   │                              story, schedule, party, RSVP, media, effects panel
│   ├── sections/
│   │   ├── CountdownSection.tsx   Live countdown (setInterval), fade-in whileInView
│   │   ├── OurStorySection.tsx    Timeline milestones, alternating L/R desktop
│   │   ├── WeddingPartySection.tsx Grid bridesmaids/groomsmen, stagger + hover
│   │   ├── ScheduleSection.tsx    3-col grid (timeW|dotW|1fr) — line và dot LUÔN thẳng hàng
│   │   └── GuestbookSection.tsx   Form gửi lời chúc + list entries, gọi public API /guestbook
│   ├── effects/EffectOverlay.tsx  4 hiệu ứng (xem chi tiết bên dưới)
│   └── ShareModal.tsx
├── pages/
│   ├── LandingPage.tsx     Public homepage — nếu đã login → route đúng role
│   ├── LoginPage.tsx       POST /api/auth/login
│   ├── RegisterPage.tsx    POST /api/auth/register
│   ├── DashboardPage.tsx   Couple: list + xoá thiệp của mình
│   ├── EditorPage.tsx      Editor + preview, auto-save debounce 900ms
│   ├── InvitePage.tsx      Public view by slug → GET /api/public/invitations/:slug
│   └── admin/
│       ├── AdminLayout.tsx         Dark sidebar nav + <Outlet>
│       ├── AdminDashboard.tsx      Stats cards (users/invs/published/templates)
│       ├── AdminTemplates.tsx      Card grid + modal 4 tabs (basic/theme/palette/AI)
│       ├── AdminUsers.tsx          List users, khoá/mở tài khoản
│       └── AdminInvitations.tsx    All invitations + search filter
└── App.tsx                 Routes với RequireAuth và RequireAdmin guards
```

---

## Routes

```
/               LandingPage     public
/login          LoginPage       public
/register       RegisterPage    public
/invite/:slug   InvitePage      public (view thiệp, gọi public API)
/dashboard      DashboardPage   RequireAuth
/editor/:id     EditorPage      RequireAuth  (id = invitation UUID từ BE)
/admin          AdminLayout     RequireAdmin (role='admin')
  /admin/         AdminDashboard
  /admin/templates  AdminTemplates
  /admin/users      AdminUsers
  /admin/invitations AdminInvitations
```

---

## Data flow

```
InvitationRecord (API)           InvitationData (FE/templates)
{                                {
  id: UUID   ──────────── editKey (deprecated, giữ shape)
  slug: str  ──────────── id  (dùng để seed picsum images)
  content: jsonb ──spread──  tất cả fields InvitationData
  published, viewCount, owner
}
```

- `recordToData(rec)` → InvitationData (merge default cho fields mới)
- `saveInvitation(id, data)` → PUT `/api/invitations/:id`
- Public: `getPublicInvitation(slug)` → GET `/api/public/invitations/:slug`

**⚠️ BUG ĐÃ FIX — auto-save kẹt "Đang lưu...":**
Root cause: `saveState` trong deps array → `setSaveState('saving')` trigger re-render → cleanup cancel timer.
Fix: `saveState` KHÔNG nằm trong deps. Chỉ set `'saving'` bên trong async callback (sau debounce).
Xem `EditorPage.tsx` — comment giải thích rõ.

---

## InvitationData — toàn bộ fields

```typescript
// Meta
id: string          // = slug từ BE (dùng seed ảnh)
editKey: string     // = UUID từ BE (deprecated, giữ shape)
template: TemplateId

// Couple
brideFirstName, brideLastName, groomFirstName, groomLastName: string

// Event
weddingDate: string   // 'YYYY-MM-DD', default '2026-12-20'
weddingTime: string   // 'HH:mm'

// Venue
venueName, venueAddress: string

// Content
message: string

// RSVP
rsvpName, rsvpPhone, rsvpDeadline: string

// Media
coverImage: string | null   // base64 hoặc URL
galleryImages: string[]

// Sections
storyMilestones: StoryMilestone[]   // { id, year, title, description, image }
weddingParty: WeddingPartyMember[]  // { id, name, role, note, image, side:'bride'|'groom' }
scheduleEvents: ScheduleEvent[]     // { id, time, title, description, location }

// Section toggles
showCountdown, showStory, showParty, showSchedule, showGallery, showRsvp, showGuestbook: boolean

// Effects
effectType: EffectType        // 'none'|'petals'|'sakura'|'sparkles'|'lanterns', default 'petals'
effectIntensity: 'light'|'medium'|'heavy'   // default 'medium'
effectColor?: string          // hex override; undefined = dùng màu accent template

// Style
accentColor: string
createdAt, updatedAt: string
```

Migration mới (invitations cũ thiếu field): `recordToData()` merge defaults `{ effectType:'petals', effectIntensity:'medium' }`.

---

## Templates

Mỗi template nhận `data: InvitationData`, lấy theme từ `THEMES[data.template]`.

| Slug | Style | Palette | Default effect |
|---|---|---|---|
| `bloom` | Romantic cream/rose | #FAFAF7, #C4A882, #2C2420 | petals |
| `noir` | Dark luxury | #0A0A0A, #C9A84C, #F0EBE0 | sparkles |
| `minimal` | Swiss editorial | #FFFFFF, #4A4A4A, #1A1A1A | sakura |
| `velvet` | Deep plum/gold | #100D1A, #C9924A, #F0E8DC | lanterns |

**TemplateTheme keys:** `bg, text, accent, muted, border, soft, isDark`

**Thêm template mới — checklist:**
1. `TemplateId` type trong `types/invitation.ts`
2. `THEMES` và `TEMPLATE_META` trong `types/invitation.ts`
3. Tạo `src/templates/XxxTemplate.tsx` (copy VelvetTemplate làm base)
4. Export từ `src/templates/index.ts`
5. `TemplateRenderer` trong `EditorPage.tsx` và `InvitePage.tsx`
6. `TEMPLATES` array trong `LandingPage.tsx`

---

## Visual Effects System

**File:** `src/components/effects/EffectOverlay.tsx`

**4 hiệu ứng** (đom đóm đã bỏ — không phù hợp đám cưới):

| EffectType | Mô tả | SVG | Màu mặc định | Vị trí khởi đầu |
|---|---|---|---|---|
| `petals` | Cánh hoa hồng rơi + sway | 2 ellipse lồng | #E8899A | top: -Xpx → rơi xuống |
| `sakura` | Hoa anh đào 5 cánh | 5 ellipse + nhụy | #FFB7C5 | top: -Xpx → rơi xuống |
| `sparkles` | Ngôi sao 8 cánh nhấp nháy | path + circle | #F5C842 | random 5–88vh trong viewport |
| `lanterns` | Đèn lồng bay lên | rect + glow | #E84545 | bottom: X% → bay lên |

**⚠️ Lưu ý vị trí particle — quan trọng:**
- `petals/sakura`: `top: -Xpx` (bắt đầu ngoài màn hình trên, rơi xuống) ✓
- `sparkles`: `top: random 5–88vh` (bắt đầu TRONG viewport, nhấp nháy tại chỗ) ✓
- `lanterns`: `bottom: X%` (bắt đầu ngoài màn hình dưới, bay lên) ✓
- **Bug cũ:** sparkles từng dùng `top: -Xpx` → không bao giờ thấy được. Đã fix.

**Particle counts** (light/medium/heavy):
- petals: 18/32/55 | sakura: 22/40/65 | sparkles: 20/38/60 | lanterns: 8/14/24
- Mobile: tự giảm 45%

**Kỹ thuật:** Pure CSS `@keyframes` qua `<style>` tag, `position:fixed`, `pointer-events:none`, `z-index:999`. Seeded pseudo-random (không `Math.random`) để tránh re-render jitter. Tôn trọng `prefers-reduced-motion`.

**Editor:** Panel "✨ Hiệu ứng" cuối EditorSidebar — chọn loại, cường độ (nhẹ/vừa/nhiều), màu override.

---

## Shared Section Components

Tất cả templates import và dùng, truyền `theme: TemplateTheme`:

| Component | Props | Ghi chú |
|---|---|---|
| `CountdownSection` | `weddingDate, weddingTime, theme` | useEffect + setInterval 1s |
| `OurStorySection` | `milestones[], theme` | Alternating L/R desktop, single col mobile |
| `WeddingPartySection` | `members[], theme` | Tách bride/groom group |
| `ScheduleSection` | `events[], theme` | **3-col grid: `${timeW}px ${dotW}px 1fr`** — line tại `left: timeW + dotW/2` |

**ScheduleSection gotcha:** KHÔNG dùng `position:absolute` cho đường dọc — dùng `position:absolute` trên wrapper với `left` tính từ column widths để line và dot luôn thẳng hàng.

---

## Patterns & Conventions

**Responsive:** `useIsMobile(768)` → biến `m`. Desktop: `1fr 1fr` grid, mobile: `1fr` stack.

**Animation (Framer Motion):**
- Hero parallax: `useScroll + useTransform` trên `heroRef`
- Section reveal: `whileInView={{ opacity:1, y:0 }}` với `viewport={{ once:true, amount:0.3 }}`
- Stagger: `transition={{ delay: i * 0.06 }}`

**Image placeholder:** `https://picsum.photos/seed/{descriptive}/{w}/{h}`

**Error:** `apiError(err)` extract message từ Axios response. Hiển thị inline (không toast).

**Auto-save pattern (EditorPage):**
```typescript
// Đúng — chỉ set 'saving' TRONG callback:
useEffect(() => {
  if (!data || !record) return
  if (saveState === 'saved') return
  const t = setTimeout(async () => {
    setSaveState('saving')  // ← BÊN TRONG, không phải trước setTimeout
    // ...save...
    setSaveState('saved')
  }, 900)
  return () => clearTimeout(t)
}, [data, record])  // ← saveState KHÔNG trong deps
```

---

## Môi trường

```env
# D:\wedding-invite\.env
VITE_API_URL=http://localhost:4000/api
```

---

## AdminTemplates — tab editor

Modal chỉnh sửa template có 4 tabs:
1. **Thông tin chung** — slug (new only), tên, mô tả, thứ tự, premium/active toggle
2. **Theme màu sắc** — 6 ColorInput (bg/text/accent/muted/border/soft) + isDark toggle
3. **Bảng màu** — 3 màu palette hiển thị trên landing + preview dải
4. **✨ AI Generate** — textarea prompt → mock AI tạo theme (TODO: wire thật)

---

## Roadmap / TODO

- [x] Guestbook — GuestbookSection.tsx, bật/tắt bằng showGuestbook toggle, BE endpoints có sẵn
- [x] RSVP form thực — RsvpSection.tsx, form inline (tên/status/số người/ghi chú), dùng trong tất cả 7 templates
- [x] Personalised URL: `/invite/:slug?guest=TenKhach` — InvitePage đọc `?guest=` và pass vào template
- [x] Background music — MusicToggle component, URL input trong EditorSidebar
- [x] Published toggle trong EditorPage — nút "Đăng thiệp / Đã đăng" trên TopBar, gọi saveInvitation với published param
- [x] RSVP dashboard trong DashboardPage — AnalyticsModal hiển thị danh sách RSVP + stats
- [ ] Upload ảnh thật lên server (hiện base64 trong jsonb → nặng) — cần BE endpoint upload
- [ ] AI generate theme thật: endpoint BE → gọi Codex/OpenAI → trả TemplateTheme
- [ ] Guestbook moderation trong admin
