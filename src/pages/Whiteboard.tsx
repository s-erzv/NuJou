import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Text, Group, Rect, Ellipse, Transformer } from 'react-konva';
import type Konva from 'konva';
import { PenIcon } from '../components/icons';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';
import { createId } from '../components/whiteboard/types';
import TextEditorOverlay from '../components/whiteboard/TextEditorOverlay';
import type {
  CanvasObject,
  LineObject,
  TextObject,
  StickyObject,
  RectObject,
  EllipseObject,
  ToolMode,
} from '../components/whiteboard/types';

const COLORS = ['#0f172a', '#0284c7', '#0ea5e9', '#a35f2c', '#ef4444', '#436233', '#f59e0b'];
const SIZES = [2, 4, 8, 16];

interface FrameworkSection {
  label: string;
  questions: string[];
}

interface Framework {
  title: string;
  sections: FrameworkSection[];
}

/**
 * Quick-insert "frameworks": each section is a set of guiding questions to
 * answer, not just a static label — the point is to scaffold the writer's
 * own thinking directly on the canvas, not to hand them a finished outline.
 */
const TEMPLATES: Record<string, Framework> = {
  imrad: {
    title: 'Kerangka IMRaD',
    sections: [
      {
        label: 'Introduction',
        questions: [
          'Apa masalah atau celah (gap) yang mau kamu selesaikan?',
          'Kenapa masalah ini penting dibahas sekarang?',
          'Apa tujuan spesifik tulisanmu — satu kalimat?',
        ],
      },
      {
        label: 'Methods',
        questions: [
          'Desain penelitianmu apa (kualitatif/kuantitatif/campuran)?',
          'Siapa atau apa subjek/data yang kamu pakai?',
          'Instrumen apa yang dipakai untuk mengumpulkan data?',
        ],
      },
      {
        label: 'Results',
        questions: [
          'Temuan utama apa yang paling menjawab tujuanmu?',
          'Data/angka apa yang mendukung temuan ini?',
        ],
      },
      {
        label: 'Discussion',
        questions: [
          'Apa makna temuan ini dibanding penelitian sebelumnya?',
          'Apa keterbatasan (limitation) penelitianmu?',
          'Apa saran untuk penelitian selanjutnya?',
        ],
      },
    ],
  },
  esai: {
    title: 'Kerangka Esai',
    sections: [
      {
        label: 'Pendahuluan / Tesis',
        questions: [
          'Apa pendirian (klaim) utamamu — satu kalimat tegas?',
          'Kenapa pendirian ini penting atau menarik diperdebatkan?',
        ],
      },
      {
        label: 'Isi 1',
        questions: [
          'Argumen pertama apa yang mendukung tesismu?',
          'Bukti atau contoh konkret apa yang mendukungnya?',
          'Apa kemungkinan bantahan, dan bagaimana kamu menjawabnya?',
        ],
      },
      {
        label: 'Isi 2',
        questions: [
          'Argumen kedua apa — beda sudut dari argumen pertama?',
          'Bukti apa yang mendukung argumen ini?',
        ],
      },
      {
        label: 'Penutup',
        questions: [
          'Bagaimana menegaskan tesis tanpa mengulang kata yang sama persis?',
          'Apa "so what"-nya — kenapa pembaca harus peduli?',
        ],
      },
    ],
  },
  proposal: {
    title: 'Kerangka Proposal',
    sections: [
      {
        label: 'Latar Belakang',
        questions: [
          'Apa kondisi ideal vs kenyataan (gap) yang kamu lihat?',
          'Data atau fenomena apa yang menunjukkan gap ini nyata?',
        ],
      },
      {
        label: 'Rumusan Masalah',
        questions: ['Apa pertanyaan penelitian utamamu — satu kalimat?'],
      },
      {
        label: 'Tujuan',
        questions: ['Jawaban seperti apa yang ingin kamu temukan?'],
      },
      {
        label: 'Metode',
        questions: [
          'Siapa populasi/sampelmu?',
          'Bagaimana cara kamu menganalisis data yang terkumpul?',
        ],
      },
    ],
  },
  personal: {
    title: 'Kerangka Personal Essay / Blog',
    sections: [
      {
        label: 'Hook / Pembuka',
        questions: [
          'Momen atau cerita spesifik apa yang jadi pembuka menarik?',
          'Perasaan atau kondisi apa yang mau kamu tunjukkan di awal?',
        ],
      },
      {
        label: 'Isi / Insight',
        questions: [
          'Apa pelajaran atau insight utama dari pengalamanmu?',
          'Detail konkret/sensorik apa yang bikin cerita ini terasa hidup?',
        ],
      },
      {
        label: 'Refleksi',
        questions: ['Bagaimana pengalaman ini mengubah cara pandangmu?'],
      },
      {
        label: 'Penutup / Takeaway',
        questions: [
          'Satu kalimat apa yang ingin diingat pembaca setelah selesai baca?',
          'Ada ajakan (call-to-action) untuk pembaca, kalau ada?',
        ],
      },
    ],
  },
};

/**
 * A loose "patch" shape covering every optional field across all
 * CanvasObject variants. Plain `Partial<CanvasObject>` doesn't work here:
 * TypeScript's `keyof` on a union only keeps keys common to every member,
 * so it would drop variant-specific fields like `width` or `text` entirely.
 */
type ObjectPatch = Partial<LineObject> &
  Partial<TextObject> &
  Partial<StickyObject> &
  Partial<RectObject> &
  Partial<EllipseObject>;

/** Canvas height range for the size slider, in px. */
const MIN_CANVAS_HEIGHT = 320;
const MAX_CANVAS_HEIGHT = 1400;

export default function Whiteboard() {
  const reveal = useReveal<HTMLDivElement>();
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const nodesRef = useRef<Record<string, Konva.Node | null>>({});
  const isDrawing = useRef(false);
  const shapeStart = useRef<{ x: number; y: number } | null>(null);
  const drawingShapeId = useRef<string | null>(null);

  const [size, setSize] = useState({ width: 800, height: 520 });
  const [canvasHeight, setCanvasHeight] = useState(520);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stageTransform, setStageTransform] = useState({ scale: 1, x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState(COLORS[1]);
  const [strokeWidth, setStrokeWidth] = useState(SIZES[1]);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorRect, setEditorRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Canvas dimensions: width always follows the container; height follows the
  // size slider, except in fullscreen where the canvas fills the leftover
  // viewport space below the toolbar.
  useEffect(() => {
    const updateSize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      setSize({ width: parent.clientWidth, height: parent.clientHeight });
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Keep React state in sync when the user leaves fullscreen via Esc / browser UI.
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (shellRef.current) {
      await shellRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!trRef.current) return;
    const selectedObj = objects.find((o) => o.id === selectedId);
    if (selectedObj && selectedObj.kind !== 'line' && selectedId && nodesRef.current[selectedId]) {
      trRef.current.nodes([nodesRef.current[selectedId]!]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId, objects]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setObjects((prev) => prev.filter((o) => o.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  const registerNode = (id: string, node: Konva.Node | null) => {
    nodesRef.current[id] = node;
  };

  const getEditorRect = (id: string) => {
    const stage = stageRef.current;
    const node = nodesRef.current[id];
    if (!stage || !node) return null;
    const scale = stage.scaleX();
    const box = node.getClientRect({ relativeTo: stage });
    return {
      x: stage.x() + box.x * scale,
      y: stage.y() + box.y * scale,
      width: box.width * scale,
      height: box.height * scale,
    };
  };

  // Recompute the overlay's position after the Konva node has actually
  // mounted/updated. When a text/sticky object is *just* created, its Konva
  // node's ref callback hasn't fired yet during the render that sets
  // `editingId` (refs attach during commit, after this render's JSX runs),
  // so calling `getEditorRect` synchronously in render would read a stale
  // `nodesRef` entry and return null. Running it here instead, after commit,
  // guarantees the node is registered.
  useEffect(() => {
    if (!editingId) {
      setEditorRect(null);
      return;
    }
    setEditorRect(getEditorRect(editingId));
  }, [editingId, objects]);

  const handleObjectChange = (id: string, attrs: ObjectPatch) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? ({ ...obj, ...attrs } as CanvasObject) : obj)));
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const clickedOnEmpty = e.target === stage;

    if (tool === 'pen') {
      isDrawing.current = true;
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const newLine: LineObject = {
        id: createId('line'),
        kind: 'line',
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth,
      };
      setObjects((prev) => [...prev, newLine]);
      return;
    }

    if (tool === 'rect' || tool === 'ellipse') {
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const id = createId(tool);
      shapeStart.current = pos;
      drawingShapeId.current = id;
      if (tool === 'rect') {
        const newRect: RectObject = {
          id,
          kind: 'rect',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fill: `${color}33`,
          stroke: color,
        };
        setObjects((prev) => [...prev, newRect]);
      } else {
        const newEllipse: EllipseObject = {
          id,
          kind: 'ellipse',
          x: pos.x,
          y: pos.y,
          radiusX: 0,
          radiusY: 0,
          fill: `${color}33`,
          stroke: color,
        };
        setObjects((prev) => [...prev, newEllipse]);
      }
      return;
    }

    if (tool === 'text') {
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const id = createId('text');
      const newText: TextObject = {
        id,
        kind: 'text',
        x: pos.x,
        y: pos.y,
        text: 'Ketik di sini',
        fontSize: 20,
        fill: color,
        width: 220,
      };
      setObjects((prev) => [...prev, newText]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
      return;
    }

    if (tool === 'sticky') {
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const id = createId('sticky');
      const newSticky: StickyObject = {
        id,
        kind: 'sticky',
        x: pos.x,
        y: pos.y,
        width: 180,
        height: 140,
        fill: color,
        text: 'Catatan...',
      };
      setObjects((prev) => [...prev, newSticky]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
      return;
    }

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleStageMouseMove = () => {
    const stage = stageRef.current;

    if (tool === 'pen' && isDrawing.current) {
      const pos = stage?.getRelativePointerPosition();
      if (!pos) return;
      setObjects((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.kind !== 'line') return prev;
        const updated: LineObject = { ...last, points: [...last.points, pos.x, pos.y] };
        return [...prev.slice(0, -1), updated];
      });
      return;
    }

    if ((tool === 'rect' || tool === 'ellipse') && drawingShapeId.current && shapeStart.current) {
      const pos = stage?.getRelativePointerPosition();
      if (!pos) return;
      const start = shapeStart.current;
      const id = drawingShapeId.current;
      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.id !== id) return obj;
          if (obj.kind === 'rect') {
            return {
              ...obj,
              x: Math.min(start.x, pos.x),
              y: Math.min(start.y, pos.y),
              width: Math.abs(pos.x - start.x),
              height: Math.abs(pos.y - start.y),
            };
          }
          if (obj.kind === 'ellipse') {
            return {
              ...obj,
              x: (start.x + pos.x) / 2,
              y: (start.y + pos.y) / 2,
              radiusX: Math.abs(pos.x - start.x) / 2,
              radiusY: Math.abs(pos.y - start.y) / 2,
            };
          }
          return obj;
        }),
      );
    }
  };

  const handleStageMouseUp = () => {
    isDrawing.current = false;
    if (drawingShapeId.current) {
      const id = drawingShapeId.current;
      setTool('select');
      setSelectedId(id);
    }
    drawingShapeId.current = null;
    shapeStart.current = null;
  };

  const zoomBy = (factor: number) => {
    setStageTransform((prev) => {
      const newScale = Math.min(4, Math.max(0.4, prev.scale * factor));
      const center = { x: size.width / 2, y: size.height / 2 };
      const mousePointTo = { x: (center.x - prev.x) / prev.scale, y: (center.y - prev.y) / prev.scale };
      return {
        scale: newScale,
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
      };
    });
  };

  const resetView = () => setStageTransform({ scale: 1, x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const oldScale = stageTransform.scale;
    const mousePointTo = {
      x: (pointer.x - stageTransform.x) / oldScale,
      y: (pointer.y - stageTransform.y) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = Math.min(4, Math.max(0.4, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy));
    setStageTransform({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const getTouchDistance = (touches: TouchList) => {
    const a = touches[0];
    const b = touches[1];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStartWrapped = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (e.evt.touches.length === 2) {
      lastPinchDist.current = getTouchDistance(e.evt.touches);
      return;
    }
    handleStageMouseDown(e);
  };

  const handleTouchMoveWrapped = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (e.evt.touches.length === 2) {
      e.evt.preventDefault();
      const dist = getTouchDistance(e.evt.touches);
      if (lastPinchDist.current != null) {
        zoomBy(dist / lastPinchDist.current);
      }
      lastPinchDist.current = dist;
      return;
    }
    handleStageMouseMove();
  };

  const handleTouchEndWrapped = () => {
    lastPinchDist.current = null;
    handleStageMouseUp();
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };

  const insertTemplate = (key: keyof typeof TEMPLATES) => {
    const tpl = TEMPLATES[key];
    const baseX = 40;
    const baseY = 40;
    const sectionGap = 20;
    const questionLineHeight = 26;

    const newObjects: CanvasObject[] = [
      {
        id: createId('text'),
        kind: 'text',
        x: baseX,
        y: baseY,
        text: tpl.title,
        fontSize: 24,
        fill: '#0369a1',
        width: 420,
      },
      {
        id: createId('rect'),
        kind: 'rect',
        x: baseX,
        y: baseY + 40,
        width: 320,
        height: 2,
        fill: '#bae6fd',
        stroke: '#bae6fd',
      },
    ];

    let cursorY = baseY + 64;
    for (const section of tpl.sections) {
      newObjects.push({
        id: createId('text'),
        kind: 'text',
        x: baseX,
        y: cursorY,
        text: section.label,
        fontSize: 17,
        fill: '#854b22',
        width: 420,
      });
      cursorY += 28;

      for (const question of section.questions) {
        newObjects.push({
          id: createId('text'),
          kind: 'text',
          x: baseX + 12,
          y: cursorY,
          text: `?  ${question}`,
          fontSize: 15,
          fill: '#0f172a',
          width: 460,
        });
        // Rough wrap estimate at this font size/width (~60 chars/line) so
        // long questions get a second line's worth of room instead of
        // overlapping the next item.
        const estimatedLines = Math.ceil(question.length / 58);
        cursorY += questionLineHeight * estimatedLines;
      }

      cursorY += sectionGap;
    }

    setObjects((prev) => [...prev, ...newObjects]);
  };

  const clearAll = () => {
    setObjects([]);
    setSelectedId(null);
  };

  const download = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const exportPng = () => {
      const uri = stage.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `nujou-outline-${Date.now()}.png`;
      link.href = uri;
      link.click();
    };

    // Deselect first so the Transformer's selection handles aren't baked
    // into the exported image. Wait two frames for the deselect effect to
    // detach the Transformer and Konva to redraw before capturing.
    if (selectedId) {
      setSelectedId(null);
      requestAnimationFrame(() => requestAnimationFrame(exportPng));
    } else {
      exportPng();
    }
  };

  return (
    <div ref={reveal} className="container-academic py-10">
      <header className={`reveal mb-6 ${isFullscreen ? 'hidden' : ''}`}>
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

      <div
        ref={shellRef}
        className={isFullscreen ? 'flex h-screen flex-col gap-2 bg-white p-3' : undefined}
      >
      {/* Quick templates */}
      <div className={`reveal mb-3 flex flex-wrap items-center gap-2 ${isFullscreen ? 'hidden' : ''}`}>
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
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setTool('select')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'select' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pilih
          </button>
          <button
            onClick={() => setTool('pen')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'pen' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pena
          </button>
          <button
            onClick={() => setTool('text')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'text' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Teks
          </button>
          <button
            onClick={() => setTool('sticky')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'sticky' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Sticky Note
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'rect' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Kotak
          </button>
          <button
            onClick={() => setTool('ellipse')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'ellipse' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Lingkaran
          </button>
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Warna ${c}`}
              className={`h-7 w-7 rounded-full ring-2 ring-offset-2 transition ${
                color === c ? 'ring-sky-500' : 'ring-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          {/* Free color pick — the swatch doubles as the current-color preview */}
          <label
            title="Pilih warna bebas"
            className={`relative grid h-7 w-7 cursor-pointer place-items-center overflow-hidden rounded-full ring-2 ring-offset-2 transition ${
              COLORS.includes(color) ? 'ring-transparent' : 'ring-sky-500'
            }`}
            style={{
              background: COLORS.includes(color)
                ? 'conic-gradient(#ef4444, #f59e0b, #16a34a, #0ea5e9, #6366f1, #ec4899, #ef4444)'
                : color,
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Pilih warna bebas"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <div className="flex items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setStrokeWidth(s)}
              aria-label={`Ukuran ${s}`}
              className={`grid h-8 w-8 place-items-center rounded-md border transition ${
                strokeWidth === s ? 'border-sky-500 bg-white' : 'border-transparent hover:bg-white'
              }`}
            >
              <span className="rounded-full bg-slate-800" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button onClick={() => zoomBy(0.85)} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Perkecil">
            −
          </button>
          <span className="w-12 text-center text-xs font-semibold text-slate-500">
            {Math.round(stageTransform.scale * 100)}%
          </span>
          <button onClick={() => zoomBy(1.15)} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Perbesar">
            +
          </button>
          <button onClick={resetView} className="btn-ghost px-3 py-1.5 text-sm">
            Reset
          </button>
          <button onClick={toggleFullscreen} className="btn-ghost px-3 py-1.5 text-sm">
            {isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          </button>
          {selectedId && (
            <button
              onClick={deleteSelected}
              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Hapus
            </button>
          )}
          <button onClick={clearAll} className="btn-ghost px-4 py-1.5 text-sm">
            Bersihkan
          </button>
          <ClickSpark>
            <button onClick={download} className="btn-primary px-4 py-1.5 text-sm">
              Unduh PNG
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* Canvas size slider — hidden in fullscreen, where the canvas fills the screen */}
      {!isFullscreen && (
        <div className="mb-3 flex items-center gap-3">
          <label htmlFor="canvas-height" className="shrink-0 text-sm font-semibold text-slate-500">
            Tinggi kanvas
          </label>
          <input
            id="canvas-height"
            type="range"
            min={MIN_CANVAS_HEIGHT}
            max={MAX_CANVAS_HEIGHT}
            step={20}
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            className="h-1.5 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-sky-100 accent-sky-600"
          />
          <span className="w-16 shrink-0 text-xs font-semibold text-slate-400">{canvasHeight}px</span>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={containerRef}
        style={isFullscreen ? undefined : { height: canvasHeight }}
        className={`reveal relative overflow-hidden border border-sky-100 bg-white ${
          isFullscreen ? 'min-h-0 flex-1 rounded-lg' : 'rounded-2xl shadow-card'
        }`}
      >
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          scaleX={stageTransform.scale}
          scaleY={stageTransform.scale}
          x={stageTransform.x}
          y={stageTransform.y}
          draggable={tool === 'select'}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStageTransform((prev) => ({ ...prev, x: e.target.x(), y: e.target.y() }));
            }
          }}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleTouchStartWrapped}
          onTouchMove={handleTouchMoveWrapped}
          onTouchEnd={handleTouchEndWrapped}
        >
          <Layer>
            {objects.map((obj) => {
              if (obj.kind !== 'line') return null;
              return (
                <Line
                  key={obj.id}
                  id={obj.id}
                  x={obj.x ?? 0}
                  y={obj.y ?? 0}
                  points={obj.points}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  draggable={tool === 'select'}
                  onClick={() => tool === 'select' && setSelectedId(obj.id)}
                  onTap={() => tool === 'select' && setSelectedId(obj.id)}
                  onDragEnd={(e) =>
                    handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                  }
                  ref={(node) => registerNode(obj.id, node)}
                />
              );
            })}
            {objects.map((obj) => {
              if (obj.kind === 'text') {
                return (
                  <Text
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    text={obj.text}
                    fontSize={obj.fontSize}
                    fontFamily="Inter, sans-serif"
                    fill={obj.fill}
                    width={obj.width}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    visible={editingId !== obj.id}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDblClick={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDblTap={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(40, node.width() * scaleX),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              if (obj.kind === 'sticky') {
                return (
                  <Group
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    visible={editingId !== obj.id}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDblClick={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDblTap={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(80, obj.width * scaleX),
                        height: Math.max(60, obj.height * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  >
                    <Rect
                      width={obj.width}
                      height={obj.height}
                      fill={obj.fill}
                      cornerRadius={10}
                      shadowColor="rgba(15, 23, 42, 0.25)"
                      shadowBlur={10}
                      shadowOffset={{ x: 0, y: 4 }}
                    />
                    <Text
                      text={obj.text}
                      width={obj.width}
                      height={obj.height}
                      padding={12}
                      fontSize={16}
                      fontFamily="Inter, sans-serif"
                      fill="#0f172a"
                    />
                  </Group>
                );
              }

              if (obj.kind === 'rect') {
                return (
                  <Rect
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    width={obj.width}
                    height={obj.height}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={2}
                    cornerRadius={6}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(20, node.width() * scaleX),
                        height: Math.max(20, node.height() * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              if (obj.kind === 'ellipse') {
                return (
                  <Ellipse
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    radiusX={obj.radiusX}
                    radiusY={obj.radiusY}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={2}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Ellipse;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        radiusX: Math.max(10, node.radiusX() * scaleX),
                        radiusY: Math.max(10, node.radiusY() * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              return null;
            })}
            <Transformer ref={trRef} rotateEnabled />
          </Layer>
        </Stage>
        {editingId &&
          (() => {
            const obj = objects.find((o) => o.id === editingId);
            const rect = editorRect;
            if (!obj || !rect || (obj.kind !== 'text' && obj.kind !== 'sticky')) return null;
            return (
              <TextEditorOverlay
                x={rect.x}
                y={rect.y}
                width={obj.kind === 'sticky' ? rect.width - 16 * stageTransform.scale : rect.width}
                fontSize={(obj.kind === 'sticky' ? 16 : obj.fontSize) * stageTransform.scale}
                value={obj.text}
                onCommit={(value) => {
                  handleObjectChange(editingId, { text: value });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            );
          })()}
      </div>
      {!isFullscreen && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Catatan: gambar tidak tersimpan otomatis. Gunakan "Unduh PNG" untuk menyimpan karya Anda.
        </p>
      )}
      </div>
    </div>
  );
}
