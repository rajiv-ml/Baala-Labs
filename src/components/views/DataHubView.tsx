'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Search,
  Upload,
  X,
  Clock,
  CircleDot,
  Check,
  ArrowRight,
  FileAudio,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  Modal,
  Switch,
  Input,
  Select,
  PageHeader,
  ProgressBar,
  EmptyState,
  useToast,
  Skeleton,
} from '@/components/ui';
import {
  sources as initialSources,
  Source,
  SessionType,
  SourceStatus,
} from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Status pill renderer
// ---------------------------------------------------------------------------
function StatusPill({ status }: { status: SourceStatus }) {
  switch (status) {
    case 'needs-verification':
      return (
        <Badge variant="dashed" icon={<Clock size={16} strokeWidth={1.5} />}>
          Needs verification
        </Badge>
      );
    case 'ready-for-coding':
      return (
        <Badge variant="outline" icon={<CircleDot size={16} strokeWidth={1.5} />}>
          Ready for coding
        </Badge>
      );
    case 'coded-verified':
      return (
        <Badge variant="solid" icon={<Check size={16} strokeWidth={1.5} />}>
          Coded &amp; verified
        </Badge>
      );
  }
}

// ---------------------------------------------------------------------------
// File type icon helper
// ---------------------------------------------------------------------------
function fileIcon(name: string) {
  if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(name))
    return <FileAudio size={16} strokeWidth={1.5} className="text-ink-3" />;
  if (/\.(csv|xlsx|xls)$/i.test(name))
    return <FileSpreadsheet size={16} strokeWidth={1.5} className="text-ink-3" />;
  return <FileText size={16} strokeWidth={1.5} className="text-ink-3" />;
}

// ---------------------------------------------------------------------------
// Sorting helpers
// ---------------------------------------------------------------------------
type SortKey = 'id' | 'title' | 'type' | 'language' | 'location' | 'respondentId' | 'status';
type SortDir = 'asc' | 'desc';

function compare(a: Source, b: Source, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// STATUS_FILTER options
// ---------------------------------------------------------------------------
const STATUS_OPTIONS: { id: SourceStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'needs-verification', label: 'Needs verification' },
  { id: 'ready-for-coding', label: 'Ready for coding' },
  { id: 'coded-verified', label: 'Coded & verified' },
];

// ---------------------------------------------------------------------------
// Language options
// ---------------------------------------------------------------------------
const LANGUAGE_OPTIONS = [
  { value: '', label: 'Select language…' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Hindi / Bhojpuri', label: 'Hindi / Bhojpuri' },
  { value: 'Hindi / Mewari', label: 'Hindi / Mewari' },
  { value: 'Hindi / English', label: 'Hindi / English' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'English', label: 'English' },
];

const SESSION_OPTIONS = [
  { value: '', label: 'Select type…' },
  { value: 'KII', label: 'KII' },
  { value: 'FGD', label: 'FGD' },
  { value: 'Survey', label: 'Survey' },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DataHubView() {
  const { showToast } = useToast();

  // Source data
  const [sources, setSources] = useState<Source[]>(initialSources);

  // Upload modal
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [files, setFiles] = useState<File[]>([]);
  const [respondentId, setRespondentId] = useState('');
  const [sessionType, setSessionType] = useState<string>('');
  const [district, setDistrict] = useState('');
  const [demographic, setDemographic] = useState('');
  const [language, setLanguage] = useState('');
  const [autoAnon, setAutoAnon] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  // Table state
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<SourceStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // ---------------------------------------------------------------------------
  // KPI computations
  // ---------------------------------------------------------------------------
  const totalSources = sources.length;
  const verifiedCount = sources.filter((s) => s.status === 'coded-verified').length;
  const districts = new Set(sources.map((s) => s.district));
  const awaitingReview = sources.filter((s) => s.status !== 'coded-verified').length;

  // ---------------------------------------------------------------------------
  // Sort handler
  // ---------------------------------------------------------------------------
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey],
  );

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // ---------------------------------------------------------------------------
  // Filtered + sorted sources
  // ---------------------------------------------------------------------------
  const displayed = sources
    .filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (filterText) {
        const q = filterText.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.language.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.respondentId.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const c = compare(a, b, sortKey);
      return sortDir === 'asc' ? c : -c;
    });

  // ---------------------------------------------------------------------------
  // Upload helpers
  // ---------------------------------------------------------------------------
  const resetForm = useCallback(() => {
    setFiles([]);
    setRespondentId('');
    setSessionType('');
    setDistrict('');
    setDemographic('');
    setLanguage('');
    setAutoAnon(true);
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!files.length || !respondentId || !sessionType || !district || !language) return;
    setUploading(true);

    // Simulated upload — skeleton for 1.5s then resolve
    setTimeout(() => {
      const nextIdx = sources.length + 1;
      const prefix = sessionType === 'Survey' ? 'SURV' : sessionType;
      const newSource: Source = {
        id: `${prefix}-${String(nextIdx).padStart(2, '0')}`,
        title: files[0].name.replace(/\.[^.]+$/, ''),
        type: sessionType as SessionType,
        language,
        location: district,
        district: district.split(',')[0]?.trim() || district,
        state: district.split(',')[1]?.trim() || '',
        demographic,
        participantCount: 1,
        baselineScore: 0,
        respondentId,
        status: 'needs-verification' as SourceStatus,
        duration: 'N/A',
        lastEdited: 'Just now',
        editedBy: 'You',
        dateCollected: new Date().toISOString().slice(0, 10),
      };

      setSources((prev) => [...prev, newSource]);
      setUploading(false);
      setUploadOpen(false);
      resetForm();
      showToast(`Source "${newSource.id}" uploaded successfully`);
    }, 1500);
  }, [files, respondentId, sessionType, district, language, demographic, sources.length, resetForm, showToast]);

  // ---------------------------------------------------------------------------
  // Row action handlers
  // ---------------------------------------------------------------------------
  const handleVerify = useCallback(
    (id: string) => {
      setSources((prev) =>
        prev.map((s) =>
          s.id === id && s.status === 'needs-verification'
            ? { ...s, status: 'ready-for-coding' as SourceStatus, lastEdited: 'Just now', editedBy: 'You' }
            : s,
        ),
      );
      showToast(`${id} marked as verified`);
    },
    [showToast],
  );

  const handleCode = useCallback(
    (id: string) => {
      setSources((prev) =>
        prev.map((s) =>
          s.id === id && s.status === 'ready-for-coding'
            ? { ...s, status: 'coded-verified' as SourceStatus, lastEdited: 'Just now', editedBy: 'You' }
            : s,
        ),
      );
      showToast(`${id} marked as coded & verified`);
    },
    [showToast],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      {/* Page header */}
      <PageHeader
        title="Data Hub"
        description="Upload, manage and verify field data sources for qualitative analysis."
        action={
          <Button variant="primary" size="md" onClick={() => setUploadOpen(true)}>
            <Plus size={16} strokeWidth={1.5} />
            Upload field data
          </Button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* KPI ROW                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Field Sources */}
        <Card>
          <p className="micro-label mb-1">Total Field Sources</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">{totalSources}</p>
          <p className="text-xs text-ink-3 mt-1">Across {districts.size} districts</p>
        </Card>

        {/* Verified Transcripts */}
        <Card>
          <p className="micro-label mb-1">Verified Transcripts</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">
            {verifiedCount}/{totalSources}
          </p>
          <p className="text-xs text-ink-3 mt-1">
            {awaitingReview > 0 ? `${awaitingReview} awaiting review` : 'All verified'}
          </p>
          <ProgressBar value={verifiedCount} max={totalSources} className="mt-3" />
        </Card>

        {/* Grounded Coded Segments */}
        <Card>
          <p className="micro-label mb-1">Grounded Coded Segments</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">48</p>
          <p className="text-xs text-ink-3 mt-1">100% verbatim-verified</p>
        </Card>

        {/* Linked Quantitative Respondents */}
        <Card>
          <p className="micro-label mb-1">Linked Quantitative Respondents</p>
          <p className="text-[28px] font-semibold text-ink leading-tight">100%</p>
          <p className="text-xs text-ink-3 mt-1">All sources linked via respondent_id</p>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SOURCE REPOSITORY TABLE                                            */}
      {/* ------------------------------------------------------------------ */}
      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border">
          {/* Text filter */}
          <Input
            icon={<Search size={16} strokeWidth={1.5} />}
            placeholder="Filter sources…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full sm:w-64"
          />

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = statusFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setStatusFilter(opt.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-default cursor-pointer whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-ink text-white border-ink'
                        : 'bg-surface text-ink-2 border-border hover:border-border-strong'
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        {displayed.length === 0 ? (
          <EmptyState
            message="No sources match the current filters."
            action={{ label: 'Clear filters', onClick: () => { setFilterText(''); setStatusFilter('all'); } }}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('id')}>
                  ID{sortIndicator('id')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('title')}>
                  Title{sortIndicator('title')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('type')}>
                  Type{sortIndicator('type')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('language')}>
                  Language{sortIndicator('language')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('location')}>
                  Location{sortIndicator('location')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('respondentId')}>
                  Respondent ID{sortIndicator('respondentId')}
                </TableHeaderCell>
                <TableHeaderCell className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                  Status{sortIndicator('status')}
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {displayed.map((src) => (
                <TableRow key={src.id} className="group">
                  <TableCell mono>{src.id}</TableCell>
                  <TableCell className="font-medium text-ink max-w-[220px] truncate">{src.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{src.type}</Badge>
                  </TableCell>
                  <TableCell>{src.language}</TableCell>
                  <TableCell>{src.location}</TableCell>
                  <TableCell mono>{src.respondentId}</TableCell>
                  <TableCell>
                    <StatusPill status={src.status} />
                  </TableCell>
                  <TableCell>
                    <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-default">
                      {src.status === 'needs-verification' && (
                        <Button variant="ghost" size="sm" onClick={() => handleVerify(src.id)}>
                          Verify
                          <ArrowRight size={16} strokeWidth={1.5} />
                        </Button>
                      )}
                      {src.status === 'ready-for-coding' && (
                        <Button variant="ghost" size="sm" onClick={() => handleCode(src.id)}>
                          Code
                          <ArrowRight size={16} strokeWidth={1.5} />
                        </Button>
                      )}
                      {src.status === 'coded-verified' && (
                        <span className="text-xs text-ink-3 flex items-center h-7">Complete</span>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* UPLOAD MODAL                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => { setUploadOpen(false); resetForm(); }}
        title="Upload field data"
        maxWidth="max-w-xl"
      >
        {uploading ? (
          <div className="space-y-4">
            <Skeleton height="40px" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="20px" width="80%" />
            <Skeleton height="20px" width="50%" />
            <p className="text-xs text-ink-3 text-center mt-2">Processing upload…</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Drag-drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-[var(--radius-md)] border-2 transition-default cursor-pointer
                ${dragOver ? 'border-ink border-solid bg-fill-1' : 'border-dashed border-border hover:border-border-strong'}`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload size={16} strokeWidth={1.5} className="text-ink-3" />
              <p className="text-sm text-ink-2">
                Drag &amp; drop files here, or <span className="underline underline-offset-2 text-ink">browse</span>
              </p>
              <p className="text-xs text-ink-3">Accepts .txt, .csv, .docx, .mp3, .wav, .pdf</p>
              <input
                id="file-input"
                type="file"
                accept=".txt,.csv,.docx,.mp3,.wav,.pdf"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* File chips */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span
                    key={`${f.name}-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-fill-1 rounded-[var(--radius-sm)] text-ink"
                  >
                    {fileIcon(f.name)}
                    {f.name}
                    <button
                      onClick={() => removeFile(i)}
                      className="p-0.5 rounded hover:bg-fill-2 transition-default cursor-pointer"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Metadata fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="micro-label">Respondent / Group ID</span>
                <Input
                  placeholder="e.g. RES-BH-099"
                  value={respondentId}
                  onChange={(e) => setRespondentId(e.target.value)}
                />
              </label>

              <label className="space-y-1">
                <span className="micro-label">Session Type</span>
                <Select
                  options={SESSION_OPTIONS}
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full"
                />
              </label>

              <label className="space-y-1">
                <span className="micro-label">District / Location</span>
                <Input
                  placeholder="e.g. Sitamarhi, Bihar"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </label>

              <label className="space-y-1">
                <span className="micro-label">Demographic Cohort</span>
                <Input
                  placeholder="e.g. Adolescent Girls"
                  value={demographic}
                  onChange={(e) => setDemographic(e.target.value)}
                />
              </label>

              <label className="space-y-1">
                <span className="micro-label">Source Language</span>
                <Select
                  options={LANGUAGE_OPTIONS}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full"
                />
              </label>
            </div>

            {/* PII toggle */}
            <Switch
              checked={autoAnon}
              onChange={setAutoAnon}
              label="Auto-anonymize PII before LLM processing"
              helperText="Names, phone numbers, and addresses will be redacted before any AI model sees the transcript."
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="secondary"
                onClick={() => { setUploadOpen(false); resetForm(); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!files.length || !respondentId || !sessionType || !district || !language}
              >
                <Upload size={16} strokeWidth={1.5} />
                Upload &amp; process
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
