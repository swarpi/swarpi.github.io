import { useState } from 'react';
import type { ProjectWithOrchestration } from '../lib/orchestration';
import OrchestrationGraph from './OrchestrationGraph';
import ArchitectureGraph from './ArchitectureGraph';

const C = {
  border: 'var(--wf-border)',
  textPrimary: 'var(--wf-text)',
  textSec: 'var(--wf-text-sec)',
  textDim: 'var(--wf-text-dim)',
  bg: 'var(--wf-bg)',
  card: 'var(--wf-card)',
  cardHover: 'var(--wf-card-hover)',
  indigo: 'oklch(0.45 0.18 265)',
  indigoLight: 'oklch(0.93 0.04 265)',
  indigoDim: 'oklch(0.45 0.18 265 / 0.12)',
};

type ViewType = 'orchestration' | 'architecture';

function ProjectCard({
  project,
  onViewGraph,
  index,
}: {
  project: ProjectWithOrchestration;
  onViewGraph: (view: ViewType) => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const hasOrchestration = !!project.orchestration;
  const hasArchitecture = !!project.architecture;
  const hasAny = hasOrchestration || hasArchitecture;

  return (
    <div
      style={{
        background: hovered ? C.cardHover : C.card,
        border: `1.5px solid ${hovered ? C.indigo : C.border}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && hasAny ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && hasAny
          ? `0 0 0 4px ${C.indigoDim}, 0 8px 32px oklch(0 0 0 / 0.08)`
          : '0 1px 4px oklch(0 0 0 / 0.04)',
        animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: hasAny ? C.indigo : C.border,
          borderRadius: '16px 16px 0 0', opacity: hovered ? 1 : 0.5,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700,
            color: C.textPrimary, marginBottom: '4px',
          }}>
            {project.name}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
            color: C.textSec, lineHeight: 1.5,
          }}>
            {project.description}
          </div>
        </div>
      </div>

      {hasOrchestration && project.orchestration && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
            textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textDim, marginBottom: '8px',
          }}>
            Agent Orchestration
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.orchestration.agents.map((agent) => (
              <span key={agent.id} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                padding: '4px 10px', borderRadius: '8px',
                background: C.indigoLight, color: C.indigo,
                border: `1px solid oklch(0.45 0.18 265 / 0.15)`,
              }}>
                {agent.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasArchitecture && project.architecture && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
            textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textDim, marginBottom: '8px',
          }}>
            System Architecture
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.architecture.components.map((comp) => (
              <span key={comp.id} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                padding: '4px 10px', borderRadius: '8px',
                background: 'oklch(0.94 0.04 155)', color: 'oklch(0.58 0.14 155)',
                border: `1px solid oklch(0.58 0.14 155 / 0.15)`,
              }}>
                {comp.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {!hasAny && (
        <div style={{
          marginTop: '16px', fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px', color: C.textDim, fontStyle: 'italic',
        }}>
          No orchestration or architecture defined
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {project.language && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: C.textDim }}>
              {project.language}
            </span>
          )}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: C.textDim }}>
            {project.updatedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {hasOrchestration && (
            <button
              onClick={() => onViewGraph('orchestration')}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 500,
                color: C.indigo, display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = C.indigoLight; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'none'; }}
            >
              Workflow
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {hasArchitecture && (
            <button
              onClick={() => onViewGraph('architecture')}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 500,
                color: 'oklch(0.58 0.14 155)', display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'oklch(0.94 0.04 155)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'none'; }}
            >
              Architecture
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectGridProps {
  projects: ProjectWithOrchestration[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithOrchestration | null>(null);
  const [activeView, setActiveView] = useState<ViewType | null>(null);

  if (selectedProject && activeView === 'orchestration' && selectedProject.orchestration) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
        <OrchestrationGraph
          orchestration={selectedProject.orchestration}
          projectName={selectedProject.name}
          projectUrl={selectedProject.url}
          onClose={() => { setSelectedProject(null); setActiveView(null); }}
        />
      </div>
    );
  }

  if (selectedProject && activeView === 'architecture' && selectedProject.architecture) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
        <ArchitectureGraph
          architecture={selectedProject.architecture}
          projectName={selectedProject.name}
          projectUrl={selectedProject.url}
          onClose={() => { setSelectedProject(null); setActiveView(null); }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        padding: '40px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 40px',
          animation: 'fadeUp 0.5s both',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill={C.indigo} />
            <circle cx="12" cy="12" r="10" stroke={C.indigo} strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: C.textPrimary,
              margin: 0,
            }}
          >
            Agent Orchestrations
          </h1>
        </div>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            color: C.textSec,
            margin: 0,
            paddingLeft: '36px',
          }}
        >
          Projects with defined agent workflows. Click to explore the orchestration graph.
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={i}
            onViewGraph={(view) => { setSelectedProject(project); setActiveView(view); }}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontFamily: "'Space Grotesk', sans-serif",
            color: C.textDim,
          }}
        >
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No showcase projects found.</p>
          <p style={{ fontSize: '13px' }}>
            Add the <code style={{ background: C.indigoLight, padding: '2px 6px', borderRadius: '4px' }}>showcase</code> topic
            to a repository to display it here.
          </p>
        </div>
      )}

      {/* Footer hint */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: C.textDim,
          animation: 'fadeUp 0.5s 0.4s both',
        }}
      >
        Add <code style={{ background: C.card, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}` }}>orchestration.yaml</code> to your repo to define agent workflows
      </div>
    </div>
  );
}
