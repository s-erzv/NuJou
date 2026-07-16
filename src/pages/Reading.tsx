import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getLevel } from '../data';
import { useStore } from '../store/useStore';
import ContentRenderer from '../components/ContentRenderer';
import { ArrowIcon, CheckIcon } from '../components/icons';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';

export default function Reading() {
  const { slug } = useParams();
  const level = slug ? getLevel(slug) : undefined;

  const isLevelUnlocked = useStore((s) => s.isLevelUnlocked);
  const markRead = useStore((s) => s.markRead);
  const progress = useStore((s) => s.progress);
  const reveal = useReveal<HTMLDivElement>();

  const [scrollPct, setScrollPct] = useState(0);
  const unlocked = level ? isLevelUnlocked(level.id) : false;

  // Keep hooks above early returns for stable ordering.
  useEffect(() => {
    if (level && unlocked) {
      markRead(level.id);
      window.scrollTo(0, 0);
    }
  }, [level, unlocked, markRead]);

  // Reading progress bar tied to scroll position.
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [level?.id]);

  if (!level) return <Navigate to="/404" replace />;
  if (!unlocked) return <Navigate to="/" replace />;

  const quizPassed = Boolean(progress[level.id]?.quiz?.passed);
  const examPassed = Boolean(progress[level.id]?.exam?.passed);

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed inset-x-0 top-0 z-30 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-700 transition-[width] duration-150"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <div ref={reveal} className="container-academic py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline">
          ← Kembali ke Roadmap
        </Link>

        <article className="mx-auto max-w-3xl">
          <header className="reveal mb-8 border-b border-slate-200 pb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Level {level.id}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">{level.title}</h1>
            <p className="mt-2 text-lg italic text-slate-500">{level.subtitle}</p>
            <div className="mx-auto mt-4 max-w-2xl rounded-xl bg-sky-50/60 p-4 text-left text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-sky-700">Tujuan belajar: </span>
              {level.goal}
            </div>
          </header>

          <div className="paper">
            {level.sections.map((section, i) => (
              <section key={section.id} className="reveal mb-2" style={{ transitionDelay: `${i * 40}ms` }}>
                <ContentRenderer blocks={section.blocks} />
              </section>
            ))}
          </div>

          <div className="reveal mt-12 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-slate-900">Uji Pemahamanmu</h2>
            <p className="mt-1 text-slate-600">
              Latihan dulu lewat kuis, lalu taklukkan ujian (minimal {Math.round(level.exam.passRatio * 100)}%) untuk
              membuka level berikutnya.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to={`/level/${level.slug}/quiz`} className="btn-ghost">
                {quizPassed && <CheckIcon className="h-4 w-4" />}
                {quizPassed ? 'Ulangi Kuis' : 'Kerjakan Kuis'}
              </Link>
              <ClickSpark>
                <Link to={`/level/${level.slug}/exam`} className="btn-primary">
                  {examPassed ? (
                    <>
                      <CheckIcon className="h-4 w-4" /> Ujian Lulus — Tinjau
                    </>
                  ) : (
                    <>
                      Ujian Level {level.id} <ArrowIcon className="h-4 w-4" />
                    </>
                  )}
                </Link>
              </ClickSpark>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
