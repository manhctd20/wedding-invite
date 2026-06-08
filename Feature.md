# Feature Roadmap — Wedding Invite

> Cập nhật: 2026-06-08 | Phase 1 (Mobile UX Layer) đã hoàn thành

---

## Phase 2 — VN Essentials

> Những tính năng bắt buộc với thiệp cưới Việt Nam, thiếu thì thua hẳn cinelove.

---

### 2.1 Family Section (Nhà Trai / Nhà Gái)

**Mô tả:** Hiển thị song song thông tin gia đình hai bên — tên bố mẹ, quê quán, chức danh. Đây là chuẩn mực thiệp cưới VN.

**UI:** 2 cột (Nhà Trai | Nhà Gái), mỗi bên gồm:
- Tên bố (họ tên đầy đủ)
- Tên mẹ (họ tên đầy đủ)
- Quê quán (tỉnh/thành)
- Chức danh tuỳ chọn (VD: "Ông", "Bà", hoặc nghề nghiệp)

**Files cần sửa:**
- `src/types/invitation.ts` — thêm interface `FamilyInfo` + 2 fields `brideFamily`, `groomFamily`
- `src/types/invitation.ts` — thêm defaults trong `createDefaultInvitation`
- `src/store/invitationApi.ts` — merge defaults trong `recordToData`
- `src/components/sections/FamilySection.tsx` — **tạo mới**, nhận `brideFamily`, `groomFamily`, `theme`
- Tất cả 4 templates — import và render `FamilySection` sau hero (trước countdown)
- `src/components/editor/EditorSidebar.tsx` — accordion mới "Gia đình hai bên"

**Data model:**
```typescript
interface FamilyMember {
  fatherName: string
  motherName: string
  hometown: string
  title?: string        // "Ông/Bà Nguyễn Văn A"
}

// Thêm vào InvitationData:
brideFamily?: FamilyMember
groomFamily?: FamilyMember
showFamily?: boolean    // default true
```

---

### 2.2 QR Ngân Hàng Mừng Cưới

**Mô tả:** Hiển thị thông tin chuyển khoản mừng cưới kèm QR động (VietQR). Feature được dùng nhiều nhất — khách thực sự cần khi muốn mừng mà không đến được.

**UI:** Card với:
- Logo ngân hàng (text fallback nếu không có logo)
- Số tài khoản + tên chủ tài khoản
- QR code tự sinh từ VietQR API: `https://img.vietqr.io/image/{bankId}-{accountNumber}-{template}.png?amount=&addInfo=Mung+cuoi`
- Nút copy số tài khoản
- Tuỳ chọn: 2 tài khoản (cô dâu + chú rể riêng)

**Files cần sửa:**
- `src/types/invitation.ts` — thêm interface `BankInfo` + field `bankAccounts[]`
- `src/components/sections/BankSection.tsx` — **tạo mới**
- Tất cả 4 templates — render `BankSection` trước hoặc sau RSVP section
- `src/components/editor/EditorSidebar.tsx` — accordion "Thông tin mừng cưới"

**Data model:**
```typescript
interface BankAccount {
  id: string
  bankId: string        // mã ngân hàng VietQR: "VCB", "TCB", "MB", "VTB"...
  bankName: string      // tên hiển thị: "Vietcombank"
  accountNumber: string
  accountName: string
  label?: string        // "Cô dâu" | "Chú rể" | để trống
}

// Thêm vào InvitationData:
bankAccounts?: BankAccount[]
showBank?: boolean      // default false (opt-in)
```

**Danh sách bankId VietQR thông dụng:**
`VCB` (Vietcombank), `TCB` (Techcombank), `MB` (MB Bank), `VTB` (Vietinbank), `BIDV`, `ACB`, `VPB` (VPBank), `TPB` (TPBank), `STB` (Sacombank), `MSB`

---

### 2.3 Lịch Âm

**Mô tả:** Hiển thị ngày âm lịch kèm ngày dương, ví dụ: "Ngày 20.12.2026 (nhằm ngày 01 tháng 11 năm Bính Ngọ)". Bắt buộc với người Việt.

**Thư viện:** `vietnamese-lunar-calendar` hoặc `lunar-javascript` (nhẹ, no deps).

**UI:** Inline dưới ngày dương trong hero + countdown section. Định dạng: `ngày DD tháng MM năm [Can Chi]`

**Files cần sửa:**
- `package.json` — thêm `lunar-javascript` hoặc tự viết converter (thuật toán đơn giản ~30 dòng)
- `src/utils/lunar.ts` — **tạo mới**, export `toLunarDate(date: string): { day, month, year, canChi }`
- `src/templates/BloomTemplate.tsx` (và 3 template còn lại) — render ngày âm dưới ngày dương trong hero
- `src/components/sections/CountdownSection.tsx` — hiển thị ngày âm bên dưới ngày dương

**Không cần field mới** — tính toán runtime từ `weddingDate` hiện có.

---

### 2.4 Dual Venue (Lễ Nhà Gái + Đãi Tiệc)

**Mô tả:** Nhiều đám cưới VN có 2 địa điểm — lễ tại nhà gái buổi sáng, tiệc tại nhà hàng buổi tối. Cinelove hỗ trợ, mình chưa có.

**UI:** 2 card venue song song (hoặc stacked trên mobile), mỗi card gồm:
- Nhãn (VD: "Lễ Gia Tiên" | "Tiệc Cưới")
- Tên địa điểm
- Địa chỉ
- Giờ
- Link Google Maps (tuỳ chọn)

**Files cần sửa:**
- `src/types/invitation.ts` — thêm interface `VenueInfo` + field `venues[]` (array, tối đa 2)
- Giữ `venueName` + `venueAddress` cũ làm primary venue (backward compat)
- `src/components/sections/VenueSection.tsx` — **tạo mới** hoặc mở rộng ScheduleSection
- Tất cả 4 templates — render VenueSection
- `src/components/editor/EditorSidebar.tsx` — mở rộng accordion "Ngày & Địa điểm"

**Data model:**
```typescript
interface VenueInfo {
  id: string
  label: string         // "Lễ Gia Tiên" | "Tiệc Cưới"
  name: string
  address: string
  time: string          // "09:00"
  mapsUrl?: string      // Google Maps share link
}

// Thêm vào InvitationData:
venues?: VenueInfo[]    // nếu có thì ưu tiên, nếu không thì dùng venueName/venueAddress cũ
```

---

### 2.5 Personalized Guest Greeting (`?guest=`)

**Mô tả:** URL `/invite/:slug?guest=TênKhách` hiển thị "Kính mời **Anh Hùng**" thay vì "Trân trọng kính mời". Social-savvy couples hay dùng để gửi link riêng cho từng người.

**Xử lý:** Đọc `URLSearchParams` trong `InvitePage`, truyền `guestName` xuống template qua prop hoặc context.

**Files cần sửa:**
- `src/pages/InvitePage.tsx` — parse `?guest=` từ `useSearchParams()`, truyền xuống
- `src/templates/BloomTemplate.tsx` (và 3 template còn lại) — nhận prop `guestName?: string`, thay "Trân trọng kính mời" bằng "Kính mời [guestName]" nếu có
- Không cần BE thay đổi

**Ví dụ:**
```
/invite/abc123?guest=Anh+Hùng
→ Hero hiển thị: "Kính mời Anh Hùng"
```

---

## Phase 3 — Polish & Catalog

---

### 3.1 Auto-Scroll Page Theo Nhịp Nhạc

**Mô tả:** Page tự cuộn chậm khi nhạc đang phát, dừng khi user chạm/scroll, có nút ▶/⏸ floating.

**Kỹ thuật:**
- `requestAnimationFrame` loop: `window.scrollBy(0, speed)` mỗi frame (~0.4–0.8px/frame)
- Pause khi: `wheel`, `touchstart`, `keydown` event
- Resume tuỳ chọn: sau 3s không tương tác, hoặc chỉ khi bấm nút ▶
- Sync với music: chỉ auto-scroll khi `MusicToggle` đang playing (cần shared state/event)
- Tôn trọng `prefers-reduced-motion`: disabled by default

**Files cần sửa/tạo:**
- `src/hooks/useAutoScroll.ts` — **tạo mới**, hook quản lý RAF + event listeners
- `src/components/mobile/AutoScrollControl.tsx` — **tạo mới**, nút ▶/⏸ floating (gần MusicToggle)
- `src/pages/InvitePage.tsx` — wire `useAutoScroll` + `AutoScrollControl`
- `src/components/mobile/MusicToggle.tsx` — expose playing state lên (callback prop hoặc ref)

**Data model:** Thêm `autoScroll?: boolean` vào `InvitationData` (default false — opt-in bởi couple)

---

### 3.2 Google Maps Embed

**Mô tả:** Embed iframe Google Maps cho venue. Đơn giản nhưng hữu ích — khách nhấn "Chỉ đường" mở thẳng Google Maps app.

**Xử lý:** Nếu `mapsUrl` là Google Maps share link (`https://maps.app.goo.gl/...` hoặc `https://www.google.com/maps/...`), convert sang embed URL hoặc chỉ render nút "Xem bản đồ" mở tab mới (tránh iframe policy issues).

**Files cần sửa:**
- `src/types/invitation.ts` — thêm `venueMapUrl?: string` (cũng dùng cho Dual Venue ở 2.4)
- `src/components/sections/ScheduleSection.tsx` — thêm nút "📍 Xem bản đồ" nếu có `location` là URL
- `src/components/editor/EditorSidebar.tsx` — input "Link Google Maps" trong accordion Ngày & Địa điểm

---

### 3.3 Calendar Widget với Heart

**Mô tả:** Widget lịch tháng cưới, ô ngày cưới highlight với trái tim. Visual đẹp, thay thế cho dòng text ngày tháng thuần tuý.

**UI:** `<table>` 7 cột (T2–CN), tháng cưới, ô ngày cưới có SVG heart + màu accent, hover show tooltip "Ngày cưới của chúng tôi 💗".

**Files cần sửa/tạo:**
- `src/components/sections/CalendarWidget.tsx` — **tạo mới**, nhận `weddingDate`, `theme`
- Các templates — render CalendarWidget trong section Date (dưới countdown hoặc inline)
- Không cần field mới

---

### 3.4 Thêm Templates Mới

**Mục tiêu:** Từ 4 lên 6–7 templates, đa dạng phong cách để cạnh tranh với cinelove (10+ templates).

**3 templates đề xuất:**

| Slug | Phong cách | Palette chính | Hiệu ứng mặc định |
|---|---|---|---|
| `heritage` | Truyền thống VN — đỏ vàng, họa tiết | `#8B0000`, `#D4AF37`, `#FFF8E7` | lanterns |
| `garden` | Pastel mùa xuân — xanh mint, hồng nhạt | `#E8F5E9`, `#A8D5BA`, `#4A7C59` | sakura |
| `cinematic` | Điện ảnh — đen trắng high contrast | `#111111`, `#FFFFFF`, `#888888` | sparkles |

**Checklist mỗi template mới** (theo CLAUDE.md):
1. Thêm `TemplateId` trong `types/invitation.ts`
2. Thêm vào `THEMES` và `TEMPLATE_META`
3. Tạo `src/templates/XxxTemplate.tsx` (copy VelvetTemplate làm base)
4. Export từ `src/templates/index.ts`
5. Thêm vào `TemplateRenderer` trong `EditorPage.tsx` và `InvitePage.tsx`
6. Thêm vào `TEMPLATES` array trong `LandingPage.tsx`
7. Seed trong `wedding-invite-be/src/seed.ts`

---

### 3.5 Analytics Dashboard (Couple)

**Mô tả:** Trong `DashboardPage`, couple xem được thống kê của từng thiệp.

**Metrics:**
- Lượt xem (`viewCount` đã có trong BE)
- Tổng "bắn tim" (`reactionCount` đã thêm ở Phase 1)
- Số RSVP: bao nhiêu "Có" / "Không" / "Có thể"
- Số lời chúc trong guestbook
- Biểu đồ lượt xem theo ngày (optional, cần thêm field hoặc bảng riêng)

**Files cần sửa:**
- `src/pages/DashboardPage.tsx` — thêm stats card per invitation (gọi thêm `/api/invitations/:id/stats`)
- `wedding-invite-be/src/invitations/invitations.controller.ts` — thêm `GET /invitations/:id/stats`
- `wedding-invite-be/src/invitations/invitations.service.ts` — aggregate RSVP + guestbook count

---

### 3.6 Tier Free / Premium

**Mô tả:** Một số templates và tính năng chỉ dành cho tài khoản premium (như cinelove). Tạo tiền đề monetize.

**Logic:**
- `Template.isPremium` đã có trong BE schema
- Cần thêm `user.plan: 'free' | 'premium'` vào User entity
- Free: tối đa 1 thiệp, chỉ dùng basic templates, hiện watermark "Made with [brand]"
- Premium: không giới hạn thiệp, tất cả templates, không watermark, analytics

**Files cần sửa:**
- `wedding-invite-be/src/users/user.entity.ts` — thêm `plan` column
- `src/pages/DashboardPage.tsx` — hiện badge PREMIUM + upsell khi limit
- `src/pages/LandingPage.tsx` — pricing section
- `src/templates/*` — thêm watermark nhỏ góc dưới với free plan

---

## Thứ tự ưu tiên triển khai

```
Phase 2 (theo thứ tự):
  2.1 Family Section      ← impact cao, VN-essential
  2.3 Lịch âm            ← nhanh, ~30 phút
  2.5 Guest greeting      ← nhanh, ~30 phút
  2.2 QR Ngân hàng       ← cần VietQR research
  2.4 Dual Venue          ← phức tạp hơn

Phase 3 (theo thứ tự):
  3.2 Google Maps embed   ← nhanh, XS effort
  3.3 Calendar Widget     ← visual đẹp, S effort
  3.1 Auto-scroll         ← M effort, cần test kỹ
  3.4 Thêm templates      ← L effort, làm từng cái
  3.5 Analytics           ← cần BE mới
  3.6 Free/Premium tier   ← lớn nhất, làm cuối
```
