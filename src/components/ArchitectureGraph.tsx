import { useState, useEffect, useCallback } from 'react';
import type { Architecture, ArchComponent, ArchConnection } from '../lib/orchestration';

const COLORS: Record<string, { main: string; light: string; dim: string; border: string }> = {
  indigo: {
    main: 'oklch(0.45 0.18 265)',
    light: 'oklch(0.93 0.04 265)',
    dim: 'oklch(0.45 0.18 265 / 0.12)',
    border: 'oklch(0.45 0.18 265 / 0.2)',
  },
  amber: {
    main: 'oklch(0.68 0.14 65)',
    light: 'oklch(0.96 0.04 65)',
    dim: 'oklch(0.68 0.14 65 / 0.15)',
    border: 'oklch(0.68 0.14 65 / 0.25)',
  },
  green: {
    main: 'oklch(0.58 0.14 155)',
    light: 'oklch(0.94 0.04 155)',
    dim: 'oklch(0.58 0.14 155 / 0.12)',
    border: 'oklch(0.58 0.14 155 / 0.2)',
  },
  blue: {
    main: 'oklch(0.55 0.15 240)',
    light: 'oklch(0.94 0.04 240)',
    dim: 'oklch(0.55 0.15 240 / 0.12)',
    border: 'oklch(0.55 0.15 240 / 0.2)',
  },
};

const C = {
  border: 'oklch(0.88 0.01 80)',
  textPrimary: 'oklch(0.18 0.02 265)',
  textSec: 'oklch(0.45 0.02 265)',
  textDim: 'oklch(0.65 0.015 265)',
  bg: 'oklch(0.97 0.008 80)',
};

const TIER_ORDER: Record<string, number> = { client: 0, service: 1, engine: 2, data: 3 };
const TIER_LABELS: Record<string, string> = { client: 'Client', service: 'Service', engine: 'Engine', data: 'Data' };

const NODE_W = 240;
const NODE_H = 180;

interface Position { x: number; y: number }
interface Positions { [key: string]: Position }

function DotGrid({ W, H }: { W: number; H: number }) {
  const gap = 32;
  const cols = Math.ceil(W / gap) + 1;
  const rows = Math.ceil(H / gap) + 1;
  const pts: [number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push([c * gap, r * gap]);

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="dgFade2" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="oklch(0.72 0.04 265)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.72 0.04 265)" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="url(#dgFade2)" />
      ))}
    </svg>
  );
}

function ConnectionLayer({ positions, connections, components }: { positions: Positions; connections: ArchConnection[]; components: ArchComponent[] }) {
  if (Object.keys(positions).length === 0) return null;

  const getColor = (compId: string) => {
    const comp = components.find((c) => c.id === compId);
    return COLORS[comp?.color || 'indigo'];
  };

  const nCx = (id: string) => (positions[id]?.x ?? 0) + NODE_W / 2;
  const nCy = (id: string) => (positions[id]?.y ?? 0) + NODE_H / 2;
  const top = (id: string) => ({ x: nCx(id), y: positions[id]?.y ?? 0 });
  const bot = (id: string) => ({ x: nCx(id), y: (positions[id]?.y ?? 0) + NODE_H });
  const left = (id: string) => ({ x: positions[id]?.x ?? 0, y: nCy(id) });
  const right = (id: string) => ({ x: (positions[id]?.x ?? 0) + NODE_W, y: nCy(id) });

  const bez = (p0: Position, c1: Position, c2: Position, p1: Position, t = 0.5) => ({
    x: (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * c1.x + 3 * (1 - t) * t ** 2 * c2.x + t ** 3 * p1.x,
    y: (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * c1.y + 3 * (1 - t) * t ** 2 * c2.y + t ** 3 * p1.y,
  });

  const lines = connections.map((conn) => {
    const fromPos = positions[conn.from];
    const toPos = positions[conn.to];
    if (!fromPos || !toPos) return null;

    const color = getColor(conn.from);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const isStream = conn.style === 'stream';

    let f: Position, p1: Position, c1: Position, c2: Position;

    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0) { f = bot(conn.from); p1 = top(conn.to); }
      else { f = top(conn.from); p1 = bot(conn.to); }
      c1 = { x: f.x, y: f.y + (dy > 0 ? 60 : -60) };
      c2 = { x: p1.x, y: p1.y + (dy > 0 ? -60 : 60) };
    } else {
      if (dx > 0) { f = right(conn.from); p1 = left(conn.to); }
      else { f = left(conn.from); p1 = right(conn.to); }
      c1 = { x: f.x + (dx > 0 ? 60 : -60), y: f.y };
      c2 = { x: p1.x + (dx > 0 ? -60 : 60), y: p1.y };
    }

    const d = `M${f.x},${f.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
    const mid = bez(f, c1, c2, p1, 0.5);

    return { d, mid, label: conn.label, protocol: conn.protocol, color: color.main, isStream };
  }).filter(Boolean);

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        {Object.entries(COLORS).map(([name, color]) => (
          <marker key={name} id={`arch-arr-${name}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1 1l5 3-5 3" stroke={color.main} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        ))}
        <filter id="arch-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {lines.map((l, i) => l && (
        <g key={i}>
          <path d={l.d} fill="none" stroke={l.color} strokeWidth="1" strokeDasharray="5 7" opacity={0.15} />
          <path
            d={l.d}
            fill="none"
            stroke={l.color}
            strokeWidth="1.8"
            strokeDasharray={l.isStream ? '2 4' : '6 8'}
            opacity="0.55"
            markerEnd={`url(#arch-arr-indigo)`}
            filter="url(#arch-blur)"
            className="arch-flow-line"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
          <foreignObject x={l.mid.x - 60} y={l.mid.y - 14} width="120" height="28">
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8.5px',
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: '12px',
              background: 'oklch(1 0 0)',
              border: `1px solid oklch(0.88 0.04 265)`,
              color: l.color,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              boxShadow: '0 1px 4px oklch(0 0 0 / 0.06)',
            }}>
              {l.label}
              <span style={{ opacity: 0.5, marginLeft: '4px' }}>({l.protocol})</span>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}

function ComponentNode({
  component,
  index,
  pos,
  selected,
  onClick,
}: {
  component: ArchComponent;
  index: number;
  pos: Position;
  selected: boolean;
  onClick: (id: string) => void;
}) {
  const color = COLORS[component.color || 'indigo'];
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: NODE_W,
        cursor: 'pointer',
        animation: `archNodeIn 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms both`,
      }}
      onClick={() => onClick(component.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '100%',
        background: active ? color.light : 'oklch(1 0 0)',
        border: `1.5px solid ${active ? color.main : C.border}`,
        borderRadius: '14px',
        padding: '16px',
        boxShadow: active
          ? `0 0 0 4px ${color.dim}, 0 8px 32px oklch(0 0 0 / 0.08)`
          : '0 1px 4px oklch(0 0 0 / 0.05), 0 4px 16px oklch(0 0 0 / 0.04)',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: active ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: color.main, borderRadius: '14px 14px 0 0', opacity: active ? 1 : 0.4,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 500,
            color: color.main, background: color.dim, border: `1px solid ${color.border}`,
            borderRadius: '5px', padding: '2px 6px',
          }}>
            {TIER_LABELS[component.tier] || component.tier}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
            color: C.textDim,
          }}>
            {component.technology}
          </span>
        </div>

        <div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 700,
            color: C.textPrimary, marginBottom: '3px',
          }}>
            {component.title}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
            color: C.textDim, lineHeight: 1.4,
          }}>
            {component.description}
          </div>
        </div>

        {component.subcomponents && component.subcomponents.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
            {component.subcomponents.slice(0, 3).map((sub) => (
              <span key={sub.name} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px',
                padding: '2px 6px', borderRadius: '10px',
                background: color.light, color: color.main, border: `1px solid ${color.border}`,
              }}>
                {sub.name}
              </span>
            ))}
            {component.subcomponents.length > 3 && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px',
                padding: '2px 6px', borderRadius: '10px',
                background: color.light, color: color.main, border: `1px solid ${color.border}`,
              }}>
                +{component.subcomponents.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ component, onClose }: { component: ArchComponent; onClose: () => void }) {
  const color = COLORS[component.color || 'indigo'];

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 360, background: 'oklch(1 0 0)', border: `1.5px solid ${color.main}`,
      borderRadius: '18px', padding: '24px',
      boxShadow: `0 0 0 4px ${color.dim}, 0 20px 60px oklch(0 0 0 / 0.15)`,
      animation: 'archPanelIn 0.25s cubic-bezier(0.16,1,0.3,1) both', zIndex: 300,
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 14, right: 14, width: 26, height: 26,
        borderRadius: '8px', border: `1.5px solid ${C.border}`, background: 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textDim, fontSize: '13px',
      }}>✕</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: color.main,
          background: color.light, padding: '3px 8px', borderRadius: '10px', border: `1px solid ${color.border}`,
        }}>
          {TIER_LABELS[component.tier] || component.tier}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: C.textDim,
        }}>
          {component.technology}
        </span>
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700,
        color: C.textPrimary, marginBottom: '8px',
      }}>
        {component.title}
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: C.textSec,
        lineHeight: 1.6, marginBottom: '20px',
      }}>
        {component.description}
      </div>

      {component.subcomponents && component.subcomponents.length > 0 && (
        <>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', textTransform: 'uppercase',
            letterSpacing: '0.1em', color: C.textDim, marginBottom: '10px',
          }}>
            Subcomponents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {component.subcomponents.map((sub) => (
              <div key={sub.name} style={{
                padding: '10px 12px', borderRadius: '10px',
                background: color.light, border: `1px solid ${color.border}`,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                  fontWeight: 600, color: color.main, marginBottom: '2px',
                }}>
                  {sub.name}
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
                  color: C.textSec, lineHeight: 1.4,
                }}>
                  {sub.detail}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ArchitectureGraphProps {
  architecture: Architecture;
  projectName: string;
  projectUrl: string;
  onClose?: () => void;
}

export default function ArchitectureGraph({ architecture, projectName, projectUrl, onClose }: ArchitectureGraphProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [positions, setPositions] = useState<Positions>({});
  const [dims, setDims] = useState({ W: 1200, H: 800 });

  const compute = useCallback(() => {
    if (typeof window === 'undefined') return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    setDims({ W, H });

    const components = architecture.components;
    const tiers: Record<string, ArchComponent[]> = {};
    for (const comp of components) {
      const tier = comp.tier || 'service';
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(comp);
    }

    const sortedTiers = Object.entries(tiers).sort(
      ([a], [b]) => (TIER_ORDER[a] ?? 99) - (TIER_ORDER[b] ?? 99)
    );

    const totalTiers = sortedTiers.length;
    const tierSpacing = Math.min(H * 0.22, 220);
    const startY = (H - (totalTiers - 1) * tierSpacing) / 2 - NODE_H / 2 + 20;

    const newPositions: Positions = {};

    sortedTiers.forEach(([, comps], tierIdx) => {
      const y = startY + tierIdx * tierSpacing;
      const spacing = Math.min(W * 0.22, 280);
      const startX = (W - (comps.length - 1) * spacing) / 2 - NODE_W / 2;

      comps.forEach((comp, i) => {
        newPositions[comp.id] = { x: startX + i * spacing, y };
      });
    });

    setPositions(newPositions);
  }, [architecture]);

  useEffect(() => {
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [compute]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null);
        else if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onClose]);

  const selectedComp = architecture.components.find((c) => c.id === selected);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes archFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes archNodeIn { from { opacity: 0; transform: scale(0.92) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes archPanelIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes archFlowDash { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
        .arch-flow-line { animation: archFlowDash 1.6s linear infinite; }
      `}</style>

      <DotGrid W={dims.W} H={dims.H} />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, oklch(0.92 0.01 80 / 0.5) 100%)',
      }} />

      <div style={{ position: 'absolute', top: 28, left: 36, zIndex: 10, animation: 'archFadeUp 0.5s both' }}>
        {onClose && (
          <button onClick={onClose} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: C.textDim,
            background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', padding: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to projects
          </button>
        )}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 600, color: C.textPrimary,
        }}>
          {architecture.name || projectName}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: C.textDim, marginTop: '4px',
        }}>
          {architecture.components.length} components · click to explore
        </div>
      </div>

      {Object.keys(positions).length > 0 && (
        <ConnectionLayer positions={positions} connections={architecture.connections} components={architecture.components} />
      )}

      {architecture.components.map((comp, i) =>
        positions[comp.id] ? (
          <ComponentNode
            key={comp.id}
            component={comp}
            index={i}
            pos={positions[comp.id]}
            selected={selected === comp.id}
            onClick={(id) => setSelected((prev) => (prev === id ? null : id))}
          />
        ) : null
      )}

      {selected && selectedComp && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.3)', zIndex: 250 }}
            onClick={() => setSelected(null)} />
          <DetailPanel component={selectedComp} onClose={() => setSelected(null)} />
        </>
      )}

      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: C.textDim,
        animation: 'archFadeUp 0.5s 0.8s both',
      }}>
        <span style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}`, color: C.textSec }}>click</span>
        component to inspect ·
        <span style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}`, color: C.textSec }}>esc</span>
        to go back
      </div>
    </div>
  );
}
