# Wedding Invite — Architecture Overview

> Cập nhật lần cuối: Session tháng 6/2026

---

## Cấu trúc hệ thống

```
D:\
├── wedding-invite\          FE: Vite + React + TS  →  CLAUDE.md
│   ├── CLAUDE.md
│   ├── docs/ARCHITECTURE.md (file này)
│   ├── start-dev.bat        khởi động FE + BE cùng lúc
│   └── src/
│
├── wedding-invite-be\       BE: NestJS + TypeORM  →  CLAUDE.md
│   ├── CLAUDE.md
│   └── src/
│
└── Docker
    └── wedding-postgres     Postgres 16, port 5544
```

---

## Luồng dữ liệu

```
Khách mời                Cặp đôi               Admin
/invite/:slug            /dashboard            /admin
                         /editor/:id
        │                     │                   │
        ▼                     ▼                   ▼
┌──────────────────────────────────────────────────────┐
│              Frontend  :5174                         │
│  React Router · AuthProvider · Axios · EffectOverlay │
└──────────────────────┬───────────────────────────────┘
                       │ REST + JWT Bearer
                       ▼
┌──────────────────────────────────────────────────────┐
│              Backend  :4000/api                      │
│  Public API · Couple API (JWT) · Admin API (JWT+role)│
└──────────────────────┬───────────────────────────────┘
                       │ TypeORM
                       ▼
┌──────────────────────────────────────────────────────┐
│         PostgreSQL 16  :5544  (Docker)               │
│  users · invitations · templates · guestbook · rsvps │
└──────────────────────────────────────────────────────┘
```

---

## Checklist khởi động session mới

```bash
# 1. Kiểm tra Postgres
docker ps --filter name=wedding-postgres --format "{{.Status}}"
# Nếu không thấy → mở Docker Desktop, rồi:
docker start wedding-postgres

# 2. Khởi động servers
D:\wedding-invite\start-dev.bat
# hoặc 2 terminal riêng:
#   cd D:\wedding-invite-be && npm run start:dev
#   cd D:\wedding-invite && npm run dev -- --port 5174 --host

# 3. Verify
curl http://localhost:4000/api/public/templates   # BE OK
# Mở http://localhost:5174                        # FE OK
```

---

## Key Design Decisions

### 1. Invitation content = JSONB blob
Toàn bộ nội dung thiệp lưu trong `content jsonb`. Không cần migration BE khi thêm field FE mới (effects, new sections...). Tradeoff: không query được sâu vào content — chấp nhận được vì admin chỉ cần list/filter cơ bản.

### 2. Slug vs UUID cho invitation
- `id` (UUID) = private, chỉ owner biết, dùng trong editor URL `/editor/:id`
- `slug` (8 ký tự random) = public, dùng trong `/invite/:slug`
- FE `InvitationData.id` = slug (để seed picsum images nhất quán)

### 3. Inline styles (FE)
Components dùng inline styles để dynamic theme colors (accent, bg...) hoạt động mà không cần Tailwind `safelist`. Chỉ `index.css` dùng `@tailwind`.

### 4. Template system
Templates = React components nhận `InvitationData`. Shared sections (Countdown, OurStory...) nhận `theme: TemplateTheme` → tự render đúng màu. Admin quản lý metadata template trong DB; FE renderer hard-code theo `slug`.

### 5. Effects system
Pure CSS `@keyframes` inject qua `<style>` tag, `position:fixed`, `pointer-events:none`. Seeded pseudo-random (seed = index) để không re-render jitter. 4 effects: petals/sakura/sparkles/lanterns. **Vị trí khởi đầu quan trọng:** petals/sakura bắt đầu ngoài top, sparkles bắt đầu trong viewport, lanterns bắt đầu ngoài bottom.

### 6. Auto-save debounce (EditorPage)
`saveState` KHÔNG trong useEffect deps để tránh cleanup cancel timer. Chỉ set `'saving'` bên trong async callback sau 900ms debounce.

### 7. Auth: JWT stateless
Token 7 ngày, không có refresh token. Phù hợp MVP.

---

## Tài khoản & Secrets

| | Value |
|---|---|
| Admin | `admin@wedding.local` / `admin123` |
| Couple demo | `couple@wedding.local` / `couple123` |
| DB URL | `postgresql://wedding:wedding_secret@localhost:5544/wedding_invite` |
| JWT secret | xem `D:\wedding-invite-be\.env` |
| FE env | `D:\wedding-invite\.env` — `VITE_API_URL=http://localhost:4000/api` |

---

## Known bugs đã fix (không reproduce lại)

| Bug | Nguyên nhân | Fix |
|---|---|---|
| "Đang lưu..." kẹt mãi | `saveState` trong deps → cleanup cancel timer | Bỏ `saveState` khỏi deps, set 'saving' trong callback |
| Sparkles không hiển thị | `top: -Xpx` → sparkles ở ngoài viewport | `top: random 5–88vh` trong viewport |
| Timeline schedule lệch | `position:absolute` line không khớp dot | 3-col grid `timeW\|dotW\|1fr`, line tại `left: timeW + dotW/2` |
