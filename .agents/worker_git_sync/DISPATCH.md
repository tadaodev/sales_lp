## 2026-08-21T00:00:25Z
Execute the following terminal commands using run_command tool in PowerShell (with UTF-8 prefix [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;):
1. Run master test suite:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/run_all_tests.py`
2. Git status:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; git status`
3. Git stage:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; git add .`
4. Git commit:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; git commit -m "feat(italian): カジュアルイタリアンLP（BELLA TAVOLA）新規構築・新PASONA構成・14日2部制席予約カレンダー・ポータル統合・自動テスト拡充"`
5. Git push:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; git push origin main`
6. Verify `git log -1`:
   `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; git log -1`

Capture the outputs, write your execution report to `c:\Project\事業案\05_LP作成\.agents\worker_git_sync\handoff.md`, and report completion to parent via send_message.
