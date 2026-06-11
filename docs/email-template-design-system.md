# Email Template Design System

A clean, newsletter-quality transactional email system with two templates: a **client confirmation** and an **admin notification**. Built with table-based HTML for maximum email client compatibility.

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Brand Gold | `#FFC81A` | Checkmark circle, CTA buttons, accents, footer border |
| Dark | `#0f1115` | Logo bar, step circles (alt), footer background |
| Hero BG | `#ede9fe` | Client email hero section |
| Alert BG | `#FFC81A` | Admin email alert banner |
| Card BG | `#f8f9fa` | Receipt rows, contact detail rows (zebra) |
| Urgent Box | `#FFF9E6` | Urgent help box background |
| Border | `#e5e7eb` | Dividers, card borders |
| Body Text | `#374151` | Message body, table values |
| Muted Text | `#6b7280` | Subtitles, helper text |
| Purple Text | `#4c3f72` | Hero subtitle (on light purple bg) |
| Label Text | `#9ca3af` | Uppercase column labels in cards |

**Font stack:** `Inter, 'Segoe UI', Arial, sans-serif`

---

## Layout

- **Max width:** 600px, centered
- **Outer background:** `#f2f2f2`
- **Outer padding:** `32px 16px`
- **Email shell:** white `#ffffff`, `border-radius: 14px`, `box-shadow: 0 8px 40px rgba(0,0,0,0.13)`
- **All layout:** table-based (`role="presentation"`) — no flexbox, no grid
- **Inner section padding:** `28–36px 32px`

---

## Template 1 — Client Confirmation

Sent to the person who submitted the contact form.

### Section Order

```
┌─────────────────────────────────────────┐
│  LOGO BAR        dark #0f1115           │
│  [footer-logo-white.png]                │
├─────────────────────────────────────────┤
│  HERO            light purple #ede9fe   │
│  ✓ gold circle                          │
│  "Thank You, {name}!"  dark headline    │
│  subtitle in #4c3f72                    │
│  [novaimpact-submit.png]  280px wide    │
├─────────────────────────────────────────┤
│  WHAT HAPPENS NEXT   white #fff         │
│  ① gold circle  — step title + desc    │
│  ② dark circle  — step title + desc    │
│  ③ gold circle  — step title + desc    │
├─────────────────────────────────────────┤
│  ── divider #e5e7eb ──                  │
├─────────────────────────────────────────┤
│  YOUR SUBMISSION     white #fff         │
│  zebra receipt table (Subject / Message │
│  preview / Submitted date)             │
├─────────────────────────────────────────┤
│  ── divider #e5e7eb ──                  │
├─────────────────────────────────────────┤
│  WHILE YOU WAIT      white #fff         │
│  [View Our Portfolio]  dark button      │
│  [Read Our Blog]       outline button   │
├─────────────────────────────────────────┤
│  URGENT HELP BOX     #FFF9E6 / gold     │
│  border, centered email address         │
├─────────────────────────────────────────┤
│  FOOTER              dark #0f1115       │
│  3px gold top border                    │
│  Company name (gold) + tagline          │
│  Social icon pills  [YT][IN][IG][X]     │
│  Website URL                            │
└─────────────────────────────────────────┘
```

### Step Circles

Alternating gold/dark circles with numbers — 40×40px, `border-radius: 50%`.

| Step | Circle BG | Number Color |
|------|-----------|--------------|
| 1 | `#FFC81A` gold | `#0f1115` dark |
| 2 | `#0f1115` dark | `#FFC81A` gold |
| 3 | `#FFC81A` gold | `#0f1115` dark |

### Submission Receipt Card

Zebra-striped table with `border: 1px solid #e5e7eb`, `border-radius: 10px`:

- Rows alternate between `#f8f9fa` and `#ffffff`
- Labels: `11px`, `700` weight, `uppercase`, `letter-spacing: 0.7px`, color `#9ca3af`
- Values: `13–14px`, color `#374151` or `#0f1115` (bold for Subject)
- Message preview truncated to 140 characters

---

## Template 2 — Admin Notification

Sent to admin email addresses when a new form is submitted.

### Section Order

```
┌─────────────────────────────────────────┐
│  LOGO BAR        dark #0f1115           │
│  [footer-logo-white.png]  left          │
│  [● New Lead]  gold pill badge  right   │
├─────────────────────────────────────────┤
│  ALERT BANNER    gold #FFC81A           │
│  🔔 dark square icon  left             │
│  "New Contact Form Submission"          │
│  Received on {timestamp}               │
├─────────────────────────────────────────┤
│  CONTACT DETAILS     white #fff         │
│  zebra card: Name / Email / Phone /     │
│  Subject                               │
├─────────────────────────────────────────┤
│  MESSAGE             white #fff         │
│  gold left-border blockquote (4px)     │
│  italic body text                       │
├─────────────────────────────────────────┤
│  ACTION BUTTONS      white #fff         │
│  [Reply to {name}]   gold button        │
│  [View in Admin →]   dark button        │
├─────────────────────────────────────────┤
│  FOOTER              dark #0f1115       │
│  3px gold top border                    │
│  Social icon pills + website URL        │
└─────────────────────────────────────────┘
```

### "New Lead" Badge

```
display: inline-block
background: #FFC81A
color: #0f1115
font-size: 11px, font-weight: 800
padding: 5px 14px
border-radius: 999px
text-transform: uppercase
letter-spacing: 0.6px
```

### Message Blockquote

```
background: #f8f9fa
border-left: 4px solid #FFC81A
border-radius: 0 8px 8px 0
padding: 20px 22px
font-style: italic
line-height: 1.7
```

---

## Images

| File | Used In | Display Width | Notes |
|------|---------|---------------|-------|
| `assets/imgs/logo/footer-logo-white.png` | Both headers | 155–170px | White logo — works on dark `#0f1115` header |
| `images/ulistration/novaimpact-submit.png` | Client hero | 280px | Dark artwork — works on light purple `#ede9fe` hero |

> **Rule:** match illustration background to hero background. Dark illustration → light hero. Light illustration → dark or gold hero.

All image `src` values must be **absolute URLs** in emails (`https://yourdomain.com/...`). Relative paths are ignored by email clients.

---

## Social Icon Pills

Text-based pills — no external icon fonts needed (blocked by many email clients).

```html
<a href="{url}" style="
  display: inline-block;
  margin: 0 5px;
  width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 50%;
  background: #2a2a2a;
  color: #fff;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
">YT</a>
```

Labels used: `YT` / `IN` / `IG` / `X`

---

## Hidden Preheader

Each email starts with an invisible preheader — the preview text shown by email clients before the user opens the email:

```html
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f2f2f2;">
  Your preheader text here&#8203;&#65279;&#8203;
</div>
```

The `&#8203;&#65279;&#8203;` zero-width characters prevent the email client from pulling body content into the preview.

---

## Email Client Compatibility Notes

| Feature | Support |
|---------|---------|
| `border-radius` on `<td>` | Not supported in Outlook 2007–2019 |
| `border-radius` on `<table>` | Partial — degrades gracefully |
| Flexbox / CSS Grid | Not supported — use `<table>` layout |
| Web fonts (`@font-face`) | Gmail/Apple Mail only — always include system font fallbacks |
| CSS variables | Not supported — use hardcoded hex values |
| `overflow: hidden` on tables | Unreliable — avoid for clipping |
| SVG images | Blocked in Outlook — use PNG/JPG |
| External images | May be blocked by default — provide meaningful `alt` text |

---

## Reuse Checklist

When adapting for a new project, replace:

- [ ] Logo image URL → your `footer-logo-white.png` equivalent (white version for dark header)
- [ ] Illustration image URL → choose based on hero background color
- [ ] Hero background color (`#ede9fe`) → match your brand or keep light purple
- [ ] Brand gold (`#FFC81A`) → your primary accent color
- [ ] Dark (`#0f1115`) → your dark/near-black brand color
- [ ] `siteUrl` → your production domain
- [ ] Social links → your accounts
- [ ] Company name, tagline, contact email
- [ ] Step copy in "What happens next?" → match your response process
- [ ] CTA links → your portfolio, blog, or relevant pages
