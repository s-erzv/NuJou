import { Link } from 'react-router-dom';
import { levels } from '../data';
import { useStore } from '../store/useStore';
import { useReveal } from '../lib/useReveal';
import ShinyText from '../components/reactbits/ShinyText';
import ClickSpark from '../components/reactbits/ClickSpark';
import DotGrid from '../components/reactbits/DotGrid';
import Cubes from '../components/reactbits/Cubes';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import { ArrowIcon, BookIcon, PenIcon, EcosystemIcon, MapIcon } from '../components/icons';

const TOTAL_SECTIONS = levels.reduce((n, l) => n + l.sections.length, 0);
const TOTAL_QUESTIONS = levels.reduce(
  (n, l) => n + l.quiz.questions.length + l.exam.questions.length,
  0,
);

export default function Landing() {
  const reveal = useReveal<HTMLDivElement>();
  const completedCount = useStore((s) => s.completedCount);
  const done = completedCount();

  return (
    <div ref={reveal}>
      {/* ---- Hero: DotGrid backdrop ---- */}
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
        {/* Fade the grid out toward the text so the headline stays legible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,white_35%,transparent_80%)]"
        />

        <div className="container-academic relative flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
          <span className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur">
            <BookIcon className="h-3.5 w-3.5" /> {levels.length} level · gratis · bahasa Indonesia
          </span>

          <h1 className="animate-fade-in-up font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            <ShinyText>Belajar Menulis,</ShinyText>
            <br />
            <span className="text-slate-900">Bukan Sekadar Mengetik</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: '120ms' }}
          >
            Dari KTI, esai, dan artikel jurnal sampai tulisan personal di Medium atau Substack.
            Satu level satu langkah — pelan-pelan, sampai betul-betul bisa.
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <ClickSpark>
              <Link to="/roadmap" className="btn-primary px-6 py-3 text-base">
                {done > 0 ? 'Lanjutkan Belajar' : 'Mulai dari Level 1'} <ArrowIcon className="h-4 w-4" />
              </Link>
            </ClickSpark>
            <Link to="/papan-tulis" className="btn-ghost px-6 py-3 text-base">
              Coba Papan Tulis
            </Link>
          </div>

          <p className="animate-fade-in-up mt-6 text-xs text-slate-400" style={{ animationDelay: '320ms' }}>
            Tidak perlu daftar. Progresmu tersimpan otomatis di browser ini.
          </p>
        </div>
      </section>

      {/* ---- What you'll learn: CardSwap ---- */}
      <section className="overflow-hidden border-t border-sky-100 bg-sky-50/40">
        <div className="container-academic grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Apa yang dipelajari</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Empat dunia menulis, satu kurikulum
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-slate-600">
              Tidak semua tulisan minta hal yang sama. Jurnal minta bukti dan struktur; blog minta
              suara dan cerita. NuJou mengajarkan keduanya — dan kapan memakai yang mana.
            </p>
            <Link
              to="/roadmap"
              className="mt-6 inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
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
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Cara kerjanya</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Belajar, uji, buka level berikutnya
            </h2>
            <ol className="mt-6 space-y-4">
              {[
                ['Baca materinya', 'Tiap level punya materi panjang dengan contoh nyata dan sumber rujukannya.'],
                ['Kerjakan kuis', 'Latihan santai dulu untuk mengecek pemahaman — boleh diulang sepuasnya.'],
                ['Taklukkan ujian', 'Soalnya menuntut berpikir, bukan menghafal. Lulus 70% untuk buka level berikutnya.'],
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
          <div className="grid gap-6 text-center sm:grid-cols-3">
            {[
              [levels.length, 'level belajar'],
              [TOTAL_SECTIONS, 'bagian materi'],
              [TOTAL_QUESTIONS, 'soal latihan & ujian'],
            ].map(([value, label]) => (
              <div key={label} className="reveal">
                <p className="font-display text-4xl font-bold text-sky-700 sm:text-5xl">{value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="border-t border-sky-100">
        <div className="container-academic py-20 text-center">
          <h2 className="reveal font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Tulisan pertamamu tidak akan sempurna.
          </h2>
          <p className="reveal mx-auto mt-3 max-w-xl leading-relaxed text-slate-600">
            Tidak apa-apa. Yang penting mulai dulu, lalu revisi. Level 1 menunggu.
          </p>
          <div className="reveal mt-8">
            <ClickSpark>
              <Link to="/roadmap" className="btn-primary px-6 py-3 text-base">
                Buka Peta Belajar <ArrowIcon className="h-4 w-4" />
              </Link>
            </ClickSpark>
          </div>
        </div>
      </section>
    </div>
  );
}
