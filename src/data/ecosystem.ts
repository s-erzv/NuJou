export interface Tool {
  name: string;
  desc: string;
  tag: string;
  url: string;
  /** Shown as a small "kelebihan" hint under the description. */
  best?: string;
}

export interface ToolGroup {
  id: string;
  title: string;
  blurb: string;
  tools: Tool[];
}

/**
 * The research & writing toolchain, grouped by the job each tool does.
 * Indonesian-specific services (SINTA, Garuda, OJS, RJI) sit alongside the
 * international ones on purpose — most learners here need both.
 */
export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'referensi',
    title: 'Manajer Referensi',
    blurb: 'Menyimpan sumber, merapikan metadata, dan menyisipkan sitasi otomatis ke naskah.',
    tools: [
      {
        name: 'Zotero',
        desc: 'Open source, ringan, plugin browser & Word/LibreOffice. Bisa sinkron antar-perangkat.',
        tag: 'Gratis',
        url: 'https://www.zotero.org',
        best: 'Pilihan default paling aman untuk pemula.',
      },
      {
        name: 'Mendeley',
        desc: 'Milik Elsevier, terintegrasi Scopus, punya pembaca PDF dengan anotasi.',
        tag: 'Gratis',
        url: 'https://www.mendeley.com',
        best: 'Cocok kalau kampusmu berlangganan Scopus.',
      },
      {
        name: 'EndNote',
        desc: 'Fitur lengkap, umum dipakai institusi besar dan penerbit.',
        tag: 'Berbayar',
        url: 'https://endnote.com',
      },
      {
        name: 'JabRef',
        desc: 'Manajer referensi berbasis BibTeX, favorit pengguna LaTeX.',
        tag: 'Gratis',
        url: 'https://www.jabref.org',
        best: 'Pasangan alami Overleaf.',
      },
      {
        name: 'Paperpile',
        desc: 'Terintegrasi erat dengan Google Docs dan Google Scholar.',
        tag: 'Berbayar',
        url: 'https://paperpile.com',
      },
    ],
  },
  {
    id: 'mencari',
    title: 'Mencari Literatur',
    blurb: 'Menemukan artikel yang relevan — termasuk yang tidak muncul di halaman pertama Google.',
    tools: [
      {
        name: 'Google Scholar',
        desc: 'Mesin pencari akademik paling inklusif. Punya fitur "cited by" untuk menelusuri sitasi.',
        tag: 'Gratis',
        url: 'https://scholar.google.com',
      },
      {
        name: 'Semantic Scholar',
        desc: 'Pencarian akademik berbantuan AI, dengan ringkasan otomatis (TLDR) tiap artikel.',
        tag: 'Gratis',
        url: 'https://www.semanticscholar.org',
      },
      {
        name: 'Garuda',
        desc: 'Garba Rujukan Digital — indeks artikel dan jurnal terbitan Indonesia.',
        tag: 'Nasional',
        url: 'https://garuda.kemdikbud.go.id',
        best: 'Wajib dicek untuk topik lokal Indonesia.',
      },
      {
        name: 'Connected Papers',
        desc: 'Memetakan satu artikel menjadi graf artikel terkait — bagus untuk memulai tinjauan pustaka.',
        tag: 'Freemium',
        url: 'https://www.connectedpapers.com',
      },
      {
        name: 'PubMed',
        desc: 'Basis data rujukan bidang biomedis dan kesehatan.',
        tag: 'Gratis',
        url: 'https://pubmed.ncbi.nlm.nih.gov',
      },
      {
        name: 'ERIC',
        desc: 'Basis data literatur bidang pendidikan yang dikelola Departemen Pendidikan AS.',
        tag: 'Gratis',
        url: 'https://eric.ed.gov',
      },
    ],
  },
  {
    id: 'orisinalitas',
    title: 'Cek Orisinalitas',
    blurb: 'Mendeteksi kemiripan teks untuk menjaga integritas sebelum naskah dikirim.',
    tools: [
      {
        name: 'Turnitin',
        desc: 'Pemeriksa similarity standar institusi pendidikan Indonesia.',
        tag: 'Institusi',
        url: 'https://www.turnitin.com',
        best: 'Biasanya diakses lewat akun kampus, bukan pribadi.',
      },
      {
        name: 'iThenticate',
        desc: 'Versi Turnitin untuk naskah jurnal profesional; dipakai banyak penerbit.',
        tag: 'Berbayar',
        url: 'https://www.ithenticate.com',
      },
      {
        name: 'Plagiarism Checker X',
        desc: 'Alternatif desktop untuk pengecekan mandiri sebelum submit resmi.',
        tag: 'Berbayar',
        url: 'https://plagiarismcheckerx.com',
      },
    ],
  },
  {
    id: 'menulis',
    title: 'Menulis & Menyusun Naskah',
    blurb: 'Menyusun naskah rapi, terutama yang penuh rumus, tabel, dan sitasi.',
    tools: [
      {
        name: 'Overleaf',
        desc: 'Editor LaTeX daring, kolaboratif, banyak templat jurnal siap pakai.',
        tag: 'Freemium',
        url: 'https://www.overleaf.com',
        best: 'Standar de facto untuk naskah penuh rumus matematika.',
      },
      {
        name: 'Zettlr',
        desc: 'Editor Markdown untuk akademisi, mendukung sitasi dan ekspor ke Word/PDF.',
        tag: 'Gratis',
        url: 'https://www.zettlr.com',
      },
      {
        name: 'Obsidian',
        desc: 'Catatan berbasis Markdown dengan tautan antar-catatan — bagus untuk membangun literature note.',
        tag: 'Gratis',
        url: 'https://obsidian.md',
      },
      {
        name: 'Scrivener',
        desc: 'Ditujukan untuk naskah panjang: skripsi, tesis, disertasi, atau buku.',
        tag: 'Berbayar',
        url: 'https://www.literatureandlatte.com/scrivener',
      },
    ],
  },
  {
    id: 'bahasa',
    title: 'Bahasa & Penyuntingan',
    blurb: 'Membantu tata bahasa dan keterbacaan — pembantu, bukan pengganti revisi sendiri.',
    tools: [
      {
        name: 'Grammarly',
        desc: 'Pemeriksa tata bahasa Inggris dengan saran gaya penulisan.',
        tag: 'Freemium',
        url: 'https://www.grammarly.com',
      },
      {
        name: 'LanguageTool',
        desc: 'Pemeriksa tata bahasa multibahasa dan open source — mendukung bahasa Indonesia.',
        tag: 'Freemium',
        url: 'https://languagetool.org',
        best: 'Salah satu yang mendukung bahasa Indonesia.',
      },
      {
        name: 'KBBI Daring',
        desc: 'Kamus Besar Bahasa Indonesia resmi dari Badan Bahasa — rujukan kata baku.',
        tag: 'Gratis',
        url: 'https://kbbi.kemdikbud.go.id',
        best: 'Rujukan wajib untuk memastikan kata baku (Level 4).',
      },
      {
        name: 'Hemingway Editor',
        desc: 'Menyorot kalimat yang terlalu panjang atau berbelit — melatih kalimat efektif.',
        tag: 'Freemium',
        url: 'https://hemingwayapp.com',
      },
      {
        name: 'EYD/PUEBI Daring',
        desc: 'Pedoman Umum Ejaan Bahasa Indonesia resmi dari Badan Bahasa.',
        tag: 'Gratis',
        url: 'https://ejaan.kemdikbud.go.id',
      },
    ],
  },
  {
    id: 'data',
    title: 'Analisis Data',
    blurb: 'Mengolah data kuantitatif maupun kualitatif sebelum ditulis jadi temuan.',
    tools: [
      {
        name: 'SPSS',
        desc: 'Perangkat statistik paling umum di kampus Indonesia, antarmuka klik.',
        tag: 'Berbayar',
        url: 'https://www.ibm.com/products/spss-statistics',
      },
      {
        name: 'JASP',
        desc: 'Alternatif gratis dan open source untuk SPSS, mendukung analisis Bayesian.',
        tag: 'Gratis',
        url: 'https://jasp-stats.org',
        best: 'Pengganti SPSS yang gratis dan ramah pemula.',
      },
      {
        name: 'R / RStudio',
        desc: 'Bahasa statistik open source yang sangat kuat dan bisa direproduksi.',
        tag: 'Gratis',
        url: 'https://posit.co/download/rstudio-desktop',
      },
      {
        name: 'NVivo',
        desc: 'Membantu mengorganisasi coding dan tema data kualitatif (Level 9).',
        tag: 'Berbayar',
        url: 'https://lumivero.com/products/nvivo',
      },
      {
        name: 'Taguette',
        desc: 'Alat coding kualitatif open source — alternatif gratis untuk NVivo.',
        tag: 'Gratis',
        url: 'https://www.taguette.org',
      },
    ],
  },
  {
    id: 'indeksasi',
    title: 'Indeksasi & Reputasi Jurnal',
    blurb: 'Menakar mutu dan menemukan jurnal tujuan yang kredibel sebelum mengirim naskah.',
    tools: [
      {
        name: 'Scopus',
        desc: 'Basis data sitasi internasional; sumber peringkat kuartil Q1–Q4.',
        tag: 'Internasional',
        url: 'https://www.scopus.com',
      },
      {
        name: 'SINTA',
        desc: 'Pemeringkatan jurnal Indonesia (S1–S6) dari Kemdikbud.',
        tag: 'Nasional',
        url: 'https://sinta.kemdikbud.go.id',
        best: 'Rujukan utama akreditasi jurnal nasional.',
      },
      {
        name: 'DOAJ',
        desc: 'Direktori jurnal akses terbuka yang sudah diseleksi kualitasnya.',
        tag: 'Open Access',
        url: 'https://doaj.org',
      },
      {
        name: 'Scimago Journal Rank',
        desc: 'Melihat kuartil dan tren sitasi sebuah jurnal secara gratis.',
        tag: 'Gratis',
        url: 'https://www.scimagojr.com',
        best: 'Cara gratis mengecek kuartil tanpa akses Scopus.',
      },
      {
        name: 'Web of Science',
        desc: 'Basis data sitasi Clarivate; sumber Journal Impact Factor.',
        tag: 'Internasional',
        url: 'https://www.webofscience.com',
      },
    ],
  },
  {
    id: 'publikasi',
    title: 'Publikasi & Identitas Peneliti',
    blurb: 'Mengirim naskah, mendapat identitas digital, dan membuat karyamu bisa ditemukan.',
    tools: [
      {
        name: 'OJS',
        desc: 'Open Journal Systems — perangkat lunak yang dipakai hampir semua jurnal Indonesia untuk submission.',
        tag: 'Gratis',
        url: 'https://pkp.sfu.ca/software/ojs',
        best: 'Antarmuka yang akan kamu temui saat submit ke jurnal nasional.',
      },
      {
        name: 'ORCID',
        desc: 'Identitas digital permanen untuk peneliti — memastikan karyamu tidak tertukar dengan nama serupa.',
        tag: 'Gratis',
        url: 'https://orcid.org',
        best: 'Daftar sekarang, gratis, dipakai seumur karier.',
      },
      {
        name: 'Crossref',
        desc: 'Lembaga yang menerbitkan DOI — penanda permanen sebuah artikel.',
        tag: 'Institusi',
        url: 'https://www.crossref.org',
      },
      {
        name: 'ResearchGate',
        desc: 'Jejaring sosial peneliti untuk berbagi naskah dan berdiskusi.',
        tag: 'Gratis',
        url: 'https://www.researchgate.net',
      },
      {
        name: 'arXiv',
        desc: 'Repositori preprint untuk fisika, matematika, ilmu komputer, dan bidang terkait.',
        tag: 'Gratis',
        url: 'https://arxiv.org',
      },
      {
        name: 'Zenodo',
        desc: 'Repositori terbuka untuk data, kode, dan materi pendukung penelitian; memberi DOI.',
        tag: 'Gratis',
        url: 'https://zenodo.org',
      },
    ],
  },
  {
    id: 'menerbitkan-personal',
    title: 'Menerbitkan Tulisan Personal',
    blurb: 'Kalau tulisanmu bukan untuk jurnal, ini rumah-rumah yang tersedia.',
    tools: [
      {
        name: 'Medium',
        desc: 'Platform blogging dengan publication dan sistem kurasi bawaan.',
        tag: 'Freemium',
        url: 'https://medium.com',
      },
      {
        name: 'Substack',
        desc: 'Newsletter gratis dengan opsi langganan berbayar; kamu memiliki daftar pembacamu.',
        tag: 'Freemium',
        url: 'https://substack.com',
      },
      {
        name: 'Ghost',
        desc: 'Platform publikasi open source, bisa self-hosted — kendali penuh atas situsmu.',
        tag: 'Freemium',
        url: 'https://ghost.org',
      },
      {
        name: 'The Conversation Indonesia',
        desc: 'Media tempat akademisi menulis untuk publik awam, disunting jurnalis profesional.',
        tag: 'Nasional',
        url: 'https://theconversation.com/id',
        best: 'Jembatan antara dunia akademik dan pembaca umum.',
      },
    ],
  },
];

export const WORKFLOW: { step: string; detail: string }[] = [
  {
    step: 'Kumpulkan literatur',
    detail: 'Cari lewat Scholar/Garuda/Semantic Scholar, simpan rapi di Zotero atau Mendeley.',
  },
  {
    step: 'Baca & buat catatan',
    detail: 'Bangun literature note (Obsidian/Zettlr) — bukan sekadar menandai PDF.',
  },
  {
    step: 'Susun kerangka',
    detail: 'Petakan gagasan dulu di Papan Tulis NuJou sebelum menulis kalimat pertama.',
  },
  {
    step: 'Tulis draf',
    detail: 'Word atau Overleaf (LaTeX); sisipkan sitasi otomatis dari reference manager.',
  },
  {
    step: 'Olah data',
    detail: 'JASP/SPSS/R untuk kuantitatif, NVivo/Taguette untuk kualitatif.',
  },
  {
    step: 'Sunting & periksa',
    detail: 'LanguageTool/KBBI untuk bahasa, Turnitin untuk orisinalitas.',
  },
  {
    step: 'Verifikasi jurnal tujuan',
    detail: 'Cek scope, kuartil, dan reputasi lewat Scimago, DOAJ, atau SINTA.',
  },
  {
    step: 'Submit & revisi',
    detail: 'Kirim via OJS → peer review → revisi → terbit ber-DOI, tercatat di ORCID-mu.',
  },
];

export const PREDATORY_SIGNS: string[] = [
  'Email spam mengajak submit, sering menyebut namamu dengan salah atau tidak menyebut bidangmu.',
  'Menjanjikan terbit sangat cepat (misalnya "review 3 hari") — peer review sungguhan butuh minggu hingga bulan.',
  'Klaim indeksasi palsu atau memakai metrik karangan sendiri ("Journal Impact Factor" abal-abal).',
  'Biaya (APC) tidak transparan, atau baru disebut setelah naskahmu diterima.',
  'Cakupan (scope) terlalu luas — satu jurnal mengaku menerima kedokteran, hukum, dan teknik sekaligus.',
  'Dewan editor tidak jelas, tidak punya afiliasi, atau namanya dicatut tanpa izin.',
  'Situsnya penuh salah ketik, kontaknya cuma alamat Gmail.',
];
