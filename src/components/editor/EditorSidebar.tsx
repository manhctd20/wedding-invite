import { useState, useRef, ChangeEvent } from 'react'
import { InvitationData, TemplateId, TEMPLATE_META, StoryMilestone, WeddingPartyMember, ScheduleEvent, EffectType, EffectIntensity } from '../../types/invitation'
import { EFFECT_META } from '../effects/EffectOverlay'

interface Props {
  data: InvitationData
  onChange: (patch: Partial<InvitationData>) => void
}

// ─── Primitives ───────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 8) }

function AccordionSection({ title, children, defaultOpen = false, badge }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid #E8DDD4' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8C7C' }}>{title}</span>
          {badge && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#C4A882', background: '#F5EDE4', padding: '1px 6px', borderRadius: 2 }}>{badge}</span>
          )}
        </div>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#9C8C7C', flexShrink: 0 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>}
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%', padding: '7px 9px', border: '1px solid #E8DDD4', background: '#FFF',
  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#2C2420',
  outline: 'none', transition: 'border-color 0.15s',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 72 }

function Label({ t }: { t: string }) {
  return <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9C8C7C', marginBottom: 4 }}>{t}</label>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label t={label} />{children}</div>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10, position: 'relative',
          background: checked ? '#C4A882' : '#E8DDD4', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 19 : 3, width: 14, height: 14, borderRadius: '50%',
          background: '#FFF', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </div>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5C4C3C' }}>{label}</span>
    </label>
  )
}

// ─── Story Editor ─────────────────────────────────────────────

function StoryEditor({ milestones, onChange }: { milestones: StoryMilestone[]; onChange: (v: StoryMilestone[]) => void }) {
  const refs = useRef<Record<string, HTMLInputElement | null>>({})

  function update(id: string, patch: Partial<StoryMilestone>) {
    onChange(milestones.map(m => m.id === id ? { ...m, ...patch } : m))
  }
  function remove(id: string) { onChange(milestones.filter(m => m.id !== id)) }
  function add() { onChange([...milestones, { id: uid(), year: '', title: '', description: '', image: null }]) }

  function handleImg(id: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update(id, { image: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {milestones.map((ms, i) => (
        <div key={ms.id} style={{ border: '1px solid #E8DDD4', padding: 12, background: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#C4A882', fontWeight: 500 }}>Mốc {i + 1}</span>
            <button onClick={() => remove(ms.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4A882', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Field label="Năm / Thời điểm">
              <input style={inp} value={ms.year} onChange={e => update(ms.id, { year: e.target.value })} placeholder="2020" />
            </Field>
            <Field label="Tiêu đề">
              <input style={inp} value={ms.title} onChange={e => update(ms.id, { title: e.target.value })} placeholder="Lần đầu gặp nhau" />
            </Field>
            <Field label="Câu chuyện">
              <textarea style={ta} value={ms.description} onChange={e => update(ms.id, { description: e.target.value })} placeholder="Mô tả khoảnh khắc này..." />
            </Field>
            <div>
              <Label t="Ảnh (tuỳ chọn)" />
              {ms.image ? (
                <div style={{ position: 'relative', marginBottom: 4 }}>
                  <img src={ms.image} alt="" style={{ width: '100%', height: 80, objectFit: 'cover' }} />
                  <button onClick={() => update(ms.id, { image: null })} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF', cursor: 'pointer', width: 20, height: 20, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ) : (
                <label style={{ display: 'block', padding: '7px', border: '1px dashed #C4A882', textAlign: 'center', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C' }}>
                  + Chọn ảnh
                  <input ref={el => { refs.current[ms.id] = el }} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(ms.id, e)} />
                </label>
              )}
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} style={{ padding: '8px', border: '1px dashed #C4A882', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C', cursor: 'pointer' }}>
        + Thêm mốc kỷ niệm
      </button>
    </div>
  )
}

// ─── Party Editor ─────────────────────────────────────────────

function PartyEditor({ members, onChange }: { members: WeddingPartyMember[]; onChange: (v: WeddingPartyMember[]) => void }) {
  function update(id: string, patch: Partial<WeddingPartyMember>) {
    onChange(members.map(m => m.id === id ? { ...m, ...patch } : m))
  }
  function remove(id: string) { onChange(members.filter(m => m.id !== id)) }
  function add(side: 'bride' | 'groom') {
    onChange([...members, { id: uid(), name: '', role: side === 'bride' ? 'Phù dâu' : 'Phù rể', note: '', image: null, side }])
  }

  function handleImg(id: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update(id, { image: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  const brides = members.filter(m => m.side === 'bride')
  const grooms = members.filter(m => m.side === 'groom')

  function renderGroup(list: WeddingPartyMember[], side: 'bride' | 'groom') {
    return (
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 8 }}>
          {side === 'bride' ? 'Phù dâu' : 'Phù rể'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((mb, i) => (
            <div key={mb.id} style={{ border: '1px solid #E8DDD4', padding: 10, background: '#FFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C' }}>#{i + 1}</span>
                <button onClick={() => remove(mb.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4A882', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Field label="Tên"><input style={inp} value={mb.name} onChange={e => update(mb.id, { name: e.target.value })} placeholder="Thanh Hà" /></Field>
                  <Field label="Vai trò"><input style={inp} value={mb.role} onChange={e => update(mb.id, { role: e.target.value })} placeholder="Phù dâu" /></Field>
                </div>
                <Field label="Ghi chú ngắn"><input style={inp} value={mb.note} onChange={e => update(mb.id, { note: e.target.value })} placeholder="Bạn thân từ đại học..." /></Field>
                <div>
                  <Label t="Ảnh (tuỳ chọn)" />
                  {mb.image ? (
                    <div style={{ position: 'relative' }}>
                      <img src={mb.image} alt="" style={{ width: '100%', height: 70, objectFit: 'cover' }} />
                      <button onClick={() => update(mb.id, { image: null })} style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF', cursor: 'pointer', width: 18, height: 18, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', padding: '6px', border: '1px dashed #C4A882', textAlign: 'center', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C' }}>
                      + Ảnh
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(mb.id, e)} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => add(side)} style={{ padding: '7px', border: '1px dashed #C4A882', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C', cursor: 'pointer' }}>
            + Thêm {side === 'bride' ? 'phù dâu' : 'phù rể'}
          </button>
        </div>
      </div>
    )
  }

  return <div>{renderGroup(brides, 'bride')}{renderGroup(grooms, 'groom')}</div>
}

// ─── Schedule Editor ──────────────────────────────────────────

function ScheduleEditor({ events, onChange }: { events: ScheduleEvent[]; onChange: (v: ScheduleEvent[]) => void }) {
  function update(id: string, patch: Partial<ScheduleEvent>) {
    onChange(events.map(e => e.id === id ? { ...e, ...patch } : e))
  }
  function remove(id: string) { onChange(events.filter(e => e.id !== id)) }
  function add() { onChange([...events, { id: uid(), time: '', title: '', description: '', location: '' }]) }

  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map((ev, i) => (
        <div key={ev.id} style={{ border: '1px solid #E8DDD4', padding: 12, background: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#C4A882' }}>{ev.time || '--:--'}</span>
            <button onClick={() => remove(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4A882', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field label="Giờ"><input type="time" style={inp} value={ev.time} onChange={e => update(ev.id, { time: e.target.value })} /></Field>
              <Field label="Tên sự kiện"><input style={inp} value={ev.title} onChange={e => update(ev.id, { title: e.target.value })} placeholder="Lễ thành hôn" /></Field>
            </div>
            <Field label="Mô tả"><input style={inp} value={ev.description} onChange={e => update(ev.id, { description: e.target.value })} placeholder="Nghi thức kết hôn..." /></Field>
            <Field label="Địa điểm"><input style={inp} value={ev.location} onChange={e => update(ev.id, { location: e.target.value })} placeholder="Sảnh chính - Tầng 2" /></Field>
          </div>
        </div>
      ))}
      <button onClick={add} style={{ padding: '8px', border: '1px dashed #C4A882', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C', cursor: 'pointer' }}>
        + Thêm sự kiện
      </button>
    </div>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────

export default function EditorSidebar({ data, onChange }: Props) {
  const galleryRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  function handleCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const r = new FileReader(); r.onload = ev => onChange({ coverImage: ev.target?.result as string }); r.readAsDataURL(file)
  }
  function handleGallery(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if (!files.length) return
    Promise.all(files.map(f => new Promise<string>(res => { const r = new FileReader(); r.onload = ev => res(ev.target?.result as string); r.readAsDataURL(f) }))).then(imgs => onChange({ galleryImages: [...data.galleryImages, ...imgs] }))
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FAFAF7' }}>

      {/* ── Template ── */}
      <AccordionSection title="Template" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {(Object.keys(TEMPLATE_META) as TemplateId[]).map(tid => {
            const meta = TEMPLATE_META[tid]; const active = data.template === tid
            return (
              <button key={tid} onClick={() => onChange({ template: tid })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', border: `1px solid ${active ? '#C4A882' : '#E8DDD4'}`, background: active ? '#F5EDE4' : '#FFF', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {meta.palette.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.08)' }} />)}
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#2C2420', marginBottom: 1 }}>{meta.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#9C8C7C' }}>{meta.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </AccordionSection>

      {/* ── Sections toggle ── */}
      <AccordionSection title="Bật / tắt section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Toggle checked={data.showCountdown} onChange={v => onChange({ showCountdown: v })} label="Đếm ngược (countdown)" />
          <Toggle checked={data.showStory} onChange={v => onChange({ showStory: v })} label="Câu chuyện tình yêu" />
          <Toggle checked={data.showSchedule} onChange={v => onChange({ showSchedule: v })} label="Lịch trình trong ngày" />
          <Toggle checked={data.showParty} onChange={v => onChange({ showParty: v })} label="Đội hình hạnh phúc" />
          <Toggle checked={data.showGallery} onChange={v => onChange({ showGallery: v })} label="Ảnh gallery" />
          <Toggle checked={data.showRsvp} onChange={v => onChange({ showRsvp: v })} label="RSVP xác nhận" />
          <Toggle checked={data.showGuestbook ?? true} onChange={v => onChange({ showGuestbook: v })} label="Sổ lưu bút (lời chúc)" />
        </div>
      </AccordionSection>

      {/* ── Couple ── */}
      <AccordionSection title="Cô dâu & Chú rể" defaultOpen>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Field label="Tên cô dâu"><input style={inp} value={data.brideFirstName} onChange={e => onChange({ brideFirstName: e.target.value })} placeholder="Ngọc" /></Field>
          <Field label="Họ cô dâu"><input style={inp} value={data.brideLastName} onChange={e => onChange({ brideLastName: e.target.value })} placeholder="Linh" /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Field label="Tên chú rể"><input style={inp} value={data.groomFirstName} onChange={e => onChange({ groomFirstName: e.target.value })} placeholder="Minh" /></Field>
          <Field label="Họ chú rể"><input style={inp} value={data.groomLastName} onChange={e => onChange({ groomLastName: e.target.value })} placeholder="Tuấn" /></Field>
        </div>
        <Field label="Kiểu chữ tên">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {(['serif', 'script'] as const).map(f => {
              const active = (data.coupleNameFont ?? 'serif') === f
              const labels = { serif: '✦ Sang trọng', script: '✍️ Viết tay' }
              const previews = { serif: "'Cormorant Garamond', serif", script: "'Great Vibes', cursive" }
              return (
                <button key={f} onClick={() => onChange({ coupleNameFont: f })}
                  style={{ padding: '9px 8px', border: `1px solid ${active ? '#C4A882' : '#E8DDD4'}`, background: active ? '#F5EDE4' : '#FFF', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                  <p style={{ fontFamily: previews[f], fontSize: f === 'script' ? 18 : 14, color: '#2C2420', marginBottom: 3 }}>Tên</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: active ? '#9C8C7C' : '#C4A882' }}>{labels[f]}</p>
                </button>
              )
            })}
          </div>
        </Field>
        <Field label="Lời nhắn">
          <textarea style={ta} value={data.message} onChange={e => onChange({ message: e.target.value })} placeholder="Lời mời chân thành..." />
        </Field>
      </AccordionSection>

      {/* ── Date & Venue ── */}
      <AccordionSection title="Ngày & Địa điểm">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Field label="Ngày cưới"><input type="date" style={inp} value={data.weddingDate} onChange={e => onChange({ weddingDate: e.target.value })} /></Field>
          <Field label="Giờ"><input type="time" style={inp} value={data.weddingTime} onChange={e => onChange({ weddingTime: e.target.value })} /></Field>
        </div>
        <Field label="Tên địa điểm"><input style={inp} value={data.venueName} onChange={e => onChange({ venueName: e.target.value })} /></Field>
        <Field label="Địa chỉ"><textarea style={{ ...ta, minHeight: 60 }} value={data.venueAddress} onChange={e => onChange({ venueAddress: e.target.value })} /></Field>
      </AccordionSection>

      {/* ── Our Story ── */}
      <AccordionSection title="Câu chuyện tình yêu" badge={`${data.storyMilestones.length}`}>
        <StoryEditor milestones={data.storyMilestones} onChange={v => onChange({ storyMilestones: v })} />
      </AccordionSection>

      {/* ── Schedule ── */}
      <AccordionSection title="Lịch trình ngày cưới" badge={`${data.scheduleEvents.length}`}>
        <ScheduleEditor events={data.scheduleEvents} onChange={v => onChange({ scheduleEvents: v })} />
      </AccordionSection>

      {/* ── Wedding Party ── */}
      <AccordionSection title="Đội hình hạnh phúc" badge={`${data.weddingParty.length}`}>
        <PartyEditor members={data.weddingParty} onChange={v => onChange({ weddingParty: v })} />
      </AccordionSection>

      {/* ── RSVP ── */}
      <AccordionSection title="RSVP">
        <Field label="Tên liên hệ"><input style={inp} value={data.rsvpName} onChange={e => onChange({ rsvpName: e.target.value })} /></Field>
        <Field label="Số điện thoại"><input style={inp} value={data.rsvpPhone} onChange={e => onChange({ rsvpPhone: e.target.value })} placeholder="0912 345 678" /></Field>
        <Field label="Hạn xác nhận"><input type="date" style={inp} value={data.rsvpDeadline} onChange={e => onChange({ rsvpDeadline: e.target.value })} /></Field>
      </AccordionSection>

      {/* ── Media ── */}
      <AccordionSection title="Hình ảnh">
        <Field label="Ảnh bìa">
          <div onClick={() => coverRef.current?.click()} style={{ border: '1px dashed #C4A882', cursor: 'pointer', overflow: 'hidden' }}>
            {data.coverImage ? (
              <div style={{ position: 'relative' }}>
                <img src={data.coverImage} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                <button onClick={e => { e.stopPropagation(); onChange({ coverImage: null }) }} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, background: 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9C8C7C', marginBottom: 3 }}>Nhấn để chọn ảnh bìa</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#C4A882' }}>JPG, PNG, WebP</p>
              </div>
            )}
          </div>
          <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />
        </Field>

        <Field label={`Gallery (${data.galleryImages.length} ảnh)`}>
          {data.galleryImages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, marginBottom: 8 }}>
              {data.galleryImages.map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => onChange({ galleryImages: data.galleryImages.filter((_, j) => j !== i) })} style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => galleryRef.current?.click()} style={{ width: '100%', padding: '7px', border: '1px dashed #C4A882', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C', cursor: 'pointer' }}>
            + Thêm ảnh
          </button>
          <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGallery} />
        </Field>
      </AccordionSection>

      {/* ── Music & Interaction ── */}
      <AccordionSection title="🎵 Nhạc & Tương tác">
        <Field label="URL nhạc nền (mp3, m4a...)">
          <input style={inp} value={data.musicUrl ?? ''} onChange={e => onChange({ musicUrl: e.target.value || undefined })} placeholder="https://example.com/nhac-cuoi.mp3" />
        </Field>
        <Field label="Tên bài hát (tuỳ chọn)">
          <input style={inp} value={data.musicTitle ?? ''} onChange={e => onChange({ musicTitle: e.target.value || undefined })} placeholder="VD: Hôn Nhân — Phùng Khánh Linh" />
        </Field>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
          <Toggle checked={data.showStickyToolbar ?? true} onChange={v => onChange({ showStickyToolbar: v })} label="Hiện thanh tương tác dưới cùng" />
          <Toggle checked={data.showLiveTicker ?? true} onChange={v => onChange({ showLiveTicker: v })} label="Hiện lời chúc tự cuộn" />
          <Toggle checked={data.allowReactions ?? true} onChange={v => onChange({ allowReactions: v })} label='Cho phép khách "Bắn tim"' />
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C', lineHeight: 1.5, padding: '8px 10px', background: '#F5EDE4', borderLeft: '2px solid #C4A882' }}>
          Thanh tương tác + lời chúc cuộn chỉ hiển thị trên thiệp khi khách xem — không hiện trong editor.
        </p>
      </AccordionSection>

      {/* ── Effects ── */}
      <AccordionSection title="✨ Hiệu ứng" defaultOpen>
        {/* Effect type selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(Object.keys(EFFECT_META) as EffectType[]).map(etype => {
            const meta = EFFECT_META[etype]
            const active = (data.effectType ?? 'petals') === etype
            return (
              <button
                key={etype}
                onClick={() => onChange({ effectType: etype })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', border: `1px solid ${active ? '#C4A882' : '#E8DDD4'}`,
                  background: active ? '#F5EDE4' : '#FFF', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{meta.emoji}</span>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#2C2420', marginBottom: 1 }}>{meta.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#9C8C7C' }}>{meta.desc}</p>
                </div>
                {active && <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#C4A882', flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>

        {/* Intensity */}
        {(data.effectType ?? 'petals') !== 'none' && (
          <>
            <Field label="Cường độ">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {(['light', 'medium', 'heavy'] as EffectIntensity[]).map(lvl => {
                  const labels = { light: '🌿 Nhẹ', medium: '🌸 Vừa', heavy: '🎊 Nhiều' }
                  const active = (data.effectIntensity ?? 'medium') === lvl
                  return (
                    <button key={lvl} onClick={() => onChange({ effectIntensity: lvl })}
                      style={{ padding: '7px 4px', border: `1px solid ${active ? '#C4A882' : '#E8DDD4'}`, background: active ? '#F5EDE4' : '#FFF', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: active ? '#2C2420' : '#9C8C7C', transition: 'all 0.15s' }}>
                      {labels[lvl]}
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="Màu riêng (để trống = dùng màu template)">
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 32, height: 32, border: '1px solid #E8DDD4', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: '100%', background: data.effectColor || EFFECT_META[data.effectType ?? 'petals'].defaultColor }} />
                  <input type="color" value={data.effectColor || EFFECT_META[data.effectType ?? 'petals'].defaultColor}
                    onChange={e => onChange({ effectColor: e.target.value })}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                </div>
                <input style={{ ...inp, flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 12 }}
                  value={data.effectColor || ''}
                  onChange={e => onChange({ effectColor: e.target.value || undefined })}
                  placeholder={EFFECT_META[data.effectType ?? 'petals'].defaultColor} />
                {data.effectColor && (
                  <button onClick={() => onChange({ effectColor: undefined })}
                    style={{ fontSize: 14, color: '#9C8C7C', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            </Field>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9C8C7C', lineHeight: 1.5, padding: '8px 10px', background: '#F5EDE4', borderLeft: '2px solid #C4A882' }}>
              Hiệu ứng hiển thị trên trang xem thiệp của khách mời. Xem trước bằng nút "Xem trước" ở trên.
            </p>
          </>
        )}
      </AccordionSection>

      <div style={{ height: 40 }} />
    </div>
  )
}
