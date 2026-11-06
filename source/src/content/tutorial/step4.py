import numpy as np
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
