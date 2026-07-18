import { Link } from 'react-router-dom';
import { levels } from '../data';
import { TIERS } from '../data/tiers';
import { useStore } from '../store/useStore';
import { useReveal } from '../lib/useReveal';
import ShinyText from '../components/reactbits/ShinyText';
import ClickSpark from '../components/reactbits/ClickSpark';
import DotGrid from '../components/reactbits/DotGrid';
import Cubes from '../components/reactbits/Cubes';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import TextPressure from '../components/reactbits/TextPressure';
import TrueFocus from '../components/reactbits/TrueFocus';
import GradualBlur from '../components/reactbits/GradualBlur';
import { useSpotlight } from '../components/reactbits/useSpotlight';
import { ArrowIcon, BookIcon, PenIcon, EcosystemIcon, MapIcon } from '../components/icons';

const TOTAL_SECTIONS = levels.reduce((n, l) => n + l.sections.length, 0);
const TOTAL_QUESTIONS = levels.reduce(
  (n, l) => n + l.quiz.questions.length + l.exam.questions.length,
  0,
);
const TOTAL_SOURCES = levels.reduce((n, l) => n + (l.sources?.length ?? 0), 0);

// Two reading "arcs" over the sequential 50-level spine — a way to orient
// newcomers without changing the unlock order.
const ARCS = [
  {
    label: 'Academic Track',
    range: 'Level 1–28',
    desc: 'Fondasi tulisan ilmiah, metode penelitian & data, publikasi jurnal, sampai skripsi dan sidang.',
    tint: 'from-sky-100 to-white',
  },
  {
    label: 'Personal & Public Track',
    range: 'Level 29–50',
    desc: 'Menemukan voice, personal essay, storytelling, Medium & Substack, op-ed, sampai portofolio.',
    tint: 'from-sky-50 to-white',
  },
];

export default function Landing() {
  const reveal = useReveal<HTMLDivElement>();
  const completedCount = useStore((s) => s.completedCount);
  const done = completedCount();

  return (
    <div ref={reveal} className="relative">
      {/* ---- Hero: DotGrid backdrop + TextPressure headline ---- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <DotGrid
            dotSize={5}
            gap={26}
            baseColor="#e7f2fc"
            activeColor="#3b7dc4"
            proximity={130}
            shockRadius={220}
            shockStrength={4}
            returnDuration={1.4}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_42%,white_35%,transparent_82%)]"
        />

        <div className="container-academic relative flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
          <span className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur">
            <BookIcon className="h-3.5 w-3.5" /> {levels.length} level · gratis · terus di-update
          </span>

          {/* Interactive variable-font headline */}
          <div className="mx-auto w-full max-w-3xl">
            <TextPressure
              text="MENULIS"
              minFontSize={64}
              textColor="#294863"
              className="font-bold"
            />
          </div>

          <h1 className="animate-fade-in-up mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            <ShinyText>bukan sekadar mengetik.</ShinyText>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: '120ms' }}
          >
            Dari <span className="font-semibold text-slate-800">KTI, esai, dan artikel jurnal</span>{' '}
            sampai tulisan personal di <span className="font-semibold text-slate-800">Medium</span> atau{' '}
            <span className="font-semibold text-slate-800">Substack</span>. Learn to write, step by
            step — pelan-pelan, sampai betul-betul bisa.
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <ClickSpark>
              <Link to="/roadmap" className="cursor-target btn-primary px-6 py-3 text-base">
                {done > 0 ? 'Lanjutkan Belajar' : 'Mulai dari Level 1'} <ArrowIcon className="h-4 w-4" />
              </Link>
            </ClickSpark>
            <Link to="/papan-tulis" className="cursor-target btn-ghost px-6 py-3 text-base">
              Coba Papan Tulis
            </Link>
          </div>

          <p className="animate-fade-in-up mt-6 text-xs text-slate-400" style={{ animationDelay: '320ms' }}>
            No sign-up. Progresmu tersimpan otomatis di browser ini.
          </p>
        </div>
      </section>

      {/* ---- Two tracks ---- */}
      <section className="border-t border-sky-100 bg-sky-50/40">
        <div className="container-academic py-20">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Dua jalur, satu peta</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Mau nulis jurnal, atau nulis di Substack?
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Kurikulumnya satu garis 50 level yang saling menyambung. Tapi kamu bisa membacanya
              sebagai dua arc — akademik dulu, atau langsung ke sisi personal. You choose the vibe.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {ARCS.map((arc) => (
              <div
                key={arc.label}
                className={`reveal cursor-target rounded-2xl border border-sky-200 bg-gradient-to-br ${arc.tint} p-6 shadow-card`}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                  {arc.range}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-slate-900">{arc.label}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{arc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What you'll learn: CardSwap ---- */}
      <section className="overflow-hidden border-t border-sky-100">
        <div className="container-academic grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">What you'll learn</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Empat dunia menulis, satu kurikulum
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-600">
              Tidak semua tulisan minta hal yang sama. Jurnal minta bukti dan struktur; blog minta
              suara dan cerita. NuJou mengajarkan keduanya — dan kapan memakai yang mana.
            </p>
            <Link
              to="/roadmap"
              className="cursor-target mt-6 inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
            >
              Lihat peta lengkapnya <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="reveal relative h-[420px] sm:h-[460px]">
            <CardSwap width={320} height={250} cardDistance={40} verticalDistance={48} delay={3800} pauseOnHover>
              <Card className="border border-sky-200 bg-white p-6 shadow-lift">
                <MapIcon className="h-6 w-6 text-sky-600" />
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">Fondasi Akademik</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Bedah KTI, esai, paper, dan jurnal. Kuasai IMRaD, sitasi, parafrase, dan nada
                  akademik yang objektif.
                </p>
              </Card>
              <Card className="border border-sky-200 bg-white p-6 shadow-lift">
                <BookIcon className="h-6 w-6 text-sky-600" />
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">Metode & Data</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Kualitatif, kuantitatif, analisis tematik, sampai statistik secukupnya untuk
                  membaca dan menulis hasil dengan jujur.
                </p>
              </Card>
              <Card className="border border-sky-200 bg-white p-6 shadow-lift">
                <PenIcon className="h-6 w-6 text-sky-600" />
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">Tulisan Personal</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Menemukan voice, menulis personal essay, hook yang menahan pembaca, dan terbit di
                  Medium atau Substack.
                </p>
              </Card>
              <Card className="border border-sky-200 bg-white p-6 shadow-lift">
                <EcosystemIcon className="h-6 w-6 text-sky-600" />
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">Publikasi</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Memilih jurnal, cover letter, menghadapi peer review, dan mengenali jurnal
                  predator sebelum terlambat.
                </p>
              </Card>
            </CardSwap>
          </div>
        </div>
      </section>

      {/* ---- The 7 tiers (bento) ---- */}
      <section className="border-t border-sky-100 bg-sky-50/40">
        <div className="container-academic py-20">
          <div className="reveal mb-10 text-center">
            <div className="flex justify-center">
              <TrueFocus sentence="Tujuh Tahap Belajar" />
            </div>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              Lima puluh level dikelompokkan jadi tujuh tahap yang runtut, dari fondasi sampai mahir.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIERS.map((tier, i) => (
              <TierBento key={tier.id} index={i} name={tier.name} blurb={tier.blurb} from={tier.from} to={tier.to} />
            ))}
            <Link
              to="/roadmap"
              className="cursor-target group flex flex-col items-start justify-center rounded-2xl border border-dashed border-sky-300 bg-white/60 p-5 transition hover:bg-white"
            >
              <span className="font-serif text-lg font-bold text-sky-700">Buka peta lengkap</span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                Semua 50 level <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- How it works: Cubes ---- */}
      <section className="border-t border-sky-100">
        <div className="container-academic grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="reveal order-2 mx-auto w-full max-w-sm lg:order-1">
            <Cubes
              gridSize={6}
              maxAngle={55}
              radius={3}
              borderStyle="1px solid #aed3f2"
              faceColor="#f4f9fe"
              rippleColor="#3b7dc4"
              rippleSpeed={1.6}
              cellGap={6}
              autoAnimate
              rippleOnClick
            />
            <p className="mt-4 text-center text-xs text-slate-400">Klik kubusnya — biar seru sedikit.</p>
          </div>

          <div className="reveal order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">How it works</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Baca, uji, buka level berikutnya
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                ['Baca materinya', 'Tiap level punya materi panjang, contoh nyata, before/after, dan sumber rujukan asli.'],
                ['Kerjakan kuis', 'Latihan santai dulu untuk cek pemahaman — boleh diulang sepuasnya.'],
                ['Taklukkan ujian', 'Soalnya scenario-based, menuntut berpikir, bukan menghafal. Lulus 70% untuk lanjut.'],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- Numbers ---- */}
      <section className="border-t border-sky-100 bg-sky-50/40">
        <div className="container-academic py-16">
          <div className="grid gap-6 text-center sm:grid-cols-4">
            {[
              [levels.length, 'level belajar'],
              [TOTAL_SECTIONS, 'bagian materi'],
              [TOTAL_QUESTIONS, 'soal latihan & ujian'],
              [TOTAL_SOURCES, 'sumber rujukan asli'],
            ].map(([value, label]) => (
              <div key={label} className="reveal">
                <p className="font-display text-4xl font-bold text-sky-700 sm:text-5xl">{value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-center text-sm text-slate-500">
            ✎ Materi NuJou <span className="font-semibold text-sky-700">terus diperbarui</span> — level
            dan modul baru ditambahkan seiring waktu. Yang kamu lihat hari ini baru permulaan.
          </p>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="border-t border-sky-100">
        <div className="container-academic py-20 text-center">
          <h2 className="reveal font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Tulisan pertamamu tidak akan sempurna.
          </h2>
          <p className="reveal mx-auto mt-3 max-w-xl leading-relaxed text-slate-600">
            And that's okay. Yang penting mulai dulu, lalu revisi. Level 1 is waiting.
          </p>
          <div className="reveal mt-8">
            <ClickSpark>
              <Link to="/roadmap" className="cursor-target btn-primary px-6 py-3 text-base">
                Buka Peta Belajar <ArrowIcon className="h-4 w-4" />
              </Link>
            </ClickSpark>
          </div>
        </div>
      </section>

      {/* Soft blur at the very bottom edge of the page */}
      <GradualBlur position="bottom" height="5rem" strength={2} divCount={5} curve="ease-out" />
    </div>
  );
}

function TierBento({
  index,
  name,
  blurb,
  from,
  to,
}: {
  index: number;
  name: string;
  blurb: string;
  from: number;
  to: number;
}) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="spotlight-host cursor-target rounded-2xl border border-sky-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="spotlight-glow" aria-hidden />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sm font-bold text-sky-700">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Level {from}–{to}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-slate-900">{name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{blurb}</p>
      </div>
    </div>
  );
}
