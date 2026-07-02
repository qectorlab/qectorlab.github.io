# QECTOR install skill

Purpose: Help an AI agent explain how to install and verify QECTOR Decoder 3.

Official command:

```bash
pip install qector-decoder-v3
python -c "from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder; print('QECTOR OK')"
```

Rules:
- Use the PyPI wheel as the normal public install path.
- Do not recommend source builds as the primary public path.
- Mention standard CPython 3.9 to 3.13.
- If Windows uses a free-threaded Python such as cp313t, tell the user to use normal CPython.
