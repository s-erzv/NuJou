# NuJou — Belajar Menulis Akademik (Zero to Hero)

Platform belajar menulis akademik Indonesia: **KTI, Esai, Paper, dan Jurnal**. Progres tersimpan
otomatis di browser (localStorage); level terkunci hingga ujian level sebelumnya lulus.

## Tech Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** — palet Putih & Sky Blue, font global **Times New Roman** (vibe akademik)
- **Zustand** (`persist`) — menyimpan progres, skor, dan level terbuka ke `localStorage`
- **React Router DOM** — routing
- Konten kursus sebagai **JSON statis** (`src/data/*.json`) — tanpa database eksternal
- **HTML5 Canvas** native untuk Papan Tulis (tanpa dependensi tambahan)
- **React Bits-style primitives** (`src/components/reactbits/`) — komponen interaktif diadaptasi
  dari [React Bits](https://reactbits.dev), ditulis ulang murni dengan React + CSS (tanpa
  dependensi/paket baru) agar tetap ringan dan konsisten dengan tema akademik

## Menjalankan (pakai pnpm)

```bash
pnpm install
pnpm dev        # jalankan dev server
pnpm build      # build produksi (tsc + vite)
pnpm preview    # pratinjau hasil build
```

## Struktur

```
src/
├─ data/                 # levels 1–6 (materi, kuis, ujian) sebagai JSON + index loader
├─ store/                # Zustand store (progres + logika unlock/pass)
├─ components/
│  ├─ reactbits/         # GlassSurface, ShinyText, SpotlightCard, ClickSpark, useSpotlight
│  ├─ Layout.tsx          Layout, ContentRenderer, ikon
│  └─ ...
├─ lib/                  # useReveal (scroll-reveal), confetti
├─ pages/                # Dashboard (Roadmap), Reading, Assessment (kuis/ujian),
│                        #   Whiteboard (Papan Tulis), Ecosystem, NotFound
├─ types.ts              # tipe konten & progres
├─ App.tsx               # definisi rute
└─ index.css             # tema global (Times New Roman, sky blue, layout .paper, efek React Bits)
```

## Komponen React Bits

Empat primitif interaktif di `src/components/reactbits/`, diadaptasi dari koleksi
[React Bits](https://reactbits.dev) menjadi React + CSS murni (nol dependensi baru):

- **GlassSurface** — panel kaca buram (frosted glass) dengan sheen lembut di bagian atas.
  Dipakai untuk navbar mengambang di `Layout.tsx`.
- **ShinyText** — highlight yang menyapu teks berlapis gradien secara berulang. Dipakai pada judul
  hero di Dashboard dan Ekosistem.
- **SpotlightCard** (+ hook `useSpotlight`) — glow lembut yang mengikuti kursor saat hover. Dipakai
  pada kartu statistik & roadmap di Dashboard, serta kartu tools di Ekosistem.
- **ClickSpark** — percikan partikel kecil saat tombol diklik. Dipakai pada tombol submit ujian,
  CTA ujian di Reading, dan tombol unduh PNG di Papan Tulis.

## Fitur

1. **Roadmap Dashboard** — progres visual Level 1→5. Level berikutnya terkunci sampai **ujian**
   level sebelumnya lulus (syarat lulus 70%).
2. **Reading View** — tata letak menyerupai paper akademik (justified, indentasi, tabel, kutipan).
3. **Kuis & Ujian** — penilaian otomatis, penjelasan tiap soal, hasil tersimpan di Zustand. Hanya
   **ujian** yang membuka level berikutnya (kuis bersifat latihan).
4. **Papan Tulis** — kanvas HTML5 untuk brainstorming & menggambar outline; unduh sebagai PNG.
5. **Ekosistem & Tools** — Mendeley, Zotero, Turnitin, Overleaf, indeksasi (Scopus, SINTA, DOAJ),
   alur publikasi, dan peringatan jurnal predator.

## Edge cases yang ditangani

- Mengakses level terkunci lewat URL langsung → dialihkan ke Roadmap.
- Slug level tidak dikenal → halaman 404.
- Progres persist antar sesi; tombol **Reset progres** tersedia di Dashboard.
- Hasil ujian terbaik yang lulus tidak tertimpa oleh percobaan gagal berikutnya.

## Kurikulum

| Level | Fokus |
|------|-------|
| 1 | Fundamental — bedah KTI, Esai, Paper, Jurnal |
| 2 | Struktur — anatomi jurnal & IMRaD |
| 3 | Literatur & Sitasi — referensi, parafrase, anti-plagiarisme |
| 4 | Nada Akademik — do's & don'ts, kata ganti, transisi |
| 5 | Ekosistem & Publikasi — tools riset & indeksasi |
| 6 | Proposal & Metodologi — rumusan masalah, metode, populasi/sampel, variabel |
