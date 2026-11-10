import type { CSSProperties } from 'react';
import type { SymbolType } from '../data/puzzles';

interface FlowShapeProps {
  type: SymbolType;
  w: number;
  h: number;
  text?: string;
  sub?: string;
  ghost?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function FlowShape({ type, w, h, text, sub, ghost, className = '', style }: FlowShapeProps) {
  const sw = 2.5;
  const skew = Math.min(26, w * 0.14);
  let shape: React.ReactNode;
  switch (type) {
    case 'terminator':
      shape = <rect x={sw} y={sw} width={w - sw * 2} height={h - sw * 2} rx={(h - sw * 2) / 2} />;
      break;
    case 'process':
      shape = <rect x={sw} y={sw} width={w - sw * 2} height={h - sw * 2} rx={7} />;
      break;
    case 'io':
      shape = (
        <polygon
          points={`${skew},${sw} ${w - sw},${sw} ${w - skew},${h - sw} ${sw},${h - sw}`}
          strokeLinejoin="round"
        />
      );
      break;
    case 'decision':
      shape = (
        <polygon
          points={`${w / 2},${sw} ${w - sw},${h / 2} ${w / 2},${h - sw} ${sw},${h / 2}`}
          strokeLinejoin="round"
        />
      );
      break;
  }
  return (
    <div
      className={`flow-shape flow-shape--${type} ${ghost ? 'flow-shape--ghost' : ''} ${className}`}
      style={{ width: w, height: h, ...style }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false">
        {shape}
      </svg>
      {text && (
        <span className="flow-shape__text">
          <strong>{text}</strong>
          {sub && <small>{sub}</small>}
        </span>
      )}
    </div>
  );
}

export function FlowSymbolLegend() {
  const items: { type: SymbolType; text: string; note: string }[] = [
    { type: 'terminator', text: 'Mulai / Selesai', note: 'Terminator' },
    { type: 'io', text: 'Input / Output', note: 'Jajar genjang' },
    { type: 'process', text: 'Proses', note: 'Persegi panjang' },
    { type: 'decision', text: 'Keputusan?', note: 'Belah ketupat' },
  ];
  return (
    <div className="legend">
      {items.map((it) => (
        <figure key={it.type} className="legend__item">
          <FlowShape type={it.type} w={it.type === 'decision' ? 140 : 140} h={it.type === 'decision' ? 76 : 48} text={it.text} />
          <figcaption>{it.note}</figcaption>
        </figure>
      ))}
      <figure className="legend__item">
        <svg viewBox="0 0 140 48" width="140" height="48" aria-hidden="true">
          <defs>
            <marker id="legend-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#5a3a1a" />
            </marker>
          </defs>
          <line x1="10" y1="24" x2="128" y2="24" stroke="#5a3a1a" strokeWidth="4" strokeLinecap="round" markerEnd="url(#legend-arrow)" />
        </svg>
        <figcaption>Panah (arah alur)</figcaption>
      </figure>
    </div>
  );
}
