import{j as e}from"./vendor-react-BiHfrq0e.js";import{S as i,C as s,L as r}from"./index-c1PDYu0j.js";import"./vendor-ui-B8TlNU4J.js";import"./vendor-gsap-a3sj5zmn.js";const c=`import qector_decoder_v3 as q
print(q.__version__)
print(q.get_license_info()["tier"])   # "Community" until you activate a licence
`,d=`import numpy as np
from qector_decoder_v3 import BlossomDecoder, UnionFindDecoder, generate_parity_check_matrix

# Distance-5 repetition code: 5 data qubits, 4 parity checks.
check_to_qubits = [[0, 1], [1, 2], [2, 3], [3, 4]]
H = generate_parity_check_matrix(check_to_qubits, 5)

error = np.array([0, 0, 1, 0, 0], dtype=np.uint8)
syndrome = (H @ error) % 2                      # which checks fire

for decoder in (UnionFindDecoder(check_to_qubits, 5), BlossomDecoder(check_to_qubits, 5)):
    correction = np.asarray(decoder.decode(syndrome), dtype=np.uint8)
    assert np.array_equal((H @ correction) % 2, syndrome)   # H·c = s (mod 2)
    print(type(decoder).__name__, correction)
`,a=`import stim
from qector_decoder_v3 import dem

circuit = stim.Circuit.generated(
    "surface_code:rotated_memory_z", distance=5, rounds=5,
    after_clifford_depolarization=0.005,
)
graph = dem.from_stim(circuit.detector_error_model(decompose_errors=True)).collapse_to_graph()
decoder = graph.make_decoder("blossom")          # uses the DEM's edge weights

shots = 2_000
dets, obs = circuit.compile_detector_sampler(seed=7).sample(shots, separate_observables=True)
fails = 0
for d, o in zip(dets, obs):
    correction = decoder.decode(d.astype("uint8"))
    predicted = graph.predicted_observables(correction)
    fails += int(predicted[0] != o[0])
print(f"logical errors: {fails} / {shots}")
`,l=`import numpy as np
from qector_decoder_v3 import codes
from qector_decoder_v3.bposd import BpOsdDecoder

# [[144,12,12]] bivariate bicycle code: A = x^3 + y + y^2, B = y^3 + x + x^2
cx, cz = codes.bivariate_bicycle_code(
    12, 6, [("x", 3), ("y", 1), ("y", 2)], [("y", 3), ("x", 1), ("x", 2)]
)
H = cx.parity_check_matrix()
decoder = BpOsdDecoder(H, error_rate=0.01, osd_order=0)

rng = np.random.default_rng(1)
error = (rng.random(H.shape[1]) < 0.01).astype(np.uint8)
syndrome = (H @ error) % 2
correction = np.asarray(decoder.decode(syndrome), dtype=np.uint8)
assert np.array_equal((H @ correction) % 2, syndrome)
print(H.shape, "syndrome reproduced")
`,m=`import sinter
import stim
from qector_decoder_v3.sinter_compat import qector_sinter_decoders


def main():
    tasks = [
        sinter.Task(
            circuit=stim.Circuit.generated(
                "surface_code:rotated_memory_z", distance=d, rounds=d,
                after_clifford_depolarization=p,
            ),
            json_metadata={"d": d, "p": p},
        )
        for d in (3, 5)
        for p in (0.002, 0.004)
    ]

    stats = sinter.collect(
        num_workers=2, tasks=tasks,
        decoders=["qector_blossom"],
        custom_decoders=qector_sinter_decoders(),
        max_shots=2_000, max_errors=50,
    )
    for s in sorted(stats, key=lambda s: (s.json_metadata["d"], s.json_metadata["p"])):
        print(s.json_metadata, s.errors, "/", s.shots)


if __name__ == "__main__":   # Sinter uses worker processes
    main()
`,o=[{id:"install",title:"Install and check",text:'Install from PyPI. Wheels exist for CPython 3.9 to 3.14 on Linux x86_64, Windows x64 and macOS on Apple silicon, so there is nothing to compile. The tier stays "Community" until you activate a licence, and every decoder works on the CPU in that tier.',shell:'python -m pip install --upgrade "qector-decoder-v3>=1.0.1,<2" stim sinter',code:c,file:"step1_check.py"},{id:"first-decode",title:"Your first decode, checked",text:"Build a distance-5 repetition code, inject one error, and decode its syndrome with Union-Find and exact matching. The assert is the contract every QECTOR decoder keeps: the correction reproduces the syndrome, H·c = s (mod 2).",code:d,file:"step2_first_decode.py"},{id:"stim",title:"Decode a Stim circuit",text:"Generate a rotated surface-code memory experiment with Stim, turn its detector error model into a weighted matching graph, and count logical errors over sampled shots. The decoder uses the error model’s weights, so rare and common faults are treated differently.",code:a,file:"step3_stim.py"},{id:"qldpc",title:"qLDPC with BP-OSD",text:"Matching needs graph-like errors; qLDPC codes do not have them. Build the [[144,12,12]] bivariate bicycle code and decode a random error with belief propagation plus ordered statistics, again checking the syndrome.",code:l,file:"step4_qldpc.py"},{id:"sinter",title:"Scale up with Sinter",text:"Sinter runs many circuits across worker processes and collects statistics. QECTOR registers its decoders as Sinter custom decoders. Keep the main guard: Sinter starts worker processes.",code:m,file:"step5_sinter.py"}];function _(){return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Getting Started · QECTOR Decoder v3",description:"A 15-minute tutorial for QECTOR Decoder v3: install, a first checked decode, a Stim surface-code circuit, qLDPC decoding with BP-OSD, and Sinter. Every snippet is tested against version 1.0.1."}),e.jsxs("section",{className:"relative pt-32 pb-12 md:pt-36 text-center overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void"}),e.jsxs("div",{className:"relative z-10 section-padding max-w-3xl mx-auto",children:[e.jsx("div",{className:"eyebrow-pill mb-6",children:"About 15 minutes · Tested on 1.0.1"}),e.jsx("h1",{className:"text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6",children:"Getting Started"}),e.jsxs("p",{className:"text-secondary text-lg leading-relaxed",children:["From ",e.jsx("code",{className:"font-mono text-cyan-200",children:"pip install"})," to decoding a surface-code circuit and a qLDPC code. Each step is a complete script you can copy and run."]})]})]}),e.jsx("section",{className:"section-padding pb-24",children:e.jsxs("div",{className:"max-w-4xl mx-auto grid lg:grid-cols-[13rem_1fr] gap-10",children:[e.jsx("nav",{"aria-label":"Steps",className:"hidden lg:block",children:e.jsx("ol",{className:"sticky top-28 space-y-2 text-sm",children:o.map((t,n)=>e.jsx("li",{children:e.jsxs("a",{href:`#${t.id}`,className:"text-secondary hover:text-cyan-300",children:[n+1,". ",t.title]})},t.id))})}),e.jsxs("div",{className:"space-y-14 min-w-0",children:[o.map((t,n)=>e.jsxs("article",{id:t.id,className:"scroll-mt-28",children:[e.jsxs("p",{className:"text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1",children:["Step ",n+1]}),e.jsx("h2",{className:"text-2xl font-bold mb-3",children:t.title}),e.jsx("p",{className:"text-secondary leading-relaxed mb-4",children:t.text}),t.shell&&e.jsx("div",{className:"mb-4",children:e.jsx(s,{language:"bash",filename:"terminal",code:t.shell})}),e.jsx(s,{language:"python",filename:t.file,code:t.code.trimEnd()})]},t.id)),e.jsxs("div",{className:"bg-[#0b1329]/40 border border-slate-800/80 rounded-2xl p-6",children:[e.jsx("h2",{className:"text-xl font-bold mb-3",children:"Where to go next"}),e.jsxs("ul",{className:"text-secondary text-sm space-y-2 list-disc pl-5",children:[e.jsxs("li",{children:["Every class and function, with signatures: the ",e.jsx(r,{to:"/technical-reference",className:"text-cyan-300 hover:underline",children:"API index"}),"."]}),e.jsxs("li",{children:["Choosing a decoder and the full feature set: ",e.jsx(r,{to:"/decoder",className:"text-cyan-300 hover:underline",children:"Decoder"})," and the ",e.jsx(r,{to:"/manual",className:"text-cyan-300 hover:underline",children:"user manual"}),"."]}),e.jsxs("li",{children:["Using QECTOR from Claude: the ",e.jsx(r,{to:"/claude-plugin",className:"text-cyan-300 hover:underline",children:"Claude plugin"}),"."]}),e.jsxs("li",{children:["GPU batch decoding and commercial use: ",e.jsx(r,{to:"/pricing",className:"text-cyan-300 hover:underline",children:"plans"}),", from $79/month."]})]}),e.jsx("p",{className:"text-muted-foreground text-xs mt-4",children:"Verified: each script above was run against the published qector-decoder-v3 1.0.1 wheel on Linux (CPython 3.13) on 6 November 2026. Logical-error counts depend on the random seed and noise settings; measure on your own workloads."})]})]})]})})]})}export{_ as default};
