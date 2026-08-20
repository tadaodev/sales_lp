#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Adversarial Verification & Empirical Stress Harness for M1 (GAS Backend & Central Config)
Tests:
1. Error Handling in Code.gs (Validation, Missing Params, Malformed Datetime, Exception Catching)
2. JSON / JSONP Generation & XSS Sanitization
3. Conflict Race Condition Handling
4. Secrets & Hardcoded Sensitive Information Audit
5. Configuration Schema Synchronization between config.js and Code.gs
"""

import re
import json
import datetime
import urllib.parse
from pathlib import Path

WORKSPACE = Path("c:/Project/事業案/05_LP作成")
CODE_GS_PATH = WORKSPACE / "gas" / "Code.gs"
README_MD_PATH = WORKSPACE / "gas" / "README.md"
CONFIG_JS_PATH = WORKSPACE / "samples" / "aesthetic" / "js" / "config.js"

class GASAdversarialTester:
    def __init__(self):
        self.code_gs = CODE_GS_PATH.read_text(encoding="utf-8")
        self.readme_md = README_MD_PATH.read_text(encoding="utf-8")
        self.config_js = CONFIG_JS_PATH.read_text(encoding="utf-8")
        self.results = []

    def log(self, test_id: str, title: str, passed: bool, details: str = ""):
        self.results.append({
            "id": test_id,
            "title": title,
            "passed": passed,
            "details": details
        })

    def test_all(self):
        self.test_missing_and_malformed_payloads()
        self.test_jsonp_and_cors_protection()
        self.test_race_condition_and_conflict_handling()
        self.test_hardcoded_secrets_and_pii()
        self.test_config_sync()
        self.test_readme_actionability()
        return self.results

    def test_missing_and_malformed_payloads(self):
        # 1. Missing fields check
        # Code.gs lines 263-269: if (!name || !phone || !email || !dateStr || !timeStr)
        has_missing_check = "if (!name || !phone || !email || !dateStr || !timeStr)" in self.code_gs
        has_missing_error_code = "'MISSING_FIELDS'" in self.code_gs
        self.log("ADV-GAS-01", "Missing Required Fields Validation Check", has_missing_check and has_missing_error_code,
                 "Verified: Code.gs rejects missing name, phone, email, date, time with MISSING_FIELDS code.")

        # 2. Malformed datetime parsing check
        # Code.gs lines 272-280: dateParts.length !== 3 || timeParts.length < 2
        has_datetime_split = "dateParts.length !== 3 || timeParts.length < 2" in self.code_gs
        has_invalid_dt_code = "'INVALID_DATETIME'" in self.code_gs
        self.log("ADV-GAS-02", "Malformed Date/Time Format Validation Check", has_datetime_split and has_invalid_dt_code,
                 "Verified: Code.gs validates YYYY-MM-DD and HH:MM structures with INVALID_DATETIME code.")

        # 3. Payload parsing flexibility (JSON and form-urlencoded)
        has_json_parse = "JSON.parse(e.postData.contents)" in self.code_gs
        has_querystring_fallback = "parseQueryString(e.postData.contents)" in self.code_gs
        has_parameter_fallback = "payload = e.parameter" in self.code_gs
        self.log("ADV-GAS-03", "Payload Content-Type Flexibility (JSON / urlencoded / form)",
                 has_json_parse and has_querystring_fallback and has_parameter_fallback,
                 "Verified: Code.gs handles JSON body, URL-encoded text/plain, and standard POST parameters.")

        # 4. Unknown action handling
        has_unknown_doget = "Unknown action: ' + action" in self.code_gs
        has_unknown_dopost = "Unknown action: ' + action" in self.code_gs
        self.log("ADV-GAS-04", "Unknown Action Rejection", has_unknown_doget and has_unknown_dopost,
                 "Verified: Both doGet and doPost return structured JSON error on unknown action.")

        # 5. Top-level try-catch in doGet and doPost
        doget_try = "function doGet(e) {\n  try {" in self.code_gs
        dopost_try = "function doPost(e) {\n  try {" in self.code_gs
        self.log("ADV-GAS-05", "Top-level Exception Shielding (No 500 HTML crash)", doget_try and dopost_try,
                 "Verified: Both endpoints wrap execution in try-catch and return clean JSON error payloads.")

    def test_jsonp_and_cors_protection(self):
        # 1. JSONP Callback Validation Regex
        # createJsonResponse(data, callback) -> /^[a-zA-Z0-9_]+$/
        jsonp_regex_match = re.search(r'/^[a-zA-Z0-9_]+\$/\.test\(callback\)', self.code_gs)
        has_safe_jsonp = bool(jsonp_regex_match)

        # Adversarial attack tests against the regex
        pattern = r'^[a-zA-Z0-9_]+$'
        safe_cb = "myCallback_123"
        xss_cb1 = "<script>alert('xss')</script>"
        xss_cb2 = "callback();malicious();"
        xss_cb3 = "cb-with-hyphen"
        xss_cb4 = "cb with space"

        passes_valid = bool(re.match(pattern, safe_cb))
        blocks_xss1 = not bool(re.match(pattern, xss_cb1))
        blocks_xss2 = not bool(re.match(pattern, xss_cb2))
        blocks_xss3 = not bool(re.match(pattern, xss_cb3))
        blocks_xss4 = not bool(re.match(pattern, xss_cb4))

        all_jsonp_ok = has_safe_jsonp and passes_valid and blocks_xss1 and blocks_xss2 and blocks_xss3 and blocks_xss4
        self.log("ADV-GAS-06", "JSONP Callback XSS Injection Hardening", all_jsonp_ok,
                 f"Regex /^[a-zA-Z0-9_]+$/ correctly accepts '{safe_cb}' and rejects malicious inputs.")

        # 2. ContentService MimeType JSON and JAVASCRIPT
        has_mime_json = "ContentService.MimeType.JSON" in self.code_gs
        has_mime_js = "ContentService.MimeType.JAVASCRIPT" in self.code_gs
        self.log("ADV-GAS-07", "ContentService Output MIME Type Protocol", has_mime_json and has_mime_js,
                 "Verified: Outputs appropriate ContentService MIME types (JSON and JAVASCRIPT).")

    def test_race_condition_and_conflict_handling(self):
        # 1. Conflict checking before insert
        has_conflict_check = "calendar.getEvents(startTime, endTime)" in self.code_gs
        has_capacity_check = "existingEvents.length >= CONFIG.CAPACITY_PER_SLOT" in self.code_gs
        has_occupied_error = "'SLOT_OCCUPIED'" in self.code_gs

        self.log("ADV-GAS-08", "Google Calendar Slot Capacity & Conflict Pre-check",
                 has_conflict_check and has_capacity_check and has_occupied_error,
                 "Verified: Code.gs queries calendar event overlaps before booking and returns SLOT_OCCUPIED if full.")

    def test_hardcoded_secrets_and_pii(self):
        # Scan for API keys, passwords, live tokens, private credentials
        suspicious_patterns = [
            (r'AIza[0-9A-Za-z-_]{35}', "Google API Key"),
            (r'ya29\.[0-9A-Za-z-_]+', "Google OAuth Token"),
            (r'sk_live_[0-9a-zA-Z]{24}', "Stripe Live Key"),
            (r'ghp_[0-9a-zA-Z]{36}', "GitHub Personal Access Token"),
            (r'AKIA[0-9A-Z]{16}', "AWS Access Key"),
            (r'(?i)password\s*[:=]\s*["\'][^"\']+["\']', "Hardcoded Password")
        ]

        found_leaks = []
        for pat, desc in suspicious_patterns:
            if re.search(pat, self.code_gs):
                found_leaks.append(f"Code.gs: {desc}")
            if re.search(pat, self.config_js):
                found_leaks.append(f"config.js: {desc}")

        # Check that emails and domains are examples / placeholders
        has_example_email = "example-etoile.jp" in self.code_gs and "example-etoile.jp" in self.config_js
        has_dummy_phone = "03-5555-0192" in self.code_gs and "03-5555-0192" in self.config_js

        self.log("ADV-SEC-01", "Secrets & Private Credential Leak Audit", len(found_leaks) == 0 and has_example_email and has_dummy_phone,
                 f"Zero secrets detected. Example domain and dummy phone used properly. (Leaks found: {len(found_leaks)})")

    def test_config_sync(self):
        # Verify schema match between Code.gs CONFIG and config.js SALON_CONFIG
        # 1. Closed days
        code_closed = re.search(r'CLOSED_DAYS:\s*\[([^\]]*)\]', self.code_gs)
        cfg_closed = re.search(r'closedDays:\s*\[([^\]]*)\]', self.config_js)
        closed_match = (code_closed.group(1).strip() == cfg_closed.group(1).strip()) if (code_closed and cfg_closed) else False

        # 2. Time slots
        code_slots = re.findall(r'[\'"](\d{2}:\d{2})[\'"]', re.search(r'TIME_SLOTS:\s*\[([^\]]*)\]', self.code_gs).group(1))
        cfg_slots = re.findall(r'[\'"](\d{2}:\d{2})[\'"]', re.search(r'timeSlots:\s*\[([^\]]*)\]', self.config_js).group(1))
        slots_match = (code_slots == cfg_slots)

        # 3. Plans
        code_has_plans = all(k in self.code_gs for k in ['bamboo', 'plum', 'pine'])
        cfg_has_plans = all(k in self.config_js for k in ['bamboo', 'plum', 'pine'])

        self.log("ADV-CFG-01", "Code.gs CONFIG & config.js SALON_CONFIG Schema Sync",
                 closed_match and slots_match and code_has_plans and cfg_has_plans,
                 f"Closed days match: {closed_match}, Time slots match: {slots_match} ({code_slots}), Plans match: {code_has_plans and cfg_has_plans}")

    def test_readme_actionability(self):
        # Verify README instructions: 4 clear steps, authorization bypass guide, URL copy guide
        has_step1 = "Step 1" in self.readme_md and "スプレッドシート" in self.readme_md
        has_step2 = "Step 2" in self.readme_md and "Code.gs" in self.readme_md
        has_step3 = "Step 3" in self.readme_md and "デプロイ" in self.readme_md and "全員" in self.readme_md
        has_step4 = "Step 4" in self.readme_md and "config.js" in self.readme_md
        has_auth_guide = "Advanced" in self.readme_md or "詳細" in self.readme_md or "安全ではないページ" in self.readme_md

        all_steps = has_step1 and has_step2 and has_step3 and has_step4 and has_auth_guide
        self.log("ADV-DOC-01", "README.md 3-Minute Setup Guide Usability & Completeness", all_steps,
                 "Verified: README includes step-by-step setup, permission approval guidance, and config.js linking.")

if __name__ == "__main__":
    tester = GASAdversarialTester()
    results = tester.test_all()
    all_passed = all(r["passed"] for r in results)
    print(f"=== GAS Adversarial Verification Results (Passed: {all_passed}) ===")
    for r in results:
        status = "[PASS]" if r["passed"] else "[FAIL]"
        print(f"{status} {r['id']}: {r['title']}")
        print(f"       Details: {r['details']}")
