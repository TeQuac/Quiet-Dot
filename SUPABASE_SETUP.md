# Supabase Setup (Silentap)

Wenn der **Split-/Druck-Mode-Highscore nicht userübergreifend** erscheint, fehlt meist die DB-Erweiterung für Split-/Druck-Score.

## 1) SQL ausführen
1. Supabase Dashboard → **SQL Editor**
2. Datei `supabase_split_mode.sql` öffnen, komplett kopieren und ausführen.

Damit werden:
- Tabelle `game_scores` abgesichert/ergänzt,
- neue Spalten `split_highscore` und `pressure_highscore` ergänzt,
- RPC `submit_score_mode(...)` angelegt,
- Trigger für `updated_at` gesetzt,
- RLS + Policies für Lesen und initiales Erstellen sichergestellt,
- Tabelle `feedback_messages` für App-internes Feedback angelegt.


Hinweis: Die Migration verwendet absichtlich `drop policy if exists ...` + `create policy ...`, damit sie auch auf Postgres-Versionen läuft, die `create policy if not exists` nicht unterstützen.

## 2) App-Logik
Die App verwendet danach:
- für **Normal**: `highscore`
- für **Split**: `split_highscore`
- für **Druck**: `pressure_highscore`

Und sendet Scores über `submit_score_mode(p_username, p_mode, p_score)`.

## 3) Kurzer Funktionstest
1. Mit User A im Druck-Mode Punkte machen.
2. Auf zweitem Gerät/Browser mit anderem User starten.
3. In den Druck-Mode wechseln → Top-10 sollte den Druck-Score von User A enthalten.

## 4) Fallback
Falls die neue RPC noch nicht vorhanden ist, nutzt die App für Normal-Mode automatisch den Legacy-Call `submit_score` als Fallback.


## Copy-Paste SQL (direkt)
Den vollständigen SQL-Code findest du 1:1 in `supabase_split_mode.sql`.
Für den schnellen Copy/Paste-Flow:
1. Datei `supabase_split_mode.sql` öffnen.
2. Alles markieren und kopieren.
3. In Supabase SQL Editor einfügen und ausführen.

Tipp: Wenn bereits Daten existieren, ist das Skript idempotent ausgelegt (`if not exists`, `drop ... if exists`).

## 5) Feedback aus der App
Die Nachricht an den Entwickler wird ohne Mail-App direkt in Supabase gespeichert (`feedback_messages`).
Dafür wird absichtlich die Empfängeradresse auch als `sender_email` verwendet, damit Nutzer keine Mailadresse eingeben müssen.


## 6) E-Mail-Zustellung aktivieren (Edge Function)
Damit Feedback **nicht nur gespeichert**, sondern auch an die Empfängeradresse gesendet wird:

1. Supabase CLI installieren und einloggen.
2. Secret setzen:
   - `supabase secrets set RESEND_API_KEY=DEIN_RESEND_API_KEY`
3. Edge Function deployen:
   - `supabase functions deploy send-feedback-email --no-verify-jwt`
4. In Resend sicherstellen, dass die `from`-Adresse (hier Entwickleradresse) als Sender verifiziert ist.

Danach ruft die App beim Absenden zusätzlich die Function `send-feedback-email` auf und verschickt die Mail serverseitig.
