import { useEffect, useRef, useState, useCallback } from 'react';
import { PenIcon } from '../components/icons';
import { useReveal } from '../lib/useReveal';

const COLORS = ['#0f172a', '#0284c7', '#0ea5e9', '#38bdf8', '#ef4444', '#16a34a', '#f59e0b'];
const SIZES = [2, 4, 8, 16];

// Quick-insert outline scaffolds (drawn as text onto the canvas).
const TEMPLATES: Record<string, { title: string; items: string[] }> = {
  imrad: {
    title: 'Kerangka IMRaD',
    items: [
      'Introduction  — latar belakang, celah, tujuan',
      'Methods        — desain, sampel, instrumen',
      'Results        — temuan (angka/tabel)',
      'Discussion     — makna, keterbatasan, saran',
    ],
  },
  esai: {
    title: 'Kerangka Esai',
    items: [
      'Pendahuluan — kalimat tesis (pendirian + alasan)',
      'Isi 1          — argumen + bukti',
      'Isi 2          — argumen + bukti',
      'Penutup       — tegaskan tesis & simpulan',
    ],
  },
  proposal: {
    title: 'Kerangka Proposal',
    items: [
      'Latar belakang — ideal vs kenyataan (gap)',
      'Rumusan masalah — pertanyaan inti',
      'Tujuan          — jawaban yang dicari',
      'Metode          — populasi, sampel, analisis',
    ],
  },
};

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState(COLORS[1]);
  const [size, setSize] = useState(SIZES[1]);
  const [eraser, setEraser] = useState(false);
  const reveal = useReveal<HTMLDivElement>();

  // Set up canvas + preserve drawing across resize.
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ratio = window.devicePixelRatio || 1;

    // Preserve current bitmap
    const prev = ctxRef.current
      ? ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)
      : null;

    const w = parent.clientWidth;
    const h = 520;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    if (prev) ctx.putImageData(prev, 0, 0);
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !ctxRef.current || !last.current) return;
    const ctx = ctxRef.current;
    const p = pos(e);
    ctx.strokeStyle = eraser ? '#ffffff' : color;
    ctx.lineWidth = eraser ? size * 3 : size;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const insertTemplate = (key: keyof typeof TEMPLATES) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const tpl = TEMPLATES[key];
    ctx.save();
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 26px "Times New Roman", serif';
    ctx.fillText(tpl.title, 40, 56);
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 68);
    ctx.lineTo(360, 68);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = '20px "Times New Roman", serif';
    tpl.items.forEach((line, i) => ctx.fillText(`•  ${line}`, 48, 110 + i * 44));
    ctx.restore();
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nujou-outline-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={reveal} className="container-academic py-10">
      <header className="reveal mb-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-600">
          <PenIcon className="h-4 w-4" /> Papan Tulis
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-slate-900">
          Brainstorm & Kerangka Tulisan
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Gunakan kanvas ini untuk memetakan gagasan, menyusun outline, atau menggambar diagram
          IMRaD sebelum menulis. Gambaran kasar sering kali melahirkan struktur yang jernih.
        </p>
      </header>

      {/* Quick templates */}
      <div className="reveal mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">Sisipkan kerangka:</span>
        {Object.entries(TEMPLATES).map(([key, tpl]) => (
          <button
            key={key}
            onClick={() => insertTemplate(key as keyof typeof TEMPLATES)}
            className="rounded-full border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            {tpl.title}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setEraser(false);
              }}
              aria-label={`Warna ${c}`}
              className={`h-7 w-7 rounded-full ring-2 ring-offset-2 transition ${
                color === c && !eraser ? 'ring-sky-500' : 'ring-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <div className="flex items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-label={`Ukuran ${s}`}
              className={`grid h-8 w-8 place-items-center rounded-md border transition ${
                size === s ? 'border-sky-500 bg-white' : 'border-transparent hover:bg-white'
              }`}
            >
              <span className="rounded-full bg-slate-800" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <button
          onClick={() => setEraser((v) => !v)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            eraser ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
          }`}
        >
          Penghapus
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={clear} className="btn-ghost px-4 py-1.5 text-sm">
            Bersihkan
          </button>
          <button onClick={download} className="btn-primary px-4 py-1.5 text-sm">
            Unduh PNG
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="reveal overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-card">
        <canvas
          ref={canvasRef}
          className="block touch-none"
          style={{ cursor: eraser ? 'cell' : 'crosshair' }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Catatan: gambar tidak tersimpan otomatis. Gunakan "Unduh PNG" untuk menyimpan karya Anda.
      </p>
    </div>
  );
}
