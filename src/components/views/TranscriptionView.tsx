'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Search,
  Check,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  Button,
  Badge,
  Segmented,
  Select,
  PageHeader,
  Drawer,
  Input,
  useToast,
} from '@/components/ui';
import {
  sources,
  fgd01Utterances as initialUtterances,
  Utterance,
  glossaryTerms,
  GlossaryTerm,
} from '@/lib/mock-data';

export default function TranscriptionView() {
  const { showToast } = useToast();

  // State
  const [selectedSourceId, setSelectedSourceId] = useState('FGD-01');
  const [engine, setEngine] = useState('sarvam');
  const [utterances, setUtterances] = useState<Utterance[]>(initialUtterances);
  const [activeUtteranceId, setActiveUtteranceId] = useState<string>('u1');
  const [hoveredUtteranceId, setHoveredUtteranceId] = useState<string | null>(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(258); // default to 00:04:18 (258s)
  const totalDuration = 1930; // 00:32:10 in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  // Editing translation
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Glossary drawer
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  // Source options for select
  const sourceOptions = sources.map((s) => ({
    value: s.id,
    label: `${s.id} — ${s.title} (${s.language})`,
  }));

  // Engine options
  const engineOptions = [
    { id: 'sarvam', label: 'Sarvam AI', badge: 'Active • 94.2% conf' },
    { id: 'bhashini', label: 'Bhashini' },
    { id: 'whisper', label: 'OpenAI Whisper' },
  ];

  // Format seconds to hh:mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Audio simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const speedMultiplier = parseFloat(playbackSpeed);
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1 * speedMultiplier;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Sync active utterance based on currentTime
  useEffect(() => {
    const current = utterances.slice().reverse().find((u) => u.timestampSeconds <= currentTime);
    if (current && current.id !== activeUtteranceId) {
      setActiveUtteranceId(current.id);
    }
  }, [currentTime, utterances, activeUtteranceId]);

  // Handle scrubber click
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = Math.floor(percentage * totalDuration);
    setCurrentTime(newTime);
  };

  // Jump to utterance audio
  const jumpToUtterance = (u: Utterance) => {
    setCurrentTime(u.timestampSeconds);
    setActiveUtteranceId(u.id);
  };

  // Mark low confidence as verified
  const markVerified = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const originalUtterances = [...utterances];
    setUtterances((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isLowConfidence: false, isVerified: true } : u))
    );
    showToast('Utterance marked as verified', () => {
      setUtterances(originalUtterances);
    });
  };

  // Start inline editing
  const startEditing = (u: Utterance, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(u.id);
    setEditingText(u.englishTranslation);
  };

  // Save edit
  const saveEdit = (id: string) => {
    setUtterances((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, englishTranslation: editingText, isEdited: true } : u
      )
    );
    setEditingId(null);
    showToast('Translation updated');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Filtered glossary
  const filteredGlossary = glossaryTerms.filter(
    (g) =>
      g.devanagari.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.transliteration.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.englishRendering.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.note.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // Waveform heights (deterministic pseudo-random bars)
  const waveformHeights = [
    12, 20, 16, 28, 36, 18, 24, 32, 40, 14, 22, 38, 28, 16, 30, 44, 26, 18, 32, 22,
    14, 28, 38, 20, 34, 40, 18, 26, 30, 16, 24, 38, 28, 14, 22, 36, 30, 20, 28, 16,
    22, 34, 40, 26, 18, 30, 36, 20, 14, 28, 38, 24, 16, 32, 42, 22, 18, 28, 34, 20,
    14, 26, 38, 30, 18, 24, 36, 40, 22, 16, 30, 34, 20, 14, 26, 38, 28, 18, 32, 24,
  ];

  const scrubberPercentage = (currentTime / totalDuration) * 100;

  return (
    <div className="pb-16">
      {/* Page Header */}
      <PageHeader
        title="Transcription & Multilingual Verification Studio"
        description="Side-by-side verification of Indic ASR diarized transcripts with line-by-line bilingual alignment."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => setGlossaryOpen(true)}>
              <BookOpen size={16} strokeWidth={1.5} />
              Domain Glossary ({glossaryTerms.length})
            </Button>
          </div>
        }
      />

      {/* Top Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-border rounded-[var(--radius-md)] mb-4">
        <div className="flex items-center gap-3">
          <span className="micro-label">Source</span>
          <Select
            options={sourceOptions}
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="w-72"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="micro-label">ASR Engine</span>
            <Segmented
              options={engineOptions}
              value={engine}
              onChange={setEngine}
            />
          </div>
          <Badge variant="outline" className="text-ink font-mono text-[11px]">
            Speaker Diarization: ON
          </Badge>
        </div>
      </div>

      {/* Sticky Audio Player Bar */}
      <div className="sticky top-12 z-20 bg-surface border border-border-strong rounded-[var(--radius-md)] shadow-[var(--shadow-float)] p-3 mb-6">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            className="w-9 h-8 rounded-[var(--radius-sm)]"
          >
            {isPlaying ? <Pause size={14} strokeWidth={2} /> : <Play size={14} strokeWidth={2} />}
          </Button>

          {/* Timestamp Readout */}
          <div className="mono text-xs font-medium text-ink w-36 whitespace-nowrap">
            {formatTime(currentTime)} <span className="text-ink-3">/ {formatTime(totalDuration)}</span>
          </div>

          {/* Waveform & Scrubber */}
          <div
            className="flex-1 relative h-10 flex items-center gap-0.5 cursor-pointer select-none group"
            onClick={handleScrubberClick}
            title="Click to seek"
          >
            {waveformHeights.map((h, i) => {
              const barPercent = (i / waveformHeights.length) * 100;
              const isPlayed = barPercent <= scrubberPercentage;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] transition-colors duration-75 ${
                    isPlayed ? 'bg-ink' : 'bg-fill-3 group-hover:bg-fill-2'
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
            {/* Playhead thumb line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-ink shadow-sm pointer-events-none"
              style={{ left: `${scrubberPercentage}%` }}
            />
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 border-l border-border pl-3">
            <span className="micro-label mr-1 text-[10px]">Speed</span>
            {['0.8x', '1.0x', '1.2x', '1.5x'].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 text-xs font-mono rounded-[4px] transition-default cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-ink text-white'
                    : 'text-ink-3 hover:text-ink bg-fill-1'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Split Verification Editor */}
      <div className="border border-border rounded-[var(--radius-md)] bg-surface overflow-hidden">
        {/* Split Headers */}
        <div className="grid grid-cols-2 border-b border-border bg-fill-1">
          <div className="px-4 py-2.5 border-r border-border flex items-center justify-between">
            <span className="micro-label font-semibold text-ink">
              Original Regional Transcript (Hindi / Devanagari)
            </span>
            <span className="text-xs text-ink-3">Click utterance to seek audio</span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between">
            <span className="micro-label font-semibold text-ink">
              Verified English Translation (Editable)
            </span>
            <span className="text-xs text-ink-3">Click any text to edit inline</span>
          </div>
        </div>

        {/* Utterances Rows */}
        <div className="divide-y divide-border">
          {utterances.map((u) => {
            const isActive = activeUtteranceId === u.id;
            const isHovered = hoveredUtteranceId === u.id;

            return (
              <div
                key={u.id}
                onMouseEnter={() => setHoveredUtteranceId(u.id)}
                onMouseLeave={() => setHoveredUtteranceId(null)}
                onClick={() => jumpToUtterance(u)}
                className={`grid grid-cols-2 cursor-pointer transition-default ${
                  isHovered ? 'bg-fill-1' : ''
                } ${isActive ? 'bg-fill-2/50' : ''}`}
              >
                {/* Left Pane: Original Regional Speech */}
                <div
                  className={`p-4 border-r border-border transition-default ${
                    isActive ? 'border-l-2 border-l-ink pl-[14px]' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-[var(--radius-sm)] border border-border-strong flex items-center justify-center font-mono text-xs font-semibold text-ink bg-surface">
                        {u.speakerInitials}
                      </span>
                      <span className="text-xs font-semibold text-ink">{u.speaker}</span>
                    </div>
                    <span className="mono text-xs text-ink-3">{u.timestamp}</span>
                  </div>

                  {/* Devanagari regional text */}
                  <p className="devanagari text-[15px] text-ink leading-[1.75] font-normal">
                    {u.originalText}
                  </p>

                  {/* Transliteration */}
                  {u.transliteration && (
                    <p className="text-xs text-ink-3 italic mt-1 font-mono">
                      {u.transliteration}
                    </p>
                  )}
                </div>

                {/* Right Pane: English Translation & Verification */}
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-ink-3">English Translation</span>
                        {u.isEdited && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1 border-border-strong text-ink-2">
                            Edited
                          </Badge>
                        )}
                      </div>

                      {/* Status / Flagging */}
                      {u.isLowConfidence ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-border-strong rounded-full bg-surface text-ink-2">
                            <AlertTriangle size={12} strokeWidth={1.5} />
                            <span>{u.confidence}% conf — {u.lowConfidenceReason}</span>
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => markVerified(u.id, e)}
                            className="h-6 text-xs px-2"
                          >
                            <Check size={12} strokeWidth={1.5} />
                            Mark verified
                          </Button>
                        </div>
                      ) : u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-ink font-medium">
                          <CheckCircle size={14} strokeWidth={1.5} />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-ink-3">Awaiting review</span>
                      )}
                    </div>

                    {/* Editable Text Area or Paragraph */}
                    {editingId === u.id ? (
                      <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') cancelEdit();
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit(u.id);
                          }}
                          className="w-full text-sm p-2 bg-surface border border-ink rounded-[var(--radius-sm)] text-ink focus:outline-none min-h-[70px]"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>
                            Cancel (Esc)
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => saveEdit(u.id)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={(e) => startEditing(u, e)}
                        className={`text-sm text-ink-2 leading-relaxed hover:text-ink rounded-[4px] p-1 -m-1 transition-colors ${
                          u.isLowConfidence
                            ? 'bg-fill-1 border-l-2 border-ink pl-2 py-1 italic'
                            : ''
                        }`}
                        title="Click to edit translation"
                      >
                        {u.englishTranslation}
                      </div>
                    )}
                  </div>

                  {/* Coded Tags Pill Row */}
                  {u.codes && u.codes.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border">
                      <span className="micro-label text-[10px]">Coded:</span>
                      {u.codes.map((c) => (
                        <span
                          key={c}
                          className="text-[11px] font-mono px-1.5 py-0.2 bg-fill-2 border border-border text-ink rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Glossary Collapsible Drawer */}
      <Drawer
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        title="Domain Health & Cultural Glossary"
        width="w-96"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-3">
            Standardized localized idioms and health terms to guide verbatim translation consistency without literal distortion.
          </p>

          <Input
            icon={<Search size={14} strokeWidth={1.5} />}
            placeholder="Search glossary terms…"
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
          />

          <div className="divide-y divide-border border border-border rounded-[var(--radius-sm)] bg-surface">
            {filteredGlossary.map((g) => (
              <div key={g.id} className="p-3 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="devanagari text-base font-semibold text-ink">
                    {g.devanagari}
                  </span>
                  <span className="mono text-xs text-ink-3 italic">{g.transliteration}</span>
                </div>
                <div className="text-xs font-semibold text-ink">{g.englishRendering}</div>
                <p className="text-xs text-ink-3 leading-normal">{g.note}</p>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-ink-3">
                    {g.language}
                  </Badge>
                </div>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <div className="p-4 text-center text-xs text-ink-3">
                No glossary terms match &quot;{glossarySearch}&quot;
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

