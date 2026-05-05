import yaml from 'js-yaml';

export interface Agent {
  id: string;
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

export interface ProjectWithOrchestration {
  name: string;
  description: string;
  url: string;
  language: string | null;
  updatedAt: Date;
  stars: number;
  orchestration: Orchestration | null;
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
        const orchestration = await fetchOrchestration(repo.name);
        return {
          name: repo.name,
          description: repo.description ?? 'No description',
          url: repo.html_url,
          language: repo.language,
          updatedAt: new Date(repo.updated_at),
          stars: repo.stargazers_count,
          orchestration,
        };
      })
    );

    return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch {
    return [];
  }
}
