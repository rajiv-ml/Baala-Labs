'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
  FileText,
  Search,
  Filter,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  PageHeader,
  Drawer,
  useToast,
} from '@/components/ui';
import {
  quoteBank,
  QuoteBank,
  themes,
  sources,
} from '@/lib/mock-data';

interface CitationDetails {
  id: string;
  num: number;
  quote: string;
  speaker: string;
  district: string;
  demographic: string;
  charOffset: string;
  sourceId: string;
  originalText: string;
  audioTimestamp: string;
}

const citationsMap: Record<number, CitationDetails> = {
  1: {
    num: 1,
    id: 'q1',
    quote: 'I was very scared. I thought I had gotten some disease. My mother told me this happens to all girls — stay quiet, don\'t tell anyone.',
    speaker: 'Respondent 1 (Sunita, 14)',
    district: 'Sitamarhi, Bihar',
    demographic: 'Adolescent Girls',
    charOffset: 'chars 82–218',
    sourceId: 'FGD-01',
    originalText: 'हमको तो बहुत डर लगा था। हमको लगा कि कोई बीमारी हो गई। माँ ने कहा कि ई सब लड़कियों को होता है, चुपचाप रहो, किसी को मत बताओ।',
    audioTimestamp: '00:00:38',
  },
  2: {
    num: 2,
    id: 'q3',
    quote: 'There\'s no water in the toilets, no dustbin. There\'s no place to change cloth pads. So we just stay home on those days.',
    speaker: 'Respondent 3 (Priya, 14)',
    district: 'Sitamarhi, Bihar',
    demographic: 'Adolescent Girls',
    charOffset: 'chars 356–502',
    sourceId: 'FGD-01',
    originalText: 'टॉयलेट में पानी नहीं होता, डस्टबिन नहीं है। कपड़ा बदलने की जगह नहीं मिलती। तो हम उन दिनों घर पर ही रह जाते हैं।',
    audioTimestamp: '00:02:22',
  },
  3: {
    num: 3,
    id: 'q4',
    quote: 'The reusable pads are good but drying them in the sun where others can see is a big problem because everyone can see.',
    speaker: 'SHG Member (Fatima, 22)',
    district: 'Gaya, Bihar',
    demographic: 'Young Women / SHG',
    charOffset: 'chars 88–182',
    sourceId: 'FGD-06',
    originalText: 'कपड़े वाले पैड अच्छे हैं पर धूप में सुखाना जहाँ सब देख सकें — ये बड़ी समस्या है।',
    audioTimestamp: '00:04:55',
  },
  4: {
    num: 4,
    id: 'q6',
    quote: 'The peer educator explained everything to us — that this is natural, not a disease. She also showed us how to use pads. Now we\'re not afraid anymore.',
    speaker: 'Respondent 5 (Kavita, 15)',
    district: 'Sitamarhi, Bihar',
    demographic: 'Adolescent Girls',
    charOffset: 'chars 614–698',
    sourceId: 'FGD-01',
    originalText: 'साखी दीदी ने हमको सब समझाया — कि ई natural है, कोई बीमारी नहीं है। उन्होंने पैड कैसे इस्तेमाल करना है वो भी दिखाया।',
    audioTimestamp: '00:04:38',
  },
};

export default function ReportsView() {
  const { showToast } = useToast();

  // Citation Drawer State
  const [selectedCitation, setSelectedCitation] = useState<CitationDetails | null>(null);

  // Quote Bank Filters
  const [quoteSearch, setQuoteSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Export loading states
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingMd, setIsExportingMd] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);

  // Filter options
  const themeOptions = [
    { value: 'All', label: 'All Themes' },
    ...themes.map((t) => ({ value: t.label, label: t.label })),
  ];

  const districtOptions = [
    { value: 'All', label: 'All Districts' },
    { value: 'Sitamarhi', label: 'Sitamarhi, Bihar' },
    { value: 'Udaipur', label: 'Udaipur, Rajasthan' },
    { value: 'Satara', label: 'Satara, Maharashtra' },
    { value: 'Gaya', label: 'Gaya, Bihar' },
  ];

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quoteBank.filter((q) => {
      if (selectedTheme !== 'All' && q.theme !== selectedTheme) return false;
      if (selectedDistrict !== 'All' && q.district !== selectedDistrict) return false;
      if (quoteSearch) {
        const query = quoteSearch.toLowerCase();
        return (
          q.quote.toLowerCase().includes(query) ||
          q.speaker.toLowerCase().includes(query) ||
          q.code.toLowerCase().includes(query) ||
          q.theme.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [quoteSearch, selectedTheme, selectedDistrict]);

  // Copy citation to clipboard
  const handleCopyCitation = (q: QuoteBank) => {
    const citation = `"${q.quote}" — ${q.speaker}, ${q.sourceId} (${q.district}), ${q.charOffset}. Baala QualAI Grounded Dataset.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(q.id);
    showToast('Citation copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Export Coded Matrix (CSV)
  const handleExportCsv = () => {
    setIsExportingCsv(true);
    setTimeout(() => {
      const headers = ['Segment ID', 'Source ID', 'Speaker', 'District', 'Theme', 'Code', 'Offset', 'Verbatim Quote'];
      const rows = quoteBank.map((q) => [
        q.id,
        q.sourceId,
        `"${q.speaker}"`,
        `"${q.district}"`,
        `"${q.theme}"`,
        `"${q.code}"`,
        `"${q.charOffset}"`,
        `"${q.quote.replace(/"/g, '""')}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Baala_QualAI_Coded_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingCsv(false);
      showToast('Exported Coded Matrix (CSV)');
    }, 600);
  };

  // 2. Export Preliminary Report (Markdown)
  const handleExportMd = () => {
    setIsExportingMd(true);
    setTimeout(() => {
      const mdContent = `# Baala Labs • Qualitative Research Synthesis Report
**Project:** Menstrual Health Impact Study — Q4
**Generated Date:** ${new Date().toLocaleDateString()}
**Methodology:** Grounded Theory (Verbatim Indic Diarization with pgvector & LangGraph)

---

## 1. Executive Summary & Key Findings
Qualitative evidence gathered across Sitamarhi, Gaya, Udaipur, and Satara reveals that adolescent school absenteeism is driven by sanitation infrastructure deficits rather than biological incapacity.

- **Prevalence:** 58% of participants report missing 2–3 school days per cycle.
- **Privacy Crisis:** Over 70% of respondents in Bihar highlight drying reusable pads as the most acute source of social distress.
- **Peer Trust:** Peer educator interventions show an immediate 42% uplift in menstrual hygiene confidence.

## 2. Cited Evidence
${quoteBank
  .map(
    (q, i) =>
      `### [${i + 1}] ${q.theme}: ${q.code}\n> "${q.quote}"\n\n*Source: ${q.speaker} (${q.district}) | Offset: ${q.charOffset} | Source ID: ${q.sourceId}*\n`
  )
  .join('\n')}

---
*Report generated via Baala QualAI Zero-Retention Grounded System.*
`;

      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Baala_Research_Brief_Q4.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingMd(false);
      showToast('Exported Preliminary Report (Markdown)');
    }, 600);
  };

  // 3. Export Codebook (JSON)
  const handleExportJson = () => {
    setIsExportingJson(true);
    setTimeout(() => {
      const jsonContent = JSON.stringify(
        {
          project: 'Baala Labs Menstrual Health Study',
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          totalThemes: themes.length,
          themes: themes,
          sources: sources,
        },
        null,
        2
      );

      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Baala_Codebook_Hierarchy.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingJson(false);
      showToast('Exported Codebook Structure (JSON)');
    }, 600);
  };

  return (
    <div className="pb-16 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Automated Research Reports & Evidence Exports"
        description="Verbatim synthesized policy briefs with interactive citation lineage and complete dataset export capabilities."
      />

      {/* Working Export Bar */}
      <div className="p-4 bg-surface border border-border rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">Export Grounded Research Deliverables</h2>
          <p className="text-xs text-ink-3">Download production-ready matrices, structured briefs, or codebook taxonomy.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportCsv}
            disabled={isExportingCsv}
          >
            <FileSpreadsheet size={16} strokeWidth={1.5} />
            {isExportingCsv ? 'Generating CSV…' : 'Export Coded Matrix (.csv)'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportMd}
            disabled={isExportingMd}
          >
            <FileText size={16} strokeWidth={1.5} />
            {isExportingMd ? 'Compiling Markdown…' : 'Export Preliminary Report (.md)'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJson}
            disabled={isExportingJson}
          >
            <FileCode size={16} strokeWidth={1.5} />
            {isExportingJson ? 'Structuring JSON…' : 'Export Codebook (.json)'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Analytical Summary Brief (~720px reading column / col-span-7) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <Card padding={false} className="bg-surface">
            <div className="p-4 border-b border-border bg-fill-1 flex items-center justify-between">
              <div>
                <span className="micro-label">Auto-Generated Executive Synthesis</span>
                <h3 className="text-sm font-semibold text-ink mt-0.5">
                  Interim Qualitative Finding &amp; Policy Brief (Q4)
                </h3>
              </div>
              <Badge variant="solid" className="text-[10px] font-mono">
                Peer-Reviewed Draft
              </Badge>
            </div>

            {/* Constrained ~720px editorial document layout */}
            <div className="p-8 max-w-[720px] mx-auto space-y-6 text-ink-2 leading-[1.8] text-[15px]">
              {/* Section 1 */}
              <div>
                <h4 className="text-base font-semibold text-ink tracking-tight mb-2">
                  1. The Mechanics of School Absenteeism in Rural Bihar
                </h4>
                <p>
                  Qualitative focus group discussions across Sitamarhi and Gaya indicate that menstrual absenteeism is overwhelmingly structural rather than physiological. Over 82% of adolescent respondents described early menarche accompanied by intense shock and secrecy norms{' '}
                  <button
                    onClick={() => setSelectedCitation(citationsMap[1])}
                    className="inline-flex items-center px-1 py-0 text-xs font-mono font-semibold border border-ink text-ink rounded bg-fill-2 hover:bg-ink hover:text-white transition-colors cursor-pointer align-super"
                    title="Click to view verified citation [1]"
                  >
                    [1]
                  </button>
                  . Upon returning to academic settings, students encounter severely unequipped infrastructure: non-functional school toilets lacking running water, absence of covered waste receptacles, and zero privacy for changing cloth pads{' '}
                  <button
                    onClick={() => setSelectedCitation(citationsMap[2])}
                    className="inline-flex items-center px-1 py-0 text-xs font-mono font-semibold border border-ink text-ink rounded bg-fill-2 hover:bg-ink hover:text-white transition-colors cursor-pointer align-super"
                    title="Click to view verified citation [2]"
                  >
                    [2]
                  </button>
                  . This directly prompts preemptive absenteeism of 2 to 4 days during each menstrual cycle.
                </p>
              </div>

              {/* Section 2 */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-base font-semibold text-ink tracking-tight mb-2">
                  2. Wash &amp; Drying Privacy as the Critical Bottleneck for Reusables
                </h4>
                <p>
                  While eco-friendly reusable cloth pads are recognized as financially preferable compared to recurring single-use commercial purchases, their ongoing adoption encounters severe cultural roadblocks. In dense joint households and rural hamlets, drying washed cloth pads under direct sunlight is considered deeply taboo{' '}
                  <button
                    onClick={() => setSelectedCitation(citationsMap[3])}
                    className="inline-flex items-center px-1 py-0 text-xs font-mono font-semibold border border-ink text-ink rounded bg-fill-2 hover:bg-ink hover:text-white transition-colors cursor-pointer align-super"
                    title="Click to view verified citation [3]"
                  >
                    [3]
                  </button>
                  . As a consequence, participants dry pads beneath roof rafters, under beds, or inside damp corners, escalating bacterial infection risks.
                </p>
              </div>

              {/* Section 3 */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-base font-semibold text-ink tracking-tight mb-2">
                  3. Peer Educator (&ldquo;Sakhi Didi&rdquo;) Interventions Drive Knowledge Uplift
                </h4>
                <p>
                  In contrast to formal teacher-led lectures where shame suppresses inquiries, community peer educators achieve immediate rapport. Girls report feeling empowered to discard generational myths (e.g., prohibition of pickle consumption or kitchen entry) once biological realities are articulated by near-peer facilitators{' '}
                  <button
                    onClick={() => setSelectedCitation(citationsMap[4])}
                    className="inline-flex items-center px-1 py-0 text-xs font-mono font-semibold border border-ink text-ink rounded bg-fill-2 hover:bg-ink hover:text-white transition-colors cursor-pointer align-super"
                    title="Click to view verified citation [4]"
                  >
                    [4]
                  </button>
                  . This correlates with a 38% reduction in reported anxiety regarding visible staining.
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 bg-fill-1 rounded border border-border space-y-2 mt-4">
                <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Actionable Policy Recommendations
                </h5>
                <ul className="list-disc pl-5 text-xs text-ink space-y-1">
                  <li>
                    <strong>School Wash Retrofits:</strong> Mandate water connectivity and enclosed incinerator/disposal units in upper-primary schools across Sitamarhi district.
                  </li>
                  <li>
                    <strong>Confidential Drying Enclosures:</strong> Pilot breathable, ventilated privacy drying pouches alongside reusable pad distributions.
                  </li>
                  <li>
                    <strong>Expansion of Peer Cohorts:</strong> Scale the Baala Sakhi peer model into Satara and Udaipur to address inter-generational myth propagation.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Supporting Quote Bank (col-span-5) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card padding={false}>
            <div className="p-3.5 border-b border-border bg-fill-1 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink">Supporting Quote Bank</h3>
                <p className="text-[11px] text-ink-3">Verbatim participant evidence repository</p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {filteredQuotes.length} quotes
              </Badge>
            </div>

            {/* Quote Bank Filters */}
            <div className="p-3 border-b border-border space-y-2 bg-surface">
              <Input
                icon={<Search size={14} strokeWidth={1.5} />}
                placeholder="Filter quotes by keyword, speaker, code…"
                value={quoteSearch}
                onChange={(e) => setQuoteSearch(e.target.value)}
                className="text-xs h-7"
              />
              <div className="flex gap-2">
                <Select
                  options={themeOptions}
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-1/2 text-xs h-7"
                />
                <Select
                  options={districtOptions}
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-1/2 text-xs h-7"
                />
              </div>
            </div>

            {/* Scrollable Quotes List */}
            <div className="p-3 divide-y divide-border space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredQuotes.map((q) => {
                const isCopied = copiedId === q.id;

                return (
                  <div key={q.id} className="pt-3 first:pt-0 space-y-2">
                    <p className="text-xs text-ink italic leading-relaxed">
                      &ldquo;{q.quote}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-ink-3">
                      <span className="font-medium text-ink-2">{q.speaker}</span>
                      <span className="mono">{q.district}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="mono text-[10px] bg-fill-2 px-1.5 py-0.5 rounded text-ink">
                        {q.theme} &bull; {q.code}
                      </span>
                      <button
                        onClick={() => handleCopyCitation(q)}
                        className="inline-flex items-center gap-1 text-[11px] text-ink-2 hover:text-ink cursor-pointer transition-default border border-border px-2 py-0.5 rounded bg-surface hover:bg-fill-1"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} strokeWidth={2} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} strokeWidth={1.5} />
                            <span>Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredQuotes.length === 0 && (
                <div className="py-8 text-center text-xs text-ink-3">
                  No quotes found matching your filters.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Slide-over Citation Drawer */}
      <Drawer
        isOpen={!!selectedCitation}
        onClose={() => setSelectedCitation(null)}
        title={selectedCitation ? `Citation [${selectedCitation.num}] Grounded Lineage` : 'Citation Details'}
        width="w-96"
      >
        {selectedCitation && (
          <div className="space-y-4">
            <div>
              <span className="micro-label">Exact Verified English Quote</span>
              <p className="text-sm text-ink-2 italic bg-fill-2/60 p-3 rounded border border-border mt-1 leading-relaxed">
                &ldquo;{selectedCitation.quote}&rdquo;
              </p>
            </div>

            <div>
              <span className="micro-label">Original Regional Language Utterance</span>
              <p className="devanagari text-sm text-ink bg-fill-1 p-3 rounded border border-border mt-1 leading-relaxed">
                {selectedCitation.originalText}
              </p>
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Speaker:</span>
                <span className="font-semibold text-ink">{selectedCitation.speaker}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Location:</span>
                <span className="font-semibold text-ink">{selectedCitation.district}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Demographic:</span>
                <span className="font-semibold text-ink">{selectedCitation.demographic}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Source ID:</span>
                <span className="mono font-semibold text-ink">{selectedCitation.sourceId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Character Offset:</span>
                <span className="mono font-semibold text-ink">{selectedCitation.charOffset}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-3">Audio Timestamp:</span>
                <span className="mono font-semibold text-ink">{selectedCitation.audioTimestamp}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  const citText = `"${selectedCitation.quote}" — ${selectedCitation.speaker}, ${selectedCitation.sourceId} (${selectedCitation.district}), ${selectedCitation.charOffset}. Baala QualAI Grounded Dataset.`;
                  navigator.clipboard.writeText(citText);
                  showToast('Citation copied to clipboard');
                }}
              >
                <Copy size={14} strokeWidth={1.5} />
                Copy Full Formal Citation
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

