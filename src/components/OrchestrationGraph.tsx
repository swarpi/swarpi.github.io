import { useState, useEffect, useCallback, useRef } from 'react';
import type { Orchestration, Agent, Connection } from '../lib/orchestration';

const COLORS = {
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
  borderStrong: 'oklch(0.78 0.02 80)',
  textPrimary: 'oklch(0.18 0.02 265)',
  textSec: 'oklch(0.45 0.02 265)',
  textDim: 'oklch(0.65 0.015 265)',
  bg: 'oklch(0.97 0.008 80)',
};

const ICONS: Record<string, React.ReactNode> = {
  architect: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  planner: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 6h12M4 10h8M4 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  executor: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 7l4-3 4 3v6l-4 3-4-3V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  ),
  reviewer: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  ),
};

const NODE_W = 220;
const NODE_H = 160;

interface Position {
  x: number;
  y: number;
}

interface Positions {
  [key: string]: Position;
}

function DotGrid({ W, H }: { W: number; H: number }) {
  const gap = 32;
  const cols = Math.ceil(W / gap) + 1;
  const rows = Math.ceil(H / gap) + 1;
  const pts: [number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push([c * gap, r * gap]);

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="dgFade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="oklch(0.72 0.04 265)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.72 0.04 265)" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="url(#dgFade)" />
      ))}
    </svg>
  );
}

function ConnectionLayer({ positions, connections, agents }: { positions: Positions; connections: Connection[]; agents: Agent[] }) {
  if (Object.keys(positions).length === 0) return null;

  const getColor = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    return COLORS[agent?.color || 'indigo'];
  };

  const nCx = (id: string) => positions[id]?.x + NODE_W / 2 || 0;
  const nCy = (id: string) => positions[id]?.y + NODE_H / 2 || 0;
  const top = (id: string) => ({ x: nCx(id), y: positions[id]?.y || 0 });
  const bot = (id: string) => ({ x: nCx(id), y: (positions[id]?.y || 0) + NODE_H });
  const left = (id: string) => ({ x: positions[id]?.x || 0, y: nCy(id) });
  const right = (id: string) => ({ x: (positions[id]?.x || 0) + NODE_W, y: nCy(id) });

  const bez = (p0: Position, c1: Position, c2: Position, p1: Position, t = 0.5) => ({
    x: (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * c1.x + 3 * (1 - t) * t ** 2 * c2.x + t ** 3 * p1.x,
    y: (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * c1.y + 3 * (1 - t) * t ** 2 * c2.y + t ** 3 * p1.y,
  });

  const lines = connections.map((conn) => {
    const fromPos = positions[conn.from];
    const toPos = positions[conn.to];
    if (!fromPos || !toPos) return null;

    const color = getColor(conn.type === 'feedback' ? conn.from : conn.from);
    const isFeedback = conn.type === 'feedback';

    // Determine best connection points based on relative positions
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;

    let f: Position, p1: Position, c1: Position, c2: Position;

    if (isFeedback) {
      // Feedback loops go below
      f = bot(conn.from);
      p1 = bot(conn.to);
      const swing = 50;
      c1 = { x: f.x + 20, y: f.y + swing };
      c2 = { x: p1.x - 20, y: p1.y + swing };
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        f = right(conn.from);
        p1 = left(conn.to);
      } else {
        f = left(conn.from);
        p1 = right(conn.to);
      }
      c1 = { x: f.x + (dx > 0 ? 60 : -60), y: f.y };
      c2 = { x: p1.x + (dx > 0 ? -60 : 60), y: p1.y };
    } else {
      // Vertical connection
      if (dy > 0) {
        f = bot(conn.from);
        p1 = top(conn.to);
      } else {
        f = top(conn.from);
        p1 = bot(conn.to);
      }
      c1 = { x: f.x, y: f.y + (dy > 0 ? 60 : -60) };
      c2 = { x: p1.x, y: p1.y + (dy > 0 ? -60 : 60) };
    }

    const d = `M${f.x},${f.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
    const mid = bez(f, c1, c2, p1, 0.5);

    return { d, mid, artifact: conn.artifact, color: color.main, isFeedback };
  }).filter(Boolean);

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        {Object.entries(COLORS).map(([name, color]) => (
          <marker key={name} id={`arr-${name}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1 1l5 3-5 3" stroke={color.main} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        ))}
        <filter id="blur-line" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
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
            strokeDasharray="6 8"
            opacity="0.55"
            markerEnd={`url(#arr-${l.isFeedback ? 'amber' : 'indigo'})`}
            filter="url(#blur-line)"
            className={l.isFeedback ? 'flow-line-reverse' : 'flow-line'}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
          <foreignObject x={l.mid.x - 50} y={l.mid.y - 12} width="100" height="24">
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                lineHeight: 1,
                padding: '4px 8px',
                borderRadius: '12px',
                background: 'oklch(1 0 0)',
                border: `1px solid oklch(0.88 0.04 265)`,
                color: l.color,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                boxShadow: '0 1px 4px oklch(0 0 0 / 0.06)',
              }}
            >
              {l.artifact}
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}


function NodeCard({
  agent,
  index,
  pos,
  selected,
  onClick,
  onDrag,
  isDragging,
}: {
  agent: Agent;
  index: number;
  pos: Position;
  selected: boolean;
  onClick: (id: string) => void;
  onDrag: (id: string, e: React.MouseEvent) => void;
  isDragging: boolean;
}) {
  const color = COLORS[agent.color || 'indigo'];
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;
  const icon = ICONS[agent.id] || ICONS.default;

  const hasInteracted = useRef(false);
  if (isDragging) hasInteracted.current = true;

  return (
    <div
      data-node-id={agent.id}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: NODE_W,
        height: NODE_H,
        cursor: isDragging ? 'grabbing' : 'grab',
        animation: hasInteracted.current ? 'none' : `nodeIn 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms both`,
        userSelect: 'none',
      }}
      onMouseDown={(e) => { e.preventDefault(); onDrag(agent.id, e); }}
      onClick={() => onClick(agent.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: active ? color.light : 'oklch(1 0 0)',
          border: `1.5px solid ${active ? color.main : C.border}`,
          borderRadius: '14px',
          padding: '16px',
          boxShadow: isDragging
            ? `0 0 0 4px ${color.dim}, 0 16px 48px oklch(0 0 0 / 0.15)`
            : active
            ? `0 0 0 4px ${color.dim}, 0 8px 32px oklch(0 0 0 / 0.08)`
            : '0 1px 4px oklch(0 0 0 / 0.05), 0 4px 16px oklch(0 0 0 / 0.04)',
          transition: isDragging ? 'box-shadow 0.15s' : 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          transform: isDragging ? 'scale(1.03)' : active ? 'translateY(-2px)' : 'translateY(0)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: color.main,
            borderRadius: '14px 14px 0 0',
            opacity: active ? 1 : 0.4,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              fontWeight: 500,
              color: color.main,
              background: color.dim,
              border: `1px solid ${color.border}`,
              borderRadius: '5px',
              padding: '2px 6px',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ color: color.main }}>{icon}</span>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '17px',
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: '3px',
            }}
          >
            {agent.title}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              color: C.textDim,
              lineHeight: 1.4,
            }}
          >
            {agent.tagline}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
          {agent.outputs.slice(0, 3).map((o) => (
            <span
              key={o}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8.5px',
                padding: '2px 6px',
                borderRadius: '10px',
                background: color.light,
                color: color.main,
                border: `1px solid ${color.border}`,
              }}
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ agent, onClose, repoUrl }: { agent: Agent; onClose: () => void; repoUrl: string }) {
  const color = COLORS[agent.color || 'indigo'];
  const icon = ICONS[agent.id] || ICONS.default;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 340,
        background: 'oklch(1 0 0)',
        border: `1.5px solid ${color.main}`,
        borderRadius: '18px',
        padding: '24px',
        boxShadow: `0 0 0 4px ${color.dim}, 0 20px 60px oklch(0 0 0 / 0.15)`,
        animation: 'panelIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        zIndex: 300,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          width: 26,
          height: 26,
          borderRadius: '8px',
          border: `1.5px solid ${C.border}`,
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.textDim,
          fontSize: '13px',
        }}
      >
        ✕
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ color: color.main }}>{icon}</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            color: color.main,
            background: color.light,
            padding: '3px 8px',
            borderRadius: '10px',
            border: `1px solid ${color.border}`,
          }}
        >
          Agent
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '22px',
          fontWeight: 700,
          color: C.textPrimary,
          marginBottom: '8px',
        }}
      >
        {agent.title}
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '13px',
          color: C.textSec,
          lineHeight: 1.6,
          marginBottom: '20px',
        }}
      >
        {agent.description}
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: C.textDim,
          marginBottom: '8px',
        }}
      >
        Outputs
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {agent.outputs.map((o) => (
          <span
            key={o}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: color.light,
              color: color.main,
              border: `1px solid ${color.border}`,
            }}
          >
            {o}
          </span>
        ))}
      </div>

      {agent.docLink && (
        <a
          href={`${repoUrl}/blob/main${agent.docLink}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: color.main,
            padding: '10px 16px',
            borderRadius: '10px',
            border: `1.5px solid ${color.border}`,
            background: color.light,
            textDecoration: 'none',
            width: '100%',
          }}
        >
          View documentation
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  );
}

interface OrchestrationGraphProps {
  orchestration: Orchestration;
  projectName: string;
  projectUrl: string;
  onClose?: () => void;
}

export default function OrchestrationGraph({ orchestration, projectName, projectUrl, onClose }: OrchestrationGraphProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [positions, setPositions] = useState<Positions>({});
  const [dims, setDims] = useState({ W: 1200, H: 800 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const didDragRef = useRef(false);

  const handleDragStart = useCallback((id: string, e: React.MouseEvent) => {
    const nodeEl = (e.target as HTMLElement).closest('[data-node-id]');
    const rect = nodeEl?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    didDragRef.current = false;
    setDraggingId(id);

    const onMove = (ev: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      didDragRef.current = true;
      const x = ev.clientX - drag.offsetX;
      const y = ev.clientY - drag.offsetY;
      setPositions((prev) => ({ ...prev, [drag.id]: { x, y } }));
    };

    const onUp = () => {
      dragRef.current = null;
      setDraggingId(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const compute = useCallback(() => {
    if (typeof window === 'undefined') return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    setDims({ W, H });

    const agents = orchestration.agents;
    const n = agents.length;
    const cx = W / 2;
    const cy = H / 2;

    const newPositions: Positions = {};

    if (orchestration.layout === 'diamond' && n === 4) {
      const hSpread = Math.min(W * 0.22, 260);
      const vSpread = Math.min(H * 0.26, 200);
      newPositions[agents[0].id] = { x: cx - NODE_W / 2, y: cy - vSpread - NODE_H / 2 };
      newPositions[agents[1].id] = { x: cx - hSpread - NODE_W / 2, y: cy - NODE_H / 2 };
      newPositions[agents[2].id] = { x: cx + hSpread - NODE_W / 2, y: cy - NODE_H / 2 };
      newPositions[agents[3].id] = { x: cx - NODE_W / 2, y: cy + vSpread - NODE_H / 2 };
    } else if (n <= 3) {
      // Horizontal layout for small number of agents
      const spacing = Math.min(W * 0.25, 300);
      const startX = cx - ((n - 1) * spacing) / 2 - NODE_W / 2;
      agents.forEach((agent, i) => {
        newPositions[agent.id] = { x: startX + i * spacing, y: cy - NODE_H / 2 };
      });
    } else {
      // Grid layout for larger numbers
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const spacingX = Math.min(W * 0.22, 280);
      const spacingY = Math.min(H * 0.28, 220);
      const startX = cx - ((cols - 1) * spacingX) / 2 - NODE_W / 2;
      const startY = cy - ((rows - 1) * spacingY) / 2 - NODE_H / 2;

      agents.forEach((agent, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        newPositions[agent.id] = { x: startX + col * spacingX, y: startY + row * spacingY };
      });
    }

    setPositions(newPositions);
  }, [orchestration]);

  useEffect(() => {
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [compute]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) {
          setSelected(null);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onClose]);

  const selectedAgent = orchestration.agents.find((a) => a.id === selected);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: C.bg,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: scale(0.92) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes flowDash {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        .flow-line {
          animation: flowDash 1.6s linear infinite;
        }
        .flow-line-reverse {
          animation: flowDash 2s linear infinite reverse;
        }
      `}</style>

      <DotGrid W={dims.W} H={dims.H} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, oklch(0.92 0.01 80 / 0.5) 100%)',
        }}
      />

      {/* Header */}
      <div style={{ position: 'absolute', top: 28, left: 36, zIndex: 10, animation: 'fadeUp 0.5s both' }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              color: C.textDim,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '8px',
              padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to projects
          </button>
        )}
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            color: C.textPrimary,
          }}
        >
          {orchestration.name || projectName}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: C.textDim,
            marginTop: '4px',
          }}
        >
          {orchestration.agents.length} agents · click to explore
        </div>
      </div>

      {Object.keys(positions).length > 0 && (
        <ConnectionLayer positions={positions} connections={orchestration.connections} agents={orchestration.agents} />
      )}

      {orchestration.agents.map((agent, i) =>
        positions[agent.id] ? (
          <NodeCard
            key={agent.id}
            agent={agent}
            index={i}
            pos={positions[agent.id]}
            selected={selected === agent.id}
            onClick={(id) => { if (!didDragRef.current) setSelected((prev) => (prev === id ? null : id)); }}
            onDrag={handleDragStart}
            isDragging={draggingId === agent.id}
          />
        ) : null
      )}

      {selected && selectedAgent && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'oklch(0 0 0 / 0.3)',
              zIndex: 250,
            }}
            onClick={() => setSelected(null)}
          />
          <DetailPanel agent={selectedAgent} onClose={() => setSelected(null)} repoUrl={projectUrl} />
        </>
      )}

      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: C.textDim,
          animation: 'fadeUp 0.5s 0.8s both',
        }}
      >
        <span style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}`, color: C.textSec }}>click</span>
        agent to inspect ·
        <span style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}`, color: C.textSec }}>drag</span>
        to rearrange ·
        <span style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}`, color: C.textSec }}>esc</span>
        to go back
      </div>
    </div>
  );
}
