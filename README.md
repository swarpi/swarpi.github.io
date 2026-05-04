# swarpi.github.io

Personal site and project showcase, built with [Astro](https://astro.build).

## Features

- **Workflow page** — Automatically synced from [agentic-workflow](https://github.com/swarpi/agentic-workflow) repo
- **Projects page** — Displays all repos tagged with `showcase` topic
- **Writing section** — Ready for essays and notes
- **RSS feed** — Available at `/rss.xml`

## Development

```bash
npm install
npm run dev
```

## Build triggers

The site rebuilds automatically on:

- Push to `main`
- Repository dispatch from `agentic-workflow` (when site-content changes)
- Daily at 06:00 UTC
- Manual trigger from Actions tab

## License

MIT
