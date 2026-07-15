import { useReveal } from '../lib/useReveal';

type Tool = {
  name: string;
  desc: string;
  tag: string;
  url: string;
};

type Group = {
  title: string;
  blurb: string;
  tools: Tool[];
};

const GROUPS: Group[] = [
  {
    title: 'Manajer Referensi',
    blurb: 'Menyimpan sumber dan menyisipkan sitasi otomatis ke naskah.',
    tools: [
      { name: 'Zotero', desc: 'Open source, ringan, plugin browser & Word/LibreOffice.', tag: 'Gratis', url: 'https://www.zotero.org' },
      { name: 'Mendeley', desc: 'Milik Elsevier, terintegrasi Scopus & pembaca PDF.', tag: 'Gratis', url: 'https://www.mendeley.com' },
      { name: 'EndNote', desc: 'Fitur lengkap, umum di institusi besar.', tag: 'Berbayar', url: 'https://endnote.com' },
    ],
  },
  {
    title: 'Cek Orisinalitas',
    blurb: 'Mendeteksi kemiripan teks untuk menjaga integritas.',
    tools: [
      { name: 'Turnitin', desc: 'Pemeriksa similarity standar institusi pendidikan.', tag: 'Institusi', url: 'https://www.turnitin.com' },
      { name: 'iThenticate', desc: 'Cek plagiarisme untuk naskah jurnal profesional.', tag: 'Berbayar', url: 'https://www.ithenticate.com' },
    ],
  },
  {
    title: 'Penulisan & LaTeX',
    blurb: 'Menyusun naskah rapi, terutama yang penuh rumus dan tabel.',
    tools: [
      { name: 'Overleaf', desc: 'Editor LaTeX daring, kolaboratif, banyak templat jurnal.', tag: 'Freemium', url: 'https://www.overleaf.com' },
      { name: 'Grammarly', desc: 'Pemeriksa tata bahasa (Inggris) — pembantu, bukan pengganti revisi.', tag: 'Freemium', url: 'https://www.grammarly.com' },
      { name: 'LanguageTool', desc: 'Pemeriksa tata bahasa multibahasa & open source.', tag: 'Freemium', url: 'https://languagetool.org' },
    ],
  },
  {
    title: 'Indeksasi & Reputasi Jurnal',
    blurb: 'Menakar mutu dan menemukan jurnal tujuan yang kredibel.',
    tools: [
      { name: 'Scopus', desc: 'Basis data sitasi internasional; kuartil Q1–Q4.', tag: 'Internasional', url: 'https://www.scopus.com' },
      { name: 'SINTA', desc: 'Pemeringkatan jurnal Indonesia (S1–S6), Kemendikbud.', tag: 'Nasional', url: 'https://sinta.kemdikbud.go.id' },
      { name: 'DOAJ', desc: 'Direktori jurnal akses terbuka bereputasi.', tag: 'Open Access', url: 'https://doaj.org' },
      { name: 'Google Scholar', desc: 'Mesin pencari akademik paling inklusif.', tag: 'Gratis', url: 'https://scholar.google.com' },
    ],
  },
];

const WORKFLOW = [
  'Kumpulkan literatur dan simpan di Zotero/Mendeley.',
  'Tulis draf; sisipkan sitasi otomatis dari reference manager.',
  'Rapikan format di Word atau Overleaf (LaTeX).',
  'Periksa tata bahasa (Grammarly/LanguageTool) dan orisinalitas (Turnitin).',
  'Verifikasi jurnal tujuan lewat Scopus/DOAJ/SINTA.',
  'Submit via OJS → peer review → revisi → terbit ber-DOI.',
];

export default function Ecosystem() {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <div ref={reveal} className="relative">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />
      <div className="container-academic relative py-12">
      <header className="mb-10 text-center">
        <h1 className="animate-fade-in-up font-serif text-4xl font-bold sm:text-5xl">
          <span className="text-gradient">Ekosistem Riset & Publikasi</span>
        </h1>
        <p className="animate-fade-in-up mx-auto mt-3 max-w-2xl text-lg text-slate-600" style={{ animationDelay: '120ms' }}>
          Perangkat dan alur kerja yang digunakan peneliti sungguhan — dari mengelola referensi
          hingga menembus jurnal terindeks.
        </p>
      </header>

      {/* Workflow */}
      <section className="reveal mx-auto mb-12 max-w-3xl rounded-2xl border border-sky-100 bg-sky-50/50 p-6 shadow-card">
        <h2 className="font-serif text-xl font-bold text-slate-900">Alur Kerja Riset Umum</h2>
        <ol className="mt-4 space-y-2">
          {WORKFLOW.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Tool groups */}
      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.title} className="reveal">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{group.title}</h2>
            <p className="mb-4 text-slate-500">{group.blurb}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex flex-col rounded-2xl border border-sky-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-sky-700">
                      {tool.name}
                    </h3>
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.desc}</p>
                  <span className="mt-3 text-sm font-semibold text-sky-600">Kunjungi →</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Predator warning */}
      <section className="reveal mx-auto mt-12 max-w-3xl rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-6 shadow-card">
        <h2 className="font-serif text-xl font-bold text-amber-800">Waspada Jurnal Predator</h2>
        <p className="mt-2 text-slate-700">
          Jurnal predator menjanjikan terbit sangat cepat dengan biaya (APC) tanpa peer review yang
          sungguh-sungguh. Ciri: email spam mengajak submit, klaim indeksasi palsu, dan biaya tidak
          transparan. Selalu verifikasi lewat Scopus, DOAJ, atau SINTA sebelum mengirim naskah.
        </p>
      </section>
      </div>
    </div>
  );
}
