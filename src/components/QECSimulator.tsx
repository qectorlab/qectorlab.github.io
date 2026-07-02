import { useState, useCallback, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

interface Node {
  id: string;
  r: number;
  c: number;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  type: 'H' | 'V' | 'L' | 'R';
  r: number;
  c: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function QECSimulator() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [corrections, setCorrections] = useState<Record<string, boolean>>({});
  const [hasDecoded, setHasDecoded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Nodes: 3x3 Grid of Syndrome Checks
  const nodes = useMemo<Node[]>(() => {
    const arr: Node[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        arr.push({
          id: `${r}_${c}`,
          r,
          c,
          x: 120 + c * 100,
          y: 60 + r * 100,
        });
      }
    }
    return arr;
  }, []);

  // Edges: 18 Data Qubits
  const edges = useMemo<Edge[]>(() => {
    const arr: Edge[] = [];

    // Left Boundary Edges
    for (let r = 0; r < 3; r++) {
      arr.push({
        id: `L_${r}`,
        type: 'L',
        r,
        c: -1,
        x1: 30,
        y1: 60 + r * 100,
        x2: 120,
        y2: 60 + r * 100,
      });
    }

    // Right Boundary Edges
    for (let r = 0; r < 3; r++) {
      arr.push({
        id: `R_${r}`,
        type: 'R',
        r,
        c: 3,
        x1: 320,
        y1: 60 + r * 100,
        x2: 410,
        y2: 60 + r * 100,
      });
    }

    // Horizontal Edges
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        arr.push({
          id: `H_${r}_${c}`,
          type: 'H',
          r,
          c,
          x1: 120 + c * 100,
          y1: 60 + r * 100,
          x2: 120 + (c + 1) * 100,
          y2: 60 + r * 100,
        });
      }
    }

    // Vertical Edges
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        arr.push({
          id: `V_${r}_${c}`,
          type: 'V',
          r,
          c,
          x1: 120 + c * 100,
          y1: 60 + r * 100,
          x2: 120 + c * 100,
          y2: 60 + (r + 1) * 100,
        });
      }
    }

    return arr;
  }, []);

  // Compute active checks (syndromes) based on current errors
  const activeChecks = useMemo<Record<string, boolean>>(() => {
    const syndrome: Record<string, boolean> = {};

    // Helper to flip syndrome state
    const flip = (nodeId: string) => {
      syndrome[nodeId] = !syndrome[nodeId];
    };

    edges.forEach((edge) => {
      if (errors[edge.id]) {
        // Toggle checks at endpoints
        if (edge.type === 'H') {
          flip(`${edge.r}_${edge.c}`);
          flip(`${edge.r}_${edge.c + 1}`);
        } else if (edge.type === 'V') {
          flip(`${edge.r}_${edge.c}`);
          flip(`${edge.r + 1}_${edge.c}`);
        } else if (edge.type === 'L') {
          flip(`${edge.r}_0`);
        } else if (edge.type === 'R') {
          flip(`${edge.r}_2`);
        }
      }
    });

    // Remove false properties to simplify
    Object.keys(syndrome).forEach((key) => {
      if (!syndrome[key]) delete syndrome[key];
    });

    return syndrome;
  }, [errors, edges]);

  // Click handler to toggle qubit error
  const handleEdgeClick = (edgeId: string) => {
    setCorrections({});
    setHasDecoded(false);
    setErrors((prev) => ({
      ...prev,
      [edgeId]: !prev[edgeId],
    }));
  };

  // Reset graph
  const handleReset = () => {
    setErrors({});
    setCorrections({});
    setHasDecoded(false);
  };

  // Inject random errors (each edge has a p% chance of error)
  const handleInjectRandom = (p: number = 0.2) => {
    setCorrections({});
    setHasDecoded(false);
    const newErrors: Record<string, boolean> = {};
    edges.forEach((edge) => {
      if (Math.random() < p) {
        newErrors[edge.id] = true;
      }
    });
    setErrors(newErrors);
  };

  // Distance calculator on the grid graph
  const getDist = (n1: Node, n2: Node) => {
    return Math.abs(n1.r - n2.r) + Math.abs(n1.c - n2.c);
  };

  // Get shortest path edges between u and v
  const getShortestPath = useCallback((u: Node, v: Node): string[] => {
    const path: string[] = [];

    // Go vertical first
    const rStart = Math.min(u.r, v.r);
    const rEnd = Math.max(u.r, v.r);
    const col = u.r < v.r ? u.c : v.c; // vertical along the appropriate column
    for (let r = rStart; r < rEnd; r++) {
      path.push(`V_${r}_${col}`);
    }

    // Go horizontal next
    const cStart = Math.min(u.c, v.c);
    const cEnd = Math.max(u.c, v.c);
    const row = u.r < v.r ? v.r : u.r; // horizontal along the target row
    for (let c = cStart; c < cEnd; c++) {
      path.push(`H_${row}_${c}`);
    }

    return path;
  }, []);

  // Solve MWPM exactly using backtracking (N <= 9 is extremely fast)
  const solveMWPM = useCallback(() => {
    const activeNodesList = Object.keys(activeChecks).map((id) => {
      const [r, c] = id.split('_').map(Number);
      return nodes.find((n) => n.r === r && n.c === c) as Node;
    });

    if (activeNodesList.length === 0) {
      setCorrections({});
      setHasDecoded(true);
      return;
    }

    interface MatchResult {
      cost: number;
      pairs: Array<[Node | 'L' | 'R', Node | 'L' | 'R']>;
    }

    // Memoized solve solver
    const solve = (unmatched: Node[]): MatchResult => {
      if (unmatched.length === 0) {
        return { cost: 0, pairs: [] };
      }

      const u = unmatched[0];
      const rest = unmatched.slice(1);

      let bestCost = Infinity;
      let bestPairs: MatchResult['pairs'] = [];

      // Option 1: Match u to left boundary
      // Cost is distance from u.c to left (-1 column): u.c - (-1) = u.c + 1
      const leftCost = u.c + 1;
      const leftResult = solve(rest);
      if (leftCost + leftResult.cost < bestCost) {
        bestCost = leftCost + leftResult.cost;
        bestPairs = [[u, 'L'], ...leftResult.pairs];
      }

      // Option 2: Match u to right boundary
      // Cost is distance from u.c to right (3 column): 3 - u.c
      const rightCost = 3 - u.c;
      const rightResult = solve(rest);
      if (rightCost + rightResult.cost < bestCost) {
        bestCost = rightCost + rightResult.cost;
        bestPairs = [[u, 'R'], ...rightResult.pairs];
      }

      // Option 3: Match u to another unmatched node v
      for (let i = 0; i < rest.length; i++) {
        const v = rest[i];
        const cost = getDist(u, v);
        const nextRest = rest.filter((_, idx) => idx !== i);
        const result = solve(nextRest);
        if (cost + result.cost < bestCost) {
          bestCost = cost + result.cost;
          bestPairs = [[u, v], ...result.pairs];
        }
      }

      return { cost: bestCost, pairs: bestPairs };
    };

    const bestMatching = solve(activeNodesList);

    // Turn matching pairs into correction edges
    const newCorrections: Record<string, boolean> = {};
    bestMatching.pairs.forEach(([u, v]) => {
      if (u === 'L' || u === 'R' || v === 'L' || v === 'R') {
        const node = (u === 'L' || u === 'R' ? v : u) as Node;
        const bound = (u === 'L' || u === 'R' ? u : v) as 'L' | 'R';

        if (bound === 'L') {
          // Left path: connect node back to column 0 horizontally, then left boundary
          for (let c = 0; c < node.c; c++) {
            newCorrections[`H_${node.r}_${c}`] = true;
          }
          newCorrections[`L_${node.r}`] = true;
        } else {
          // Right path: connect node to column 2 horizontally, then right boundary
          for (let c = node.c; c < 2; c++) {
            newCorrections[`H_${node.r}_${c}`] = true;
          }
          newCorrections[`R_${node.r}`] = true;
        }
      } else {
        // Node to Node path
        const pathEdges = getShortestPath(u as Node, v as Node);
        pathEdges.forEach((eid) => {
          newCorrections[eid] = true;
        });
      }
    });

    setCorrections(newCorrections);
    setHasDecoded(true);
  }, [activeChecks, nodes, getShortestPath]);

  // Compute success/logical error status:
  // Combined subgraph = error edges XOR correction edges.
  // A logical error occurs if the combined subgraph connects left boundary to right boundary.
  const codeStatus = useMemo(() => {
    if (!hasDecoded) return 'idle';

    // Build adjacency list for path finding on active sub-graph (Errors XOR Corrections)
    // In QEC, correction cancels syndrome errors, so if error XOR correction connects boundaries,
    // it means we created a logical loop.
    const activeEdges = edges.filter((edge) => {
      const err = errors[edge.id] || false;
      const corr = corrections[edge.id] || false;
      return err !== corr; // XOR
    });

    // Node representation: 'L' boundary, 'R' boundary, or check coordinates 'r_c'
    const adj: Record<string, string[]> = {};
    const addEdge = (u: string, v: string) => {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    };

    activeEdges.forEach((edge) => {
      if (edge.type === 'H') {
        addEdge(`${edge.r}_${edge.c}`, `${edge.r}_${edge.c + 1}`);
      } else if (edge.type === 'V') {
        addEdge(`${edge.r}_${edge.c}`, `${edge.r + 1}_${edge.c}`);
      } else if (edge.type === 'L') {
        addEdge('L', `${edge.r}_0`);
      } else if (edge.type === 'R') {
        addEdge('R', `${edge.r}_2`);
      }
    });

    // BFS to find if 'L' connects to 'R'
    const visited: Record<string, boolean> = {};
    const queue = ['L'];
    visited['L'] = true;

    let hasPath = false;
    while (queue.length > 0) {
      const u = queue.shift() as string;
      if (u === 'R') {
        hasPath = true;
        break;
      }
      const neighbors = adj[u] || [];
      neighbors.forEach((v) => {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      });
    }

    return hasPath ? 'failure' : 'success';
  }, [hasDecoded, errors, corrections, edges]);

  return (
    <div className="flex flex-col gap-4 border border-gridline bg-surface/30 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Interactive QEC Simulator
          </h4>
          <p className="text-muted-foreground text-xs mt-0.5">
            Planar stabilizer code (d=3). Click edges to toggle physical errors.
          </p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-secondary hover:text-cyan-300 transition-colors"
          aria-label="Toggle help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {showExplanation && (
        <div className="p-4 bg-void/80 border border-gridline rounded-xl text-xs text-secondary leading-relaxed space-y-2">
          <p>
            <strong>How to play:</strong> Click on the links (grey/red lines) to inject physical errors. Red lines represent errors.
          </p>
          <p>
            <strong>Syndromes:</strong> Grid nodes measure checks. When adjacent errors are odd, a check triggers (lights up orange).
          </p>
          <p>
            <strong>Decoder:</strong> Minimum Weight Perfect Matching (MWPM) matches active checks. When you click <span className="text-cyan-300">Run Decoder</span>, it draws matching correction paths in cyan.
          </p>
          <p>
            <strong>Success condition:</strong> If error + correction paths do not form a logical connection across boundaries (from left to right), the state is successfully corrected!
          </p>
        </div>
      )}

      {/* Simulator canvas */}
      <div className="bg-void/50 border border-gridline rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
        <svg viewBox="0 0 440 320" className="w-full max-w-[440px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Active Node Gold Glow */}
            <radialGradient id="activeNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
            {/* Inactive Node Steel */}
            <linearGradient id="inactiveNodeGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            {/* Grid dot pattern for SVG background */}
            <pattern id="gridDots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1e293b" fillOpacity="0.6" />
            </pattern>
          </defs>

          {/* Subtle grid dot pattern inside the simulator */}
          <rect width="440" height="320" fill="url(#gridDots)" rx="10" />

          {/* Boundaries */}
          <line x1="30" y1="30" x2="30" y2="290" stroke="#475569" strokeWidth="3" strokeDasharray="4 4" />
          <text x="20" y="165" fill="#475569" fontSize="10" textAnchor="middle" transform="rotate(-90, 20, 165)" className="font-mono">
            LEFT BOUNDARY
          </text>

          <line x1="410" y1="30" x2="410" y2="290" stroke="#475569" strokeWidth="3" strokeDasharray="4 4" />
          <text x="420" y="165" fill="#475569" fontSize="10" textAnchor="middle" transform="rotate(90, 420, 165)" className="font-mono">
            RIGHT BOUNDARY
          </text>

          {/* Edges (Data Qubits) */}
          {edges.map((edge) => {
            const hasError = errors[edge.id] || false;
            const hasCorr = corrections[edge.id] || false;

            let strokeColor = '#334155'; // standard line
            if (hasError && hasCorr) {
              strokeColor = '#e2e8f0'; // cancel/overlap
            } else if (hasError) {
              strokeColor = '#ef4444'; // Red error
            } else if (hasCorr) {
              strokeColor = '#06b6d4'; // Cyan correction
            }

            return (
              <g key={edge.id} className="group">
                {/* Thick invisible interaction layer */}
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="transparent"
                  strokeWidth="16"
                  className="cursor-pointer"
                  onClick={() => handleEdgeClick(edge.id)}
                />
                {/* Main line */}
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={strokeColor}
                  strokeWidth={hasError || hasCorr ? 4 : 2}
                  className="transition-colors duration-200 pointer-events-none group-hover:stroke-cyan-300/40"
                  style={{
                    filter: hasError ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))' : hasCorr ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))' : 'none',
                  }}
                />
                {/* Qubit marker dot */}
                <circle
                  cx={(edge.x1 + edge.x2) / 2}
                  cy={(edge.y1 + edge.y2) / 2}
                  r="5"
                  fill={hasError ? '#ef4444' : hasCorr ? '#06b6d4' : '#1e293b'}
                  stroke={hasError || hasCorr ? '#e2e8f0' : '#475569'}
                  strokeWidth="1.5"
                  className="transition-colors duration-200 pointer-events-none group-hover:fill-cyan-300 group-hover:stroke-cyan-200"
                />
              </g>
            );
          })}

          {/* Nodes (Checks) */}
          {nodes.map((node) => {
            const isActive = activeChecks[node.id] || false;
            return (
              <g key={node.id}>
                {/* Node Outer Shadow Glow */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill="rgba(251, 191, 36, 0.15)"
                    className="animate-pulse"
                  />
                )}
                {/* Node Main Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 12 : 9}
                  fill={isActive ? 'url(#activeNodeGlow)' : 'url(#inactiveNodeGlow)'}
                  stroke={isActive ? '#fbbf24' : '#334155'}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="transition-all duration-300 pointer-events-none"
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.7))' : 'none',
                  }}
                />
                {/* Glass highlight on top-left of node */}
                <circle
                  cx={node.x - (isActive ? 3 : 2)}
                  cy={node.y - (isActive ? 3 : 2)}
                  r={isActive ? 3 : 2}
                  fill="white"
                  fillOpacity="0.25"
                  className="pointer-events-none"
                />
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill="transparent"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    className="animate-ping"
                  />
                )}
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fill={isActive ? '#020617' : '#94a3b8'}
                  fontSize="9"
                  fontWeight="bold"
                  className="font-mono text-[9px] pointer-events-none"
                >
                  {isActive ? '!' : 'S'}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Decoder Status Overlay */}
        {hasDecoded && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 bg-surface/90 border border-gridline rounded-xl backdrop-blur-md transition-all duration-300">
            {codeStatus === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <ShieldCheck className="w-5 h-5" />
                <span>SUCCESS: Errors resolved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                <ShieldAlert className="w-5 h-5" />
                <span>LOGICAL ERROR: Correction failed</span>
              </div>
            )}
            <div className="text-[10px] text-muted-foreground font-mono">
              d=3 code slice
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleInjectRandom(0.2)}
          className="px-3 py-2 bg-surface hover:bg-white/5 border border-gridline rounded-lg text-xs font-semibold text-secondary hover:text-primary transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Inject Errors
        </button>
        <button
          onClick={solveMWPM}
          disabled={Object.keys(activeChecks).length === 0}
          className="px-3 py-2 bg-cyan-300 disabled:bg-cyan-300/20 disabled:text-void/40 hover:bg-cyan-200 text-void rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${hasDecoded ? '' : 'animate-spin'}`} />
          Run Decoder
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-surface hover:bg-red-950/20 border border-gridline hover:border-red-900/30 rounded-lg text-xs font-semibold text-secondary hover:text-red-400 transition-all"
        >
          Reset Graph
        </button>
      </div>
    </div>
  );
}
