import stim
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
