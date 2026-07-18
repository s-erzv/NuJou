import { useState } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../data';
import { TIERS } from '../data/tiers';
import { PATHS } from '../data/paths';
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
import CurvedLoop from '../components/reactbits/CurvedLoop';
import SpecularButton from '../components/reactbits/SpecularButton';
import BorderGlow from '../components/reactbits/BorderGlow';
import OptionWheel from '../components/reactbits/OptionWheel';
import InfiniteMenu from '../components/reactbits/InfiniteMenu';
import { useSpotlight } from '../components/reactbits/useSpotlight';
import { ArrowIcon, BookIcon, PenIcon, EcosystemIcon, MapIcon } from '../components/icons';

const CONTACT_EMAIL = 'nujou.journal@gmail.com';

// Fun practice prompts — spin the wheel to get a random writing challenge to
// draft on the Whiteboard.
const CHALLENGES = [
  'Jelaskan penelitian atau topik favoritmu seakan kamu sedang nongkrong di warkop.',
  'Tulis paragraf pembuka (hook) esai tentang pengalaman paling memalukan yang mengubah hidupmu.',
  'Ubah kalimat birokratis ini jadi bahasa manusia: "Terdapat signifikansi korelasi yang nyata."',
  'Tulis abstrak 3 kalimat untuk jurnal fiktif berjudul: "Dampak Mengantuk Saat Zoom Meeting".',
  'Ceritakan suasana sekitarmu sekarang pakai teknik "show, don\'t tell", fokus ke suara dan bau.',
  'Buat kalimat penutup (closing statement) yang menohok untuk opini tentang bahaya overthinking.',
  'Rumuskan satu pertanyaan penelitian yang liar tapi ilmiah tentang tren fyp TikTok.',
  'Tulis bio profil untuk dirimu sendiri yang tidak membosankan atau sekadar daftar prestasi.',
];

const TOTAL_SECTIONS = levels.reduce((n, l) => n + l.sections.length, 0);
const TOTAL_QUESTIONS = levels.reduce(
  (n, l) => n + l.quiz.questions.length + l.exam.questions.length,
  0,
);
const TOTAL_SOURCES = levels.reduce((n, l) => n + (l.sources?.length ?? 0), 0);

// The two main learning tracks, shown as separately-openable paths.
const TRACKS = PATHS.filter((p) => p.id === 'academic' || p.id === 'personal');

const menuItems = levels.map((lvl) => ({
  image: `https://picsum.photos/seed/${lvl.id + 42}/500/500`,
  link: `/roadmap`,
  title: `Level ${lvl.id}`,
  description: lvl.title,
}));

export default function Landing() {
  const reveal = useReveal<HTMLDivElement>();
  const completedCount = useStore((s) => s.completedCount);
  const done = completedCount();
  const [showChallenge, setShowChallenge] = useState<string | null>(null);

  return (
    <div ref={reveal} className="relative">
      {/* ---- Hero (English) — DotGrid backdrop + TextPressure headline ---- */}
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

        <div className="w-full max-w-none px-6 lg:px-16 mx-auto relative flex min-h-[80vh] flex-col items-start justify-center py-20 text-left sm:items-center sm:text-center">
          <span className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur">
            <BookIcon className="h-3.5 w-3.5" /> {levels.length} levels · free · always growing
          </span>

          {/* Interactive variable-font headline */}
          <div className="w-full max-w-3xl sm:mx-auto">
            <TextPressure text="WRITING" minFontSize={64} textColor="#294863" className="font-bold" />
          </div>

          <h1 className="animate-fade-in-up mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            <ShinyText>is a skill, not a talent.</ShinyText>
          </h1>

          <p
            className="animate-fade-in-up mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:mx-auto"
            style={{ animationDelay: '120ms' }}
          >
            From <span className="font-semibold text-slate-800">research papers and journals</span> to
            personal essays on <span className="font-semibold text-slate-800">Medium</span> and{' '}
            <span className="font-semibold text-slate-800">Substack</span>. Learn it one level at a
            time — slowly, until it actually clicks.
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-center"
            style={{ animationDelay: '240ms' }}
          >
            <ClickSpark>
              <Link to="/roadmap">
                <SpecularButton as="span" className="cursor-target btn-primary px-6 py-3 text-base">
                  {done > 0 ? 'Continue learning' : 'Start learning'} <ArrowIcon className="h-4 w-4" />
                </SpecularButton>
              </Link>
            </ClickSpark>
            <Link to="/papan-tulis" className="cursor-target btn-ghost px-6 py-3 text-base">
              Try the Whiteboard
            </Link>
          </div>

          <p className="animate-fade-in-up mt-6 text-xs text-slate-400" style={{ animationDelay: '320ms' }}>
            No sign-up. Your progress is saved automatically in this browser.
          </p>
        </div>
      </section>

      {/* ---- Two separate paths ---- */}
      <section className="border-t border-sky-100">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto py-20">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Two paths, open them separately</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Mau nulis jurnal, atau nulis di Substack?
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Dua jalur yang bisa kamu buka masing-masing. Mau langsung ke sisi personal tanpa lewat
              akademik dulu? Totally fine — pilih jalurmu.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {TRACKS.map((track, i) => (
              <BorderGlow key={track.id} className="reveal rounded-2xl">
                <Link
                  to={`/roadmap?path=${track.id}`}
                  className="cursor-target group flex h-full flex-col rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-card transition hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-sky-600">
                    Level {track.levelIds[0]}–{track.levelIds[track.levelIds.length - 1]}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-slate-900">{track.name}</h3>
                  <p className="mt-1 text-sm italic text-slate-500">{track.tagline}</p>
                  <p className="mt-3 flex-1 leading-relaxed text-slate-600">{track.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-semibold text-sky-700">
                    Buka jalur ini{' '}
                    <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What you'll learn: CardSwap ---- */}
      <section className="overflow-hidden border-t border-sky-100 bg-sky-50/40">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">What you'll learn</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Four worlds of writing, one curriculum
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-600">
              Not every kind of writing asks for the same thing. A journal wants evidence and
              structure; a blog wants voice and story. NuJou teaches both — dan kapan memakai yang
              mana.
            </p>
            <Link
              to="/roadmap"
              className="cursor-target mt-6 inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
            >
              See the full map <ArrowIcon className="h-4 w-4" />
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
                  Menemukan voice, personal essay, hook yang menahan pembaca, dan terbit di Medium
                  atau Substack.
                </p>
              </Card>
              <Card className="border border-sky-200 bg-white p-6 shadow-lift">
                <EcosystemIcon className="h-6 w-6 text-sky-600" />
                <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">Publikasi</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Memilih jurnal, cover letter, peer review, dan mengenali jurnal predator sebelum
                  terlambat.
                </p>
              </Card>
            </CardSwap>
          </div>
        </div>
      </section>

      {/* ---- The seven tiers (bento) ---- */}
      <section className="border-t border-sky-100">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto py-20">
          <div className="reveal mb-10 text-center">
            <div className="flex justify-center">
              <TrueFocus sentence="Tujuh Tahap Belajar" />
            </div>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              Lima puluh level lebih, dikelompokkan jadi tujuh tahap yang runtut — from the basics to
              publishing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIERS.filter((t) => t.id !== 'bonus').map((tier, i) => (
              <TierBento key={tier.id} index={i} name={tier.name} blurb={tier.blurb} from={tier.from} to={tier.to} />
            ))}
            <Link
              to="/roadmap"
              className="cursor-target group flex flex-col items-start justify-center rounded-2xl border border-dashed border-sky-300 bg-sky-50/40 p-5 transition hover:bg-white"
            >
              <span className="font-serif text-lg font-bold text-sky-700">Open the full map</span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                All levels <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- How it works: Cubes ---- */}
      <section className="border-t border-sky-100 bg-sky-50/40">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="reveal order-2 mx-auto w-full max-w-sm lg:order-1">
            <Cubes 
              gridSize={8}
              maxAngle={55}
              radius={3}
              borderStyle="1px dashed #aed3f2"
              faceColor="#f4f9fe"
              rippleColor="#ff6b6b"
              rippleSpeed={1.5}
              autoAnimate
              rippleOnClick
            />
            <p className="mt-4 text-center text-xs text-slate-400">Click the cubes — just for fun.</p>
          </div>

          <div className="reveal order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">How it works</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Read, test, unlock the next level
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                ['Read the material', 'Every level has long-form material with real examples, before/after, and real sources.'],
                ['Take the quiz', 'A relaxed check first — retake it as many times as you like.'],
                ['Beat the exam', 'Scenario-based questions that make you think, not memorize. Pass 70% to move on.'],
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
      <section className="border-t border-sky-100">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto py-16">
          <div className="grid gap-6 text-center sm:grid-cols-4">
            {[
              [levels.length, 'levels'],
              [TOTAL_SECTIONS, 'material sections'],
              [TOTAL_QUESTIONS, 'quiz & exam questions'],
              [TOTAL_SOURCES, 'real references'],
            ].map(([value, label]) => (
              <div key={label} className="reveal">
                <p className="font-display text-4xl font-bold text-sky-700 sm:text-5xl">{value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-center text-sm text-slate-500">
            ✎ NuJou is <span className="font-semibold text-sky-700">always being updated</span> — new
            levels and modules keep getting added. What you see today is just the start.
          </p>
        </div>
      </section>

      {/* ---- Writing challenge wheel ---- */}
      <section className="border-t border-sky-100 bg-sky-50/40">
        <div className="w-full max-w-none px-6 lg:px-16 mx-auto grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Latihan santai</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Spin buat tantangan menulis
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-600">
              Belum tahu mau nulis apa? Putar rodanya, dapat satu case kecil, lalu langsung
              drafting di Papan Tulis. Small reps, big progress.
            </p>
            <Link
              to="/papan-tulis"
              className="cursor-target mt-6 inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
            >
              Buka Papan Tulis <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="reveal flex justify-center">
            <OptionWheel options={CHALLENGES} spinLabel="Putar tantangan" onSelect={(opt) => setShowChallenge(opt)} />
          </div>
        </div>
      </section>

      {/* Challenge Popup Modal */}
      {showChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="animate-pop w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl ring-1 ring-sky-100">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-sky-100 text-sky-600">
              <PenIcon className="h-8 w-8" />
            </span>
            <h3 className="font-serif text-3xl font-bold text-slate-900">Tantangan Menulismu!</h3>
            <p className="mt-6 text-xl leading-relaxed text-slate-700">{showChallenge}</p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setShowChallenge(null)}
                className="cursor-target btn-ghost px-6 py-3 text-base"
              >
                Tutup
              </button>
              <Link to="/papan-tulis" className="cursor-target btn-primary px-6 py-3 text-base">
                Buka Papan Tulis <ArrowIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ---- FOOTER / BOTTOM AREA ---- */}
      <section className="relative mt-20 overflow-hidden bg-gradient-to-b from-white to-sky-50/80 pt-40 pb-24 text-slate-900 border-t border-sky-100">
        <div aria-hidden className="absolute inset-0 z-0 opacity-60">
          <DotGrid
            dotSize={4}
            gap={32}
            baseColor="#e7f2fc"
            activeColor="#3b7dc4"
            proximity={150}
            shockRadius={200}
            shockStrength={3}
            returnDuration={1.5}
          />
        </div>
        
        {/* Glow behind the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(139,188,237,0.15),transparent_70%)]"
        />

        <CurvedLoop 
          text="Master the Craft of Writing" 
          color="#aed3f2"
          speed={22} 
          className="absolute -top-5 left-0 z-0 w-full pointer-events-none opacity-60" 
        />

        <div className="w-full max-w-none px-6 lg:px-16 mx-auto relative z-10">
          
          {/* Closing CTA */}
          <div className="reveal mb-32 grid lg:grid-cols-2 gap-10 items-center text-left">
            <div>
              <h2 className="font-serif text-5xl font-bold text-slate-900 sm:text-7xl leading-tight">
                Your first draft <br className="hidden sm:block" /> won't be perfect.
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600">
                And that's entirely the point. Just start, then revise. Level 1 is waiting for you.
              </p>
              <div className="mt-10">
                <ClickSpark>
                  <Link to="/roadmap">
                    <SpecularButton as="span" className="cursor-target btn-primary px-10 py-5 text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                      Open the map <ArrowIcon className="ml-2 h-5 w-5" />
                    </SpecularButton>
                  </Link>
                </ClickSpark>
              </div>
            </div>
            
            <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden border border-sky-200 shadow-xl bg-white">
              <InfiniteMenu items={menuItems} scale={1.5} />
            </div>
          </div>

          {/* Contact / Contribute Card */}
          <div className="reveal mx-auto max-w-4xl">
            <BorderGlow className="rounded-[2.5rem]">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-sky-200 bg-white/70 p-10 text-center shadow-card backdrop-blur-md sm:p-16">
                <div className="relative z-10">
                  <span className="inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-sky-700">
                    Punya Masukan?
                  </span>
                  <h3 className="mt-6 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
                    Bantu NuJou tumbuh
                  </h3>
                  <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                    Mau rekomendasi topik/modul tambahan, atau menemukan materi yang perlu dikoreksi?
                    Kirim aja lewat email — semua masukan dibaca. Every suggestion helps.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Masukan%20untuk%20NuJou`}
                    className="cursor-target mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-sky-50 px-8 py-4 text-base font-semibold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100 hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <PenIcon className="h-5 w-5" /> Kirim masukan via Email
                  </a>
                </div>
              </div>
            </BorderGlow>
          </div>

        </div>
      </section>

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
    <BorderGlow className="rounded-2xl">
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight-host cursor-target h-full rounded-2xl border border-sky-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
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
    </BorderGlow>
  );
}
