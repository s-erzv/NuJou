import { useReveal } from '../lib/useReveal';
import ShinyText from '../components/reactbits/ShinyText';
import { useSpotlight } from '../components/reactbits/useSpotlight';
import { TOOL_GROUPS, WORKFLOW, PREDATORY_SIGNS, type Tool } from '../data/ecosystem';

const TOTAL_TOOLS = TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);

export default function Ecosystem() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div ref={reveal} className="relative">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[320px]" />

      <div className="container-academic relative py-12">
        <header className="mb-10 text-center">
          <h1 className="animate-fade-in-up font-serif text-4xl font-bold sm:text-5xl">
            <ShinyText>Ekosistem Riset & Publikasi</ShinyText>
          </h1>
          <p
            className="animate-fade-in-up mx-auto mt-3 max-w-2xl text-lg text-slate-600"
            style={{ animationDelay: '120ms' }}
          >
            {TOTAL_TOOLS} perangkat dan alur kerja yang dipakai peneliti sungguhan — dari mencari
            literatur, mengolah data, sampai menembus jurnal terindeks.
          </p>
        </header>

        {/* Jump nav — the page is long, so let people skip to what they need */}
        <nav className="reveal mx-auto mb-12 flex max-w-3xl flex-wrap justify-center gap-2">
          {TOOL_GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              {group.title}
            </a>
          ))}
        </nav>

        {/* Workflow */}
        <section className="reveal mx-auto mb-14 max-w-3xl rounded-2xl border border-sky-100 bg-sky-50/50 p-6 shadow-card">
          <h2 className="font-serif text-xl font-bold text-slate-900">Alur Kerja Riset Umum</h2>
          <p className="mt-1 text-sm text-slate-500">
            Urutan ini bukan aturan kaku, tapi begini biasanya sebuah naskah lahir.
          </p>
          <ol className="mt-4 space-y-3">
            {WORKFLOW.map((item, i) => (
              <li key={item.step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.step}</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Tool groups */}
        <div className="space-y-14">
          {TOOL_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="reveal scroll-mt-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900">{group.title}</h2>
              <p className="mb-4 text-slate-500">{group.blurb}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Predator warning */}
        <section className="reveal mx-auto mt-16 max-w-3xl rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-6 shadow-card">
          <h2 className="font-serif text-xl font-bold text-amber-800">Waspada Jurnal Predator</h2>
          <p className="mt-2 text-slate-700">
            Jurnal predator menjanjikan terbit sangat cepat dengan biaya (APC) tanpa peer review yang
            sungguh-sungguh. Naskah yang terbit di sana sering dianggap tidak sah untuk kenaikan
            jabatan — dan sulit ditarik kembali. Kenali tandanya:
          </p>
          <ul className="mt-4 space-y-2">
            {PREDATORY_SIGNS.map((sign) => (
              <li key={sign} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                <span aria-hidden className="mt-0.5 shrink-0 font-bold text-amber-600">!</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-amber-800">
            Selalu verifikasi lewat Scopus, DOAJ, SINTA, atau Think. Check. Submit. sebelum mengirim
            naskah.
          </p>
        </section>
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const { ref, onMouseMove } = useSpotlight<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      onMouseMove={onMouseMove}
      href={tool.url}
      target="_blank"
      rel="noreferrer noopener"
      className="spotlight-host group flex flex-col rounded-2xl border border-sky-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-sky-700">
            {tool.name}
          </h3>
          <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
            {tool.tag}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.desc}</p>
        {tool.best && (
          <p className="mt-2 text-xs font-semibold leading-relaxed text-sky-600">★ {tool.best}</p>
        )}
        <span className="mt-3 text-sm font-semibold text-sky-600">Kunjungi →</span>
      </div>
    </a>
  );
}
