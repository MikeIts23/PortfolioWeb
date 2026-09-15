# Audio previews

Drop the beat and loop previews here as MP3.

**Naming** — the player derives each filename from the title in
`assets/js/data.js`: lowercase, apostrophes dropped, everything else
non-alphanumeric turned into a dash.

| Title | Expected file |
| --- | --- |
| `ASHES OF ME` | `ashes-of-me.mp3` |
| `MY FATHER'S RECORD` | `my-father-s-record.mp3` |
| `711` | `711.mp3` |

Loops use a `loop-` prefix: `DAD'S VINYL` → `loop-dad-s-vinyl.mp3`.

Until a file exists, the player falls back to a royalty-free demo track so the
UI stays usable. Set `DEMO_FALLBACK = false` in `assets/js/data.js` to turn the
fallback off once the real previews are uploaded.

Keep previews short (60-90s) and around 128 kbps — they are streamed on page
interaction, not downloaded.
