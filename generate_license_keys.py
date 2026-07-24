"""
QECTOR Decoder v3 - Ed25519 License Key Generator & Token Creator
"""

from __future__ import annotations
import os
import base64
from typing import Tuple, Optional
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey

PRIVATE_KEY_PEM = b"""-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIO8EZir7Z8Ij1a3pGvQmyG6EmeNaKyW414K4ZTX7o+QT
-----END PRIVATE KEY-----"""

_STATIC_PRIVATE_KEY = serialization.load_pem_private_key(PRIVATE_KEY_PEM, password=None)


def get_private_key() -> Ed25519PrivateKey:
    env_b64 = os.getenv("QECTOR_LICENSE_PRIVATE_KEY_B64")
    if env_b64:
        try:
            raw = base64.b64decode(env_b64)
            return serialization.load_pem_private_key(raw, password=None)  # type: ignore
        except Exception:
            pass
    return _STATIC_PRIVATE_KEY


def create_license_token(receipt_id: str, customer_email: str = "", private_key: Optional[Ed25519PrivateKey] = None) -> str:
    key = private_key or get_private_key()
    email_clean = customer_email.strip().lower()
    payload = f"{receipt_id}:{email_clean}".encode("utf-8")
    signature = key.sign(payload)
    sig_b64 = base64.urlsafe_b64encode(signature).decode("utf-8").rstrip("=")

    if customer_email:
        email_b64 = base64.urlsafe_b64encode(email_clean.encode("utf-8")).decode("utf-8").rstrip("=")
        return f"{receipt_id}.{email_b64}.{sig_b64}"
    else:
        return f"{receipt_id}.{sig_b64}"


def generate_keypair() -> Tuple[bytes, bytes]:
    priv = Ed25519PrivateKey.generate()
    pub = priv.public_key()
    priv_pem = priv.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    pub_pem = pub.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return priv_pem, pub_pem
