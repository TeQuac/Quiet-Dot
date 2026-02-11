# PR Transfer Paket

## Vorschlag PR-Titel
Fix split-mode leaderboard persistence across users + Supabase policy compatibility

## Vorschlag PR-Description
### Motivation
- Split-Mode-Highscores wurden nicht zuverlässig user-/geräteübergreifend angezeigt.
- SQL-Migration schlug in manchen Supabase-Umgebungen fehl, weil `CREATE POLICY IF NOT EXISTS` nicht überall unterstützt wird.

### Änderungen
- `script.js` auf Remote-Read/Write für `split_highscore` erweitert.
- Neue RPC-Nutzung `submit_score_mode(p_username, p_mode, p_score)` für mode-spezifische Persistenz.
- Legacy-Fallback im Normal-Mode auf `submit_score` beibehalten.
- `supabase_split_mode.sql` ergänzt/gehärtet (inkl. `drop policy if exists` + `create policy`).
- Setup-Dokumentation für Ausführung und Verifikation erweitert.

### Testing
- `node --check script.js`

## Transfer-Checkliste
- [ ] `supabase_split_mode.sql` im Supabase SQL Editor vollständig ausgeführt
- [ ] Split-Mode mit User A gespielt
- [ ] Zweiter User / zweites Gerät öffnet Split-Top-10 und sieht User-A-Score
- [ ] PR mit obigem Titel/Body erstellt
