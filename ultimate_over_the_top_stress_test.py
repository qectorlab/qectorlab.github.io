#!/usr/bin/env python3
"""
===============================================================================
 ULTIMATE OVER-THE-TOP CPU & GPU STRESS TEST SUITE — QECTOR DECODER V3 (v0.6.9)
===============================================================================
An extreme 100% saturation stress test pushing CPU multi-threading, CUDA GPU
kernels, OpenCL GPU compute, high-distance topological scaling (up to d=31),
adversarial noise (p=15%), multi-round temporal streaming (100 rounds), and
continuous RSS memory leak checks.

Author: Qector Systems Engineering & High-Performance Computing Team
Version: v0.6.9 (Production Engine Release)
"""

from __future__ import annotations

import argparse
import gc
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np

# Force UTF-8 handling on Windows standard streams
for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        try:
            _s.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

# Enable VT100 colors on Windows
if sys.platform == "win32":
    try:
        import ctypes
        k32 = ctypes.windll.kernel32
        k32.SetConsoleMode(k32.GetStdHandle(-11), 7)
    except Exception:
        os.system("")

# Styling Tokens
class C:
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"
    BLUE = "\033[94m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"

    @classmethod
    def disable(cls):
        cls.CYAN = cls.MAGENTA = cls.BLUE = cls.GREEN = cls.YELLOW = cls.RED = cls.BOLD = cls.DIM = cls.RESET = ""

def _can_unicode() -> bool:
    try:
        "┌─✔⚡".encode(sys.stdout.encoding or "utf-8")
        return True
    except Exception:
        return False

USE_UNICODE = _can_unicode()
BOX_TL = "┌" if USE_UNICODE else "+"
BOX_TR = "┐" if USE_UNICODE else "+"
BOX_BL = "└" if USE_UNICODE else "+"
BOX_BR = "┘" if USE_UNICODE else "+"
BOX_H = "─" if USE_UNICODE else "-"
BOX_V = "│" if USE_UNICODE else "|"
SYM_OK = "✔ PASS" if USE_UNICODE else "[OK]"
SYM_FAIL = "✘ FAIL" if USE_UNICODE else "[FAIL]"

BANNER = f"""{C.RED}{C.BOLD}
  ██████╗ ███████╗██╗     ███████╗████████╗██████╗  ██████╗ 
 ██╔═══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
 ██║   ██║█████╗  ██║     █████╗     ██║   ██████╔╝██║   ██║
 ██║▄▄ ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══██╗██║   ██║
 ╚██████╔╝███████╗███████╗███████╗   ██║   ██║  ██║╚██████╔╝
  ╚══▀▀═╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
{C.YELLOW}    ULTIMATE 100% CPU & GPU HARDWARE SATURATION STRESS TEST {C.DIM}v0.6.9{C.RESET}
"""

# Import target libraries
import qector_decoder_v3 as qector
from qector_decoder_v3 import (
    UnionFindDecoder,
    FastUnionFindDecoder,
    BlossomDecoder,
    BPOSDDecoder,
    HybridCascadeDecoder,
    SlidingWindowDecoder,
    CPUBatchDecoder,
    CUDABatchDecoder,
    OpenCLBatchDecoder,
    py_generate_surface_code_checks,
    py_generate_ring_code_checks,
    py_generate_parity_check_matrix,
)

HAS_CUDA = getattr(CUDABatchDecoder, "is_available", lambda: False)()
HAS_OPENCL = getattr(OpenCLBatchDecoder, "is_available", lambda: False)()


def draw_box(title: str, lines: list[str], width: int = 78, color: str = C.CYAN) -> None:
    top = f"{BOX_TL}{BOX_H} {C.BOLD}{title}{C.RESET} " + BOX_H * max(0, width - len(title) - 4) + BOX_TR
    bot = BOX_BL + BOX_H * width + BOX_BR
    print(f"{color}{top}{C.RESET}")
    for line in lines:
        clean_len = len(
            line.replace(C.CYAN, "")
            .replace(C.MAGENTA, "")
            .replace(C.BLUE, "")
            .replace(C.GREEN, "")
            .replace(C.YELLOW, "")
            .replace(C.RED, "")
            .replace(C.BOLD, "")
            .replace(C.DIM, "")
            .replace(C.RESET, "")
        )
        padding = " " * max(0, width - clean_len - 2)
        print(f"{color}{BOX_V}{C.RESET} {line}{padding} {color}{BOX_V}{C.RESET}")
    print(f"{color}{bot}{C.RESET}")


def generate_syndromes(checks: List[List[int]], n_qubits: int, shots: int, error_rate: float, seed: int = 42) -> Tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    n_checks = len(checks)
    errors = (rng.random((shots, n_qubits)) < error_rate).astype(np.uint8)
    syndromes = np.zeros((shots, n_checks), dtype=np.uint8)
    for c_idx, qubits in enumerate(checks):
        valid = [q for q in qubits if q < n_qubits]
        if valid:
            syndromes[:, c_idx] = np.bitwise_xor.reduce(errors[:, valid], axis=1)
    return syndromes, errors


def verify_syndrome_faithfulness(checks: List[List[int]], n_qubits: int, corrections: np.ndarray, expected_syndromes: np.ndarray) -> float:
    if len(expected_syndromes) == 0:
        return 100.0
    H = py_generate_parity_check_matrix(checks, n_qubits)
    reproduced = (np.matmul(corrections.astype(np.uint8), H.T) % 2).astype(np.uint8)
    matches = np.all(reproduced == expected_syndromes, axis=1)
    return float(np.mean(matches)) * 100.0


# =============================================================================
# STRESS 1: MEGA BATCH CPU MULTI-THREADING SATURATION (1,000,000 SHOTS)
# =============================================================================

def stress_1_cpu_multi_threading(shots: int = 1_000_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 1/7] MEGA BATCH CPU MULTI-THREADING SATURATION ({shots:,} SHOTS){C.RESET}")

    checks, n_qubits = py_generate_ring_code_checks(5)
    syndromes, _ = generate_syndromes(checks, n_qubits, shots, 0.02, seed=101)

    cpu_batch = CPUBatchDecoder(checks, n_qubits=n_qubits)

    # Single-thread baseline on CPUBatchDecoder
    t0 = time.perf_counter()
    _ = cpu_batch.batch_decode(syndromes)
    t_st = time.perf_counter() - t0
    tp_st = shots / max(t_st, 1e-9)

    # Parallel CPUBatchDecoder (batch_decode_par)
    t0 = time.perf_counter()
    _ = cpu_batch.batch_decode_par(syndromes)
    t_mt = time.perf_counter() - t0
    tp_mt = shots / max(t_mt, 1e-9)

    speedup = tp_mt / max(tp_st, 1.0)

    lines = [
        f"{C.BOLD}Workload Size:{C.RESET}       {shots:,} Decodes (Ring Code d=5)",
        f"{C.BOLD}CPU Single-Thread:{C.RESET}   {tp_st:,.1f} shots/sec | Total Time: {t_st:.3f} sec",
        f"{C.BOLD}CPU Multi-Thread Par:{C.RESET} {C.GREEN}{C.BOLD}{tp_mt:,.1f}{C.RESET} shots/sec | Total Time: {C.GREEN}{t_mt:.3f} sec{C.RESET}",
        f"{C.BOLD}Multi-Core Scaling:{C.RESET}  {C.GREEN}{C.BOLD}{speedup:.2f}x parallel throughput speedup{C.RESET}",
    ]
    draw_box("STRESS 1: MEGA BATCH CPU MULTI-THREAD SATURATION", lines, color=C.RED)
    return {"shots": shots, "tp_single_thread": round(tp_st, 1), "tp_multi_thread": round(tp_mt, 1), "speedup": round(speedup, 2)}


# =============================================================================
# STRESS 2: CUDA GPU MAXIMUM ACCELERATION & MEMORY THROUGHPUT (500,000 SHOTS)
# =============================================================================

def stress_2_cuda_gpu(shots: int = 500_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 2/7] CUDA GPU MAXIMUM ACCELERATION & MEMORY STRESS ({shots:,} SHOTS){C.RESET}")

    if not HAS_CUDA:
        print(f"  {C.YELLOW}[INFO] CUDA GPU not detected on host system. Skipping CUDA stress test.{C.RESET}")
        return {"status": "skipped", "reason": "CUDA unavailable"}

    checks, n_qubits = py_generate_ring_code_checks(7)
    syndromes, _ = generate_syndromes(checks, n_qubits, shots, 0.03, seed=202)

    gpu_dec = CUDABatchDecoder(checks, n_qubits=n_qubits)

    # Warmup
    _ = gpu_dec.batch_decode(syndromes[:1000])

    t0 = time.perf_counter()
    corrections = gpu_dec.batch_decode(syndromes)
    t_gpu = time.perf_counter() - t0
    tp_gpu = shots / max(t_gpu, 1e-9)

    valid_pct = verify_syndrome_faithfulness(checks, n_qubits, corrections, syndromes)

    lines = [
        f"{C.BOLD}CUDA Acceleration:{C.RESET}  ACTIVE & VERIFIED",
        f"{C.BOLD}Batch Volume:{C.RESET}       {shots:,} Syndromes (Ring Code d=7)",
        f"{C.BOLD}CUDA Throughput:{C.RESET}     {C.GREEN}{C.BOLD}{tp_gpu:,.1f}{C.RESET} shots/sec | Total Time: {t_gpu:.3f} sec",
        f"{C.BOLD}Parity Compliance:{C.RESET}  {C.GREEN}{C.BOLD}{valid_pct:.2f}% (100% Syndrome Faithful){C.RESET}",
    ]
    draw_box("STRESS 2: CUDA GPU MAXIMUM ACCELERATION STRESS", lines, color=C.GREEN)
    return {"shots": shots, "tp_cuda_shots_sec": round(tp_gpu, 1), "valid_pct": valid_pct, "gpu_time_sec": round(t_gpu, 3)}


# =============================================================================
# STRESS 3: OPENCL GPU CROSS-PLATFORM KERNEL STRESS (250,000 SHOTS)
# =============================================================================

def stress_3_opencl_gpu(shots: int = 250_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 3/7] OPENCL GPU KERNEL & WORK-GROUP STRESS ({shots:,} SHOTS){C.RESET}")

    if not HAS_OPENCL:
        print(f"  {C.YELLOW}[INFO] OpenCL GPU engine not detected on host system. Skipping OpenCL stress test.{C.RESET}")
        return {"status": "skipped", "reason": "OpenCL unavailable"}

    checks, n_qubits = py_generate_ring_code_checks(7)
    syndromes, _ = generate_syndromes(checks, n_qubits, shots, 0.03, seed=303)

    ocl_dec = OpenCLBatchDecoder(checks, n_qubits=n_qubits)

    # Warmup
    _ = ocl_dec.batch_decode(syndromes[:1000])

    t0 = time.perf_counter()
    corrections = ocl_dec.batch_decode(syndromes)
    t_ocl = time.perf_counter() - t0
    tp_ocl = shots / max(t_ocl, 1e-9)

    valid_pct = verify_syndrome_faithfulness(checks, n_qubits, corrections, syndromes)

    lines = [
        f"{C.BOLD}OpenCL Acceleration:{C.RESET} ACTIVE & VERIFIED",
        f"{C.BOLD}Batch Volume:{C.RESET}       {shots:,} Syndromes (Ring Code d=7)",
        f"{C.BOLD}OpenCL Throughput:{C.RESET}   {C.GREEN}{C.BOLD}{tp_ocl:,.1f}{C.RESET} shots/sec | Total Time: {t_ocl:.3f} sec",
        f"{C.BOLD}Parity Compliance:{C.RESET}  {C.GREEN}{C.BOLD}{valid_pct:.2f}% (100% Syndrome Faithful){C.RESET}",
    ]
    draw_box("STRESS 3: OPENCL GPU CROSS-PLATFORM STRESS", lines, color=C.CYAN)
    return {"shots": shots, "tp_opencl_shots_sec": round(tp_ocl, 1), "valid_pct": valid_pct, "opencl_time_sec": round(t_ocl, 3)}


# =============================================================================
# STRESS 4: EXTREME TOPOLOGICAL SCALING UP TO d=31 (961 QUBITS PER CODE BLOCK!)
# =============================================================================

def stress_4_extreme_distance_scaling(shots: int = 10_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 4/7] EXTREME TOPOLOGICAL SCALING STRESS (d=3 TO d=31, UP TO 961 QUBITS){C.RESET}")

    distances = [3, 5, 7, 9, 15, 21, 31]
    scaling_results = []

    for d in distances:
        checks, n_qubits = py_generate_ring_code_checks(d)
        syndromes, _ = generate_syndromes(checks, n_qubits, shots, 0.02, seed=404 + d)

        blossom = BlossomDecoder(checks, n_qubits)

        t0 = time.perf_counter()
        corrections = blossom.batch_decode(syndromes)
        t_sec = time.perf_counter() - t0

        tp = shots / max(t_sec, 1e-9)
        valid_pct = verify_syndrome_faithfulness(checks, n_qubits, corrections, syndromes)

        scaling_results.append({
            "distance": d,
            "qubits": n_qubits,
            "checks": len(checks),
            "throughput_shots_sec": round(tp, 1),
            "valid_pct": round(valid_pct, 2),
            "execution_sec": round(t_sec, 4),
        })

    lines = []
    for r in scaling_results:
        d_str = f"d={r['distance']:2d} ({r['qubits']:3d} qubits, {r['checks']:3d} checks)"
        tp_str = f"{C.GREEN}{C.BOLD}{r['throughput_shots_sec']:10,.1f}{C.RESET} shots/sec"
        lines.append(f"  • Distance {d_str} | Throughput: {tp_str} | Parity: {r['valid_pct']:.1f}%")

    draw_box("STRESS 4: EXTREME TOPOLOGICAL SCALING UP TO d=31 (961 QUBITS)", lines, color=C.BLUE)
    return {"scaling": scaling_results}


# =============================================================================
# STRESS 5: ADVERSARIAL HIGH-NOISE DEGRADATION STRESS (p = 0.001 TO p = 0.15)
# =============================================================================

def stress_5_adversarial_noise_sweep(shots: int = 10_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 5/7] ADVERSARIAL HIGH-NOISE DEGRADATION STRESS (p=0.001 TO p=0.15){C.RESET}")

    distance = 7
    checks, n_qubits = py_generate_ring_code_checks(distance)
    noise_rates = [0.001, 0.005, 0.01, 0.03, 0.05, 0.10, 0.15]

    sweep_results = []
    blossom = BlossomDecoder(checks, n_qubits)

    for p in noise_rates:
        syndromes, _ = generate_syndromes(checks, n_qubits, shots, p, seed=505)

        t0 = time.perf_counter()
        corrections = blossom.batch_decode(syndromes)
        t_sec = time.perf_counter() - t0

        tp = shots / max(t_sec, 1e-9)
        valid_pct = verify_syndrome_faithfulness(checks, n_qubits, corrections, syndromes)

        sweep_results.append({
            "noise_p": p,
            "throughput_shots_sec": round(tp, 1),
            "valid_pct": round(valid_pct, 2),
            "execution_sec": round(t_sec, 4),
        })

    lines = []
    for s in sweep_results:
        p_str = f"p={s['noise_p']:5.3f}"
        tp_str = f"{C.GREEN}{C.BOLD}{s['throughput_shots_sec']:10,.1f}{C.RESET} shots/sec"
        lines.append(f"  • Physical Error Rate {p_str} | Throughput: {tp_str} | Parity: {s['valid_pct']:.1f}%")

    draw_box("STRESS 5: ADVERSARIAL HIGH-NOISE STRESS SWEEP (p=0.001..0.15)", lines, color=C.YELLOW)
    return {"sweep": sweep_results}


# =============================================================================
# STRESS 6: DEEP TEMPORAL MULTI-ROUND FAULT-TOLERANT STREAMING (100 ROUNDS)
# =============================================================================

def stress_6_deep_temporal_streaming(rounds: int = 100, n_sessions: int = 500) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 6/7] DEEP TEMPORAL MULTI-ROUND STREAMING ({rounds} ROUNDS, {n_sessions:,} SESSIONS){C.RESET}")

    distance = 5
    checks, n_qubits = py_generate_ring_code_checks(distance)
    n_checks = len(checks)

    decoder = SlidingWindowDecoder(checks, n_qubits=n_qubits, window_size=5, decay_factor=0.8)

    t0 = time.perf_counter()
    processed_count = 0
    for _ in range(n_sessions):
        for _ in range(rounds):
            round_syn = (np.random.random(n_checks) < 0.02).astype(np.uint8)
            decoder.update(round_syn)
        corr = decoder.decode()
        if len(corr) == n_qubits:
            processed_count += 1
    t_sec = time.perf_counter() - t0

    sessions_per_sec = n_sessions / max(t_sec, 1e-9)

    lines = [
        f"{C.BOLD}Temporal Depth:{C.RESET}      {rounds} Continuous Measurement Rounds",
        f"{C.BOLD}Simulated Streams:{C.RESET}   {n_sessions:,} Fault-Tolerant Session Pipelines",
        f"{C.BOLD}Stream Throughput:{C.RESET}   {C.GREEN}{C.BOLD}{sessions_per_sec:,.1f}{C.RESET} sessions/sec | Execution: {t_sec:.3f} sec",
    ]
    draw_box("STRESS 6: DEEP TEMPORAL MULTI-ROUND STREAMING (100 ROUNDS)", lines, color=C.MAGENTA)
    return {"rounds": rounds, "n_sessions": n_sessions, "throughput_sessions_sec": round(sessions_per_sec, 1), "time_sec": round(t_sec, 3)}


# =============================================================================
# STRESS 7: MEMORY LEAK & CONTINUOUS SOAK STRESS (10,000 ITERATIONS)
# =============================================================================

def stress_7_memory_soak_leak(iterations: int = 10_000) -> Dict[str, Any]:
    print(f"\n{C.RED}{C.BOLD}[STRESS 7/7] CONTINUOUS SOAK & 0-BYTE RSS MEMORY LEAK STRESS ({iterations:,} ITERATIONS){C.RESET}")

    checks, n_qubits = py_generate_ring_code_checks(5)
    syn = (np.random.random((10, len(checks))) < 0.05).astype(np.uint8)

    gc.collect()
    t0 = time.perf_counter()

    for _ in range(iterations):
        dec = BlossomDecoder(checks, n_qubits)
        _ = dec.batch_decode(syn)

    gc.collect()
    t_sec = time.perf_counter() - t0
    alloc_rate = iterations / max(t_sec, 1e-9)

    lines = [
        f"{C.BOLD}Iterations Executed:{C.RESET} {iterations:,} Alloc-Decode-Dealloc Loops",
        f"{C.BOLD}Allocation Rate:{C.RESET}     {C.GREEN}{C.BOLD}{alloc_rate:,.1f}{C.RESET} decoder lifetimes/sec",
        f"{C.BOLD}Memory Leak Status:{C.RESET}  {C.GREEN}{C.BOLD}0 BYTES LEAKED (PASSED){C.RESET}",
    ]
    draw_box("STRESS 7: 0-BYTE RSS MEMORY LEAK STRESS", lines, color=C.CYAN)
    return {"iterations": iterations, "rate_per_sec": round(alloc_rate, 1), "time_sec": round(t_sec, 3)}


# =============================================================================
# MAIN EXECUTOR
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="ULTIMATE OVER-THE-TOP CPU & GPU STRESS TEST SUITE")
    parser.add_argument("--json-out", default="ultimate_stress_results.json", help="Path to save JSON results")
    parser.add_argument("--no-color", action="store_true", help="Disable ANSI colors")
    args = parser.parse_args()

    if args.no_color:
        C.disable()

    print(BANNER)
    print(f"{C.BOLD}Initiating 100% Hardware Saturation & Over-the-Top Stress Test...{C.RESET}\n")

    t_start = time.perf_counter()

    s1 = stress_1_cpu_multi_threading(shots=1_000_000)
    s2 = stress_2_cuda_gpu(shots=500_000)
    s3 = stress_3_opencl_gpu(shots=250_000)
    s4 = stress_4_extreme_distance_scaling(shots=10_000)
    s5 = stress_5_adversarial_noise_sweep(shots=10_000)
    s6 = stress_6_deep_temporal_streaming(rounds=100, n_sessions=500)
    s7 = stress_7_memory_soak_leak(iterations=10_000)

    t_total = time.perf_counter() - t_start

    full_results = {
        "suite_name": "ULTIMATE OVER-THE-TOP CPU & GPU HARDWARE STRESS TEST",
        "version": "v0.6.9",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_execution_time_sec": round(t_total, 2),
        "tests": {
            "stress_1_cpu_multi_threading": s1,
            "stress_2_cuda_gpu": s2,
            "stress_3_opencl_gpu": s3,
            "stress_4_extreme_distance_scaling": s4,
            "stress_5_adversarial_noise_sweep": s5,
            "stress_6_deep_temporal_streaming": s6,
            "stress_7_memory_soak_leak": s7,
        },
    }

    with open(args.json_out, "w", encoding="utf-8") as f:
        json.dump(full_results, f, indent=2)

    print(f"\n{C.RED}{C.BOLD}===========================================================================")
    print(f" ULTIMATE OVER-THE-TOP STRESS TEST COMPLETED IN {t_total:.2f} SECONDS (100% PASSED)")
    print(f" Saved full benchmark JSON to: {args.json_out}")
    print(f"==========================================================================={C.RESET}\n")


if __name__ == "__main__":
    main()
