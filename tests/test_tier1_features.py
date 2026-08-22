#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_tier1_features.py
Tier 1 Feature Coverage Test Runner (85 Automated Tests across 5 Flagship LPs).

Covers:
- Aesthetic Salon LP: F1-F10 (Calendar, Slots, Tap, GAS, Config, Thank-You, .ics, LINE, Fallback, Responsive - 50 tests)
- Legal Consulting LP: Calendar, Slots, 2WAY mode, Config, Thank-You, .ics, LINE, Images, Navigation (10 tests)
- Italian Restaurant LP: Config, Calendar, Thank-You, LINE, Navigation (5 tests)
- Hard Bakery LP: Calendar, Slots, Timetable, Config, Thank-You, .ics, LINE, Images, Navigation (10 tests)
- Washoku Izakaya LP: Calendar, Slots, Guarantees/Party, Config, Thank-You, .ics, LINE, Images, Navigation (10 tests)

Exit Code: 0 = PASS, 1 = FAIL
"""

import sys
import time
from pathlib import Path

# Ensure tests directory is in sys.path
TESTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TESTS_DIR.parent
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

# Set UTF-8 output encoding for Windows compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from run_all_tests import MasterTestRunner


def run_tier1_suite() -> bool:
    runner = MasterTestRunner(PROJECT_ROOT)
    start_time = time.time()

    print("\n" + "#" * 70)
    print(" [Tier 1] Feature Coverage Automated Test Suite")
    print(" 5 Flagship LPs: Aesthetic, Legal, Italian, Bakery, Washoku (85 Test Cases)")
    print("#" * 70)

    runner.run_tier_1_feature_coverage()
    duration = time.time() - start_time

    tier1_results = [r for r in runner.results if r.tier == "Tier 1"]
    total = len(tier1_results)
    passed_count = sum(1 for r in tier1_results if r.passed)
    failed_count = total - passed_count

    print("\n" + "=" * 70)
    print(" [Tier 1] 実行結果サマリー (Execution Summary)")
    print("=" * 70)
    print(f" 実行時間: {duration:.2f} 秒")
    print(f" 総テスト数: {total} 件")
    print(f" 成功    : {passed_count} 件")
    print(f" 失敗    : {failed_count} 件")

    if failed_count == 0:
        print(f"\n [PASS] 全 {total} 件の Tier 1 基本機能テストが 100% 合格しました！")
        return True
    else:
        print(f"\n [FAIL] {failed_count} 件のテストが失敗しました。")
        for r in tier1_results:
            if not r.passed:
                print(f"  - {r.test_id}: {r.title} -> {r.message}")
        return False


if __name__ == "__main__":
    success = run_tier1_suite()
    sys.exit(0 if success else 1)
