import { useState } from 'react';
import type { ProjectWithOrchestration } from '../lib/orchestration';
import OrchestrationGraph from './OrchestrationGraph';

const C = {
  border: 'oklch(0.88 0.01 80)',
  textPrimary: 'oklch(0.18 0.02 265)',
  textSec: 'oklch(0.45 0.02 265)',
  textDim: 'oklch(0.65 0.015 265)',
  bg: 'oklch(0.97 0.008 80)',
  indigo: 'oklch(0.45 0.18 265)',
  indigoLight: 'oklch(0.93 0.04 265)',
  indigoDim: 'oklch(0.45 0.18 265 / 0.12)',
};

function ProjectCard({
  project,
  onClick,
  index,
}: {
  project: ProjectWithOrchestration;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const hasOrchestration = !!project.orchestration;

  return (
    <div
      style={{
        background: hovered ? 'oklch(1 0 0)' : 'oklch(0.995 0.005 80)',
        border: `1.5px solid ${hovered ? C.indigo : C.border}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: hasOrchestration ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && hasOrchestration ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && hasOrchestration
          ? `0 0 0 4px ${C.indigoDim}, 0 8px 32px oklch(0 0 0 / 0.08)`
          : '0 1px 4px oklch(0 0 0 / 0.04)',
        animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={hasOrchestration ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: hasOrchestration ? C.indigo : C.border,
          borderRadius: '16px 16px 0 0',
          opacity: hovered ? 1 : 0.5,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: '4px',
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              color: C.textSec,
              lineHeight: 1.5,
            }}
          >
            {project.description}
          </div>
        </div>
      </div>

      {hasOrchestration && project.orchestration && (
        <div style={{ marginTop: '16px' }}>
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
            Agent Orchestration
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.orchestration.agents.map((agent) => (
              <span
                key={agent.id}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: C.indigoLight,
                  color: C.indigo,
                  border: `1px solid oklch(0.45 0.18 265 / 0.15)`,
                }}
              >
                {agent.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {!hasOrchestration && (
        <div
          style={{
            marginTop: '16px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: C.textDim,
            fontStyle: 'italic',
          }}
        >
          No orchestration defined
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {project.language && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: C.textDim,
              }}
            >
              {project.language}
            </span>
          )}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: C.textDim,
            }}
          >
            {project.updatedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {hasOrchestration && (
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              color: C.indigo,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View graph
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

interface ProjectGridProps {
  projects: ProjectWithOrchestration[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithOrchestration | null>(null);

  if (selectedProject && selectedProject.orchestration) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
        <OrchestrationGraph
          orchestration={selectedProject.orchestration}
          projectName={selectedProject.name}
          projectUrl={selectedProject.url}
          onClose={() => setSelectedProject(null)}
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
            onClick={() => setSelectedProject(project)}
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
        Add <code style={{ background: 'oklch(1 0 0)', padding: '2px 6px', borderRadius: '4px', border: `1px solid ${C.border}` }}>orchestration.yaml</code> to your repo to define agent workflows
      </div>
    </div>
  );
}
