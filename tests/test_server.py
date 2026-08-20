#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_server.py
Static HTTP server runner and verification suite for GitHub Pages compatibility.
Supports root-level hosting and simulated subdirectory hosting (/repo-name/).
Uses Python standard library only (http.server, urllib.request, threading, socket).
"""

import sys
import os
import time
import socket
import threading
import urllib.request
import urllib.error
import http.server
from pathlib import Path
from typing import List, Tuple, Dict, Any, Optional

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PORT_RANGE = range(8080, 8100)
SUBDIR_NAME = "lp-portal-hub"


def find_free_port(port_range=DEFAULT_PORT_RANGE) -> int:
    """Find an available port within the specified range."""
    for port in port_range:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    # Fallback to ephemeral port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class SubdirSimulatingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP request handler that simulates both root serving and
    GitHub Pages project site subdirectory serving (/lp-portal-hub/...).
    """
    def __init__(self, *args, subdir_prefix=SUBDIR_NAME, **kwargs):
        self.subdir_prefix = subdir_prefix.strip("/")
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def translate_path(self, path):
        # Normalize path
        normalized = path.split("?", 1)[0].split("#", 1)[0]
        prefix = f"/{self.subdir_prefix}"
        if normalized == prefix or normalized.startswith(f"{prefix}/"):
            # Strip subdirectory prefix to simulate subdirectory serving
            stripped = normalized[len(prefix):]
            if not stripped:
                stripped = "/"
            return super().translate_path(stripped)
        return super().translate_path(path)

    def log_message(self, format, *args):
        # Suppress standard HTTP logging during test execution unless verbose
        if os.environ.get("TEST_VERBOSE") == "1":
            super().log_message(format, *args)


class LocalTestServer:
    """Context manager and controller for background local HTTP test server."""
    def __init__(self, port: Optional[int] = None, subdir_prefix: str = SUBDIR_NAME):
        self.port = port or find_free_port()
        self.subdir_prefix = subdir_prefix
        self.httpd: Optional[http.server.HTTPServer] = None
        self.thread: Optional[threading.Thread] = None
        self.base_url = f"http://127.0.0.1:{self.port}"
        self.subdir_base_url = f"http://127.0.0.1:{self.port}/{self.subdir_prefix}"

    def start(self):
        handler_factory = lambda *args, **kwargs: SubdirSimulatingHTTPRequestHandler(
            *args, subdir_prefix=self.subdir_prefix, **kwargs
        )
        self.httpd = http.server.HTTPServer(("127.0.0.1", self.port), handler_factory)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()

        # Wait for server to become responsive
        max_attempts = 20
        for _ in range(max_attempts):
            try:
                with socket.create_connection(("127.0.0.1", self.port), timeout=0.2):
                    break
            except (OSError, ConnectionRefusedError):
                time.sleep(0.05)

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()
            self.httpd = None
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.0)

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stop()


def fetch_url(url: str, timeout: float = 3.0) -> Tuple[int, Dict[str, str], bytes]:
    """Helper to fetch a URL and return (status_code, headers_dict, body_bytes)."""
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "LP-Static-Test-Runner/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status = response.status
            headers = {k.lower(): v for k, v in response.headers.items()}
            body = response.read()
            return status, headers, body
    except urllib.error.HTTPError as e:
        headers = {k.lower(): v for k, v in e.headers.items()}
        body = e.read()
        return e.code, headers, body
    except Exception as e:
        return 0, {}, str(e).encode("utf-8")


def run_server_tests(verbose: bool = True) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Executes all static HTTP server tests across Root and Subdirectory modes.
    Returns (all_passed: bool, results_list: List[Dict]).
    """
    results = []
    
    def record_result(test_id: str, name: str, passed: bool, message: str = ""):
        results.append({
            "id": test_id,
            "name": name,
            "passed": passed,
            "message": message
        })
        if verbose:
            status_str = "[PASS]" if passed else "[FAIL]"
            print(f"  {status_str} {test_id}: {name}")
            if not passed and message:
                print(f"         Details: {message}")

    if verbose:
        print("\n=== Running Static HTTP Server Tests (tests/test_server.py) ===")

    server = LocalTestServer()
    try:
        server.start()
        
        # Test 1: Root index.html fetch
        status, headers, body = fetch_url(f"{server.base_url}/index.html")
        if status == 200:
            content_type = headers.get("content-type", "")
            has_html = "text/html" in content_type
            record_result(
                "SRV-ROOT-01",
                "Root Mode: GET /index.html returns 200 OK with text/html",
                has_html,
                f"Status: {status}, Content-Type: {content_type}"
            )
        else:
            record_result(
                "SRV-ROOT-01",
                "Root Mode: GET /index.html returns 200 OK with text/html",
                False,
                f"HTTP Status {status} (Expected 200). Is index.html created?"
            )

        # Test 2: Root samples/aesthetic/index.html fetch
        status, headers, body = fetch_url(f"{server.base_url}/samples/aesthetic/index.html")
        if status == 200:
            content_type = headers.get("content-type", "")
            has_html = "text/html" in content_type
            record_result(
                "SRV-ROOT-02",
                "Root Mode: GET /samples/aesthetic/index.html returns 200 OK",
                has_html,
                f"Status: {status}, Content-Type: {content_type}"
            )
        else:
            record_result(
                "SRV-ROOT-02",
                "Root Mode: GET /samples/aesthetic/index.html returns 200 OK",
                False,
                f"HTTP Status {status} (Expected 200). Is samples/aesthetic/index.html created?"
            )

        # Test 3: Subdirectory Mode: /<subdir>/index.html
        status, headers, body = fetch_url(f"{server.subdir_base_url}/index.html")
        record_result(
            "SRV-SUBDIR-01",
            f"Subdirectory Mode: GET /{SUBDIR_NAME}/index.html returns 200 OK",
            status == 200,
            f"HTTP Status {status} (Expected 200)"
        )

        # Test 4: Subdirectory Mode: /<subdir>/samples/aesthetic/index.html
        status, headers, body = fetch_url(f"{server.subdir_base_url}/samples/aesthetic/index.html")
        record_result(
            "SRV-SUBDIR-02",
            f"Subdirectory Mode: GET /{SUBDIR_NAME}/samples/aesthetic/index.html returns 200 OK",
            status == 200,
            f"HTTP Status {status} (Expected 200)"
        )

        # Test 5: Non-existent asset returns 404 cleanly (no 500)
        status, headers, body = fetch_url(f"{server.base_url}/non_existent_asset_12345.xyz")
        record_result(
            "SRV-ERR-01",
            "Error Handling: Non-existent path returns 404 without server error",
            status == 404,
            f"HTTP Status {status} (Expected 404)"
        )

        # Test 6: CSS / JS Assets Content-Type verification
        css_path = PROJECT_ROOT / "css" / "tokens.css"
        portal_css_path = PROJECT_ROOT / "css" / "portal.css"
        aesthetic_css_path = PROJECT_ROOT / "samples" / "aesthetic" / "css" / "aesthetic.css"
        
        target_css = None
        if css_path.exists():
            target_css = "css/tokens.css"
        elif portal_css_path.exists():
            target_css = "css/portal.css"
        elif aesthetic_css_path.exists():
            target_css = "samples/aesthetic/css/aesthetic.css"

        if target_css:
            status, headers, _ = fetch_url(f"{server.base_url}/{target_css}")
            ct = headers.get("content-type", "")
            is_css = status == 200 and "text/css" in ct
            record_result(
                "SRV-MIME-01",
                f"MIME Type: GET /{target_css} returns 200 and text/css",
                is_css,
                f"Status: {status}, Content-Type: {ct}"
            )
        else:
            record_result(
                "SRV-MIME-01",
                "MIME Type: Static CSS asset delivery check",
                False,
                "No CSS files found yet (css/tokens.css, css/portal.css, etc.)"
            )

    finally:
        server.stop()

    all_passed = all(r["passed"] for r in results)
    return all_passed, results


if __name__ == "__main__":
    passed, test_results = run_server_tests(verbose=True)
    total = len(test_results)
    passed_count = sum(1 for r in test_results if r["passed"])
    failed_count = total - passed_count
    print(f"\nServer Test Summary: {passed_count}/{total} passed, {failed_count} failed.")
    sys.exit(0 if passed else 1)
