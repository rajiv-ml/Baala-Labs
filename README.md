# Baala Labs • QualAI Dashboard

An AI-powered qualitative and mixed-methods research dashboard engineered for women's health and social impact organizations. Designed with a restrained, editorial, strictly monochrome aesthetic inspired by Linear, Dovetail, and Notion.

## Features

- **Data Hub & Modular Ingestion**: Drag-and-drop ingestion with simulated upload progress, demographic metadata intake, PII auto-anonymization safeguards, and searchable/filterable field repository tables.
- **Transcription & Multilingual Verification Studio**: Side-by-side verification editor aligning Indic regional speech (Devanagari, Bhojpuri, Mewari, Marathi) with editable English translations, low-confidence utterance flagging, interactive audio playback scrubber, and domain health glossary.
- **Grounded Qualitative Coding Studio**: Deductive and Inductive coding workflows, LangGraph deterministic offset checking (`100% Verbatim Match`), traceability inspector, AI validation queue with 1-click approvals, and expandable codebook hierarchy.
- **Visualisation & Mixed-Methods Analytics**: Simulated `pgvector` semantic search with cosine similarity scoring, 5-step grayscale code frequency heatmaps, dual-axis mixed-methods Recharts pairing qualitative mentions with quantitative indicators, interactive thematic co-occurrence SVG network map, weighted keyword clouds, and relational PostgreSQL ER diagram modal.
- **Automated Research Reports & Evidence Exports**: Auto-generated structured executive policy briefs with inline clickable citation lineage drawer, filterable supporting quote bank with 1-click clipboard citation copying, and working browser exports for Coded Matrix (`.csv`), Executive Brief (`.md`), and Codebook Hierarchy (`.json`).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, TypeScript
- **Styling**: Tailwind CSS (strict monochrome palette via CSS variables)
- **Icons**: Lucide React
- **Visualizations**: Recharts & Custom SVG Node-Link Network

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build & Deployment

```bash
npm run build
npm start
```
This repository is configured for zero-config deployment on [Vercel](https://vercel.com).
