import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Transformer } from 'react-konva';
import type Konva from 'konva';
import { PenIcon } from '../components/icons';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';
import { createId } from '../components/whiteboard/types';
import type {
  CanvasObject,
  LineObject,
  TextObject,
  StickyObject,
  RectObject,
  EllipseObject,
  ToolMode,
} from '../components/whiteboard/types';

const COLORS = ['#0f172a', '#0284c7', '#0ea5e9', '#38bdf8', '#ef4444', '#16a34a', '#f59e0b'];
const SIZES = [2, 4, 8, 16];

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

export default function Whiteboard() {
  const reveal = useReveal<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const nodesRef = useRef<Record<string, Konva.Node | null>>({});
  const isDrawing = useRef(false);

  const [size, setSize] = useState({ width: 800, height: 520 });
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState(COLORS[1]);
  const [strokeWidth, setStrokeWidth] = useState(SIZES[1]);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = width < 640 ? 360 : 520;
      setSize({ width, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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

  const handleObjectChange = (id: string, attrs: ObjectPatch) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? ({ ...obj, ...attrs } as CanvasObject) : obj)));
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const clickedOnEmpty = e.target === stage;

    if (tool === 'pen') {
      isDrawing.current = true;
      const pos = stage.getPointerPosition();
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

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleStageMouseMove = () => {
    if (tool !== 'pen' || !isDrawing.current) return;
    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    setObjects((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.kind !== 'line') return prev;
      const updated: LineObject = { ...last, points: [...last.points, pos.x, pos.y] };
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleStageMouseUp = () => {
    isDrawing.current = false;
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };

  const clearAll = () => {
    setObjects([]);
    setSelectedId(null);
  };

  const download = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `nujou-outline-${Date.now()}.png`;
    link.href = uri;
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

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
        <div className="flex items-center gap-1">
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

        <div className="ml-auto flex items-center gap-2">
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

      {/* Canvas */}
      <div
        ref={containerRef}
        className="reveal relative overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-card"
      >
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleStageMouseDown}
          onTouchMove={handleStageMouseMove}
          onTouchEnd={handleStageMouseUp}
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
            <Transformer ref={trRef} rotateEnabled />
          </Layer>
        </Stage>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Catatan: gambar tidak tersimpan otomatis. Gunakan "Unduh PNG" untuk menyimpan karya Anda.
      </p>
    </div>
  );
}
