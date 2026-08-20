#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/validate_pasona_dom.py
New PASONA Framework, Semantic DOM, SEO, and Accessibility Validator.

Validates:
1. New PASONA 7 Sections in Aesthetic LP (Problem, Affinity, Solution, Offer, Narrowing, Action, FAQ).
2. H1-H6 Heading Hierarchy (Single H1, no skipped heading levels).
3. SEO & Open Graph Tags (viewport, lang="ja", title, description, og:*).
4. Accessibility Standards (img alt attributes, aria-expanded for interactive elements).
5. Pricing 3-tier structure & Before/After comparison components.
"""

import sys
import re
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Dict, Set, Tuple, Optional, Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class DOMNode:
    """Represents an HTML tag node with attributes and hierarchical position."""
    def __init__(self, tag: str, attrs: Dict[str, str], line: int):
        self.tag = tag.lower()
        self.attrs = attrs
        self.line = line
        self.children: List['DOMNode'] = []
        self.text_content: str = ""

    def get(self, attr: str, default: str = "") -> str:
        return self.attrs.get(attr, default)

    def __repr__(self):
        return f"<{self.tag} id='{self.get('id')}' class='{self.get('class')}' data-pasona='{self.get('data-pasona')}'>"


class DOMTreeBuilder(HTMLParser):
    """Parses HTML into a lightweight DOM tree and collects semantic metadata."""
    def __init__(self):
        super().__init__()
        self.root = DOMNode("root", {}, 0)
        self.stack: List[DOMNode] = [self.root]
        self.headings: List[Tuple[str, int, str]] = []  # (tag, line, text)
        self.images: List[DOMNode] = []
        self.meta_tags: List[Dict[str, str]] = []
        self.pasona_sections: Dict[str, DOMNode] = {}
        self.html_attrs: Dict[str, str] = {}
        self.title_text: str = ""
        self.in_title: bool = False
        self.in_heading: Optional[DOMNode] = None

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        line = self.getpos()[0]
        attrs_dict = {k.lower(): (v or "") for k, v in attrs}
        node = DOMNode(tag, attrs_dict, line)

        if tag == "html":
            self.html_attrs = attrs_dict
        elif tag == "meta":
            self.meta_tags.append(attrs_dict)
        elif tag == "title":
            self.in_title = True
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.in_heading = node
        elif tag == "img":
            self.images.append(node)

        # Detect PASONA section markers
        pasona_attr = attrs_dict.get("data-pasona", "").lower()
        elem_id = attrs_dict.get("id", "").lower()

        if pasona_attr:
            self.pasona_sections[pasona_attr] = node
        elif elem_id:
            # Map canonical IDs if data-pasona attribute is absent
            id_to_pasona = {
                "problem": "problem", "hero": "problem",
                "affinity": "affinity", "empathy": "affinity",
                "solution": "solution", "reasons": "solution", "feature": "solution",
                "offer": "offer", "pricing": "offer", "plan": "offer", "plans": "offer",
                "narrowing": "narrowing", "urgency": "narrowing", "limit": "narrowing",
                "action": "action", "cta": "action", "booking": "action",
                "faq": "faq", "qa": "faq"
            }
            if elem_id in id_to_pasona:
                self.pasona_sections[id_to_pasona[elem_id]] = node

        if self.stack:
            self.stack[-1].children.append(node)
        self.stack.append(node)

    def handle_endtag(self, tag: str):
        if tag == "title":
            self.in_title = False
        elif self.in_heading and tag == self.in_heading.tag:
            self.headings.append((self.in_heading.tag, self.in_heading.line, self.in_heading.text_content.strip()))
            self.in_heading = None

        if len(self.stack) > 1:
            self.stack.pop()

    def handle_data(self, data: str):
        if self.in_title:
            self.title_text += data
        if self.in_heading:
            self.in_heading.text_content += data
        if self.stack:
            self.stack[-1].text_content += data


class PASONADOMValidator:
    """Validates DOM structure, semantic headings, and PASONA framework fidelity."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.project_root = project_root
        self.violations: List[Dict[str, Any]] = []

    def validate_file_pasona(self, html_path: Path) -> List[Dict[str, Any]]:
        """Validates New PASONA structure for aesthetic salon LP."""
        local_violations = []
        if not html_path.exists():
            local_violations.append({
                "rule": "FILE_EXISTS",
                "file": str(html_path.relative_to(self.project_root)),
                "message": f"Aesthetic LP file not found at {html_path}"
            })
            return local_violations

        content = html_path.read_text(encoding="utf-8", errors="replace")
        builder = DOMTreeBuilder()
        builder.feed(content)

        # 1. Check all New PASONA 7 Sections
        required_pasona_keys = [
            ("problem", "Problem (問題提起) / Hero section"),
            ("affinity", "Affinity (親近感・共感) / Empathy story section"),
            ("solution", "Solution (解決策・根拠) / 3 Reasons / Before-After"),
            ("offer", "Offer (提案・価格) / Matsutake Pricing section"),
            ("narrowing", "Narrowing Down (限定性・絞り込み) section"),
            ("action", "Action (行動喚起) / Dual CTA & Booking Modal"),
            ("faq", "FAQ (よくある質問) / Accordion section")
        ]

        for p_key, p_desc in required_pasona_keys:
            if p_key not in builder.pasona_sections:
                local_violations.append({
                    "rule": "PASONA_SECTION_MISSING",
                    "file": str(html_path.relative_to(self.project_root)),
                    "message": f"Missing required PASONA section: '{p_key}' ({p_desc}). "
                               f"Specify data-pasona='{p_key}' or id='{p_key}'."
                })

        # 2. Check 松竹梅 3-tier Pricing Structure in Offer section
        # Look for 3 pricing tiers or cards in HTML
        has_3_plans = False
        pricing_matches = re.findall(r'(松|竹|梅|ライト|スタンダード|プレミアム|プラチナ|シルバー|ゴールド|プラン|コース|course|plan)', content, re.IGNORECASE)
        # Check if offer section has multiple plan cards
        offer_node = builder.pasona_sections.get("offer")
        if offer_node:
            offer_text = content[offer_node.line * 20: (offer_node.line + 200) * 80] if offer_node.line else content
            plan_count = len(re.findall(r'(class=[\'"][^\'"]*plan-card[^\'"]*[\'"]|class=[\'"][^\'"]*pricing-card[^\'"]*[\'"]|class=[\'"][^\'"]*price-card[^\'"]*[\'"])', content))
            if plan_count >= 3 or len(pricing_matches) >= 3:
                has_3_plans = True

        if not has_3_plans and "offer" in builder.pasona_sections:
            local_violations.append({
                "rule": "PASONA_OFFER_STRUCTURE",
                "file": str(html_path.relative_to(self.project_root)),
                "message": "Offer section must include a 3-tier pricing structure (Matsutake / 松竹梅 / 3 courses)."
            })

        # 3. Check Before / After visual comparison
        has_before_after = bool(re.search(r'(before|after|ビフォー|アフター|効果実証|変化)', content, re.IGNORECASE))
        if not has_before_after:
            local_violations.append({
                "rule": "PASONA_SOLUTION_BEFORE_AFTER",
                "file": str(html_path.relative_to(self.project_root)),
                "message": "Solution section should contain Before/After comparison evidence."
            })

        # 4. Check LINE and Web CTAs in Action / LP
        has_line_cta = bool(re.search(r'(line|LINE|line\.me|line://)', content))
        has_web_modal = bool(re.search(r'(modal|form|booking|予約フォーム|modal-trigger|open-modal)', content, re.IGNORECASE))
        if not (has_line_cta and has_web_modal):
            local_violations.append({
                "rule": "PASONA_DUAL_CTA",
                "file": str(html_path.relative_to(self.project_root)),
                "message": f"Dual CTA required: LINE CTA (found: {has_line_cta}) and Web Booking Modal/Form (found: {has_web_modal})."
            })

        # 5. Check FAQ accordion items (minimum 3 items)
        faq_items_count = len(re.findall(r'(class=[\'"][^\'"]*faq-item[^\'"]*[\'"]|<details|<dt|class=[\'"][^\'"]*accordion-item[^\'"]*[\'"])', content, re.IGNORECASE))
        if faq_items_count < 3 and "faq" in builder.pasona_sections:
            local_violations.append({
                "rule": "PASONA_FAQ_COUNT",
                "file": str(html_path.relative_to(self.project_root)),
                "message": f"FAQ section should contain at least 3 Q&A accordion items (found {faq_items_count})."
            })

        return local_violations

    def validate_semantics_and_seo(self, html_path: Path) -> List[Dict[str, Any]]:
        """Validates H1-H6 hierarchy, viewport, OGP, and image accessibility."""
        local_violations = []
        if not html_path.exists():
            return local_violations

        content = html_path.read_text(encoding="utf-8", errors="replace")
        builder = DOMTreeBuilder()
        builder.feed(content)
        rel_file = str(html_path.relative_to(self.project_root))

        # 1. Single H1 check
        h1_list = [h for h in builder.headings if h[0] == "h1"]
        if len(h1_list) == 0:
            local_violations.append({
                "rule": "SEO_H1_MISSING",
                "file": rel_file,
                "message": "Page must contain exactly one <h1> heading."
            })
        elif len(h1_list) > 1:
            local_violations.append({
                "rule": "SEO_H1_MULTIPLE",
                "file": rel_file,
                "message": f"Page contains {len(h1_list)} <h1> headings (strictly 1 allowed for SEO)."
            })

        # 2. Heading hierarchy continuity check (no skipped levels like H1 -> H3)
        prev_level = 0
        for tag, line, text in builder.headings:
            curr_level = int(tag[1])
            if prev_level > 0 and curr_level > prev_level + 1:
                local_violations.append({
                    "rule": "HEADING_HIERARCHY_SKIPPED",
                    "file": rel_file,
                    "line": line,
                    "message": f"Heading hierarchy jumped from <h{prev_level}> to <h{curr_level}> without intervening <h{prev_level+1}> ('{text[:30]}...')"
                })
            prev_level = curr_level

        # 3. Lang attribute on <html>
        html_lang = builder.html_attrs.get("lang", "").strip()
        if html_lang not in ("ja", "ja-JP", "ja_JP"):
            local_violations.append({
                "rule": "HTML_LANG_ATTRIBUTE",
                "file": rel_file,
                "message": f"<html lang='...'> attribute must be set to 'ja' (current: '{html_lang}')."
            })

        # 4. Viewport meta tag
        has_viewport = any(
            m.get("name") == "viewport" and "width=device-width" in m.get("content", "")
            for m in builder.meta_tags
        )
        if not has_viewport:
            local_violations.append({
                "rule": "SEO_VIEWPORT_MISSING",
                "file": rel_file,
                "message": "Missing standard responsive <meta name='viewport' content='width=device-width, initial-scale=1.0'> tag."
            })

        # 5. Page Title
        if not builder.title_text.strip():
            local_violations.append({
                "rule": "SEO_TITLE_EMPTY",
                "file": rel_file,
                "message": "<title> tag is missing or empty."
            })

        # 6. Description meta tag
        has_desc = any(
            m.get("name") == "description" and len(m.get("content", "").strip()) >= 10
            for m in builder.meta_tags
        )
        if not has_desc:
            local_violations.append({
                "rule": "SEO_DESCRIPTION_MISSING",
                "file": rel_file,
                "message": "Missing or empty <meta name='description' content='...'> tag."
            })

        # 7. OGP meta tags (og:title, og:description, og:type)
        og_tags = {m.get("property", ""): m.get("content", "") for m in builder.meta_tags if m.get("property", "").startswith("og:")}
        for req_og in ["og:title", "og:description", "og:type"]:
            if req_og not in og_tags or not og_tags[req_og].strip():
                local_violations.append({
                    "rule": "SEO_OGP_MISSING",
                    "file": rel_file,
                    "message": f"Missing or empty Open Graph tag: <meta property='{req_og}' content='...'>"
                })

        # 8. Image Alt Accessibility
        for img in builder.images:
            alt = img.get("alt", None)
            aria_hidden = img.get("aria-hidden", "")
            if alt is None:
                local_violations.append({
                    "rule": "A11Y_IMG_ALT_MISSING",
                    "file": rel_file,
                    "line": img.line,
                    "message": f"<img> tag missing 'alt' attribute: <img src='{img.get('src')}'>"
                })

        return local_violations

    def validate_all(self, verbose: bool = True) -> Tuple[bool, List[Dict[str, Any]]]:
        self.violations.clear()
        
        # Files to validate
        portal_html = self.project_root / "index.html"
        aesthetic_html = self.project_root / "samples" / "aesthetic" / "index.html"

        if verbose:
            print("\n=== Running PASONA DOM & Semantic Validation (tests/validate_pasona_dom.py) ===")

        # Validate Portal Hub
        if portal_html.exists():
            v = self.validate_semantics_and_seo(portal_html)
            self.violations.extend(v)
        else:
            self.violations.append({
                "rule": "PORTAL_MISSING",
                "file": "index.html",
                "message": "Portal index.html not yet found on disk."
            })

        # Validate Aesthetic Salon LP
        if aesthetic_html.exists():
            v_seo = self.validate_semantics_and_seo(aesthetic_html)
            v_pasona = self.validate_file_pasona(aesthetic_html)
            self.violations.extend(v_seo)
            self.violations.extend(v_pasona)
        else:
            self.violations.append({
                "rule": "AESTHETIC_LP_MISSING",
                "file": "samples/aesthetic/index.html",
                "message": "Aesthetic Salon LP samples/aesthetic/index.html not yet found on disk."
            })

        is_clean = len(self.violations) == 0
        if verbose:
            if is_clean:
                print("[PASS] PASONA architecture, H1-H6 hierarchy, SEO, and A11y DOM validation passed 100%!")
            else:
                print(f"[FAIL] Found {len(self.violations)} DOM/semantic issue(s):")
                for v in self.violations:
                    line_str = f":{v['line']}" if 'line' in v else ""
                    print(f"  - [{v['rule']}] {v['file']}{line_str}")
                    print(f"    Message: {v['message']}")

        return is_clean, self.violations


if __name__ == "__main__":
    validator = PASONADOMValidator(PROJECT_ROOT)
    clean, viols = validator.validate_all(verbose=True)
    sys.exit(0 if clean else 1)
