import yaml from 'js-yaml';

export interface Agent {
  id: string;
  kind?: 'decision' | 'planning' | 'execution' | 'validation';
  title: string;
  tagline: string;
  description: string;
  outputs: string[];
  color: 'indigo' | 'amber' | 'green' | 'blue';
  docLink?: string;
}

export interface Connection {
  from: string;
  to: string;
  artifact: string;
  type?: 'main' | 'feedback';
}

export interface Orchestration {
  name: string;
  description: string;
  agents: Agent[];
  connections: Connection[];
  layout?: 'diamond' | 'horizontal' | 'vertical';
}

export interface Subcomponent {
  name: string;
  detail: string;
}

export interface ArchComponent {
  id: string;
  title: string;
  description: string;
  technology: string;
  tier: 'client' | 'service' | 'engine' | 'data';
  color: 'indigo' | 'amber' | 'green' | 'blue';
  subcomponents?: Subcomponent[];
}

export interface ArchConnection {
  from: string;
  to: string;
  label: string;
  protocol: string;
  style?: 'sync' | 'async' | 'stream';
}

export interface Architecture {
  name: string;
  description: string;
  components: ArchComponent[];
  connections: ArchConnection[];
}

export interface ProjectWithOrchestration {
  name: string;
  description: string;
  url: string;
  language: string | null;
  updatedAt: Date;
  stars: number;
  orchestration: Orchestration | null;
  architecture: Architecture | null;
}

export async function fetchOrchestration(repoName: string): Promise<Orchestration | null> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/swarpi/${repoName}/main/orchestration.yaml`
    );

    if (!response.ok) {
      return null;
    }

    const content = await response.text();
    const parsed = yaml.load(content) as Orchestration;
    return parsed;
  } catch {
    return null;
  }
}

export async function fetchArchitecture(repoName: string): Promise<Architecture | null> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/swarpi/${repoName}/main/architecture.yaml`
    );

    if (!response.ok) {
      return null;
    }

    const content = await response.text();
    const parsed = yaml.load(content) as Architecture;
    return parsed;
  } catch {
    return null;
  }
}

export async function fetchProjectsWithOrchestrations(): Promise<ProjectWithOrchestration[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch('https://api.github.com/users/swarpi/repos?per_page=100', {
      headers,
    });

    if (!response.ok) {
      return [];
    }

    const repos = await response.json();
    const showcaseRepos = repos.filter((repo: any) => repo.topics?.includes('showcase'));

    const projects: ProjectWithOrchestration[] = await Promise.all(
      showcaseRepos.map(async (repo: any) => {
        const [orchestration, architecture] = await Promise.all([
          fetchOrchestration(repo.name),
          fetchArchitecture(repo.name),
        ]);
        return {
          name: repo.name,
          description: repo.description ?? 'No description',
          url: repo.html_url,
          language: repo.language,
          updatedAt: new Date(repo.updated_at),
          stars: repo.stargazers_count,
          orchestration,
          architecture,
        };
      })
    );

    return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch {
    return [];
  }
}
