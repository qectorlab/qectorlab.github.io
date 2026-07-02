import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Play } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'success' | 'info';
}

export default function TerminalEmulator() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'QECTOR CLI Terminal Emulator v0.5.8', type: 'info' },
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
        { text: '  python -m qector.validate -quick  - Run rapid syndrome validator', type: 'output' },
        { text: '  python -m qector.benchmark -distance 5 - Run matching LER comparison', type: 'output' },
        { text: '  clear                       - Clear the terminal screen', type: 'output' },
      ]);
    } else if (trimmed === 'clear') {
      setLines([]);
    } else if (trimmed === 'pip install qector-decoder-v3') {
      await sleep(300);
      setLines((prev) => [...prev, { text: 'Downloading qector-decoder-v3-0.5.8-cp310-manylinux_x86_64.whl (5.2MB)...', type: 'output' }]);
      await sleep(800);
      setLines((prev) => [...prev, { text: 'Installing collected packages: qector-decoder-v3', type: 'output' }]);
      await sleep(400);
      setLines((prev) => [...prev, { text: 'Verifying Sigstore wheel signatures and SLSA provenance...', type: 'output' }]);
      await sleep(600);
      setLines((prev) => [
        ...prev,
        { text: '✓ Signature verified: Cosign cert subject CN matches guillaume@qector.store', type: 'success' },
        { text: 'Successfully installed qector-decoder-v3-0.5.8', type: 'success' },
      ]);
    } else if (trimmed === 'python -m qector.validate -quick') {
      await sleep(300);
      setLines((prev) => [...prev, { text: 'Initializing SATI validation harness...', type: 'output' }]);
      await sleep(400);
      setLines((prev) => [
        ...prev,
        { text: 'Running test 1/5: Check simple d=3 CSS Blossom... [PASS]', type: 'success' },
      ]);
      await sleep(300);
      setLines((prev) => [
        ...prev,
        { text: 'Running test 2/5: Check BP-OSD decoding index... [PASS]', type: 'success' },
      ]);
      await sleep(300);
      setLines((prev) => [
        ...prev,
        { text: 'Running test 3/5: CUDA execution compatibility... [PASS]', type: 'success' },
      ]);
      await sleep(200);
      setLines((prev) => [
        ...prev,
        { text: 'Running test 4/5: Verification checks for [[832,10,4]]... [PASS]', type: 'success' },
        { text: 'Running test 5/5: Stim parity validation (1,000 shots)... [PASS]', type: 'success' },
      ]);
      await sleep(200);
      setLines((prev) => [
        ...prev,
        { text: '✓ QECTOR OK (All 5 verification suites passed successfully)', type: 'success' },
      ]);
    } else if (trimmed === 'python -m qector.benchmark -distance 5') {
      await sleep(400);
      setLines((prev) => [
        ...prev,
        { text: 'Simulating rotated surface code (d=5, p=0.001, 100,000 shots)...', type: 'output' },
      ]);
      await sleep(1000);
      setLines((prev) => [
        ...prev,
        { text: '---------------------------------------------------------', type: 'info' },
        { text: 'Decoder           | Logical Error Rate | Speed (shots/s)', type: 'info' },
        { text: '---------------------------------------------------------', type: 'info' },
        { text: 'PyMatching        | 0.0079             | 145,210', type: 'output' },
        { text: 'QECTOR-Blossom    | 0.0079             | 1,085,412 (7.4x)', type: 'success' },
        { text: 'QECTOR-BeliefMatch| 0.0056             | 412,987   (2.8x)', type: 'success' },
        { text: '---------------------------------------------------------', type: 'info' },
        { text: '✓ Parity match verified. Belief-Matching LER reduction: +29.1%', type: 'success' },
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
