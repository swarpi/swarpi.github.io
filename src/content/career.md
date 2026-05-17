---
name: Trung Duc Nguyen
title: Software Engineer
location: Berlin
tagline: >
  Building things with TypeScript, Python, and Java —
  shipping agentic workflows and AI-powered applications with Claude Code.
email: nguyendtrung15@gmail.com
github: https://github.com/swarpi
current_focus: >
  Currently building agentic developer tools and AI-powered applications using Claude Code.
  Associate Engineer at Deutsche Bank, modernizing commercial banking on GCP.
---

## Skills

### Languages
TypeScript, Python, Java, SQL, Dart, C#

### Technologies
React, Spring Boot, Docker, Firebase, Supabase, GCP, Kubernetes, MySQL, MongoDB, Flutter

### Agent Engineering
AI agent orchestration, prompt engineering, Claude Code workflows, system design with AI tools

### Interests
LLM-augmented development, agentic workflows, real-time systems

## Experience

### Associate Engineer
- company: Deutsche Bank
- period: 2025 – Present

Primary backend developer on Phoenix (Front-to-Back), a platform to automate self-service products for commercial banking and expand into new European markets starting with the Netherlands. First deliverable: B2B SEPA mandate management serving 45,000+ corporate clients in Germany.

Built Java Spring Boot CRUD endpoints for mandate creation, retrieval, update, and deletion. Drove cross-team integration with 3 internal platform teams (SEPA central engine, user data, frontend enablement) to connect the system end-to-end. Supported GCP/Kubernetes infrastructure setup alongside a senior engineer — gained depth in service mesh and API gateway communication.

Integrated a no-code frontend platform (Angular-based, originally built for private banking) into the corporate banking domain hosted on GCP/GitHub. Built CI automation with another developer to extract code from the no-code platform and deploy it — reduced frontend update time from 30–60 min to 2–5 min.

Co-designed a dynamic document generation system for mandate summaries. Previous approach required a stored template per brand; with 3 brands and 7 planned self-services, that meant 21 templates. New approach constructs summaries from scratch at download time — zero template storage, scales to any number of brands and services.

Team: 4 developers, 1 QA, 2 POs, 2 BAs. Drove technical discussions in cross-team calls. Spearheaded AI coding tool adoption (Copilot) within the team. Supported QA engineer in setting up end-to-end test automation, helping resolve token authentication challenges that had previously blocked other teams from achieving automated e2e coverage.

### Founders Associate
- company: cliqe
- period: 2023

Built onboarding automation with TypeScript + Firebase (3 min → 30 sec) and an outreach system with Python that scaled daily reach from 600 to 1,000.

### ERP Business Analyst
- company: Capgemini
- period: 2022 – 2023

Wrote user stories for an Oracle ERP system. Established a Confluence documentation process for 20+ project documents.

### Academic Tutor
- company: TU Berlin
- period: 2019 – 2021

Taught technical foundations and advanced Java programming. Graded work on concurrency, deadlock prevention, and thread synchronization.

### Automotive QA Engineer
- company: Capgemini
- period: 2018 – 2019

JUnit testing and debugging for a complex Java automotive system. Optimized MySQL queries for large-scale data processing. Collaborated across teams in Germany and India.

## Projects

### agent-eng (npm package)
Built entirely using AI-assisted development (Claude Code). Published CLI tool (v0.13.0) that scaffolds a structured agentic engineering workflow into any project. Zero dependencies — uses only Node.js built-in modules. Running `npx agent-eng init` generates a complete development pipeline: five specialized Claude Code subagents (Architect, System Architect, Planner, Executor, Reviewer), ADR and specification templates, ticket structure, and language-specific conventions (TypeScript, Python, Java). Preserves existing project files by default. Used to bootstrap this portfolio site and all related projects.

### Project Hub
Built entirely using AI-assisted development (Claude Code). React 19 + TypeScript web application for visualizing and editing agentic workflows and system architectures. Interactive diagram builder using XYFlow with undo/redo (Zustand + zundo), auto-layout algorithm, and bidirectional YAML import/export. Displays orchestration graphs showing agent interactions and architecture diagrams showing system components, connections, and tiers. Built with Vite, tested with Vitest.

### AI TTRPG
Built entirely using AI-assisted development (Claude Code). Real-time voice-powered D&D Game Master. Players speak naturally via Daily WebRTC; the system classifies intent using semantic routing (Redis Vector + fastembed, <15ms), resolves combat deterministically through a FastMCP rules engine (39 unit tests), and narrates outcomes with synthesized speech. Dual pipeline architecture: OpenAI Realtime API (~400ms latency) for production, or a multi-provider standard pipeline (Claude, GPT, Gemini) for flexibility. Built with Python, Pipecat, Deepgram STT, and OpenAI TTS. Includes a Game Hub web UI (Next.js), SQLite persistence, and real-time sync via SSE.

### Real-time multiplayer game
Led a 3-person team building a cross-platform party game with Flutter, Dart, and Supabase. Designed a custom Stream-based architecture for real-time sync across mobile and web.

### LLM recommender system
Master's thesis. Used LLaMA3 for generation and RoBERTa for embeddings, with ChromaDB and cosine similarity for retrieval.

### AAS Dashboard
React + TypeScript dashboard for managing Asset Administration Shells, containerized with Docker.

### Satellite image classification
ML pipeline with Python and Keras to classify building locations from satellite imagery.

## Education

### M.Sc. Information Systems Management
- institution: TU Berlin
- period: 2020 – 2025

IT Management, Data Science, Machine Learning

### Exchange Year
- institution: Hanyang University, South Korea
- period: 2021 – 2022

Entrepreneurship and Marketing

### B.Sc. Business Informatics
- institution: TU Berlin
- period: 2017 – 2020

Thesis: Serious game teaching children about sustainability (A+)

## Languages
German, English, Vietnamese
