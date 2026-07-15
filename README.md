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
├─ data/            # levels 1–5 (materi, kuis, ujian) sebagai JSON + index loader
├─ store/           # Zustand store (progres + logika unlock/pass)
├─ components/      # Layout, ContentRenderer, ikon
├─ pages/           # Dashboard (Roadmap), Reading, Assessment (kuis/ujian),
│                   #   Whiteboard (Papan Tulis), Ecosystem, NotFound
├─ types.ts         # tipe konten & progres
├─ App.tsx          # definisi rute
└─ index.css        # tema global (Times New Roman, sky blue, layout .paper)
```

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
