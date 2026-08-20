#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/validate_links.py
Strict Link and Asset Validator for GitHub Pages Compatibility.

Validates:
1. Rule-L1: Zero root-relative ('/') paths in href, src, action, and CSS url().
2. Rule-L2: 100% valid relative paths pointing to existing local files.
3. Case Sensitivity Guard: Enforces exact case matching on disk to prevent Linux/GitHub Pages 404s.
4. Rule-L3: In-page and cross-page anchor (#id) target element existence.
5. Rule-L4: External URL scheme whitelist (http, https, line, tel, mailto).
"""

import os
import sys
import re
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Dict, Set, Tuple, Optional, Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {".git", ".agents", "scratch", "__pycache__", ".vscode", ".idea"}
ALLOWED_SCHEMES = {"http", "https", "mailto", "tel", "line", "javascript", "data"}


class LinkOccurrence:
    """Represents a discovered link/asset reference in HTML or CSS."""
    def __init__(self, source_file: Path, line_number: int, attr: str, url: str, tag: str = ""):
        self.source_file = source_file
        self.line_number = line_number
        self.attr = attr
        self.url = url.strip()
        self.tag = tag

    def __repr__(self):
        return f"LinkOccurrence({self.source_file.name}:{self.line_number} <{self.tag} {self.attr}='{self.url}'>)"


class HTMLLinkExtractor(HTMLParser):
    """Parses HTML to extract all links, image/script sources, form actions, and element IDs."""
    def __init__(self, file_path: Path):
        super().__init__()
        self.file_path = file_path
        self.links: List[LinkOccurrence] = []
        self.ids: Set[str] = set()

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        line_no = self.getpos()[0]
        attrs_dict = dict(attrs)

        # Record element IDs
        if "id" in attrs_dict and attrs_dict["id"]:
            self.ids.add(attrs_dict["id"])
        if tag == "a" and "name" in attrs_dict and attrs_dict["name"]:
            self.ids.add(attrs_dict["name"])

        # Check relevant link attributes
        link_attrs = ["href", "src", "action", "data-src", "poster"]
        for attr in link_attrs:
            if attr in attrs_dict and attrs_dict[attr]:
                raw_val = attrs_dict[attr].strip()
                self.links.append(LinkOccurrence(self.file_path, line_no, attr, raw_val, tag))

        # Check inline styles for url(...)
        if "style" in attrs_dict and attrs_dict["style"]:
            style_val = attrs_dict["style"]
            css_urls = re.findall(r'url\s*\(\s*["\']?([^"\'\)]+)["\']?\s*\)', style_val)
            for css_url in css_urls:
                self.links.append(LinkOccurrence(self.file_path, line_no, "style[url]", css_url, tag))


def extract_css_links(css_file: Path) -> List[LinkOccurrence]:
    """Extracts url(...) references and @import references from a CSS file."""
    links = []
    try:
        content = css_file.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        print(f"Error reading CSS file {css_file}: {e}")
        return links

    lines = content.splitlines()
    for line_idx, line in enumerate(lines, start=1):
        # Match url(...)
        for match in re.finditer(r'url\s*\(\s*["\']?([^"\'\)\s]+)["\']?\s*\)', line):
            raw_url = match.group(1)
            links.append(LinkOccurrence(css_file, line_idx, "url", raw_url, "css"))
        # Match @import
        for match in re.finditer(r'@import\s+["\']([^"\']+)["\']', line):
            raw_url = match.group(1)
            links.append(LinkOccurrence(css_file, line_idx, "@import", raw_url, "css"))
    return links


def verify_case_sensitive_path(base_dir: Path, rel_path: str) -> Tuple[bool, str]:
    """
    Verifies on Windows whether each component in rel_path matches
    the exact casing on disk (preventing Linux 404s).
    """
    parts = Path(rel_path).parts
    current = base_dir.resolve()

    for part in parts:
        if part in (".", ""):
            continue
        if part == "..":
            current = current.parent
            continue

        if not current.exists() or not current.is_dir():
            return False, f"Directory does not exist: {current}"

        entries = os.listdir(current)
        if part not in entries:
            # Check case-insensitive match to explain the issue
            lower_map = {e.lower(): e for e in entries}
            if part.lower() in lower_map:
                actual_name = lower_map[part.lower()]
                return False, f"Case mismatch: '{part}' vs disk '{actual_name}' in {current}"
            return False, f"Component '{part}' not found in {current}"

        current = current / part

    return True, ""


class LinkValidator:
    """Orchestrates link, anchor, and relative path validation across the project."""
    def __init__(self, root_dir: Path = PROJECT_ROOT):
        self.root_dir = root_dir
        self.html_files: List[Path] = []
        self.css_files: List[Path] = []
        self.html_parsed_data: Dict[Path, Tuple[List[LinkOccurrence], Set[str]]] = {}
        self.violations: List[Dict[str, Any]] = []

    def discover_files(self):
        self.html_files.clear()
        self.css_files.clear()
        for root, dirs, files in os.walk(self.root_dir):
            # Exclude specified directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
            root_path = Path(root)
            for f in files:
                file_path = root_path / f
                if f.endswith(".html"):
                    self.html_files.append(file_path)
                elif f.endswith(".css"):
                    self.css_files.append(file_path)

    def parse_all(self):
        self.html_parsed_data.clear()
        for html_file in self.html_files:
            try:
                content = html_file.read_text(encoding="utf-8", errors="replace")
                parser = HTMLLinkExtractor(html_file)
                parser.feed(content)
                self.html_parsed_data[html_file] = (parser.links, parser.ids)
            except Exception as e:
                self.violations.append({
                    "rule": "PARSE_ERROR",
                    "file": str(html_file),
                    "line": 1,
                    "target": "",
                    "message": f"Failed to parse HTML: {e}"
                })

    def validate(self) -> Tuple[bool, List[Dict[str, Any]], int]:
        self.violations.clear()
        self.discover_files()
        self.parse_all()

        total_links_checked = 0

        # Validate all HTML links
        for html_file, (links, ids) in self.html_parsed_data.items():
            for link in links:
                total_links_checked += 1
                self._check_link(link)

        # Validate all CSS links
        for css_file in self.css_files:
            links = extract_css_links(css_file)
            for link in links:
                total_links_checked += 1
                self._check_link(link)

        is_clean = len(self.violations) == 0
        return is_clean, self.violations, total_links_checked

    def _check_link(self, link: LinkOccurrence):
        url = link.url

        # Skip empty or anchor-only / dummy links
        if not url:
            return

        # Check for Rule-L1: Root-relative link starting with / (e.g. /css/style.css, /samples/...)
        if url.startswith("/") and not url.startswith("//"):
            self.violations.append({
                "rule": "Rule-L1 (Root-Relative Path)",
                "file": str(link.source_file.relative_to(self.root_dir)),
                "line": link.line_number,
                "target": url,
                "message": (
                    f"Root-relative path '{url}' violates GitHub Pages compatibility. "
                    f"Use strict relative paths ('./', '../', or relative filename)."
                )
            })
            return

        # Check external protocols
        if ":" in url:
            scheme = url.split(":", 1)[0].lower()
            if scheme in ALLOWED_SCHEMES:
                # Valid external scheme
                return
            elif not (url.startswith("./") or url.startswith("../")):
                # Unrecognized scheme
                self.violations.append({
                    "rule": "Rule-L4 (Invalid Scheme)",
                    "file": str(link.source_file.relative_to(self.root_dir)),
                    "line": link.line_number,
                    "target": url,
                    "message": f"Disallowed or malformed URL scheme: '{scheme}:'"
                })
                return

        # Check in-page anchor (e.g. #solution, #hero)
        if url.startswith("#"):
            anchor_id = url[1:]
            if anchor_id and anchor_id not in {"", "top"}:
                # Look up ID in current HTML file
                if link.source_file in self.html_parsed_data:
                    _, page_ids = self.html_parsed_data[link.source_file]
                    if anchor_id not in page_ids:
                        self.violations.append({
                            "rule": "Rule-L3 (Broken In-Page Anchor)",
                            "file": str(link.source_file.relative_to(self.root_dir)),
                            "line": link.line_number,
                            "target": url,
                            "message": f"Target element with id='{anchor_id}' not found in {link.source_file.name}"
                        })
            return

        # Handle relative path with optional anchor and query parameters
        clean_url = url.split("?", 1)[0]
        anchor_id = ""
        if "#" in clean_url:
            clean_url, anchor_id = clean_url.split("#", 1)

        if not clean_url:
            return

        base_dir = link.source_file.parent
        target_path = (base_dir / clean_url).resolve()

        # Rule-L2: Local file existence
        if not target_path.exists():
            self.violations.append({
                "rule": "Rule-L2 (Missing File 404)",
                "file": str(link.source_file.relative_to(self.root_dir)),
                "line": link.line_number,
                "target": url,
                "message": f"Referenced target file does not exist on disk: '{clean_url}' -> {target_path}"
            })
            return

        # Case Sensitivity check
        case_ok, case_msg = verify_case_sensitive_path(base_dir, clean_url)
        if not case_ok:
            self.violations.append({
                "rule": "Rule-L2 (Case Sensitivity Mismatch)",
                "file": str(link.source_file.relative_to(self.root_dir)),
                "line": link.line_number,
                "target": url,
                "message": f"Path case mismatch on disk: {case_msg}"
            })
            return

        # Rule-L3: Cross-page anchor validation
        if anchor_id and target_path in self.html_parsed_data:
            _, target_ids = self.html_parsed_data[target_path]
            if anchor_id not in target_ids:
                self.violations.append({
                    "rule": "Rule-L3 (Broken Cross-Page Anchor)",
                    "file": str(link.source_file.relative_to(self.root_dir)),
                    "line": link.line_number,
                    "target": url,
                    "message": f"Target id='{anchor_id}' not found in target file '{clean_url}'"
                })


def validate_all_links(verbose: bool = True) -> Tuple[bool, List[Dict[str, Any]], int]:
    """Public runner entry point for validate_links."""
    validator = LinkValidator(PROJECT_ROOT)
    is_clean, violations, total_checked = validator.validate()

    if verbose:
        print("\n=== Running Link & Asset Validation (tests/validate_links.py) ===")
        print(f"Scanned {len(validator.html_files)} HTML files and {len(validator.css_files)} CSS files.")
        print(f"Total links/assets checked: {total_checked}")

        if is_clean:
            print("[PASS] All relative links, assets, and anchor IDs are 100% valid! Zero 404s, zero root '/' links.")
        else:
            print(f"[FAIL] Found {len(violations)} link/asset violation(s):")
            for v in violations:
                print(f"  - [{v['rule']}] {v['file']}:{v.get('line', '?')}")
                print(f"    Target:  {v['target']}")
                print(f"    Reason:  {v['message']}")

    return is_clean, violations, total_checked


if __name__ == "__main__":
    clean, viols, count = validate_all_links(verbose=True)
    sys.exit(0 if clean else 1)
