import { useState, useRef, useEffect } from 'react';
import { SEO } from '../lib/seo';
import CodeBlock from '../components/CodeBlock';
import { Search, ChevronDown, ChevronRight, Terminal, BookOpen, Layers } from 'lucide-react';
import gsap from 'gsap';

interface APIClass {
  name: string;
  signature: string;
  desc: string;
  parameters: Array<{ name: string; type: string; default: string; desc: string }>;
  example: string;
}

export default function TechnicalReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClass, setExpandedClass] = useState<string | null>('BlossomDecoder');
  const detailsRef = useRef<HTMLDivElement>(null);

  const classes: APIClass[] = [
    {
      name: 'BlossomDecoder',
      signature: 'BlossomDecoder(dem: stim.DetectorErrorModel, *, adaptive_k: bool = True, timeout: Optional[float] = None)',
      desc: 'Minimum-weight perfect matching (MWPM) decoder for CSS stabilizer codes. Uses an exact matching solver to pair syndrome checks. Matches PyMatching LER output exactly through distance 15.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
        { name: 'adaptive_k', type: 'bool', default: 'True', desc: 'Enable Union-Find pre-filtering to compress graph' },
        { name: 'timeout', type: 'float', default: 'None', desc: 'Max seconds allowed to match a syndrome' },
      ],
      example: `import qector
decoder = qector.BlossomDecoder(dem)
correction = decoder.decode(syndrome)`
    },
    {
      name: 'BeliefMatchingDecoder',
      signature: 'BeliefMatchingDecoder(dem: stim.DetectorErrorModel, *, bp_iters: int = 30, max_paths: int = 10, bp_method: str = "product_sum")',
      desc: 'Top-tier accuracy decoder. Uses Belief Propagation (BP) preprocessing to compute edge probabilities, and then matches on a reweighted Blossom matching graph. Achieves +35.7% LER reduction vs plain MWPM.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
        { name: 'bp_iters', type: 'int', default: '30', desc: 'Max iterations for Belief Propagation' },
        { name: 'max_paths', type: 'int', default: '10', desc: 'Max alternative paths for match reweighting' },
        { name: 'bp_method', type: 'str', default: '"product_sum"', desc: 'BP update equation to resolve constraints' },
      ],
      example: `import qector
decoder = qector.BeliefMatchingDecoder(dem, bp_iters=30)
correction = decoder.decode(syndrome)`
    },
    {
      name: 'BpOsdDecoder',
      signature: 'BpOsdDecoder(dem: stim.DetectorErrorModel, *, osd_order: int = 40, osd_method: str = "osd_cs")',
      desc: 'Belief Propagation + Ordered Statistics Decoding. The standard decoder for qLDPC codes, where matching graphs are undefined. Handles non-CSS stabilizer layouts.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
        { name: 'osd_order', type: 'int', default: '40', desc: 'OSD search order limit' },
        { name: 'osd_method', type: 'str', default: '"osd_cs"', desc: 'OSD resolution method' },
      ],
      example: `import qector
decoder = qector.BpOsdDecoder(dem, osd_order=40)
correction = decoder.decode(syndrome)`
    },
    {
      name: 'UnionFindDecoder',
      signature: 'UnionFindDecoder(dem: stim.DetectorErrorModel, *, use_combined: bool = True)',
      desc: 'Near-linear time approximate decoder. Resolves syndromes by cluster growth and path compression. Scaling is O(N) making it ideal for large distance real-time systems.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
        { name: 'use_combined', type: 'bool', default: 'True', desc: 'Enable combined cluster growth constraints' },
      ],
      example: `import qector
decoder = qector.UnionFindDecoder(dem)
correction = decoder.decode(syndrome)`
    },
    {
      name: 'GpuBatchDecoder',
      signature: 'GpuBatchDecoder(dem: stim.DetectorErrorModel, *, backend: str = "cuda", batch_size: int = 1000)',
      desc: 'Parallel batch decoder. Implements CUDA and OpenCL device pipelines to solve thousands of syndromes concurrently. Bit-identical to CPU MWPM output.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
        { name: 'backend', type: 'str', default: '"cuda"', desc: 'GPU platform backend: "cuda" or "opencl"' },
        { name: 'batch_size', type: 'int', default: '1000', desc: 'Parallel batch sizing in device memory' },
      ],
      example: `import qector
decoder = qector.GpuBatchDecoder(dem, backend="cuda", batch_size=2048)
# Decodes 2D numpy array of syndromes in one call
corrections = decoder.decode_batch(syndromes_array)`
    },
    {
      name: 'SparseBlossomDecoder',
      signature: 'SparseBlossomDecoder(dem: stim.DetectorErrorModel)',
      desc: 'Low-latency region growing blossom variant optimized for ring-like and sparse detector error graphs.',
      parameters: [
        { name: 'dem', type: 'stim.DetectorErrorModel', default: 'Required', desc: 'Detector error model of the circuit' },
      ],
      example: `import qector
decoder = qector.SparseBlossomDecoder(dem)
correction = decoder.decode(syndrome)`
    },
  ];

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClass = (name: string) => {
    setExpandedClass(expandedClass === name ? null : name);
  };

  useEffect(() => {
    if (expandedClass && detailsRef.current) {
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [expandedClass]);

  return (
    <>
      <SEO
        title="Technical Reference · QECTOR"
        description="API reference, decoder parameters, and technical documentation for QECTOR quantum error correction decoder."
      />

      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-6">
            10 Decoder APIs · Stim DEM · PyO3 Zero-Copy NumPy
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">Technical Reference</h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Complete API documentation for QECTOR's decoders — signatures, parameter limits,
            and integration snippets for quantum pipelines.
          </p>
        </div>
      </section>

      {/* API Explorer section */}
      <section className="section-padding pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Search bar */}
          <div className="relative mb-8 max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search decoders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-3 bg-surface/50 border border-gridline rounded-xl text-primary text-sm focus:border-cyan-300/50 focus:outline-none transition-colors"
            />
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3.5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List column */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Decoder Classes
              </div>
              <div className="space-y-1">
                {filteredClasses.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggleClass(item.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all duration-200 ${
                      expandedClass === item.name
                        ? 'bg-cyan-300/10 text-cyan-300 border-cyan-300/20 shadow-xs'
                        : 'bg-surface/20 text-secondary hover:text-primary hover:bg-surface/40 border-gridline/50'
                    }`}
                  >
                    <span className="font-mono font-semibold">{item.name}</span>
                    {expandedClass === item.name ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                ))}
                {filteredClasses.length === 0 && (
                  <div className="p-4 text-center text-xs text-muted-foreground italic border border-dashed border-gridline rounded-xl">
                    No decoders matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Details column */}
            <div className="lg:col-span-8">
              {expandedClass ? (
                (() => {
                  const active = classes.find((c) => c.name === expandedClass);
                  if (!active) return null;
                  return (
                    <div ref={detailsRef} className="card-surface bg-surface/10 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-primary font-mono">{active.name}</h2>
                        <p className="text-secondary text-sm mt-3 leading-relaxed">{active.desc}</p>
                      </div>

                      {/* Signature block */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          Signature
                        </div>
                        <CodeBlock
                          code={active.signature}
                          language="python"
                          className="!my-0 bg-void/70"
                        />
                      </div>

                      {/* Parameters Table */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Parameters
                        </div>
                        <div className="overflow-x-auto border border-gridline rounded-xl">
                          <table className="w-full border-collapse text-left text-sm">
                            <thead>
                              <tr className="bg-surface/50 border-b border-gridline text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Default</th>
                                <th className="p-3">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gridline">
                              {active.parameters.map((p) => (
                                <tr key={p.name} className="hover:bg-surface/20 transition-colors">
                                  <td className="p-3 font-mono font-semibold text-primary">{p.name}</td>
                                  <td className="p-3 font-mono text-xs text-secondary">{p.type}</td>
                                  <td className="p-3 font-mono text-xs text-cyan-300">{p.default}</td>
                                  <td className="p-3 text-xs text-secondary leading-relaxed">{p.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Code Example */}
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Usage Example</div>
                        <CodeBlock
                          code={active.example}
                          language="python"
                          filename={`${active.name.toLowerCase()}_usage.py`}
                        />
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-gridline rounded-2xl p-12 text-center text-muted-foreground italic text-sm">
                  Select a decoder class from the sidebar to inspect parameters and example usage.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
