# 🌙 A Little Tarot Gift — Romantic Tarot Microsite

A dreamy, cute-mystical romantic QR microsite built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Designed to be scanned from a QR code inside a romantic couple bracelet gift package.

## ✨ Features

- **4-chapter narrative flow** — The Arrival → The Bracelet → Feeling Cards → Closing Note
- **Interactive tarot card reading** — Tap to flip 3 poetic cards in a fan spread
- **Magical loading transitions** — 5-card shuffle animation between chapters
- **WhatsApp CTA** — Deep link to send a "parcel arrived" message
- **Photo placeholders** — Decorative frames ready for real photos
- **Procedurally generated SVG assets** — All illustrations generated from code
- **Mobile-first** — Optimized for 390×844 to 430×932 viewports

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Generate Assets

All visual assets (celestial icons, tarot cards, mascots, frames) are generated from SVG code:

```bash
npm run generate:assets
```

This creates PNG files in `public/assets/` and SVG sources in `public/assets/sources/`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a mobile-sized browser window.

### Production Build

```bash
npm run build
npm start
```

---

## 🎨 Customization Guide

### Change Chapter Text

Edit [`data/chapters.ts`](data/chapters.ts):

```typescript
// Each chapter has these editable fields:
{
  title: "The Arrival",           // Main heading
  subtitle: "Your subtitle...",   // Below the heading
  eyebrow: "A little parcel spell", // Small accent text above title
  body: [                          // Array of paragraphs in the parchment panel
    "First paragraph...",
    "Second paragraph..."
  ],
  ctaLabel: "Buka Kartunya",      // Button text
}
```

For the 3 feeling cards in Chapter III, edit the `revealCards` array:

```typescript
revealCards: [
  {
    id: "warmth",
    title: "The Warm Spark",
    message: "Your poetic message here..."
  },
  // ...
]
```

### Change WhatsApp Number & Message

Edit [`data/siteConfig.ts`](data/siteConfig.ts):

```typescript
export const siteConfig = {
  senderName: "Aku",
  recipientName: "kamu",
  whatsapp: {
    number: "6281234567890",   // Replace with real number (international format)
    message: "Hii, paketnya udah sampaii 🤍"  // Customize arrival message
  }
};
```

### Replace Bracelet Image

1. Replace `public/assets/bracelet/bracelet_placeholder_01.png` with your real bracelet photo
2. Keep the same filename, or update the path in [`data/assets.ts`](data/assets.ts):
   ```typescript
   bracelet: {
     bracelet: "/assets/bracelet/your_bracelet_photo.png",
     // ...
   }
   ```
3. Recommended size: square, 500×500px to 1024×1024px, transparent background

### Replace Photo Placeholders

The site has decorative photo frames in Chapters I and IV. To add real photos:

1. Prepare your photo (portrait orientation, roughly 3:4 ratio)
2. Place it in `public/assets/placeholders/`
3. Update the component — in [`components/PhotoPlaceholder.tsx`](components/PhotoPlaceholder.tsx), add your photo as a layer:
   ```tsx
   {/* Add below the gradient background div */}
   <img
     src="/assets/placeholders/your-photo.jpg"
     alt="Your description"
     className="absolute inset-[14%] rounded-[1rem] object-cover"
   />
   ```

### Customize Colors

**Tailwind tokens** — Edit [`tailwind.config.ts`](tailwind.config.ts):

```typescript
colors: {
  ivory: "#fff7ea",      // Primary background
  blush: "#f4c3ca",      // Pink accents
  rose: "#c56f82",       // Accent text
  navy: "#11172d",       // Dark backgrounds & headings
  gold: "#cfa15f",       // Borders, sparkles, highlights
  "rose-gold": "#d99a8b" // Gradient accents
}
```

**CSS custom properties** — Edit [`app/globals.css`](app/globals.css) for button styles, panel styles, and animation timings.

### Regenerate Assets After Changes

If you modify the SVG generation script:

```bash
npm run generate:assets
```

The script is at [`scripts/generate-assets.ts`](scripts/generate-assets.ts) — each `draw*()` function generates one asset category.

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page controller
│   └── globals.css         # Design system, animations, utilities
├── components/
│   ├── ChapterScreen.tsx   # Chapter layouts & navigation
│   ├── LoadingOverlay.tsx   # Loading transition animation
│   ├── TarotCard.tsx       # Interactive flip cards
│   ├── PhotoPlaceholder.tsx # Decorative photo frames
│   ├── FloatingDecor.tsx   # Ambient floating decorations
│   ├── SparkleParticles.tsx # Sparkle particle effects
│   └── AssetImage.tsx      # Resilient image loader
├── data/
│   ├── chapters.ts         # Chapter content & structure
│   ├── assets.ts           # Asset path registry
│   └── siteConfig.ts       # WhatsApp config
├── scripts/
│   └── generate-assets.ts  # SVG → PNG asset generator
└── public/assets/          # Generated visual assets
    ├── celestial/          # Sun, moon, stars, clouds
    ├── cards/              # Tarot card frames & badges
    ├── decor/              # Ornaments, dividers, hearts
    ├── mascot/             # Familiar, envelope, gift box
    ├── bracelet/           # Bracelet display
    ├── placeholders/       # Photo frame overlays
    ├── loading/            # Loading screen assets
    ├── ui/                 # Panel & button assets
    └── sources/            # SVG source files
```

## 📱 Design System

### Typography
- **Display**: Cormorant Garamond — magical headings
- **Body**: Nunito Sans — readable body text
- **Accent**: Patrick Hand — handwritten notes

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| ivory | `#fff7ea` | Primary background |
| parchment | `#fef6e8` | Panel fills |
| blush | `#f4c3ca` | Pink accents |
| rose | `#c56f82` | Accent text |
| peach | `#edb49d` | Warm accents |
| navy | `#11172d` | Dark backgrounds |
| midnight | `#0a0f1e` | Deep dark |
| charcoal | `#292733` | Body text |
| gold | `#cfa15f` | Borders, sparkles |
| rose-gold | `#d99a8b` | Gradient accents |
| lavender | `#b8a9c9` | Soft purple accents |

---

## 🌟 Adding More Chapters

1. Add a new `ChapterKind` in `data/chapters.ts`
2. Add the chapter object to the `chapters` array
3. Add a new content renderer in `ChapterScreen.tsx`
4. Add matching assets in `data/assets.ts`
5. Generate badge assets by adding entries in `scripts/generate-assets.ts`

---

## License

Personal project — not for redistribution.
