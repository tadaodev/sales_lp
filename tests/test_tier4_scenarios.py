#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_tier4_scenarios.py
Tier 4 Real-World Application Persona Scenarios Test Runner (10 Comprehensive Journeys).

Covers:
- TC-APP-01: Busy Office Worker Mobile Booking (Aesthetic Friday 18:30 Bamboo -> .ics -> LINE)
- TC-APP-02: Weekend Bride Luxury Plan Booking (Aesthetic Saturday 10:00 Pine -> Bridal notes -> GCal)
- TC-APP-03: Salon Owner Zero-Cost Setup & GAS Live Integration (gas/Code.gs, README.md, config.js)
- TC-APP-04: Offline / Subway Intermittent Network Fallback Booking
- TC-APP-05: Multi-Device Auditor & Subdirectory Production Deployment (/lp-portal-hub/ HTTP 200)
- TC-APP-06: Startup CEO Mobile 375px Urgent Zoom Contract Review (Legal Zoom -> 15:30 -> GCal -> LINE)
- TC-APP-07: HR Director In-Person Labor Dispute Consultation (Legal Marunouchi -> 10:00 Pine -> .ics)
- TC-APP-08: Bakery Morning Artisan Lover (Bakery Jiyugaoka -> 08:00 Pine Assortment BOX -> 30m .ics -> LINE)
- TC-APP-09: Izakaya Banquet Organizer 20-Person Group Booking (Washoku Shinbashi -> 18:30 Bamboo -> 120m .ics -> LINE)
- TC-APP-10: LP Portal 5-Flagship Explorer & Responsive Category Filter Loop (All(9) / Dining(3) -> 5 flagships)

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


def run_tier4_suite() -> bool:
    runner = MasterTestRunner(PROJECT_ROOT)
    start_time = time.time()

    print("\n" + "#" * 70)
    print(" [Tier 4] Real-World Application Persona Scenarios Test Suite")
    print(" 10 End-to-End Persona Journeys across 5 Flagships & Portal Hub")
    print("#" * 70)

    runner.run_tier_4_real_world_scenarios()
    duration = time.time() - start_time

    tier4_results = [r for r in runner.results if r.tier == "Tier 4"]
    total = len(tier4_results)
    passed_count = sum(1 for r in tier4_results if r.passed)
    failed_count = total - passed_count

    print("\n" + "=" * 70)
    print(" [Tier 4] 実行結果サマリー (Execution Summary)")
    print("=" * 70)
    print(f" 実行時間: {duration:.2f} 秒")
    print(f" 総テスト数: {total} 件")
    print(f" 成功    : {passed_count} 件")
    print(f" 失敗    : {failed_count} 件")

    if failed_count == 0:
        print(f"\n [PASS] 全 {total} 件の Tier 4 実世界ユーザーシナリオテストが 100% 合格しました！")
        return True
    else:
        print(f"\n [FAIL] {failed_count} 件のテストが失敗しました。")
        for r in tier4_results:
            if not r.passed:
                print(f"  - {r.test_id}: {r.title} -> {r.message}")
        return False


if __name__ == "__main__":
    success = run_tier4_suite()
    sys.exit(0 if success else 1)
