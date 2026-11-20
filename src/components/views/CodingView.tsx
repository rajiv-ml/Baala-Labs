'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Info,
  Clock,
  ExternalLink,
  Tag,
  X,
  Layers,
  Sparkles,
  GitCommit,
  CheckCircle,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  Tabs,
  Segmented,
  PageHeader,
  useToast,
  Input,
  Modal,
} from '@/components/ui';
import {
  fgd01Utterances,
  themes as initialThemes,
  codeSuggestions as initialSuggestions,
  CodeSuggestion,
  Theme,
  Code,
} from '@/lib/mock-data';

interface SelectedSpan {
  quote: string;
  code: string;
  theme: string;
  charOffset: string;
  audioTimestamp: string;
  originalText: string;
  themeId: string;
}

export default function CodingView() {
  const { showToast } = useToast();

  // Workflow toggle: Deductive vs Inductive
  const [workflowMode, setWorkflowMode] = useState<'deductive' | 'inductive'>('deductive');

  // Code suggestions queue
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>(initialSuggestions);
  const [approvedCodesCount, setApprovedCodesCount] = useState(48);

  // Themes state
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({
    T1: true,
    T2: true,
    T3: true,
  });

  // Active tab in right panel
  const [rightPanelTab, setRightPanelTab] = useState<'queue' | 'codebook'>('queue');

  // Selected highlight for Traceability Inspector Popover
  const [activeInspector, setActiveInspector] = useState<SelectedSpan | null>(null);

  // New code creation modal / state
  const [addCodeThemeId, setAddCodeThemeId] = useState<string | null>(null);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDef, setNewCodeDef] = useState('');

  // Manual code attachment modal
  const [manualCodeQuote, setManualCodeQuote] = useState<string | null>(null);
  const [selectedCodeToApply, setSelectedCodeToApply] = useState('');

  // Toggle theme tree expansion
  const toggleTheme = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Underline CSS styling mapping for themes
  const getUnderlineClass = (style: string) => {
    switch (style) {
      case 'solid':
        return 'underline decoration-ink decoration-1';
      case 'dashed':
        return 'underline decoration-dashed decoration-ink decoration-1';
      case 'dotted':
        return 'underline decoration-dotted decoration-ink decoration-1.5';
      case 'double':
        return 'underline decoration-double decoration-ink';
      case 'thick':
        return 'underline decoration-ink decoration-2';
      case 'wavy':
        return 'underline decoration-wavy decoration-ink decoration-1';
      default:
        return 'underline decoration-ink';
    }
  };

  const getThemeUnderline = (themeId: string) => {
    switch (themeId) {
      case 'T1':
        return 'underline decoration-ink decoration-1'; // solid
      case 'T2':
        return 'underline decoration-dashed decoration-ink decoration-1'; // dashed
      case 'T3':
        return 'underline decoration-dotted decoration-ink decoration-2'; // dotted
      case 'T4':
        return 'underline decoration-double decoration-ink'; // double
      case 'T5':
        return 'underline decoration-ink decoration-2'; // thick
      case 'T6':
        return 'underline decoration-wavy decoration-ink decoration-1'; // wavy
      default:
        return 'underline decoration-ink';
    }
  };

  // Handle Approve suggestion
  const handleApprove = (id: string) => {
    const item = suggestions.find((s) => s.id === id);
    if (!item) return;

    const previousSuggestions = [...suggestions];
    const prevCount = approvedCodesCount;

    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setApprovedCodesCount((c) => c + 1);

    showToast(`Approved tag "${item.suggestedCode}"`, () => {
      setSuggestions(previousSuggestions);
      setApprovedCodesCount(prevCount);
    });
  };

  // Handle Reject suggestion
  const handleReject = (id: string) => {
    const item = suggestions.find((s) => s.id === id);
    if (!item) return;

    const previousSuggestions = [...suggestions];
    setSuggestions((prev) => prev.filter((s) => s.id !== id));

    showToast(`Rejected recommendation for "${item.suggestedCode}"`, () => {
      setSuggestions(previousSuggestions);
    });
  };

  // Add new code to theme
  const handleAddCode = (themeId: string) => {
    if (!newCodeName.trim()) return;

    const newCode: Code = {
      id: `${themeId}-${Date.now().toString().slice(-3)}`,
      label: newCodeName.trim(),
      parentTheme: themes.find((t) => t.id === themeId)?.label || '',
      definition: newCodeDef.trim() || 'Custom user-defined inductive code',
      count: 0,
      underlineStyle: 'solid',
    };

    setThemes((prev) =>
      prev.map((t) =>
        t.id === themeId
          ? { ...t, codes: [...t.codes, newCode], totalCount: t.totalCount }
          : t
      )
    );

    setAddCodeThemeId(null);
    setNewCodeName('');
    setNewCodeDef('');
    showToast(`Added code "${newCode.label}" to theme`);
  };

  // Apply code to manual selection
  const applyManualCode = () => {
    if (!manualCodeQuote || !selectedCodeToApply) return;
    showToast(`Attached code "${selectedCodeToApply}" to selected passage`);
    setManualCodeQuote(null);
    setSelectedCodeToApply('');
    setApprovedCodesCount((c) => c + 1);
  };

  // Pending count for tab
  const pendingCount = suggestions.length;

  return (
    <div className="pb-16">
      <PageHeader
        title="Grounded Qualitative Coding Studio"
        description="Verbatim traceable qualitative coding workspace with deterministic character offset verification."
        action={
          <div className="flex items-center gap-2">
            <span className="mono text-xs text-ink-3">Total Grounded Segments:</span>
            <Badge variant="solid" className="font-mono text-xs">
              {approvedCodesCount} Coded
            </Badge>
          </div>
        }
      />

      {/* Top Workflow Bar */}
      <div className="bg-surface border border-border rounded-[var(--radius-md)] p-3 mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="micro-label">Methodology</span>
            <Segmented
              options={[
                { id: 'deductive', label: 'Deductive Coding (Pre-defined Codebook)' },
                { id: 'inductive', label: 'Inductive Coding (Open → Axial → Selective)' },
              ]}
              value={workflowMode}
              onChange={(val) => setWorkflowMode(val as 'deductive' | 'inductive')}
            />
          </div>

          {/* LangGraph Pipeline Stepper */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="micro-label mr-1">Pipeline:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink text-white rounded font-medium">
              1. Chunking ✓
            </span>
            <span className="text-ink-3">→</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink text-white rounded font-medium">
              2. LLM Tagging ✓
            </span>
            <span className="text-ink-3">→</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink text-white rounded font-mono font-medium">
              3. Offset Check: 100% Match ✓
            </span>
            <span className="text-ink-3">→</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-ink text-ink rounded font-semibold bg-fill-1">
              4. Human Review
            </span>
          </div>
        </div>

        {/* Inductive 3-Stage Progression Strip */}
        {workflowMode === 'inductive' && (
          <div className="pt-2 border-t border-border flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center font-mono font-semibold text-[10px]">
                1
              </span>
              <span className="font-semibold text-ink">Open Codes</span>
              <span className="text-ink-3 font-mono">(24 raw concepts identified)</span>
            </div>
            <div className="h-px flex-1 mx-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center font-mono font-semibold text-[10px]">
                2
              </span>
              <span className="font-semibold text-ink">Axial Categories</span>
              <span className="text-ink-3 font-mono">(8 thematic clusters)</span>
            </div>
            <div className="h-px flex-1 mx-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center font-mono font-semibold text-[10px]">
                3
              </span>
              <span className="font-semibold text-ink">Selective Core Themes</span>
              <span className="text-ink-3 font-mono">(6 substantive theories)</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left/Center Pane: Traceable Transcript (60% / col-span-7) */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Card padding={false}>
            {/* Header with Underline Legend */}
            <div className="p-3 border-b border-border bg-fill-1 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-ink">FGD-01: Verified English Transcript</span>
                <p className="text-[11px] text-ink-3">Click any underlined quote to inspect exact character grounding.</p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Click sentence to code
              </Badge>
            </div>

            {/* Underline Style Legend */}
            <div className="px-4 py-2 bg-surface border-b border-border text-[11px] flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="micro-label text-[10px]">Theme styles:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-b border-ink" />
                <span className="text-ink-2">T1 Absenteeism (Solid)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-b border-dashed border-ink" />
                <span className="text-ink-2">T2 Privacy (Dashed)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-b border-dotted border-ink border-b-2" />
                <span className="text-ink-2">T3 Stigma (Dotted)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-b-2 border-double border-ink" />
                <span className="text-ink-2">T4 Cost (Double)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-b-2 border-ink" />
                <span className="text-ink-2">T5 WASH (Thick)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-ink underline decoration-wavy decoration-ink text-[10px]">~</span>
                <span className="text-ink-2">T6 Trust (Wavy)</span>
              </span>
            </div>

            {/* Transcript Utterances List */}
            <div className="p-5 space-y-6 text-sm divide-y divide-border">
              {/* Utterance 2 */}
              <div className="pt-4 first:pt-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 1 (Sunita, 14)</span>
                  <span className="mono text-[11px] text-ink-3">00:00:38</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote: 'I was very scared. I thought I had gotten some disease.',
                        code: 'Fear of staining',
                        theme: 'School Absenteeism',
                        charOffset: 'chars 82–142 • Exact Substring Verified',
                        audioTimestamp: '00:00:38',
                        originalText: 'हमको तो बहुत डर लगा था। हमको लगा कि कोई बीमारी हो गई।',
                        themeId: 'T1',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T1'
                    )}`}
                  >
                    I was very scared. I thought I had gotten some disease.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T1</sup>
                  </span>{' '}
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote:
                          "My mother told me this happens to all girls — stay quiet, don't tell anyone.",
                        code: 'Silence / secrecy norms',
                        theme: 'Community Stigma & Myths',
                        charOffset: 'chars 143–218 • Exact Substring Verified',
                        audioTimestamp: '00:00:46',
                        originalText:
                          'माँ ने कहा कि ई सब लड़कियों को होता है, चुपचाप रहो, किसी को मत बताओ।',
                        themeId: 'T3',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T3'
                    )}`}
                  >
                    My mother told me this happens to all girls — stay quiet, don&apos;t tell anyone.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T3</sup>
                  </span>
                </div>
              </div>

              {/* Utterance 3 */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 2 (Meena, 15)</span>
                  <span className="mono text-[11px] text-ink-3">00:01:15</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote:
                          'In our village, talking about this is considered sinful. Even at school nobody told us.',
                        code: 'Silence / secrecy norms',
                        theme: 'Community Stigma & Myths',
                        charOffset: 'chars 218–310 • Exact Substring Verified',
                        audioTimestamp: '00:01:15',
                        originalText:
                          'हमरे गाँव में तो ई बात करना ही पाप समझते हैं। स्कूल में भी कोई नहीं बताया।',
                        themeId: 'T3',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T3'
                    )}`}
                  >
                    In our village, talking about this is considered sinful. Even at school nobody told us.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T3</sup>
                  </span>{' '}
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote: 'When it happened to me, I didn\'t go to school for three days.',
                        code: 'Days missed per cycle',
                        theme: 'School Absenteeism',
                        charOffset: 'chars 311–378 • Exact Substring Verified',
                        audioTimestamp: '00:01:32',
                        originalText: 'जब हमको हुआ तो हम तीन दिन स्कूल नहीं गए।',
                        themeId: 'T1',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T1'
                    )}`}
                  >
                    When it happened to me, I didn&apos;t go to school for three days.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T1</sup>
                  </span>
                </div>
              </div>

              {/* Utterance 5 */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 3 (Priya, 14)</span>
                  <span className="mono text-[11px] text-ink-3">00:02:22</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote:
                          "There's no water in the toilets, no dustbin. There's no place to change cloth pads.",
                        code: 'No water in school toilets',
                        theme: 'Water & Sanitation Infrastructure',
                        charOffset: 'chars 379–465 • Exact Substring Verified',
                        audioTimestamp: '00:02:22',
                        originalText:
                          'टॉयलेट में पानी नहीं होता, डस्टबिन नहीं है। कपड़ा बदलने की जगह नहीं मिलती।',
                        themeId: 'T5',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T5'
                    )}`}
                  >
                    There&apos;s no water in the toilets, no dustbin. There&apos;s no place to change cloth pads.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T5</sup>
                  </span>{' '}
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote: 'So we just stay home on those days.',
                        code: 'Days missed per cycle',
                        theme: 'School Absenteeism',
                        charOffset: 'chars 466–502 • Exact Substring Verified',
                        audioTimestamp: '00:02:40',
                        originalText: 'तो हम उन दिनों घर पर ही रह जाते हैं।',
                        themeId: 'T1',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T1'
                    )}`}
                  >
                    So we just stay home on those days.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T1</sup>
                  </span>
                </div>
              </div>

              {/* Utterance 6 */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 4 (Anjali, 16)</span>
                  <span className="mono text-[11px] text-ink-3">00:03:10</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span>It&apos;s the same for me... sometimes with the cloth... </span>
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote: 'drying it is very embarrassing because everyone can see.',
                        code: 'Lack of private drying space',
                        theme: 'Wash & Drying Privacy',
                        charOffset: 'chars 545–601 • Exact Substring Verified',
                        audioTimestamp: '00:03:18',
                        originalText: 'सूखाने में बहुत शर्म लगती है क्योंकि सब देख लेते हैं।',
                        themeId: 'T2',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T2'
                    )}`}
                  >
                    drying it is very embarrassing because everyone can see.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T2</sup>
                  </span>
                </div>
              </div>

              {/* Utterance 7 */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 1 (Sunita, 14)</span>
                  <span className="mono text-[11px] text-ink-3">00:03:48</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote: 'Yes, and pads are very expensive.',
                        code: 'Pad cost barrier',
                        theme: 'Cost & Affordability',
                        charOffset: 'chars 602–635 • Exact Substring Verified',
                        audioTimestamp: '00:03:48',
                        originalText: 'हाँ, और पैड तो बहुत महँगा है।',
                        themeId: 'T4',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T4'
                    )}`}
                  >
                    Yes, and pads are very expensive.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T4</sup>
                  </span>{' '}
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote:
                          'Even going to the shop is embarrassing. If the shopkeeper is male, it\'s even worse.',
                        code: 'Silence / secrecy norms',
                        theme: 'Community Stigma & Myths',
                        charOffset: 'chars 636–721 • Exact Substring Verified',
                        audioTimestamp: '00:03:54',
                        originalText:
                          'दुकान पर जाने में भी शर्म लगती है। दुकानदार पुरुष होता है तो और भी।',
                        themeId: 'T3',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T3'
                    )}`}
                  >
                    Even going to the shop is embarrassing. If the shopkeeper is male, it&apos;s even worse.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T3</sup>
                  </span>
                </div>
              </div>

              {/* Utterance 9 */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-ink text-xs">Respondent 5 (Kavita, 15)</span>
                  <span className="mono text-[11px] text-ink-3">00:04:38</span>
                </div>
                <div className="leading-relaxed text-ink-2">
                  <span
                    onClick={() =>
                      setActiveInspector({
                        quote:
                          'The peer educator explained everything to us — that this is natural, not a disease.',
                        code: 'Myth-busting effectiveness',
                        theme: 'Peer Educator Trust',
                        charOffset: 'chars 750–832 • Exact Substring Verified',
                        audioTimestamp: '00:04:38',
                        originalText:
                          'साखी दीदी ने हमको सब समझाया — कि ई natural है, कोई बीमारी नहीं है।',
                        themeId: 'T6',
                      })
                    }
                    className={`bg-fill-2 px-1 py-0.5 rounded-[2px] cursor-pointer hover:bg-fill-3 transition-colors ${getThemeUnderline(
                      'T6'
                    )}`}
                  >
                    The peer educator explained everything to us — that this is natural, not a disease.
                    <sup className="ml-0.5 font-mono text-[9px] font-semibold text-ink">T6</sup>
                  </span>{' '}
                  <span
                    onClick={() => {
                      setManualCodeQuote(
                        'She also showed us how to use pads. Now we\'re not afraid anymore.'
                      );
                    }}
                    className="hover:bg-fill-1 px-1 py-0.5 rounded cursor-pointer text-ink"
                    title="Click to manually code this passage"
                  >
                    She also showed us how to use pads. Now we&apos;re not afraid anymore.
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Pane: Codebook Manager & One-Click Review Queue (40% / col-span-5) */}
        <div className="col-span-12 lg:col-span-5 space-y-4 sticky top-16">
          <Card padding={false}>
            {/* Tabs Header */}
            <div className="p-3 border-b border-border bg-fill-1 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setRightPanelTab('queue')}
                  className={`px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] transition-default cursor-pointer ${
                    rightPanelTab === 'queue'
                      ? 'bg-ink text-white'
                      : 'text-ink-2 hover:bg-fill-2'
                  }`}
                >
                  AI Validation Queue ({pendingCount})
                </button>
                <button
                  onClick={() => setRightPanelTab('codebook')}
                  className={`px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] transition-default cursor-pointer ${
                    rightPanelTab === 'codebook'
                      ? 'bg-ink text-white'
                      : 'text-ink-2 hover:bg-fill-2'
                  }`}
                >
                  Codebook Hierarchy
                </button>
              </div>
            </div>

            {/* Tab 1: AI Validation Queue */}
            {rightPanelTab === 'queue' && (
              <div className="p-4 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-ink-3 pb-1 border-b border-border">
                  <span>Deterministic offset matches verified by LangGraph</span>
                  <span className="mono">{pendingCount} pending</span>
                </div>

                {suggestions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-ink-3">
                    <CheckCircle size={24} strokeWidth={1.5} className="mx-auto mb-2 text-ink" />
                    All AI recommendations reviewed and grounded!
                  </div>
                ) : (
                  suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-surface border border-border rounded-[var(--radius-sm)] hover:border-border-strong transition-default space-y-2.5"
                    >
                      {/* Quote & Offset */}
                      <p className="text-xs text-ink italic leading-relaxed border-l-2 border-ink pl-2">
                        &ldquo;{item.quote}&rdquo;
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <span className="mono text-ink-3">{item.charOffset}</span>
                        <span className="mono text-ink-3">seek: {item.audioTimestamp}</span>
                      </div>

                      {/* Suggested Tag & Theme */}
                      <div className="p-2 bg-fill-1 rounded flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-ink">{item.suggestedCode}</div>
                          <div className="text-[10px] text-ink-3">{item.suggestedTheme}</div>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {item.confidence}% conf
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(item.id)}
                          className="text-xs h-7"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setManualCodeQuote(item.quote);
                          }}
                          className="text-xs h-7"
                        >
                          Edit Code
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          className="text-xs h-7"
                        >
                          <Check size={12} strokeWidth={2} />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Codebook Hierarchy Tree */}
            {rightPanelTab === 'codebook' && (
              <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-ink-3 pb-1 border-b border-border">
                  <span>6 Themes • {themes.reduce((acc, t) => acc + t.codes.length, 0)} Sub-codes</span>
                  <span className="mono">{approvedCodesCount} grounded occurrences</span>
                </div>

                <div className="space-y-2">
                  {themes.map((theme) => {
                    const isExpanded = !!expandedThemes[theme.id];
                    return (
                      <div
                        key={theme.id}
                        className="border border-border rounded-[var(--radius-sm)] overflow-hidden bg-surface"
                      >
                        {/* Theme Item */}
                        <div
                          onClick={() => toggleTheme(theme.id)}
                          className="p-2.5 bg-fill-1 flex items-center justify-between cursor-pointer hover:bg-fill-2 transition-default select-none"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown size={14} strokeWidth={1.5} className="text-ink-3" />
                            ) : (
                              <ChevronRight size={14} strokeWidth={1.5} className="text-ink-3" />
                            )}
                            <span className="mono text-xs font-semibold text-ink">{theme.id}</span>
                            <span className="text-xs font-semibold text-ink">{theme.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Underline Swatch */}
                            <span
                              className={`w-6 text-center text-xs font-mono text-ink ${getThemeUnderline(
                                theme.id
                              )}`}
                            >
                              abc
                            </span>
                            <span className="mono text-xs text-ink-3 bg-surface px-1.5 py-0.2 border border-border rounded">
                              {theme.totalCount}
                            </span>
                          </div>
                        </div>

                        {/* Sub-codes Tree (Indented with hairline guide) */}
                        {isExpanded && (
                          <div className="p-2.5 space-y-2 pl-6 border-t border-border bg-surface">
                            {theme.codes.map((sub) => (
                              <div
                                key={sub.id}
                                className="relative pl-3 border-l border-border hover:border-ink transition-colors py-1 space-y-0.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-ink">{sub.label}</span>
                                  <span className="mono text-[11px] text-ink-3">{sub.count} tags</span>
                                </div>
                                <p className="text-[11px] text-ink-3 leading-snug">{sub.definition}</p>
                              </div>
                            ))}

                            {/* Add Code Trigger */}
                            <button
                              onClick={() => setAddCodeThemeId(theme.id)}
                              className="w-full text-left text-xs text-ink-3 hover:text-ink flex items-center gap-1 pt-1 cursor-pointer transition-colors"
                            >
                              <Plus size={12} strokeWidth={1.5} />
                              <span>Add sub-code to {theme.id}…</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Traceability Inspector Popover / Modal */}
      {activeInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
          <div className="relative bg-surface border border-border rounded-[var(--radius-md)] shadow-[var(--shadow-float)] max-w-lg w-full p-5 space-y-4 fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Tag size={16} strokeWidth={1.5} className="text-ink" />
                <h3 className="text-sm font-semibold text-ink">Grounded Traceability Inspector</h3>
              </div>
              <button
                onClick={() => setActiveInspector(null)}
                className="p-1 hover:bg-fill-1 rounded text-ink-3 hover:text-ink cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="micro-label">Assigned Code &amp; Parent Theme</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="solid" className="text-xs">
                    {activeInspector.theme}
                  </Badge>
                  <span className="text-xs text-ink font-semibold">
                    &rarr; {activeInspector.code}
                  </span>
                </div>
              </div>

              <div>
                <span className="micro-label">Deterministic Substring Citation</span>
                <p className="mono text-xs text-ink bg-fill-1 p-2 rounded border border-border mt-1">
                  {activeInspector.charOffset}
                </p>
              </div>

              <div>
                <span className="micro-label">English Coded Passage</span>
                <p className="text-sm text-ink-2 italic bg-fill-2/50 p-2.5 rounded border border-border mt-1">
                  &ldquo;{activeInspector.quote}&rdquo;
                </p>
              </div>

              <div>
                <span className="micro-label">Original Regional Utterance (Verbatim Source)</span>
                <p className="devanagari text-sm text-ink bg-fill-1 p-2.5 rounded border border-border mt-1 leading-relaxed">
                  {activeInspector.originalText}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-ink-3 pt-2 border-t border-border">
                <span className="mono">Audio Timestamp: {activeInspector.audioTimestamp}</span>
                <Badge variant="outline" className="text-[10px] text-ink font-mono">
                  Grounded in FGD-01
                </Badge>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setActiveInspector(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Code Modal */}
      {addCodeThemeId && (
        <Modal
          isOpen={!!addCodeThemeId}
          onClose={() => setAddCodeThemeId(null)}
          title={`Add Sub-Code to Theme ${addCodeThemeId}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <span className="micro-label">Sub-Code Label</span>
              <Input
                placeholder="e.g. Reluctance to discuss in public spaces"
                value={newCodeName}
                onChange={(e) => setNewCodeName(e.target.value)}
                className="mt-1"
                autoFocus
              />
            </div>

            <div>
              <span className="micro-label">Theoretical Definition / Inclusion Criteria</span>
              <textarea
                placeholder="Specify qualitative boundary criteria for attaching this code..."
                value={newCodeDef}
                onChange={(e) => setNewCodeDef(e.target.value)}
                className="w-full text-sm p-2.5 bg-surface border border-border rounded-[var(--radius-sm)] text-ink mt-1 h-20 focus:outline-none focus:border-ink"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setAddCodeThemeId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAddCode(addCodeThemeId)}
                disabled={!newCodeName.trim()}
              >
                Create Code
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Code Attachment Modal */}
      {manualCodeQuote && (
        <Modal
          isOpen={!!manualCodeQuote}
          onClose={() => setManualCodeQuote(null)}
          title="Attach Codebook Tag to Passage"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <span className="micro-label">Selected Passage</span>
              <p className="text-xs text-ink italic p-2.5 bg-fill-1 rounded border border-border mt-1">
                &ldquo;{manualCodeQuote}&rdquo;
              </p>
            </div>

            <div>
              <span className="micro-label">Select Code from Codebook</span>
              <select
                value={selectedCodeToApply}
                onChange={(e) => setSelectedCodeToApply(e.target.value)}
                className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-[var(--radius-sm)] text-ink mt-1"
              >
                <option value="">Select a code...</option>
                {themes.flatMap((t) =>
                  t.codes.map((c) => (
                    <option key={c.id} value={c.label}>
                      [{t.label}] {c.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="secondary" onClick={() => setManualCodeQuote(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={applyManualCode}
                disabled={!selectedCodeToApply}
              >
                Attach Code
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

