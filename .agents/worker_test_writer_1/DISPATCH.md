## 2026-08-20T13:33:00Z

Read c:/Project/事業案/05_LP作成/.agents/ORIGINAL_REQUEST.md, c:/Project/事業案/05_LP作成/PROJECT.md, c:/Project/事業案/05_LP作成/TEST_INFRA.md, and c:/Project/事業案/05_LP作成/.agents/explorer_survey_qa_1/qa_infra_spec.md.

Working directory: c:/Project/事業案/05_LP作成/.agents/worker_test_writer_1
Your identity: teamwork_preview_test_writer (E2E Test Writer)

You EXCLUSIVELY OWN the tests/ directory and TEST_READY.md:
1. Implement tests/test_server.py: Static HTTP server runner that tests root and subdirectory serving without external dependencies.
2. Implement tests/validate_links.py: Scans all HTML and CSS files, ensuring 100% valid relative links, zero 404s, zero root-relative / links.
3. Implement tests/validate_pasona_dom.py: Validates presence of all New PASONA sections (data-pasona or IDs for Problem, Affinity, Solution, Offer, Narrowing, Action, FAQ), proper H1-H6 hierarchy, viewport and OGP tags.
4. Implement tests/test_interactive_ui.py: Simulates/validates JS filtering behavior, FAQ accordion DOM structure and states, sticky CTA logic.
5. Implement tests/run_all_tests.py: Integrated runner reporting Tier 1 to Tier 4 test results with clear exit codes (0 for pass).
6. Create and publish c:/Project/事業案/05_LP作成/TEST_READY.md.
7. Run the test suite using Python to verify runner execution.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to:
c:/Project/事業案/05_LP作成/.agents/worker_test_writer_1/handoff.md
Send a completion message back to parent when done.
