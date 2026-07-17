import type { Source } from '../types';

/**
 * "Sumber Materi": the reference list backing a level's material. Rendered at
 * the end of the reading view so learners can trace any claim back to where it
 * came from — the same habit the course itself teaches.
 */
export default function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="reveal mt-12 rounded-2xl border border-sky-100 bg-sky-50/40 p-6">
      <h2 className="font-serif text-lg font-bold text-slate-900">Sumber Materi</h2>
      <p className="mt-1 text-sm text-slate-500">
        Materi level ini disusun dengan merujuk sumber-sumber berikut. Silakan telusuri sendiri
        untuk mendalami.
      </p>
      <ol className="mt-4 space-y-3">
        {sources.map((source, i) => (
          <li key={i} className="text-sm leading-relaxed text-slate-700">
            <span className="mr-1.5 font-semibold text-sky-600">[{i + 1}]</span>
            {source.author && <span>{source.author}. </span>}
            {source.year && <span>({source.year}). </span>}
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-sky-700 underline-offset-2 hover:underline"
              >
                {source.title}
              </a>
            ) : (
              <span className="font-semibold">{source.title}</span>
            )}
            {source.publisher && <span className="italic text-slate-500">. {source.publisher}</span>}
            {source.note && <span className="block text-xs text-slate-500">{source.note}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
