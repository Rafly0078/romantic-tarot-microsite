import { assetPaths } from "./assets";

export type ChapterKind = "arrival" | "bracelet" | "cards" | "closing";

export type TarotReveal = {
  id: string;
  title: string;
  message: string;
};

export type Chapter = {
  id: string;
  order: number;
  roman: string;
  kind: ChapterKind;
  title: string;
  subtitle: string;
  eyebrow: string;
  body: string[];
  ctaLabel: string;
  loadingHint: string;
  badgeAsset: string;
  heroAsset: string;
  frameAsset?: string;
  photoFrameAsset?: string;
  revealCards?: TarotReveal[];
};

export const loadingMessages = [
  "Mengocok kartu terbaik buat kamu...",
  "Menyusun langit kecil berikutnya...",
  "Menarik selembar cerita baru...",
  "Merangkai sedikit sihir untuk halaman selanjutnya...",
  "Preparing the next little chapter for you..."
];

export const chapters: Chapter[] = [
  {
    id: "arrival",
    order: 1,
    roman: "I",
    kind: "arrival",
    title: "The Arrival",
    subtitle: "Untuk kamu, yang hari ini mungkin sedang membuka sesuatu kecil dari jauh.",
    eyebrow: "A little parcel spell",
    body: [
      "Ada paket kecil yang jalan pelan-pelan ke arahmu.",
      "Bukan sesuatu yang ramai. Cuma tanda manis bahwa ada satu orang yang kepikiran kamu hari ini."
    ],
    ctaLabel: "Buka Kartunya",
    loadingHint: "Menuju Chapter II",
    badgeAsset: assetPaths.cards.badge1,
    heroAsset: assetPaths.mascot.gift,
    frameAsset: assetPaths.cards.frameFront,
    photoFrameAsset: assetPaths.placeholders.tarotPortrait
  },
  {
    id: "bracelet",
    order: 2,
    roman: "II",
    kind: "bracelet",
    title: "The Bracelet",
    subtitle: "A tiny symbol, but with a soft little meaning.",
    eyebrow: "Couple charm",
    body: [
      "Gelang ini bukan janji yang berat. Biar tetap ringan, lucu, dan sederhana.",
      "Anggap aja sebagai pengingat kecil: somewhere, ada satu versi lain dari benda ini yang nyambung ke kamu."
    ],
    ctaLabel: "Lanjutkan Ceritanya",
    loadingHint: "Menuju Chapter III",
    badgeAsset: assetPaths.cards.badge2,
    heroAsset: assetPaths.bracelet.bracelet,
    frameAsset: assetPaths.bracelet.frame1,
    photoFrameAsset: assetPaths.placeholders.moonPortrait
  },
  {
    id: "feeling-cards",
    order: 3,
    roman: "III",
    kind: "cards",
    title: "Mengocok kartu perasaan...",
    subtitle: "Pick one card. Biar si kecil penjaga bintang bantu bacain pesannya.",
    eyebrow: "Soft reading",
    body: [
      "Tidak ada ramalan yang serius di sini.",
      "Cuma beberapa kalimat kecil yang sengaja dibuat manis, biar senyummu muncul sebentar."
    ],
    ctaLabel: "Simpan Pesannya",
    loadingHint: "Menuju Chapter IV",
    badgeAsset: assetPaths.cards.badge3,
    heroAsset: assetPaths.mascot.familiar,
    frameAsset: assetPaths.cards.frameFrontAlt,
    revealCards: [
      {
        id: "warmth",
        title: "The Warm Spark",
        message: "Kalau hari ini terasa biasa aja, semoga hadiah kecil ini bikin hatimu agak lebih hangat."
      },
      {
        id: "thread",
        title: "The Golden Thread",
        message: "Ada hal-hal kecil yang lucu karena rasanya nyambung, even from far away."
      },
      {
        id: "moon-note",
        title: "The Moon Note",
        message: "You do not have to reply fast. Just let this little magic arrive first."
      }
    ]
  },
  {
    id: "arrival-note",
    order: 4,
    roman: "IV",
    kind: "closing",
    title: "Tell me when it arrives",
    subtitle: "No pressure. Cuma aku pengen tahu kalau paket kecilnya sudah sampai dengan selamat.",
    eyebrow: "Final note",
    body: [
      "Kalau paketnya sudah di tanganmu, kabarin aku ya.",
      "Biar aku tahu si gelang kecil, kartunya, dan semua niat baik di dalamnya akhirnya sampai ke orang yang tepat."
    ],
    ctaLabel: "Kabarin Lewat WhatsApp",
    loadingHint: "Halaman terakhir",
    badgeAsset: assetPaths.cards.badge4,
    heroAsset: assetPaths.mascot.envelope,
    frameAsset: assetPaths.cards.frameFront,
    photoFrameAsset: assetPaths.placeholders.softOval
  }
];
