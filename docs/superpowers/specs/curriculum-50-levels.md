# NuJou — 50-level curriculum spec

Authoring contract for level JSON files in `src/data/levelN.json`.
Levels 1-10 already exist. This spec covers 11-50.

## Voice & language

- Primary language **Indonesian**, casual-but-precise. Mixing in English terms
  is expected and encouraged (the user asked for "mix indo english boleh") —
  keep English for terms of art (`hook`, `voice`, `peer review`, `byline`,
  `lede`, `call-to-action`), gloss them the first time.
- Address the reader as `kamu`. Warm, concrete, never lecturing.
- Use analogies to everyday Indonesian life. Existing levels compare Methods to
  a "resep masakan" and article structure to a supermarket layout — match that
  register.
- Never pad. Every paragraph must teach something a beginner didn't know.

## JSON schema (exact — `src/types.ts` is the source of truth)

```jsonc
{
  "id": 11,                       // number, matches filename
  "slug": "kebab-case-slug",      // URL segment, unique
  "title": "Judul Level",
  "subtitle": "Satu frasa penjelas",
  "goal": "Satu kalimat panjang: apa yang bisa dilakukan pembelajar setelah level ini.",
  "estimatedMinutes": 35,         // realistic read time
  "sections": [
    {
      "id": "11-1",               // "<levelId>-<n>"
      "title": "Judul Bagian",
      "blocks": [ /* see block types */ ]
    }
  ],
  "quiz":  { "id": "quiz-11", "title": "Kuis Level 11", "passRatio": 0.7, "questions": [ /* 7 */ ] },
  "exam":  { "id": "exam-11", "title": "Ujian Level 11", "passRatio": 0.7, "questions": [ /* 10 */ ] },
  "sources": [ /* 4-6 entries */ ]
}
```

### Block types (discriminated union — no other `type` values exist)

```jsonc
{ "type": "heading",    "text": "..." }
{ "type": "subheading", "text": "..." }
{ "type": "paragraph",  "text": "..." }
{ "type": "list",       "ordered": true, "items": ["...", "..."] }
{ "type": "quote",      "text": "...", "source": "..." }
{ "type": "table",      "headers": ["A","B"], "rows": [["1","2"]] }
{ "type": "callout",    "title": "...", "text": "..." }
```

### Question shape

```jsonc
{
  "id": "q11-1",              // quiz: q<level>-<n>; exam: e<level>-<n>
  "question": "...",
  "options": ["...", "...", "...", "..."],   // exactly 4
  "answer": 1,                                // 0-based index into options
  "explanation": "Kenapa jawabannya itu."
}
```

### Source shape

```jsonc
{
  "title": "Judul buku/artikel/halaman",
  "author": "Nama penulis atau organisasi",   // optional
  "year": 2019,                                // optional
  "publisher": "Penerbit / jurnal / situs",   // optional
  "url": "https://...",                        // optional
  "note": "Satu baris: dipakai untuk bagian apa di level ini."  // optional
}
```

**Sources must be real.** Cite works that genuinely exist (Swales & Feak,
Booth's *The Craft of Research*, Strunk & White, APA Publication Manual, Zinsser's
*On Writing Well*, Hayot's *The Elements of Academic Style*, COPE guidelines,
ICMJE, PRISMA statement, Kemdikbud/SINTA/DOAJ/Scopus pages, Purdue OWL, Nielsen
Norman Group, etc.). **Never invent a title, author, DOI, or URL.** If unsure of
a URL, omit the `url` field rather than guessing. Prefer well-known,
verifiable works over obscure ones.

## Content requirements per level

- **8-9 sections.** Substantial — the existing levels run ~250-300 lines of JSON.
- Mix block types. Every level needs at least one `table` and at least two
  `callout`s. Use `quote` for worked examples.
- At least one section must show a **worked before/after example** (bad version
  → good version) — this is the single most useful thing for a learner.
- Final section is always **"Kesalahan Umum ..."** listing 4+ concrete mistakes.
- **Cross-reference other levels by number** where relevant, e.g. "ingat pola
  CARS dari Level 2" — the curriculum should feel like one connected course.

## Question requirements (IMPORTANT)

The user explicitly asked for questions that **make you think**, and that are
**not verbatim restatements of the material**.

- **Quiz (7 questions):** may check recall/understanding directly. Still no
  copy-paste-from-the-text wording.
- **Exam (10 questions):** must be **applied scenarios**. Present a situation —
  a writer did X, an editor said Y, a draft contains Z — and ask what the flaw
  is, what to do next, or which option is best. The learner should have to
  *use* the concept, not recall its definition.
  - Good: "Seorang penulis menaruh kalimat 'temuan ini sejalan dengan teori X'
    di bagian Results. Kesalahannya adalah…"
  - Bad: "Apa itu Results?"
- All 4 options must be plausible. No obviously silly throwaway options.
- `explanation` must teach *why*, not just restate the correct option.

## Tier plan (levels 11-50)

**11-14 · Metode lanjutan & etika** (continues the 7-10 methods tier)
- 11 `tinjauan-pustaka` — Tinjauan Pustaka yang Kritis (bukan ringkasan berantai; synthesis matrix)
- 12 `systematic-review` — Systematic Review & PRISMA (protokol, screening, flow diagram)
- 13 `mixed-methods` — Mixed Methods (desain sequential/concurrent, integrasi data)
- 14 `etika-penelitian` — Etika Penelitian (informed consent, anonimitas, IRB/komisi etik, data pribadi)

**15-22 · Menulis & merevisi artikel jurnal**
- 15 `menulis-abstrak` — Menulis Abstrak yang Dilirik
- 16 `menulis-discussion` — Menulis Discussion yang Kuat (tafsir, limitations, tanpa overclaim)
- 17 `judul-keywords` — Judul & Keywords yang Ditemukan Orang
- 18 `memilih-jurnal` — Memilih Jurnal Tujuan (scope match, kuartil, waktu tunggu, APC)
- 19 `cover-letter` — Cover Letter & Submission
- 20 `peer-review` — Memahami Peer Review (jenis review, membaca komentar reviewer)
- 21 `revisi-mayor-minor` — Menjawab Revisi Mayor & Minor (response letter, point-by-point)
- 22 `ditolak-submit-ulang` — Ditolak? Bangkit & Submit Ulang (desk reject vs review reject)

**23-28 · Skripsi/tesis**
- 23 `anatomi-skripsi` — Anatomi Skripsi & Tesis (beda dengan artikel jurnal)
- 24 `bab-1-pendahuluan` — Bab 1: Pendahuluan yang Meyakinkan
- 25 `bab-2-kajian-teori` — Bab 2: Kajian Teori & Kerangka Berpikir
- 26 `bab-4-hasil` — Bab 4: Hasil & Pembahasan
- 27 `bab-5-simpulan` — Bab 5: Simpulan & Saran
- 28 `sidang-skripsi` — Menghadapi Sidang (presentasi, menjawab penguji)

**29-38 · Menulis personal & naratif** (user-requested tier — give this real care)
- 29 `menemukan-voice` — Menemukan Voice Menulismu
- 30 `personal-essay` — Anatomi Personal Essay (scene vs reflection)
- 31 `hook-pembuka` — Hook: 3 Detik Pertama (lede types)
- 32 `storytelling` — Storytelling & Show, Don't Tell
- 33 `menulis-di-medium` — Menulis di Medium (publication, tag, curation, formatting)
- 34 `newsletter-substack` — Newsletter & Substack (niche, cadence, growing a list)
- 35 `opini-op-ed` — Menulis Opini & Op-Ed (struktur op-ed, pitch ke media)
- 36 `menulis-linkedin` — Menulis Profesional di LinkedIn & Personal Branding
- 37 `journaling-menulis-bebas` — Journaling & Menulis Bebas (morning pages, freewriting sebagai bahan)
- 38 `mengedit-tulisan-sendiri` — Mengedit Tulisan Sendiri (read-aloud, kill your darlings, cut 10%)

**39-44 · Menulis digital & publik**
- 39 `seo-untuk-penulis` — SEO Dasar untuk Penulis
- 40 `headline-yang-diklik` — Headline yang Diklik (tanpa clickbait murahan)
- 41 `komunikasi-sains` — Komunikasi Sains ke Publik Awam
- 42 `copywriting-dasar` — Copywriting Dasar (AIDA, fitur vs benefit)
- 43 `kebiasaan-menulis` — Membangun Kebiasaan Menulis (habit, sistem, bukan mood)
- 44 `writers-block` — Menaklukkan Writer's Block

**45-50 · Mahir & publikasi lanjutan**
- 45 `book-review` — Menulis Book Review & Literature Essay
- 46 `policy-brief` — Policy Brief & Ringkasan Eksekutif
- 47 `menulis-kolaboratif` — Menulis Kolaboratif & Urutan Authorship (ICMJE criteria)
- 48 `proposal-hibah` — Proposal Hibah & Pendanaan Riset
- 49 `self-plagiarism` — Self-Plagiarism & Publikasi Ganda (salami slicing)
- 50 `portofolio-menulis` — Membangun Portofolio Menulis (capstone; menyatukan semua tier)

## Registering a level

After writing `src/data/levelN.json`, add it to `src/data/index.ts` (import +
array entry, in numeric order). Levels unlock sequentially, so order matters.

## Verification

- `python3 -c "import json; json.load(open('src/data/levelN.json'))"` must pass
  for every file authored.
- `pnpm lint` (tsc --noEmit) must pass with zero errors after registering.
- Check every `answer` index actually points at the correct option — an
  off-by-one here silently teaches the wrong thing.
