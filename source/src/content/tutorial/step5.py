import sinter
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
