'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Search,
  X,
  Info,
  Database,
  RotateCcw,
  SlidersHorizontal,
  Table as TableIcon,
  Network,
  Share2,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Modal,
  PageHeader,
  useToast,
} from '@/components/ui';
import {
  heatmapData as initialHeatmap,
  mixedMethodsData as initialMixedMethods,
  networkNodes as initialNodes,
  networkEdges as initialEdges,
  semanticSearchResults,
  wordCloudData,
  quoteBank,
} from '@/lib/mock-data';

export default function AnalyticsView() {
  const { showToast } = useToast();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDemographic, setSelectedDemographic] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('All');

  // Semantic search results state
  const [showSemanticResults, setShowSemanticResults] = useState(false);

  // Network graph interactive state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // DB Schema Modal
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);

  // Active Quote filter from interactions
  const [filterQuoteTheme, setFilterQuoteTheme] = useState<string | null>(null);

  // Filter options
  const locationOptions = [
    { value: 'All', label: 'All Districts' },
    { value: 'Sitamarhi', label: 'Sitamarhi, Bihar' },
    { value: 'Udaipur', label: 'Udaipur, Rajasthan' },
    { value: 'Satara', label: 'Satara, Maharashtra' },
    { value: 'Gaya', label: 'Gaya, Bihar' },
  ];

  const demographicOptions = [
    { value: 'All', label: 'All Demographics' },
    { value: 'Adolescent Girls', label: 'Adolescent Girls' },
    { value: 'Mothers', label: 'Mothers & Caregivers' },
    { value: 'ASHA Workers', label: 'ASHA Workers' },
    { value: 'Teachers', label: 'Teachers' },
  ];

  const metricOptions = [
    { value: 'All', label: 'All Knowledge Scores' },
    { value: 'low', label: 'Low Baseline Knowledge (< 50%)' },
    { value: 'high', label: 'High Baseline Knowledge (≥ 65%)' },
  ];

  // Active filters list for chips
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];
    if (selectedLocation !== 'All') {
      list.push({
        key: 'loc',
        label: `Location: ${selectedLocation}`,
        onRemove: () => setSelectedLocation('All'),
      });
    }
    if (selectedDemographic !== 'All') {
      list.push({
        key: 'demo',
        label: `Demographic: ${selectedDemographic}`,
        onRemove: () => setSelectedDemographic('All'),
      });
    }
    if (selectedMetric !== 'All') {
      list.push({
        key: 'metric',
        label: `Metric: ${selectedMetric === 'low' ? '< 50%' : '≥ 65%'}`,
        onRemove: () => setSelectedMetric('All'),
      });
    }
    if (filterQuoteTheme) {
      list.push({
        key: 'theme',
        label: `Theme: ${filterQuoteTheme}`,
        onRemove: () => setFilterQuoteTheme(null),
      });
    }
    return list;
  }, [selectedLocation, selectedDemographic, selectedMetric, filterQuoteTheme]);

  const clearAllFilters = () => {
    setSelectedLocation('All');
    setSelectedDemographic('All');
    setSelectedMetric('All');
    setFilterQuoteTheme(null);
    setSearchQuery('');
    setShowSemanticResults(false);
  };

  // Perform semantic search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSemanticResults(true);
      showToast(`pgvector: Found 5 cosine matches for "${searchQuery}"`);
    } else {
      setShowSemanticResults(false);
    }
  };

  // Heatmap rendering helpers (5-step grayscale ramp)
  // 0: #FFFFFF, 1-2: #EDEDED, 3-4: #D4D4D4, 5-6: #737373, 7+: #0A0A0A
  const getHeatmapColor = (count: number) => {
    if (count === 0) return { bg: '#FFFFFF', text: '#0A0A0A' };
    if (count <= 2) return { bg: '#EDEDED', text: '#0A0A0A' };
    if (count <= 4) return { bg: '#D4D4D4', text: '#0A0A0A' };
    if (count <= 6) return { bg: '#737373', text: '#FFFFFF' };
    return { bg: '#0A0A0A', text: '#FFFFFF' };
  };

  const districts = ['Sitamarhi', 'Udaipur', 'Satara', 'Gaya'];
  const themes = Object.keys(initialHeatmap);

  // Compute column totals
  const colTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    districts.forEach((d) => {
      totals[d] = themes.reduce((acc, t) => acc + (initialHeatmap[t][d] || 0), 0);
    });
    return totals;
  }, [districts, themes]);

  // Mixed methods dynamic data based on filters
  const chartData = useMemo(() => {
    return initialMixedMethods.filter((item) => {
      if (selectedLocation !== 'All' && item.district !== selectedLocation) return false;
      if (selectedMetric === 'low' && item.baselineKnowledge >= 50) return false;
      if (selectedMetric === 'high' && item.baselineKnowledge < 65) return false;
      return true;
    });
  }, [selectedLocation, selectedMetric]);

  // Network graph node-link handling
  const activeConnectedNodes = useMemo(() => {
    if (!selectedNode) return null;
    const connected = new Set<string>([selectedNode]);
    initialEdges.forEach((e) => {
      if (e.source === selectedNode) connected.add(e.target);
      if (e.target === selectedNode) connected.add(e.source);
    });
    return connected;
  }, [selectedNode]);

  // Filtered quotes based on interactions
  const displayedQuotes = useMemo(() => {
    return quoteBank.filter((q) => {
      if (selectedLocation !== 'All' && q.district !== selectedLocation) return false;
      if (selectedDemographic !== 'All' && q.demographic !== selectedDemographic) return false;
      if (selectedMetric === 'low' && q.baselineScore >= 50) return false;
      if (selectedMetric === 'high' && q.baselineScore < 65) return false;
      if (filterQuoteTheme && q.theme !== filterQuoteTheme) return false;
      return true;
    });
  }, [selectedLocation, selectedDemographic, selectedMetric, filterQuoteTheme]);

  return (
    <div className="pb-16 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Visualisation & Mixed-Methods Analytics"
        description="MAXQDA-inspired synthesis: linking qualitative thematic grounded codes directly with quantitative baseline metrics."
        action={
          <Button variant="secondary" size="md" onClick={() => setSchemaModalOpen(true)}>
            <Database size={16} strokeWidth={1.5} />
            View Mixed-Methods DB Schema
          </Button>
        }
      />

      {/* Top Filter & Semantic Search Bar */}
      <div className="p-4 bg-surface border border-border rounded-[var(--radius-md)] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            icon={<Search size={16} strokeWidth={1.5} />}
            placeholder="Semantic search across transcripts (e.g., 'hesitation drying reusable pads', 'fear of blood stains')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="primary" size="md" type="submit">
            Search pgvector
          </Button>
          {showSemanticResults && (
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => {
                setShowSemanticResults(false);
                setSearchQuery('');
              }}
            >
              Clear
            </Button>
          )}
        </form>

        {/* Filter dropdowns row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="micro-label">Filters:</span>
            <Select
              options={locationOptions}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs h-7"
            />
            <Select
              options={demographicOptions}
              value={selectedDemographic}
              onChange={(e) => setSelectedDemographic(e.target.value)}
              className="text-xs h-7"
            />
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-xs h-7"
            />
          </div>

          <div className="mono text-xs text-ink-3">
            Showing {displayedQuotes.length} grounded citations
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <span className="micro-label text-[10px]">Active Slices:</span>
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-fill-2 border border-border rounded-full text-ink"
              >
                {f.label}
                <button
                  onClick={f.onRemove}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  aria-label="Remove filter"
                >
                  <X size={12} strokeWidth={1.5} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-ink underline underline-offset-2 ml-2 hover:no-underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Semantic Search Results Expansion */}
      {showSemanticResults && (
        <Card className="border-ink">
          <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-semibold text-ink">
                pgvector Cosine Similarity Ranked Matches
              </span>
              <Badge variant="solid" className="text-[10px] font-mono">
                1536-dim OpenAI Ada
              </Badge>
            </div>
            <span className="text-xs text-ink-3">Threshold: &gt; 0.75 match</span>
          </div>

          <div className="space-y-3">
            {semanticSearchResults.map((res, i) => (
              <div
                key={i}
                className="p-3 bg-fill-1 rounded-[var(--radius-sm)] border border-border space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    {res.sourceId} &bull; {res.speaker}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-fill-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink"
                        style={{ width: `${res.score * 100}%` }}
                      />
                    </div>
                    <span className="mono text-xs font-semibold text-ink">
                      {res.score.toFixed(2)} match
                    </span>
                  </div>
                </div>
                <p className="text-sm text-ink-2 italic">&ldquo;{res.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 2x2 Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Code Frequency Matrix (Heatmap Table) */}
        <Card padding={false} className="flex flex-col">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-fill-1">
            <div className="flex items-center gap-2">
              <TableIcon size={16} strokeWidth={1.5} className="text-ink" />
              <h3 className="text-sm font-semibold text-ink">Code Frequency Matrix (Heatmap)</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
              <span>Ramp:</span>
              <span className="inline-block w-2.5 h-2.5 bg-white border border-border" title="0" />
              <span className="inline-block w-2.5 h-2.5 bg-[#EDEDED]" title="1-2" />
              <span className="inline-block w-2.5 h-2.5 bg-[#D4D4D4]" title="3-4" />
              <span className="inline-block w-2.5 h-2.5 bg-[#737373]" title="5-6" />
              <span className="inline-block w-2.5 h-2.5 bg-[#0A0A0A]" title="7+" />
            </div>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-semibold text-ink pb-2 pr-2">Core Theme</th>
                  {districts.map((d) => (
                    <th key={d} className="text-center font-semibold text-ink pb-2 px-2">
                      {d}
                    </th>
                  ))}
                  <th className="text-right font-semibold text-ink pb-2 pl-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {themes.map((theme) => {
                  const rowSum = districts.reduce(
                    (acc, d) => acc + (initialHeatmap[theme][d] || 0),
                    0
                  );
                  return (
                    <tr
                      key={theme}
                      onClick={() => setFilterQuoteTheme(theme)}
                      className="cursor-pointer hover:bg-fill-1/50 transition-colors"
                    >
                      <td className="py-2.5 pr-2 font-medium text-ink max-w-[150px] truncate">
                        {theme}
                      </td>
                      {districts.map((d) => {
                        const count = initialHeatmap[theme][d] || 0;
                        const { bg, text } = getHeatmapColor(count);
                        return (
                          <td key={d} className="py-1 px-1.5 text-center">
                            <span
                              className="inline-block w-8 py-1 rounded text-center font-mono font-medium transition-transform hover:scale-110"
                              style={{ backgroundColor: bg, color: text }}
                            >
                              {count}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2.5 pl-2 text-right font-mono font-semibold text-ink">
                        {rowSum}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border font-semibold text-ink">
                  <td className="pt-2 text-left">District Totals</td>
                  {districts.map((d) => (
                    <td key={d} className="pt-2 text-center font-mono">
                      {colTotals[d]}
                    </td>
                  ))}
                  <td className="pt-2 text-right font-mono font-bold">
                    {districts.reduce((acc, d) => acc + colTotals[d], 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* 2. Mixed-Methods Comparison Chart (Recharts) */}
        <Card padding={false} className="flex flex-col">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-fill-1">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Mixed-Methods Synthesis (Qual Mentions vs Quant Indicators)
              </h3>
              <p className="text-[11px] text-ink-3">Linked deterministically via respondent_id</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Dual Axis
            </Badge>
          </div>

          <div className="p-4 flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                {/* SVG Diagonal Hatch Pattern for Monochrome Bar */}
                <defs>
                  <pattern id="hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#0A0A0A" strokeWidth="2" />
                  </pattern>
                </defs>
                <CartesianGrid stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="district" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#E5E5E5' }} />
                <YAxis yAxisId="left" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#E5E5E5' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#737373', fontSize: 11 }} unit="%" axisLine={{ stroke: '#E5E5E5' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-border p-2 rounded shadow-sm text-xs space-y-1">
                          <p className="font-semibold text-ink">{payload[0].payload.district}</p>
                          <p className="text-ink-2">Qual Mentions: <span className="font-mono font-semibold">{payload[0].value}</span></p>
                          <p className="text-ink-2">Baseline Knowledge: <span className="font-mono font-semibold">{payload[1]?.value}%</span></p>
                          <p className="text-ink-2">Pad Adoption: <span className="font-mono font-semibold">{payload[2]?.value}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(val) => <span className="text-ink-2">{val}</span>}
                />
                <Bar
                  yAxisId="left"
                  dataKey="qualMentions"
                  name="Qual Coded Mentions"
                  fill="url(#hatch)"
                  stroke="#0A0A0A"
                  barSize={24}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="baselineKnowledge"
                  name="Quant Baseline Knowledge (%)"
                  stroke="#0A0A0A"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#0A0A0A' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="padAdoption"
                  name="Quant Pad Adoption (%)"
                  stroke="#737373"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#737373' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Thematic Relationship Graph (Interactive SVG Node-Link Map) */}
        <Card padding={false} className="flex flex-col">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-fill-1">
            <div className="flex items-center gap-2">
              <Network size={16} strokeWidth={1.5} className="text-ink" />
              <h3 className="text-sm font-semibold text-ink">Thematic Co-Occurrence Network</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedNode(null);
                  setFilterQuoteTheme(null);
                }}
                className="h-6 text-[10px] px-1.5"
              >
                <RotateCcw size={10} strokeWidth={1.5} />
                Reset view
              </Button>
            </div>
          </div>

          <div className="p-2 flex-1 relative bg-surface select-none">
            <svg viewBox="0 0 800 480" className="w-full h-64 md:h-72">
              {/* Edges */}
              {initialEdges.map((edge, i) => {
                const source = initialNodes.find((n) => n.id === edge.source);
                const target = initialNodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;

                const isEdgeActive =
                  !selectedNode ||
                  edge.source === selectedNode ||
                  edge.target === selectedNode;

                return (
                  <g key={i}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isEdgeActive ? (selectedNode ? '#0A0A0A' : '#D4D4D4') : '#EDEDED'}
                      strokeWidth={isEdgeActive && selectedNode ? 2.5 : Math.max(1, edge.weight / 4)}
                      strokeDasharray={edge.label ? 'none' : '2 2'}
                      opacity={isEdgeActive ? 1 : 0.2}
                    />
                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 4}
                        fill="#737373"
                        fontSize="9"
                        textAnchor="middle"
                        className="font-mono"
                        opacity={isEdgeActive ? 1 : 0.15}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {initialNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isConnected = !selectedNode || activeConnectedNodes?.has(node.id);
                const isCore = node.type === 'core';

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(isSelected ? null : node.id);
                      if (isCore) setFilterQuoteTheme(node.label);
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    opacity={isConnected ? 1 : 0.2}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isCore ? 28 : 16}
                      fill={isCore ? '#0A0A0A' : '#FFFFFF'}
                      stroke="#0A0A0A"
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-150"
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill={isCore ? '#FFFFFF' : '#0A0A0A'}
                      fontSize={isCore ? 10 : 8}
                      fontWeight={isCore ? 600 : 500}
                      textAnchor="middle"
                      className="pointer-events-none select-none font-sans"
                    >
                      {node.id}
                    </text>
                    <title>{`${node.label} (${node.type})`}</title>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-2 left-3 text-[10px] text-ink-3">
              Click any node to focus its network cluster and isolate citations.
            </div>
          </div>
        </Card>

        {/* 4. Keyword & Word Cloud Panel */}
        <Card padding={false} className="flex flex-col">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-fill-1">
            <h3 className="text-sm font-semibold text-ink">Keyword Frequency &amp; Grounded Terms</h3>
            <span className="mono text-[11px] text-ink-3">20 Key Tokens</span>
          </div>

          <div className="p-4 flex-1 space-y-4">
            {/* Tag Cloud (Monochrome only, strictly horizontal, weighted by font size & ink tone) */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 py-2 border-b border-border">
              {wordCloudData.map((item) => {
                // Font size scale: 12px to 26px
                const fontSize = 11 + Math.round((item.weight / 42) * 15);
                // Ink tone: high weight -> #0A0A0A, low weight -> #737373
                const color = item.weight > 25 ? '#0A0A0A' : item.weight > 15 ? '#525252' : '#737373';

                return (
                  <span
                    key={item.word}
                    onClick={() => {
                      setSearchQuery(item.word);
                      setShowSemanticResults(true);
                      showToast(`Filtered by keyword: "${item.word}"`);
                    }}
                    className="cursor-pointer hover:underline transition-default select-none"
                    style={{ fontSize: `${fontSize}px`, color, fontWeight: item.weight > 25 ? 600 : 400 }}
                    title={`${item.word} (${item.weight} occurrences)`}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>

            {/* Top 4 Keyword Frequency Bars */}
            <div className="space-y-2">
              <span className="micro-label text-[10px]">Top Utterance Frequency:</span>
              {wordCloudData.slice(0, 4).map((kw) => (
                <div key={kw.word} className="flex items-center gap-2 text-xs">
                  <span className="w-24 truncate text-ink-2 font-medium">{kw.word}</span>
                  <div className="flex-1 h-2 bg-fill-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${(kw.weight / 42) * 100}%` }}
                    />
                  </div>
                  <span className="mono w-8 text-right text-ink font-semibold">{kw.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Relational Database Schema Modal (PostgreSQL + pgvector) */}
      <Modal
        isOpen={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
        title="PostgreSQL + pgvector Relational Mixed-Methods Schema"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-3">
            Grounded relational architecture demonstrating zero-retention privacy, foreign-key lineage across qualitative quotes, and pgvector cosine embeddings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2 bg-fill-1 rounded border border-border">
            {/* Table 1: respondents */}
            <div className="bg-surface border border-border rounded p-3 text-xs space-y-2">
              <div className="font-semibold text-ink border-b border-border pb-1 mono">
                table: respondents
              </div>
              <div className="space-y-1 font-mono text-[11px] text-ink-2">
                <div className="font-bold text-ink">PK respondent_id varchar</div>
                <div>district varchar</div>
                <div>state varchar</div>
                <div>demographic_cohort varchar</div>
                <div>baseline_score integer</div>
                <div>pad_adoption_pct integer</div>
              </div>
            </div>

            {/* Table 2: transcripts */}
            <div className="bg-surface border border-border rounded p-3 text-xs space-y-2">
              <div className="font-semibold text-ink border-b border-border pb-1 mono">
                table: transcripts
              </div>
              <div className="space-y-1 font-mono text-[11px] text-ink-2">
                <div className="font-bold text-ink">PK transcript_id varchar</div>
                <div className="text-ink">FK respondent_id varchar</div>
                <div>asr_engine varchar</div>
                <div>confidence_score float</div>
                <div>original_raw_text text</div>
                <div>verified_english text</div>
              </div>
            </div>

            {/* Table 3: codebook */}
            <div className="bg-surface border border-border rounded p-3 text-xs space-y-2">
              <div className="font-semibold text-ink border-b border-border pb-1 mono">
                table: codebook
              </div>
              <div className="space-y-1 font-mono text-[11px] text-ink-2">
                <div className="font-bold text-ink">PK code_id varchar</div>
                <div>parent_theme varchar</div>
                <div>definition text</div>
                <div>methodology varchar</div>
                <div>tag_count integer</div>
              </div>
            </div>

            {/* Table 4: coded_segments */}
            <div className="bg-surface border border-border rounded p-3 text-xs space-y-2">
              <div className="font-semibold text-ink border-b border-border pb-1 mono">
                table: coded_segments
              </div>
              <div className="space-y-1 font-mono text-[11px] text-ink-2">
                <div className="font-bold text-ink">PK segment_id uuid</div>
                <div className="text-ink">FK transcript_id varchar</div>
                <div className="text-ink">FK code_id varchar</div>
                <div>char_start integer</div>
                <div>char_end integer</div>
                <div className="font-bold text-ink">embedding vector(1536)</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-ink-3">
            <span>Foreign Key Integrity: Verified 100% relational integrity</span>
            <Button variant="primary" size="sm" onClick={() => setSchemaModalOpen(false)}>
              Close Diagram
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

