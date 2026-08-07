import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Play } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'success' | 'info';
}

export default function TerminalEmulator() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'QECTOR CLI Terminal Emulator (latest from PyPI)', type: 'info' },
    { text: 'Type "help" for a list of available commands.', type: 'info' },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines = [...lines, { text: `qector@sandbox:~$ ${cmd}`, type: 'input' as const }];
    setLines(newLines);
    setInput('');
    setIsExecuting(true);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (trimmed === 'help') {
      await sleep(200);
      setLines((prev) => [
        ...prev,
        { text: 'Available commands:', type: 'info' },
        { text: '  help                        - Show this menu', type: 'output' },
        { text: '  pip install qector-decoder-v3- Install QECTOR packages', type: 'output' },
        { text: '  qector-doctor               - Run the 15-check environment diagnostic', type: 'output' },
        { text: '  qector bench -d 5           - Run a v1.0.0 throughput benchmark', type: 'output' },
        { text: '  clear                       - Clear the terminal screen', type: 'output' },
      ]);
    } else if (trimmed === 'clear') {
      setLines([]);
    } else if (trimmed === 'pip install qector-decoder-v3') {
      await sleep(300);
      setLines((prev) => [...prev, { text: 'Downloading latest qector-decoder-v3 (fetched via PyPI RSS)...', type: 'output' }]);
      await sleep(800);
      setLines((prev) => [...prev, { text: 'Installing collected packages: qector-decoder-v3', type: 'output' }]);
      await sleep(400);
      setLines((prev) => [...prev, { text: 'Verifying Sigstore wheel signatures and SLSA provenance...', type: 'output' }]);
      await sleep(600);
      setLines((prev) => [
        ...prev,
        { text: '✓ Signature verified: Cosign cert subject CN matches guillaume@qector.store', type: 'success' },
        { text: 'Successfully installed latest qector-decoder-v3 (from PyPI RSS)', type: 'success' },
      ]);
    } else if (trimmed === 'qector-doctor') {
      await sleep(300);
      setLines((prev) => [...prev, { text: 'qector-doctor v1.0.0: 15-check environment diagnostic', type: 'output' }]);
      await sleep(500);
      setLines((prev) => [
        ...prev,
        { text: '[ 1/15] Python version (3.9-3.13) ............ PASS', type: 'success' },
        { text: '[ 2/15] qector_decoder_v3 import, v1.0.0 ..... PASS', type: 'success' },
        { text: '[ 3/15] NumPy bounds (>=1.24,<2.3) .......... PASS', type: 'success' },
        { text: '[ 4/15] Licence resolution state ............. PASS', type: 'success' },
        { text: '[ 5/15] CPU core decoders .................... PASS', type: 'success' },
        { text: '[ 6/15] AVX2 batch path ..................... PASS', type: 'success' },
        { text: '[ 7/15] CUDA device probe ................... WARN (no NVIDIA GPU found)', type: 'info' },
        { text: '[ 8/15] Stim import + DEM conversion ......... PASS', type: 'success' },
        { text: '[ 9/15] Sinter entry points ................. PASS', type: 'success' },
        { text: '[10/15] MCP server cold-start round-trip ..... PASS', type: 'success' },
        { text: '✓ 10 PASS, 1 WARN: decode ready (see qector-doctor --json for the full report)', type: 'success' },
      ]);
    } else if (trimmed === 'qector bench -d 5' || trimmed === 'qector bench --distance 5') {
      await sleep(400);
      setLines((prev) => [
        ...prev,
        { text: 'Generating rotated surface code (d=5, rounds=5, noise=0.001, 10,000 shots)...', type: 'output' },
      ]);
      await sleep(1000);
      setLines((prev) => [
        ...prev,
        { text: 'blossom           | throughput printed for this machine only', type: 'success' },
        { text: '---------------------------------------------------------', type: 'info' },
        { text: '✓ Machine-conditional rate printed; no universal figure claimed. Results depend on your CPU, GPU, drivers, and workload. Run qector bench on your own hardware.', type: 'success' },
      ]);
    } else {
      await sleep(150);
      setLines((prev) => [
        ...prev,
        { text: `qector: command not found: ${cmd}. Type "help" for a list of commands.`, type: 'info' },
      ]);
    }

    setIsExecuting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting) return;
    handleCommand(input);
  };

  return (
    <div className="flex flex-col border border-gridline bg-void/90 rounded-2xl overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-gridline">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-300" />
          <span className="font-mono text-xs text-secondary font-semibold">interactive-cli.sh</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="p-5 font-mono text-xs h-72 overflow-y-auto space-y-2 select-text custom-scrollbar">
        {lines.map((line, idx) => {
          let colorClass = 'text-secondary';
          if (line.type === 'input') colorClass = 'text-cyan-300 font-semibold';
          else if (line.type === 'success') colorClass = 'text-green-400 font-semibold';
          else if (line.type === 'info') colorClass = 'text-gold-400';

          return (
            <div key={idx} className={`${colorClass} leading-relaxed whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
        {isExecuting && (
          <div className="text-muted-foreground animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-3 bg-muted-foreground inline-block animate-caret" />
            <span>Executing...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-gridline bg-surface/50 px-4 py-2">
        <ChevronRight className="w-4 h-4 text-cyan-300 shrink-0" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isExecuting}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyan-300 px-2 py-1 placeholder-cyan-300/30"
          placeholder='Type a command (e.g. "help", "pip install qector-decoder-v3")...'
          aria-label="Terminal input"
        />
        <button
          type="submit"
          disabled={isExecuting || !input.trim()}
          className="p-1 text-cyan-300 hover:text-cyan-200 disabled:text-muted/20 transition-colors"
          aria-label="Run command"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </form>
    </div>
  );
}
