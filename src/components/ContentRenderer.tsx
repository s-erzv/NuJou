import type { ContentBlock } from '../types';

/** Renders one rich content block inside the .paper reading layout. */
function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h2>{block.text}</h2>;
    case 'subheading':
      return <h3>{block.text}</h3>;
    case 'paragraph':
      return <p>{block.text}</p>;
    case 'list':
      return block.ordered ? (
        <ol>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote>
          <span>{block.text}</span>
          {block.source && (
            <footer className="mt-1 text-sm not-italic text-slate-500">— {block.source}</footer>
          )}
        </blockquote>
      );
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <aside className="my-5 rounded-md border-l-4 border-sky-500 bg-sky-50 p-4 text-left">
          <p className="mb-1 font-bold text-sky-800" style={{ textIndent: 0 }}>
            {block.title}
          </p>
          <p className="text-slate-700" style={{ textIndent: 0, marginBottom: 0 }}>
            {block.text}
          </p>
        </aside>
      );
    default:
      return null;
  }
}

export default function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </>
  );
}
