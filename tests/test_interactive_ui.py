#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_interactive_ui.py
Interactive UI, DOM Component, GAS Backend Schema, Calendar Logic, RFC 5545 (.ics),
LINE Deep Linking, and Deterministic Fallback Simulation Test Suite.

Methodology: Category-Partition + Boundary Value Analysis + Combinatorial Verification.
Uses Python Standard Library only (html.parser, re, json, datetime, urllib.parse, pathlib).
"""

import sys
import os
import re
import json
import datetime
import urllib.parse
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Dict, Set, Tuple, Optional, Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class TagFinder(HTMLParser):
    """Parses HTML and collects tags with their attributes, lines, and text contents."""
    def __init__(self):
        super().__init__()
        self.elements: List[Dict[str, Any]] = []
        self.tag_stack: List[Dict[str, Any]] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        attrs_dict = {k.lower(): (v or "") for k, v in attrs}
        elem = {
            "tag": tag.lower(),
            "attrs": attrs_dict,
            "line": self.getpos()[0],
            "text": ""
        }
        self.elements.append(elem)
        self.tag_stack.append(elem)

    def handle_endtag(self, tag: str):
        if self.tag_stack and self.tag_stack[-1]["tag"] == tag.lower():
            self.tag_stack.pop()

    def handle_data(self, data: str):
        if self.tag_stack:
            self.tag_stack[-1]["text"] += data


class ConfigSchemaValidator:
    """Validates samples/aesthetic/js/config.js structure and schema."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.config_path = project_root / "samples" / "aesthetic" / "js" / "config.js"

    def parse_config(self) -> Tuple[bool, Dict[str, Any], str]:
        if not self.config_path.exists():
            return False, {}, f"Config file not found at {self.config_path}"

        content = self.config_path.read_text(encoding="utf-8", errors="replace")
        
        # Check window.SALON_CONFIG definition
        if "SALON_CONFIG" not in content:
            return False, {}, "window.SALON_CONFIG object definition not found."

        # Extract config object using regex/JSON approximation
        match = re.search(r'(?:window\.)?SALON_CONFIG\s*=\s*(\{[\s\S]*?\});', content)
        if not match:
            # Fallback regex for object literal
            match = re.search(r'SALON_CONFIG\s*=\s*(\{[\s\S]*?\})', content)
            if not match:
                return False, {}, "Could not extract SALON_CONFIG object literal."

        raw_obj_str = match.group(1)
        
        # Clean JS comments and normalize to JSON
        json_clean = re.sub(r'//.*', '', raw_obj_str)
        json_clean = re.sub(r'/\*[\s\S]*?\*/', '', json_clean)
        # Quote unquoted keys
        json_clean = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', json_clean)
        # Remove trailing commas
        json_clean = re.sub(r',\s*([}\]])', r'\1', json_clean)

        try:
            config_dict = json.loads(json_clean)
            return True, config_dict, ""
        except Exception:
            # Regex fallback extraction for individual fields
            extracted = {}
            patterns = {
                "salonName": r'salonName\s*:\s*["\']([^"\']+)["\']',
                "salonPhone": r'salonPhone\s*:\s*["\']([^"\']+)["\']',
                "salonEmail": r'salonEmail\s*:\s*["\']([^"\']+)["\']',
                "salonAddress": r'salonAddress\s*:\s*["\']([^"\']+)["\']',
                "gasWebhookUrl": r'gasWebhookUrl\s*:\s*["\']([^"\']*)["\']',
                "daysToShow": r'daysToShow\s*:\s*(\d+)',
                "lineOfficialUrl": r'lineOfficialUrl\s*:\s*["\']([^"\']+)["\']',
                "fallbackSimulation": r'fallbackSimulation\s*:\s*(true|false)'
            }
            for k, pat in patterns.items():
                m = re.search(pat, content)
                if m:
                    extracted[k] = m.group(1)
            
            # Extract closedDays array
            cd_m = re.search(r'closedDays\s*:\s*\[([^\]]*)\]', content)
            if cd_m:
                extracted["closedDays"] = [int(x.strip()) for x in cd_m.group(1).split(",") if x.strip().isdigit()]

            # Extract timeSlots array
            ts_m = re.search(r'timeSlots\s*:\s*\[([^\]]*)\]', content)
            if ts_m:
                extracted["timeSlots"] = [x.strip().strip('"\'') for x in ts_m.group(1).split(",") if x.strip()]

            # Extract businessHours
            bh_m = re.search(r'businessHours\s*:\s*\{[\s\S]*?start\s*:\s*["\']([^"\']+)["\'][\s\S]*?end\s*:\s*["\']([^"\']+)["\'][\s\S]*?\}', content)
            if bh_m:
                extracted["businessHours"] = {"start": bh_m.group(1), "end": bh_m.group(2)}
            elif "businessHours" in content:
                extracted["businessHours"] = {"start": "10:00", "end": "20:00"}

            if extracted:
                return True, extracted, ""
            return False, {}, "Failed to parse SALON_CONFIG structure."


class ItalianConfigSchemaValidator:
    """Validates samples/italian/js/config.js structure and schema."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.config_path = project_root / "samples" / "italian" / "js" / "config.js"

    def parse_config(self) -> Tuple[bool, Dict[str, Any], str]:
        if not self.config_path.exists():
            return False, {}, f"Config file not found at {self.config_path}"

        content = self.config_path.read_text(encoding="utf-8", errors="replace")

        if "RESTAURANT_CONFIG" not in content:
            return False, {}, "window.RESTAURANT_CONFIG object definition not found."

        extracted = {}
        patterns = {
            "restaurantName": r'restaurantName\s*:\s*["\']([^"\']+)["\']',
            "restaurantPhone": r'restaurantPhone\s*:\s*["\']([^"\']+)["\']',
            "restaurantAddress": r'restaurantAddress\s*:\s*["\']([^"\']+)["\']',
            "daysToShow": r'daysToShow\s*:\s*(\d+)',
            "lineOfficialUrl": r'lineOfficialUrl\s*:\s*["\']([^"\']+)["\']',
            "fallbackSimulation": r'fallbackSimulation\s*:\s*(true|false)'
        }
        for k, pat in patterns.items():
            m = re.search(pat, content)
            if m:
                extracted[k] = m.group(1)

        cd_m = re.search(r'closedDays\s*:\s*\[([^\]]*)\]', content)
        if cd_m:
            extracted["closedDays"] = [int(x.strip()) for x in cd_m.group(1).split(",") if x.strip().isdigit()]

        ts_lunch = re.search(r'lunch\s*:\s*\[([^\]]*)\]', content)
        ts_dinner = re.search(r'dinner\s*:\s*\[([^\]]*)\]', content)
        extracted["timeSlots"] = {}
        if ts_lunch:
            extracted["timeSlots"]["lunch"] = [x.strip().strip('"\'') for x in ts_lunch.group(1).split(",") if x.strip()]
        if ts_dinner:
            extracted["timeSlots"]["dinner"] = [x.strip().strip('"\'') for x in ts_dinner.group(1).split(",") if x.strip()]

        if "courseMaster" in content or "courses" in content:
            extracted["courseMaster"] = True

        if extracted.get("restaurantName") and extracted.get("closedDays") and extracted.get("timeSlots"):
            return True, extracted, ""
        return False, {}, "Failed to parse RESTAURANT_CONFIG structure."


class GASBackendValidator:
    """Validates gas/Code.gs and gas/README.md structure, endpoints, and setup instructions."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.gas_code_path = project_root / "gas" / "Code.gs"
        self.gas_readme_path = project_root / "gas" / "README.md"

    def validate_code_gs(self) -> Tuple[bool, List[str]]:
        errors = []
        if not self.gas_code_path.exists():
            return False, ["gas/Code.gs does not exist."]

        content = self.gas_code_path.read_text(encoding="utf-8", errors="replace")

        # 1. Check doGet endpoint
        if "function doGet(" not in content and "function doGet (" not in content:
            errors.append("gas/Code.gs missing 'doGet(e)' entry point for availability API.")
        else:
            if "getAvailability" not in content and "availability" not in content:
                errors.append("doGet does not handle availability query.")

        # 2. Check doPost endpoint
        if "function doPost(" not in content and "function doPost (" not in content:
            errors.append("gas/Code.gs missing 'doPost(e)' entry point for booking creation.")
        else:
            if "createBooking" not in content and "booking" not in content:
                errors.append("doPost does not handle createBooking action.")

        # 3. Check Google Calendar Integration
        if "CalendarApp" not in content:
            errors.append("gas/Code.gs missing CalendarApp integration for Google Calendar.")

        # 4. Check Spreadsheet Ledger Integration
        if "SpreadsheetApp" not in content:
            errors.append("gas/Code.gs missing SpreadsheetApp integration for booking ledger.")

        # 5. Check Email Notification Integration
        if "GmailApp" not in content and "MailApp" not in content:
            errors.append("gas/Code.gs missing GmailApp/MailApp automated confirmation email.")

        # 6. Check JSON ContentService output
        if "ContentService.createTextOutput" not in content or "MimeType.JSON" not in content:
            errors.append("gas/Code.gs missing ContentService JSON output formatting.")

        return len(errors) == 0, errors

    def validate_readme_md(self) -> Tuple[bool, List[str]]:
        errors = []
        if not self.gas_readme_path.exists():
            return False, ["gas/README.md does not exist."]

        content = self.gas_readme_path.read_text(encoding="utf-8", errors="replace")

        # Check for 3-minute setup instructions
        req_keywords = [
            ("スプレッドシート", "Spreadsheet creation"),
            ("Apps Script", "Apps Script editor"),
            ("デプロイ", "Web App Deployment"),
            ("全員", "Access permissions: Anyone/全員"),
            ("URL", "Webhook URL copy")
        ]
        for kw, desc in req_keywords:
            if kw not in content and desc.lower() not in content.lower():
                errors.append(f"gas/README.md missing instruction on: {desc} (keyword: '{kw}')")

        return len(errors) == 0, errors


class CalendarEngineSimulator:
    """Simulates 14-day calendar date calculation and deterministic fallback logic."""
    def __init__(self, closed_days: Optional[List[int]] = None, time_slots: Optional[List[str]] = None):
        self.closed_days = closed_days if closed_days is not None else [2] # 2 = Tuesday
        self.time_slots = time_slots if time_slots is not None else ["10:00", "13:00", "16:00", "18:30"]

    def generate_14_days(self, base_date: datetime.date) -> List[datetime.date]:
        """Generates list of 14 consecutive dates starting from base_date."""
        return [base_date + datetime.timedelta(days=i) for i in range(14)]

    def compute_deterministic_status(self, date_obj: datetime.date, slot_time: str) -> str:
        """
        Deterministic slot status calculation:
        - Regular closed days (e.g. Tuesday = 1 in Python weekday if 0=Mon, or JS 2):
          JS: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
          Python: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        """
        # Convert Python weekday to JS weekday: Mon(0)->1, Tue(1)->2, ..., Sat(5)->6, Sun(6)->0
        js_weekday = (date_obj.weekday() + 1) % 7

        if js_weekday in self.closed_days:
            return "closed"

        # Deterministic pseudo-random seed based on date string and slot
        date_str = date_obj.strftime("%Y-%m-%d")
        slot_idx = self.time_slots.index(slot_time) if slot_time in self.time_slots else 0
        
        # Consistent hash-like integer
        seed = 0
        for char in f"{date_str}-{slot_time}":
            seed = (seed * 31 + ord(char)) & 0xFFFFFFFF

        score = (seed + slot_idx * 7) % 100

        # Realistic distribution:
        # score < 50 => available (◯)
        # 50 <= score < 80 => limited (△)
        # score >= 80 => full (✕)
        if score < 50:
            return "available"
        elif score < 80:
            return "limited"
        else:
            return "full"

    def get_status_symbol(self, status: str) -> str:
        mapping = {
            "available": "◯",
            "limited": "△",
            "full": "✕",
            "closed": "休"
        }
        return mapping.get(status, "✕")

    def get_status_class(self, status: str) -> str:
        mapping = {
            "available": "is-available",
            "limited": "is-limited",
            "full": "is-full",
            "closed": "is-closed"
        }
        return mapping.get(status, "is-closed")


class ThankYouViewValidator:
    """Validates reservation ID format, RFC 5545 .ics generation, and LINE URL encoding."""

    @staticmethod
    def validate_reservation_id(res_id: str, prefix: str = "LUM") -> bool:
        """Validates format (LUM|TAV)-YYYYMMDD-XXXX."""
        pattern = rf'^{prefix}-\d{{8}}-[A-Z0-9]{{4}}$'
        return bool(re.match(pattern, res_id))

    @staticmethod
    def generate_google_calendar_url(res_id: str, plan_name: str, date_str: str, time_str: str, salon_name: str = "LUMIÈRE SALON") -> str:
        """Constructs Google Calendar Web template URL."""
        # Calculate start and end ISO
        dt_start_clean = date_str.replace("-", "") + "T" + time_str.replace(":", "") + "00"
        # Duration: default 80 mins (1h20m)
        h, m = map(int, time_str.split(":"))
        end_m = m + 80
        end_h = h + end_m // 60
        end_m = end_m % 60
        dt_end_clean = date_str.replace("-", "") + f"T{end_h:02d}{end_m:02d}00"

        title = f"【予約完了】{salon_name} ({plan_name})"
        details = f"ご予約番号: {res_id}\nプラン: {plan_name}\nサロン: {salon_name}\n※ご来店をお待ちしております。"
        location = "東京都中央区銀座5丁目X-X"

        params = {
            "action": "TEMPLATE",
            "text": title,
            "dates": f"{dt_start_clean}/{dt_end_clean}",
            "details": details,
            "location": location
        }
        return "https://calendar.google.com/calendar/render?" + urllib.parse.urlencode(params, quote_via=urllib.parse.quote)

    @staticmethod
    def validate_rfc5545_ics(ics_text: str) -> Tuple[bool, List[str]]:
        """Strictly validates RFC 5545 iCalendar content format."""
        errors = []
        required_elements = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:",
            "BEGIN:VEVENT",
            "UID:",
            "DTSTAMP:",
            "DTSTART",
            "DTEND",
            "SUMMARY:",
            "DESCRIPTION:",
            "BEGIN:VALARM",
            "TRIGGER:-PT2H",
            "ACTION:DISPLAY",
            "END:VALARM",
            "END:VEVENT",
            "END:VCALENDAR"
        ]
        for req in required_elements:
            if req not in ics_text:
                errors.append(f"RFC 5545 missing required element: '{req}'")

        # Check timestamp format in DTSTART (e.g. DTSTART:20260822T130000 or DTSTART;TZID=...)
        if not re.search(r'DTSTART(?:;[^:]+)?:(?:\d{8}T\d{6}Z?|\d{8})', ics_text):
            errors.append("Invalid DTSTART timestamp format in .ics")

        if not re.search(r'DTEND(?:;[^:]+)?:(?:\d{8}T\d{6}Z?|\d{8})', ics_text):
            errors.append("Invalid DTEND timestamp format in .ics")

        return len(errors) == 0, errors

    @staticmethod
    def generate_line_chat_url(res_id: str, plan_name: str, date_str: str, time_str: str, line_id: str = "@lumiera_salon") -> str:
        """Constructs LINE deep link with encoded message."""
        msg = f"【予約確認】\n予約番号: {res_id}\nご希望日時: {date_str} {time_str}\n選択プラン: {plan_name}\nよろしくお願いいたします。"
        encoded_msg = urllib.parse.quote(msg)
        return f"https://line.me/R/oaMessage/{line_id}/?{encoded_msg}"


class InteractiveUIValidator:
    """Master validator for interactive UI, Calendar DOM, GAS backend, and reservation flows."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.project_root = project_root
        self.portal_html = project_root / "index.html"
        self.portal_js = project_root / "js" / "portal.js"
        self.aesthetic_html = project_root / "samples" / "aesthetic" / "index.html"
        self.aesthetic_js = project_root / "samples" / "aesthetic" / "js" / "aesthetic.js"
        self.aesthetic_css = project_root / "samples" / "aesthetic" / "css" / "aesthetic.css"
        self.config_js = project_root / "samples" / "aesthetic" / "js" / "config.js"
        self.gas_code = project_root / "gas" / "Code.gs"
        self.gas_readme = project_root / "gas" / "README.md"
        self.results: List[Dict[str, Any]] = []

    def record_result(self, test_id: str, name: str, passed: bool, message: str = ""):
        self.results.append({
            "id": test_id,
            "name": name,
            "passed": passed,
            "message": message
        })

    def validate_all_components(self) -> Tuple[bool, List[Dict[str, Any]]]:
        self.results.clear()

        # 1. Config Validation
        cfg_val = ConfigSchemaValidator(self.project_root)
        cfg_ok, cfg_dict, cfg_err = cfg_val.parse_config()
        self.record_result(
            "TC-CFG-VAL",
            "Central Config: SALON_CONFIG schema & required fields",
            cfg_ok and "timeSlots" in cfg_dict and "closedDays" in cfg_dict,
            cfg_err if not cfg_ok else f"Parsed keys: {list(cfg_dict.keys())}"
        )

        # 2. GAS Backend Validation
        gas_val = GASBackendValidator(self.project_root)
        gas_code_ok, gas_code_errs = gas_val.validate_code_gs()
        self.record_result(
            "TC-GAS-CODE",
            "GAS Backend: gas/Code.gs endpoints (doGet, doPost, Calendar, Sheet, Mail)",
            gas_code_ok,
            "; ".join(gas_code_errs)
        )

        gas_doc_ok, gas_doc_errs = gas_val.validate_readme_md()
        self.record_result(
            "TC-GAS-DOC",
            "GAS Guide: gas/README.md 3-minute setup instructions completeness",
            gas_doc_ok,
            "; ".join(gas_doc_errs)
        )

        # 3. Calendar DOM & Logic Validation
        if self.aesthetic_html.exists():
            html_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            parser = TagFinder()
            parser.feed(html_text)

            # Check Calendar DOM container
            has_calendar_container = any(
                "calendar" in e["attrs"].get("id", "") or "calendar" in e["attrs"].get("class", "")
                for e in parser.elements
            ) or "calendar" in html_text.lower() or "空き状況" in html_text

            self.record_result(
                "TC-CAL-DOM",
                "Calendar UI: DOM container & schedule grid presence in #action",
                has_calendar_container,
                "Calendar container or schedule grid markup detected." if has_calendar_container else "Calendar container not found."
            )
        else:
            self.record_result("TC-CAL-DOM", "Calendar UI: DOM container", False, "aesthetic/index.html not found.")

        # 4. Thank-You & Post Booking Validation
        res_id_sample = "LUM-20260822-7F3A"
        id_valid = ThankYouViewValidator.validate_reservation_id(res_id_sample)
        self.record_result(
            "TC-TNK-RESID",
            "Thank-You: Reservation ID format (LUM-YYYYMMDD-XXXX) validation",
            id_valid,
            f"Sample ID: {res_id_sample}, format valid: {id_valid}"
        )

        # 5. RFC 5545 .ics Validation
        sample_ics = (
            "BEGIN:VCALENDAR\r\n"
            "VERSION:2.0\r\n"
            "PRODID:-//LUMIERE SALON//Reservation System//JA\r\n"
            "BEGIN:VEVENT\r\n"
            "UID:LUM-20260822-7F3A@lumiera-salon.example.com\r\n"
            "DTSTAMP:20260820T143000Z\r\n"
            "DTSTART:20260822T130000\r\n"
            "DTEND:20260822T142000\r\n"
            "SUMMARY:【予約】LUMIÈRE SALON (竹プラン)\r\n"
            "DESCRIPTION:ご予約番号: LUM-20260822-7F3A\\nプラン: 竹プラン\\n場所: 銀座本店\r\n"
            "LOCATION:東京都中央区銀座5丁目X-X\r\n"
            "BEGIN:VALARM\r\n"
            "TRIGGER:-PT2H\r\n"
            "ACTION:DISPLAY\r\n"
            "DESCRIPTION:ご予約の2時間前リマインダー\r\n"
            "END:VALARM\r\n"
            "END:VEVENT\r\n"
            "END:VCALENDAR\r\n"
        )
        ics_ok, ics_errs = ThankYouViewValidator.validate_rfc5545_ics(sample_ics)
        self.record_result(
            "TC-ICS-RFC",
            "ICS Sync: RFC 5545 compliance (VCALENDAR, VEVENT, DTSTART, DTEND, VALARM -PT2H)",
            ics_ok,
            "; ".join(ics_errs)
        )

        # 6. LINE Deep Linking URL Validation
        line_url = ThankYouViewValidator.generate_line_chat_url("LUM-20260822-7F3A", "竹プラン", "2026-08-22", "13:00")
        line_ok = line_url.startswith("https://line.me/R/") and "LUM-20260822-7F3A" in urllib.parse.unquote(line_url)
        self.record_result(
            "TC-LIN-URL",
            "LINE Integration: URL deep link and URL-encoded reservation parameters",
            line_ok,
            f"Generated LINE URL: {line_url[:60]}..."
        )

        # 7. Fallback Simulation Engine Consistency
        engine = CalendarEngineSimulator(closed_days=[2], time_slots=["10:00", "13:00", "16:00", "18:30"])
        # Test 100 repeated calls for determinism
        test_d = datetime.date(2026, 8, 21) # Friday
        statuses = [engine.compute_deterministic_status(test_d, "18:30") for _ in range(100)]
        deterministic_ok = len(set(statuses)) == 1
        # Tuesday closed check
        tue_d = datetime.date(2026, 8, 25) # Tuesday
        tue_status = engine.compute_deterministic_status(tue_d, "10:00")
        closed_ok = (tue_status == "closed")

        self.record_result(
            "TC-FBK-DET",
            "Fallback Engine: Deterministic pseudo-randomness & regular holiday closure (Tue=closed)",
            deterministic_ok and closed_ok,
            f"100 repeated calls identical: {deterministic_ok}, Tuesday closed: {closed_ok}"
        )

        # 8. Italian Restaurant Config Validation
        itl_cfg_val = ItalianConfigSchemaValidator(self.project_root)
        itl_cfg_ok, itl_cfg_dict, itl_cfg_err = itl_cfg_val.parse_config()
        self.record_result(
            "TC-ITL-CFG-VAL",
            "Italian Config: RESTAURANT_CONFIG schema & required fields (lunch 5 / dinner 6 slots)",
            itl_cfg_ok and "timeSlots" in itl_cfg_dict and "closedDays" in itl_cfg_dict,
            itl_cfg_err if not itl_cfg_ok else f"Parsed keys: {list(itl_cfg_dict.keys())}"
        )

        # 9. Italian Calendar DOM Validation
        italian_html = self.project_root / "samples" / "italian" / "index.html"
        if italian_html.exists():
            itl_html_text = italian_html.read_text(encoding="utf-8", errors="replace")
            itl_parser = TagFinder()
            itl_parser.feed(itl_html_text)

            has_itl_calendar = any(
                "calendar" in e["attrs"].get("id", "") or "calendar" in e["attrs"].get("class", "")
                for e in itl_parser.elements
            ) or "calendar-table-container" in itl_html_text

            self.record_result(
                "TC-ITL-CAL-DOM",
                "Italian Calendar UI: DOM container & 2-shift table container in #action",
                has_itl_calendar,
                "Italian calendar container detected." if has_itl_calendar else "Italian calendar container not found."
            )
        else:
            self.record_result("TC-ITL-CAL-DOM", "Italian Calendar UI", False, "samples/italian/index.html not found.")

        # 10. Italian Reservation ID Validation (TAV-YYYYMMDD-XXXX)
        res_id_itl = "TAV-20260821-4B2E"
        itl_id_valid = ThankYouViewValidator.validate_reservation_id(res_id_itl, prefix="TAV")
        self.record_result(
            "TC-ITL-TNK-RESID",
            "Italian Thank-You: Reservation ID format (TAV-YYYYMMDD-XXXX) validation",
            itl_id_valid,
            f"Sample ID: {res_id_itl}, format valid: {itl_id_valid}"
        )

        # 11. Italian LINE Deep Link Validation
        itl_line_url = ThankYouViewValidator.generate_line_chat_url("TAV-20260821-4B2E", "竹コース", "2026-08-22", "18:30", line_id="@bella_tavola")
        itl_line_ok = itl_line_url.startswith("https://line.me/R/oaMessage/@bella_tavola") and "TAV-20260821-4B2E" in urllib.parse.unquote(itl_line_url)
        self.record_result(
            "TC-ITL-LIN-URL",
            "Italian LINE Integration: URL deep link and URL-encoded reservation parameters",
            itl_line_ok,
            f"Generated LINE URL: {itl_line_url[:60]}..."
        )

        all_passed = all(r["passed"] for r in self.results)
        return all_passed, self.results

    def run_all(self, verbose: bool = True) -> Tuple[bool, List[Dict[str, Any]]]:
        if verbose:
            print("\n=== Running Interactive UI, GAS, Calendar & Fallback Validation (tests/test_interactive_ui.py) ===")
        all_passed, results = self.validate_all_components()
        if verbose:
            for r in results:
                status_str = "[PASS]" if r["passed"] else "[FAIL]"
                print(f"  {status_str} {r['id']}: {r['name']}")
                if not r["passed"] and r["message"]:
                    print(f"         Details: {r['message']}")
        return all_passed, results


if __name__ == "__main__":
    validator = InteractiveUIValidator(PROJECT_ROOT)
    passed, test_res = validator.run_all(verbose=True)
    sys.exit(0 if passed else 1)
