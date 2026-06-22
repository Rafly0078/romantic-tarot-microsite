import { assetPaths } from "./assets";

export type ChapterKind = "arrival" | "bracelet" | "cards" | "closing";

export type TarotReveal = {
  id: string;
  title: string;
  message: string;
  variant?: "message" | "photo";
  photoFrameAsset?: string;
  photoLabel?: string;
  photoSlot?: string;
  photoSrc?: string;
  photoAlt?: string;
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
  photoLabel?: string;
  photoSlot?: string;
  photoSrc?: string;
  photoAlt?: string;
  revealCards?: TarotReveal[];
};

export const loadingMessages = [
  "Mengocok kartu terbaik buat kamu...",
  "Menyusun langit kecil berikutnya...",
  "Menarik selembar cerita baru...",
  "Menyiapkan ruang kecil buat fotomu...",
  "Menyimpan senyum manis di balik kartu...",
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
    id: "photo-spell",
    order: 4,
    roman: "IV",
    kind: "cards",
    title: "Kartu kecil tentang kamu",
    subtitle: "Buka satu kartu. Nanti bagian depannya bisa jadi tempat foto kamu.",
    eyebrow: "Photo spell",
    body: [
      "Aku mau beberapa halaman di sini terasa seperti album kecil.",
      "Bukan album yang ramai. Cuma tempat buat wajahmu muncul pelan-pelan, seperti kejutan kecil di balik kartu."
    ],
    ctaLabel: "Lanjut ke memori kecil",
    loadingHint: "Menuju Chapter V",
    badgeAsset: assetPaths.cards.badge4,
    heroAsset: assetPaths.mascot.wand,
    frameAsset: assetPaths.cards.frameFrontAlt,
    revealCards: [
      {
        id: "photo-smile",
        title: "The Smile",
        message: "Di sini nanti taruh foto senyummu. Biar halaman ini punya alasan sendiri buat terasa hangat.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearPortrait,
        photoLabel: "foto senyummu",
        photoSlot: "/assets/photos/ila-01.jpg"
      },
      {
        id: "photo-soft-look",
        title: "The Soft Look",
        message: "Satu foto yang kelihatannya sederhana, tapi cukup buat bikin aku berhenti sebentar.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearOval,
        photoLabel: "foto Ila",
        photoSlot: "/assets/photos/ila-02.jpg"
      },
      {
        id: "photo-little-day",
        title: "The Little Day",
        message: "Kalau ada foto dari harimu yang biasa aja, aku tetap mau simpan di sini.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearPortrait,
        photoLabel: "momen kecil",
        photoSlot: "/assets/photos/ila-03.jpg"
      }
    ]
  },
  {
    id: "kept-softly",
    order: 5,
    roman: "V",
    kind: "arrival",
    title: "Hal kecil yang kusimpan",
    subtitle: "Ada beberapa hal tentang kamu yang rasanya terlalu manis kalau cuma lewat begitu aja.",
    eyebrow: "A quiet memory",
    body: [
      "Mungkin nanti fotonya berubah-ubah, tapi rasanya tetap sama: aku senang punya alasan kecil buat ingat kamu.",
      "Kalau halaman ini suatu hari kamu buka lagi, semoga rasanya tetap seperti pesan pelan yang nemu jalan pulang."
    ],
    ctaLabel: "Buka halaman berikutnya",
    loadingHint: "Menuju Chapter VI",
    badgeAsset: assetPaths.cards.badge1,
    heroAsset: assetPaths.mascot.wand,
    frameAsset: assetPaths.cards.frameFront,
    photoFrameAsset: assetPaths.placeholders.clearOval,
    photoLabel: "foto favorit",
    photoSlot: "/assets/photos/ila-04.jpg"
  },
  {
    id: "matching-thread",
    order: 6,
    roman: "VI",
    kind: "bracelet",
    title: "The Matching Thread",
    subtitle: "Tentang dua benda kecil yang diam-diam punya arah yang sama.",
    eyebrow: "Tiny connection",
    body: [
      "Aku suka ide bahwa sesuatu yang kecil bisa tetap punya makna, asal dikasih niat yang benar.",
      "Gelang ini cuma benda. Tapi kalau kamu pakai, semoga dia jadi pengingat kecil bahwa kamu pernah dibuatkan sesuatu dengan hati-hati."
    ],
    ctaLabel: "Lanjut ke kartu foto",
    loadingHint: "Menuju Chapter VII",
    badgeAsset: assetPaths.cards.badge2,
    heroAsset: assetPaths.bracelet.bracelet,
    frameAsset: assetPaths.bracelet.frame2
  },
  {
    id: "three-photo-reasons",
    order: 7,
    roman: "VII",
    kind: "cards",
    title: "Tiga tempat buat fotomu",
    subtitle: "Buka kartunya satu per satu. Nanti tiap kartu bisa jadi tempat momen penting kamu.",
    eyebrow: "Little gallery",
    body: [
      "Aku sengaja bikin beberapa ruang kosong, karena ada hal yang lebih cocok diisi sama fotomu daripada kata-kataku.",
      "Pilih satu kartu dulu. Sisanya boleh jadi rahasia kecil buat nanti."
    ],
    ctaLabel: "Menuju akhir manis",
    loadingHint: "Menuju Chapter VIII",
    badgeAsset: assetPaths.cards.badge3,
    heroAsset: assetPaths.mascot.familiar,
    frameAsset: assetPaths.cards.frameFrontAlt,
    revealCards: [
      {
        id: "photo-laugh",
        title: "The Laugh",
        message: "Tempat buat foto kamu yang kelihatan paling lepas, yang bikin suasana ikut ringan.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearPortrait,
        photoLabel: "foto tertawa",
        photoSlot: "/assets/photos/ila-05.jpg"
      },
      {
        id: "photo-calm",
        title: "The Calm",
        message: "Tempat buat foto yang tenang. Yang kalau dilihat, rasanya dunia boleh pelan sebentar.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearOval,
        photoLabel: "foto tenang",
        photoSlot: "/assets/photos/ila-06.jpg"
      },
      {
        id: "photo-favorite",
        title: "The Favorite",
        message: "Tempat buat satu foto favorit. Tidak perlu sempurna, yang penting terasa kamu.",
        variant: "photo",
        photoFrameAsset: assetPaths.placeholders.clearPortrait,
        photoLabel: "foto favorit",
        photoSlot: "/assets/photos/ila-07.jpg"
      }
    ]
  },
  {
    id: "final-gift",
    order: 8,
    roman: "VIII",
    kind: "closing",
    title: "The Little Gift",
    subtitle: "Sampai sini dulu. Sisanya biar dibuka pelan-pelan sama kamu.",
    eyebrow: "Final charm",
    body: [
      "Kalau kamu sudah sampai di halaman ini, berarti semua kartu kecilnya berhasil menemukan kamu.",
      "Sekarang tinggal satu bagian terakhir: buka hadiahnya, dan semoga kamu suka walau bentuknya sederhana."
    ],
    ctaLabel: "Buka Hadiahnya",
    loadingHint: "Hadiah terakhir",
    badgeAsset: assetPaths.cards.badge4,
    heroAsset: assetPaths.mascot.envelopeClear,
    frameAsset: assetPaths.cards.frameFront,
    photoFrameAsset: assetPaths.placeholders.clearPortrait,
    photoLabel: "foto terakhir",
    photoSlot: "/assets/photos/ila-08.jpg"
  }
];
