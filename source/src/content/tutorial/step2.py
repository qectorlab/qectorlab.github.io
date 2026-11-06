import numpy as np
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
