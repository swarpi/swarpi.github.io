export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  topics: string[];
  stargazers_count: number;
}

export interface ShowcaseProject {
  name: string;
  description: string;
  url: string;
  language: string | null;
  updatedAt: Date;
  stars: number;
  readme: string | null;
}

export async function fetchShowcaseProjects(): Promise<ShowcaseProject[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch('https://api.github.com/users/swarpi/repos?per_page=100', {
    headers,
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status}`);
    return [];
  }

  const repos: GitHubRepo[] = await response.json();

  const showcaseRepos = repos.filter((repo) => repo.topics.includes('showcase'));

  const projects: ShowcaseProject[] = await Promise.all(
    showcaseRepos.map(async (repo) => {
      let readme: string | null = null;

      try {
        const readmeResponse = await fetch(
          `https://api.github.com/repos/swarpi/${repo.name}/readme`,
          { headers }
        );

        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          readme = atob(readmeData.content);
        }
      } catch {
        // README fetch failed, continue without it
      }

      return {
        name: repo.name,
        description: repo.description ?? 'No description',
        url: repo.html_url,
        language: repo.language,
        updatedAt: new Date(repo.updated_at),
        stars: repo.stargazers_count,
        readme,
      };
    })
  );

  return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
