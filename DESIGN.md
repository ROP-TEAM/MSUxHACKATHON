---
name: iTiket
description: Consumer Event Discovery & Ticket Booking Platform — horizontal-scroll category rows, AI Matching CTA bar, hero carousel, dark news section, paginated event grid
colors:
  primary: "#359aff"
  primary-deep: "#0f6dd0"
  admin-accent: "#7c3aed"
  neutral-bg: "#ffffff"
  neutral-surface: "#f8f9fa"
  neutral-border: "#eef0f1"
  neutral-text: "#1f2123"
  neutral-muted: "#646b70"
  footer-bg: "#2a2f35"
  announcement-bg: "#111111"
typography:
  display:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Noto Sans Thai, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  pill: "24px"
  card: "12px"
  button: "50%"
  chat-bubble: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "16px"
components:
  ai-chat-trigger:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  chip:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.card}"
    border: "1px solid {colors.neutral-border}"
  chip-hover:
    backgroundColor: "#e8f3ff"
    border: "1px solid #a9d3ff"
    textColor: "{colors.neutral-text}"
  send-btn:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.button}"
    size: "34px"
  input-field:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.pill}"
    border: "1px solid #d9dcde"
  input-focus:
    border: "1px solid {colors.primary}"
    backgroundColor: "{colors.neutral-bg}"
---

# Design System: MSU x Hackathon

## 1. Overview

**Creative North Star: "The Festival Wall"**

Like a festival's information wall — bold, colorful event posters in a grid, clear wayfinding, everything visible at a glance. The interface is a consumer-facing ticket discovery platform: users land on the home page and immediately see trending events, browse by category, and book via AI Matching. Organizers access a separate "ภาพรวม" (Overview) page for stats.

This system explicitly rejects SaaS-corporate templates, dark-and-moody themes, and motion that distracts rather than guides. Every element earns its place: playful precision.

**Page Structure (as designed):**

*Home (หน้าแรก):*
1. **Nav** — logo left, links center (หน้าแรก | คอนเสิร์ต ▼ | ภาพรวม | ติดต่อเรา), AI icon right
2. **Hero Carousel** — full-width promotional banner (Dime! partnership, green/purple gradient), slide dots
3. **Announcement Bar** (black) — "จองตั๋วด้วย AI Matching" pill CTA + QR icon + ticket icon + `#ไม่พลาดเทรนด์` + tagline + MSUxHackathon branding
4. **Event Section Rows** — each: section title + ↗ arrow, horizontal-scroll poster cards
   - กำลังมาแรง / ใหม่ล่าสุด / ละครเวที
5. **ข่าวล่าสุด** header row
6. **มาแรงติดเทรนด์** (dark black section) — featured news cards with thumbnail, badge (Exclusive / นักเลง), Thai headline
7. **Footer** (dark ~`#2a2f35`) — iTiket logo + Dime! App QR code block + 3-column links (Product / Company / Legal & Regulatory)

*Concert Listing (คอนเสิร์ต):*
1. **Search Bar** — "ค้นหาอีเวนส์ของคุณ" with search icon
2. **งานทั้งหมด** — 6-column event poster grid, auto-fill rows
3. **Pagination** — 1 2 3 4 … 10 numbered

**Key Characteristics:**
- Bold blue anchor with energetic accents
- Event poster cards as primary visual unit (image-dominant, no heavy text overlay on card)
- Clean white body, dark footer, black announcement bar — three distinct surface layers
- Thai-first typography (Noto Sans Thai throughout)
- Rounded, friendly shapes
- Motion that responds, not decorates

## 2. Colors

A blue-led palette anchored by Concert Blue (`#359AFF`), balanced against a clean neutral scale. Purple secondary (`#7c3aed`) reserved for admin surfaces.

### Primary
- **Concert Blue** (`#359AFF`): Primary actions, selected states, links, AI icon. The one voice that carries the brand.
- **Concert Blue Deep** (`#0f6dd0`): Hover states for primary actions.
- **Concert Blue Light** (`#e8f3ff`): Chip hover, subtle active backgrounds.

### Secondary
- **Admin Purple** (`#7c3aed`): Admin-mode accent, admin tab indicators, admin message bubbles.

### Neutral
- **Pure White** (`#ffffff`): Page background, card surfaces.
- **Gentle Surface** (`#f8f9fa`): Input backgrounds, secondary surfaces, tab bars.
- **Soft Border** (`#eef0f1`): Dividers, card borders, panel edges.
- **Ink** (`#1f2123`): Body text, headings.
- **Muted** (`#646b70`): Secondary text, placeholders.
- **Faint** (`#8e9499`): Disabled text, subtle labels.

### Named Rules
**The One Voice Rule.** Concert Blue carries ≤20% of any given screen. Its rarity is the point — when you see blue, it means something.

## 3. Typography

**Body Font:** Noto Sans Thai (with latin subset)

A variable Thai sans-serif that handles the full weight spectrum (100–900). Single-family system: no pairing, one voice across all roles. The weight axis alone creates hierarchy.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 2.5rem), -0.02em): Page titles, hero sections. Use `text-wrap: balance`.
- **Headline** (600, 1rem, 1.5): Section headings, card titles.
- **Title** (500, 0.875rem, 1.4): Subtle sub-headings, component labels.
- **Body** (400, 0.85rem, 1.6): Prose, descriptions. Max 65–75ch.
- **Label** (500, 0.72rem, 1.4): Chips, badges, metadata, tab text.
- **Small** (500, 0.65rem, 1.3): Badges, timestamps, footnotes.

### Named Rules
**The Weight Hierarchy Rule.** Hierarchy is expressed through weight first, size second. A headline at 600/1rem has more presence than a label at 500/0.875rem — the weight step is the primary signal.

## 4. Elevation

Flat by default, layered on interaction. At rest, surfaces are separated by 1px borders (`--b-100: #eef0f1`). Depth is revealed through interaction hover states — chips lift with background color shifts, buttons with darker fills. No box-shadows in the system.

**Physical metaphor:** A pinboard where posters (cards, panels) lie flat against the wall. When you reach for one, it "lifts" through color response, not shadow.

### Named Rules
**The No-Shadow Rule.** Depth is conveyed through color, never shadow. A button hover darkens; a card hover shifts background; a selected tab gets a bottom border. If you find a `box-shadow` outside of modal/tooltip native browser chrome, it's a mistake.

## 5. Components

### AI Chat Trigger
- **Shape:** Pill-shaped floating button (24px radius).
- **Default:** Concert Blue background, white icon. Compact at 12px 20px padding.
- **Hover:** Concert Blue Deep. Slight scale transform.
- **Motion:** `background 0.15s, transform 0.2s ease-out-quart`.

### AI Panel
- **Width:** 320px fixed, full height.
- **Border:** 1px solid Soft Border on left edge.
- **Header:** Icon (36px circle, Concert Blue gradient) + title + subtitle + role badge.
- **Messages:** User bubbles (Concert Blue bg, white text, 16px/4px radius). AI bubbles (Gentle Surface bg, Ink text, 4px/16px radius).
- **Input:** Pill shape, Gentle Surface bg, 24px radius. Focus: white bg + Concert Blue border.
- **Send Button:** 34px circle, Concert Blue.

### Chips
- **Default:** Gentle Surface bg, 1px Soft Border, 12px radius, Ink text.
- **Hover:** Concert Blue Light bg, Concert Blue Light border.
- **Icon:** Emoji/SVG prefix at 13px.

### Navigation
- **Layout:** Logo left | links center | AI button right. White background, 1px bottom border.
- **Links (in order):** หน้าแรก · คอนเสิร์ต ▼ (dropdown) · ภาพรวม · ติดต่อเรา
- **Dropdown "คอนเสิร์ต":** งานทั้งหมด (`/events`) + ตั๋วของฉัน (`/tickets`)
- **Active indicator:** Sliding underline bar in Concert Blue, animates `left`+`width` 0.25s ease-out. Follows hover then settles on activeKey.
- **Default text:** Muted (`#646b70`). Active/hover: Concert Blue, weight 600.
- **Dropdown panel:** Gentle Surface bg, 12px radius, 1px Soft Border, `position: absolute`.
- **Right button:** Rounded square button with bubble-chat SVG icon + "AI" text label. Concert Blue on white.

### Hero Carousel
- **Full-width** banner area below nav. Height ~340px desktop.
- **Content:** Partnership promotional banners (e.g. Dime! / KKP บัญชีเสริม) with green/purple gradient + phone mockup imagery + bold Thai headline.
- **Indicators:** Row of dot pills below banner (gray inactive, darker active). Centered.
- **Motion:** Slide or crossfade transition between slides.

### Announcement Bar
- **Background:** Near-black (`#111111`). Full width, ~52px tall.
- **Layout (left→right):** "จองตั๋วด้วย AI Matching" pill CTA (Concert Blue bg) · QR icon · ticket icon · `#ไม่พลาดเทรนด์` bold white · tagline text muted · right-aligned "MSUxHackathon" brand + tagline small text.
- **Purpose:** Persistent conversion prompt — always visible between hero and event sections.

### Event Section Row
- **Structure:** Section title (Headline 600) left + ↗ arrow link right, then horizontal-scroll rail of EventCards below.
- **Title examples:** "กำลังมาแรง" · "ใหม่ล่าสุด" · "ละครเวที"
- **Rail:** `overflow-x: auto`, no scrollbar visible, gap 10–12px between cards.
- **Cards visible:** ~6 cards on desktop, partial 7th to signal scroll.

### Event Card
- **Size:** ~150×200px portrait. Image fills the entire card face (poster artwork).
- **Shape:** Slight radius (8–12px). No heavy text overlay on card face.
- **Hover:** Subtle scale (1.03) + shadow or brightness lift.
- **Badge (optional):** "SOLD OUT" overlay in red on sold-out events.
- **Below card (listing grid only):** Small text — event name + date in label typography.

### News Section (มาแรงติดเทรนด์)
- **Background:** Black (`#000` or `#0a0a0a`). Full-width dark section.
- **Header:** "มาแรงติดเทรนด์" white title + ↗ link.
- **Cards:** Horizontal scroll. Each card: large thumbnail top, badge pill ("Exclusive" white / "นักเลง" yellow-green on dark), Thai headline below (white, 2-line clamp), muted date/source text.
- **Card bg:** Dark surface (~`#1a1a1a`), 12px radius.

### Search Bar (listing page)
- **Position:** Top of `/events` page, below nav.
- **Style:** Full-width pill input, magnifier icon prefix, placeholder "ค้นหาอีเวนส์ของคุณ".
- **Background:** Gentle Surface. Focus: white + Concert Blue border.

### Event Grid (listing page)
- **Layout:** 6-column grid, auto-fill rows of EventCards.
- **Section title:** "งานทั้งหมด" above grid.
- **Spacing:** ~12px gap between cards.

### Pagination
- **Style:** Numbered buttons centered below EventGrid.
- **Format:** 1 · 2 · 3 · 4 · … · 10 (ellipsis for large ranges)
- **Active page:** Concert Blue bg, white text, circle/pill shape.
- **Inactive:** Muted text, transparent bg. Hover: Gentle Surface bg.

### Footer
- **Background:** Dark (`#2a2f35`). Full width.
- **Layout:** iTiket logo (white version) top-left · Dime! App block (logo + "KKP Dime, a member of Kiatnakin Phatra Financial Group" + QR code + "Scan to download Dime! App" CTA in Concert Blue) · then 3 link columns right-aligned.
- **Columns:** Product (Save · Invest · Spend · Manage) · Company (Company · Milestones · Career · Contact) · Legal & Regulatory (Announcements · Cookies Policy · Privacy Notice · Business License)
- **Column headers:** Concert Blue, label weight 500. Links: Muted white/gray.

### Tabs
- **Full-width tab bar** (wrapper header).
- **Active tab:** Bottom border (2px) in Concert Blue (user) or Admin Purple (admin).
- **Default:** Muted text, transparent bottom border.
- **Background:** Gentle Surface, white for active.

## 6. Do's and Don'ts

### Do:
- **Do** use Concert Blue sparingly — it's the brand's one voice, make it count.
- **Do** use weight over size for hierarchy.
- **Do** keep surfaces flat at rest; lift with color on interaction.
- **Do** animate with purpose — state transitions (hover, focus, active) in 0.15–0.2s.
- **Do** use `text-wrap: balance` on headings to avoid orphans.

### Don't:
- **Don't** use box-shadows. Depth comes from color, not shadow.
- **Don't** use side-stripe borders (`border-left` > 1px as colored accent).
- **Don't** use gradient text (`background-clip: text`).
- **Don't** use SaaS-corporate template patterns (big number + small label stats, identical card grids).
- **Don't** put numbered section markers (01/02/03) above every section — they earn their place only when order carries information.
- **Don't** use tiny uppercase tracked eyebrows ("ABOUT" / "PROCESS") as a default scaffold.
- **Don't** apply glassmorphism (backdrop blurs on cards) — decorative, not functional.
- **Don't** use bounce or elastic easings. Stick to ease-out-quart/quint/expo.
- **Don't** nest cards — cards are the leaf affordance.
