export interface WorkflowContent {
  markdown: string;
  lastUpdated: Date;
}

export async function fetchWorkflowContent(): Promise<WorkflowContent | null> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/swarpi/agentic-workflow/contents/site-content/workflow.md',
      { headers }
    );

    if (!response.ok) {
      console.error(`Failed to fetch workflow content: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const markdown = atob(data.content);

    const commitsResponse = await fetch(
      'https://api.github.com/repos/swarpi/agentic-workflow/commits?path=site-content/workflow.md&per_page=1',
      { headers }
    );

    let lastUpdated = new Date();
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json();
      if (commits.length > 0) {
        lastUpdated = new Date(commits[0].commit.committer.date);
      }
    }

    return { markdown, lastUpdated };
  } catch (error) {
    console.error('Error fetching workflow content:', error);
    return null;
  }
}

export async function fetchWorkflowDiagram(): Promise<string | null> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/swarpi/agentic-workflow/contents/site-content/diagram.svg',
      { headers }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return atob(data.content);
  } catch {
    return null;
  }
}
