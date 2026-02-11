# Supabase Setup (Silentap)

Wenn bereits URL/Key gesetzt sind, fehlt oft nur noch die RLS-Policy-Konfiguration.

## 1) SQL ausführen
1. Supabase Dashboard → **SQL Editor**
2. Datei `supabase_hardening.sql` kopieren und komplett ausführen.

Damit werden:
- die Tabelle `game_scores` sichergestellt,
- die RPC `submit_score` abgesichert,
- RLS aktiviert,
- Policies für Lesen + initiales Erstellen gesetzt.

## 2) Warum diese Policies?
- **SELECT erlaubt**: Top-10 kann auf allen Geräten geladen werden.
- **INSERT nur mit `highscore = 0`**: User-Erstellung bleibt möglich.
- **Kein UPDATE direkt**: Highscore-Updates laufen über `submit_score`, damit Scores nie sinken.

## 3) Kurzer Funktionstest
- Neues Gerät / neues Browserprofil öffnen
- User anlegen, ein paar Punkte machen
- Seite auf zweitem Gerät neu laden → Top-10 sollte den Score zeigen

## 4) Fallback-Verhalten in der App
Die App cached lokal. Wenn Supabase kurzfristig nicht erreichbar ist,
bleibt die Anzeige lokal sichtbar und wird beim nächsten erfolgreichen Sync
wieder mit Supabase abgeglichen.
