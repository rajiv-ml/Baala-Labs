# Baala Labs • QualAI Dashboard

> **AI-Powered Qualitative and Mixed-Methods Research Dashboard for Womens Health and Social Impact**  
> Live Prototype: [https://baala-labs.vercel.app](https://baala-labs.vercel.app) • GitHub: [https://github.com/rajiv-ml/Baala-Labs](https://github.com/rajiv-ml/Baala-Labs)

---

## Overview

**Baala Labs QualAI** is an AI-powered qualitative and mixed-methods research platform tailored for public health fieldwork in rural and semi-urban India. Designed for organizations like **Baala**, it bridges the gap between unstructured, multilingual field audio (Focus Group Discussions and Key Informant Interviews in Hindi, Bhojpuri, Mewari, and Marathi) and structured quantitative impact metrics.

The platform follows a strict editorial, high-density, monochrome design language inspired by Linear, Dovetail, and Notion, eliminating decorative color cues in favor of typographic weight, border styles, and deterministic data grounding.

---

## System Architecture

The QualAI platform processes audio and survey inputs through a secure, zero-retention pipeline that performs Indic ASR, speaker diarization, automated PII scrubbing, LangGraph-orchestrated grounded coding, and vector indexing.

```mermaid
flowchart TD
    subgraph INGESTION["1. Modular Ingestion and Data Hub"]
        A1["Field Audio - FGD, KII, Survey"] --> A2["Client-Side Metadata Intake"]
        A2 --> A3["Deterministic PII Anonymization Layer"]
        A3 --> A4["Relational Data Store - PostgreSQL"]
    end

    subgraph TRANSCRIPTION["2. Multilingual ASR and Diarization"]
        B1["Speech-to-Text Engines - Sarvam AI, Bhashini, Whisper"] --> B2["Acoustic Diarization - Speaker Turns"]
        B2 --> B3["Line-by-Line Regional Text Alignment"]
        B3 --> B4["Domain Health Glossary Validation"]
        B4 --> B5["Human-in-the-Loop Verification Interface"]
    end

    subgraph CODING_PIPELINE["3. LangGraph Grounded Coding Engine"]
        C1["Verified English Transcript"] --> C2["LangGraph Agent - Utterance Chunking"]
        C2 --> C3["LLM Thematic Tagging and Code Proposal"]
        C3 --> C4["Deterministic Offset Check - 100% Verbatim Substring"]
        C4 --> C5["AI Validation Queue - 1-Click Approve, Reject"]
    end

    subgraph ANALYTICS["4. Mixed-Methods and Vector Synthesis"]
        D1["pgvector Embeddings - 1536-dim Ada"] --> D2["Semantic Search with Cosine Similarity"]
        D3["Coded Thematic Matrix"] --> D4["5-Step Grayscale Frequency Heatmap"]
        D5["Quantitative Linked Metrics - respondent_id"] --> D6["Recharts Mixed-Methods Dual-Axis Charts"]
        D3 --> D7["Thematic Co-Occurrence Network Map"]
    end

    subgraph REPORTING["5. Synthesis and Evidence Exports"]
        E1["Structured Executive Briefs"] --> E2["Interactive Citation Lineage Drawer"]
        E2 --> E3["Export Coded Matrix - CSV"]
        E2 --> E4["Export Policy Brief - MD"]
        E2 --> E5["Export Codebook Hierarchy - JSON"]
    end

    INGESTION --> TRANSCRIPTION
    TRANSCRIPTION --> CODING_PIPELINE
    CODING_PIPELINE --> ANALYTICS
    ANALYTICS --> REPORTING
```

---

## Grounded Verification Pipeline (LangGraph Workflow)

QualAI guarantees zero hallucination by enforcing a deterministic verbatim substring match before any qualitative tag is presented for human approval.

```mermaid
sequenceDiagram
    autonumber
    participant Researcher as Lead Researcher
    participant UI as Verification Studio UI
    participant LG as LangGraph Workflow
    participant LLM as LLM Coding Agent
    participant DB as PostgreSQL and pgvector

    Researcher->>UI: Selects Transcript Turn for Verification
    UI->>LG: Request Thematic Extraction
    LG->>LLM: Chunk Utterances and Propose Codebook Tags
    LLM-->>LG: Candidate Tags and Quoted Evidence
    LG->>LG: Validate Exact Substring and Character Offset
    alt Character Offset Mismatch
        LG-->>UI: Flag Warning with Dashed Underline
    else Verbatim Substring Grounded (100% Match)
        LG->>DB: Compute and Store Vector Embedding
        LG-->>UI: Deliver to AI Validation Queue with Exact Offset Citation
    end
    Researcher->>UI: 1-Click Approve or Edit Code
    UI->>DB: Commit Grounded Tag to relational dataset
```

---

## Mixed-Methods Relational Database Schema

Quantitative respondent baselines are joined deterministically to verbatim qualitative quotes through the foreign key `respondent_id`.

```mermaid
erDiagram
    RESPONDENTS ||--o{ TRANSCRIPTS : submits
    RESPONDENTS ||--o{ CODED_SEGMENTS : originates
    TRANSCRIPTS ||--o{ CODED_SEGMENTS : contains
    CODEBOOK ||--o{ CODED_SEGMENTS : classifies

    RESPONDENTS {
        string respondent_id PK
        string district
        string state
        string demographic_cohort
        int baseline_knowledge_score
        int reusable_pad_adoption_pct
    }

    TRANSCRIPTS {
        string transcript_id PK
        string respondent_id FK
        string asr_engine
        float confidence_score
        string original_regional_text
        string verified_english_text
        boolean is_verified
    }

    CODEBOOK {
        string code_id PK
        string parent_theme
        string methodology
        string definition
        int tag_count
        string underline_style
    }

    CODED_SEGMENTS {
        string segment_id PK
        string transcript_id FK
        string code_id FK
        string respondent_id FK
        int char_start
        int char_end
        string embedding
    }
```

---

## Research Workflows Across the 5 Modules

```mermaid
flowchart LR
    subgraph V1["View 1 - Ingestion"]
        V1_A["Dropzone and CSV"]
        V1_B["Auto-Anonymize PII"]
        V1_C["Repository Table"]
    end

    subgraph V2["View 2 - Transcription"]
        V2_A["Interactive Scrubber"]
        V2_B["Bilingual Split Screen"]
        V2_C["Confidence Flagging"]
    end

    subgraph V3["View 3 - Coding"]
        V3_A["LangGraph Pipeline"]
        V3_B["Traceable Highlights"]
        V3_C["Validation Queue"]
    end

    subgraph V4["View 4 - Analytics"]
        V4_A["pgvector Search"]
        V4_B["Grayscale Heatmap"]
        V4_C["Co-Occurrence Graph"]
    end

    subgraph V5["View 5 - Reports"]
        V5_A["Cited Policy Brief"]
        V5_B["Supporting Quote Bank"]
        V5_C["1-Click Exports"]
    end

    V1 --> V2
    V2 --> V3
    V3 --> V4
    V4 --> V5
```

### 1. Data Hub and Ingestion
- Upload MP3 or WAV field recordings and survey CSVs.
- Automatic PII redaction cleans sensitive identifiers prior to LLM processing.
- Repository table allows immediate status inspection (`Needs Verification`, `Ready for Coding`, `Coded & Verified`).

### 2. Transcription and Multilingual Verification Studio
- Line-by-line synchronized alignment between original Indic regional speech (Devanagari, Bhojpuri, Mewari, Marathi) and English translation.
- Interactive audio scrubber with speed settings (`0.8x`, `1.0x`, `1.2x`, `1.5x`); clicking any sentence jumps playback to its timestamp.
- Low-confidence utterances are highlighted with a dashed underline and alert pill; one-click action converts them to verified status.
- Collapsible domain glossary ensures health and cultural idioms (e.g., *साखी*, *सुखाना*, *महावारी*) maintain contextual nuance.

### 3. Grounded Qualitative Coding Studio
- Switch between **Deductive Coding** (pre-defined codebook) and **Inductive Coding** (Open to Axial to Selective 3-stage progression).
- Coded spans utilize distinct monochrome underlines (solid, dashed, dotted, double, thick, wavy) with superscript tags (`T1` to `T6`).
- Clicking any highlight opens the **Grounded Traceability Inspector**, showing character citations (e.g., `chars 82–142 • Exact Substring Verified`).
- AI Validation Queue allows researchers to 1-click **Approve**, **Edit**, or **Reject** recommendations with instant undo toasts.

### 4. Visualisation and Mixed-Methods Analytics
- **pgvector Semantic Search**: Queries return cosine similarity scores with match bars.
- **Code Frequency Matrix**: Grayscale heatmap on a 5-step contrast ramp (`#FFFFFF` to `#0A0A0A`).
- **Mixed-Methods Composed Chart**: Combines qualitative thematic mentions (SVG diagonal hatched bars) with quantitative indicators (*Baseline Knowledge Score %* and *Pad Adoption %*) linked via `respondent_id`.
- **Thematic Co-Occurrence Network**: Interactive SVG node-link graph mapping relationships (e.g., *WASH Deficits* and *Drying Privacy*).
- **Relational DB Schema Modal**: View the 4-table ER diagram with primary and foreign keys.

### 5. Automated Research Reports and Evidence Exports
- Formatted ~720px editorial policy brief with numbered findings and recommendations.
- Clickable superscript citation chips (`[1]`, `[2]`, `[3]`) open a slide-over drawer displaying original Indic audio timestamps, character offsets, and speaker metadata.
- Quote bank with 1-click clipboard citation copying.
- Instant browser file generation:
  - `Export Coded Matrix (.csv)`
  - `Export Preliminary Report (.md)`
  - `Export Codebook Hierarchy (.json)`

---

## Design System Specifications

| Token | CSS Variable | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **App Background** | `--bg` | `#FAFAFA` | Neutral canvas |
| **Surface** | `--surface` | `#FFFFFF` | Cards, panels, modals |
| **Border** | `--border` | `#E5E5E5` | Structural hairline rules |
| **Border Strong** | `--border-strong` | `#D4D4D4` | Focused/active element borders |
| **Primary Ink** | `--ink` | `#0A0A0A` | Headings, active states, solid buttons |
| **Secondary Ink** | `--ink-2` | `#525252` | Body copy, secondary text |
| **Tertiary Ink** | `--ink-3` | `#737373` | Metadata, timestamps, table micro-labels |
| **Fill 1** | `--fill-1` | `#F5F5F5` | Hover backgrounds, zebra stripes |
| **Fill 2** | `--fill-2` | `#EDEDED` | Selected states, tag highlights |
| **Fill 3** | `--fill-3` | `#D4D4D4` | Unplayed audio waveform tracks |

---

## Tech Stack & Local Setup

```bash
# Clone the repository
git clone https://github.com/rajiv-ml/Baala-Labs.git
cd Baala-Labs

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to explore the interface.
