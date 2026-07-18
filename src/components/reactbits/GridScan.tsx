import './GridScan.css';

// React Bits-style "Grid Scan": a subtle grid with a light beam sweeping across
// it. Pure CSS (a repeating-linear-gradient grid + an animated overlay), so it
// costs nothing on the main thread and honors reduced-motion.

interface GridScanProps {
  className?: string;
  /** Grid line color. */
  lineColor?: string;
  /** Sweep beam color. */
  scanColor?: string;
  /** Grid cell size in px. */
  cell?: number;
}

export default function GridScan({
  className = '',
  lineColor = 'rgba(139, 188, 237, 0.28)',
  scanColor = 'rgba(139, 188, 237, 0.5)',
  cell = 40,
}: GridScanProps) {
  return (
    <div
      aria-hidden
      className={`grid-scan ${className}`}
      style={{
        ['--gs-line' as string]: lineColor,
        ['--gs-scan' as string]: scanColor,
        ['--gs-cell' as string]: `${cell}px`,
      }}
    >
      <div className="grid-scan__grid" />
      <div className="grid-scan__beam" />
    </div>
  );
}
