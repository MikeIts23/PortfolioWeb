# Audio previews

Drop the beat and loop previews here as MP3.

**Naming** — the player derives each filename from the title in
`assets/js/data.js`: lowercase, apostrophes dropped, everything else
non-alphanumeric turned into a dash.

| Title | Expected file |
| --- | --- |
| `ASHES OF ME` | `ashes-of-me.mp3` |
| `MY FATHER'S RECORD` | `my-fathers-record.mp3` |
| `711` | `711.mp3` |

Loops use a `loop-` prefix: `DO U LIKE IT` → `loop-do-u-like-it.mp3`,
`DAD'S VINYL` → `loop-dads-vinyl.mp3`.

Until a file exists, the player falls back to a royalty-free demo track so the
UI stays usable. Set `DEMO_FALLBACK = false` in `assets/js/data.js` to turn the
fallback off once the real previews are uploaded.

## How the previews are made

Every preview so far uses the same settings, so the catalog plays at an even
volume. Keep new ones consistent:

- **Length:** a whole number of bars, cut on a phrase boundary. 24 bars is about
  52s at 110 BPM. Pick the strongest section, not a quiet intro.
- **Fades:** 20ms in (no click), last 2 bars out.
- **Loudness:** −14 LUFS integrated, true peak ≤ −1 dBTP, two-pass `loudnorm`.
- **Encoding:** MP3, 160 kbps CBR, 44.1 kHz stereo — about 1 MB per minute.
- **Tags:** title `<TITLE> (preview)`, artist `MikeB`, `TBPM`, `TKEY`.

The preview is what visitors hear and can download; the full file stays off the
site and goes out on request.
