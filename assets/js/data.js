/* ==========================================================================
   Catalog data — the single place to edit the site's content.

   To add a beat: append a row to BEATS. Columns are
   [title, bpm, key, tag, color, genre].
   The audio file is looked up at assets/audio/<slug>.mp3, where <slug> is the
   title lowercased with non-alphanumerics turned into dashes
   ("MY FATHER'S RECORD" -> my-father-s-record.mp3).
   While a file is missing, the player falls back to a royalty-free demo track
   so the UI stays usable — set DEMO_FALLBACK to false to disable that.
   ========================================================================== */

window.MIKEB = (function () {
  'use strict';

  var EMAIL = 'beatzzmike@gmail.com';
  var INSTAGRAM = '@mikebeatzzz';
  var DEMO_FALLBACK = true;

  var ORANGE = '#FF5C00',
    GRAY = '#9A958B',
    GREEN = '#10B981',
    SKY = '#38BDF8',
    INDIGO = '#818CF8',
    PINK = '#F472B6';

  // [title, bpm, key, tag, color, genre]
  var BEATS = [
    ['ASHES OF ME', '77', 'C min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['MY FATHER’S RECORD', '82', 'F min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['BEBO DREAM', '117', 'C# min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['TRUST ISSUE', '112', 'F min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['GLASS OF RED', '140', 'C min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['CIANGRETTA FAM', '146', 'D min', 'TRAP SOUL', ORANGE, 'trap-soul'],
    ['JAGUAR', '164', 'D# min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['THE THRONE', '142', 'D# min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['CASTELLO', '132', 'D min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['DONNA CHIARA', '145', 'D# min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['REVERSE DT', '160', 'D# min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['STYLES', '160', 'E min', 'DARK TRAP', GRAY, 'dark-trap'],
    ['AMALFI', '94', 'D min', 'ATMO RNB', SKY, 'atmo-rnb'],
    ['SHIRIGAMI', '124', 'D# min', 'ATMO RNB', SKY, 'atmo-rnb'],
    ['RELIEVE URSELF', '113', 'E min', 'ATMO RNB', SKY, 'atmo-rnb'],
    ['MOTEL RUNAWAY', '146', 'G min', 'ATMO RNB', SKY, 'atmo-rnb'],
    ['BLUE HOUR', '98', 'A min', 'ATMO RNB', SKY, 'atmo-rnb'],
    ['THE TRUE ME', '163', 'B min', 'RNB', PINK, 'rnb'],
    ['AUDIO', '86', 'D min', 'RNB', PINK, 'rnb'],
    ['GIRLS TRIPPPP', '118', 'D# min', 'RNB', PINK, 'rnb'],
    ['IN MY LAP', '128', 'D min', 'RNB', PINK, 'rnb'],
    ['SUNDAY TAPE', '90', 'G min', 'RNB', PINK, 'rnb'],
    ['HARDWORK', '146', 'E min', 'DRILL', INDIGO, 'drill'],
    ['TRAGEDY', '170', 'B min', 'DRILL', INDIGO, 'drill'],
    ['BANNED VAMPIRE', '137', 'C min', 'DRILL', INDIGO, 'drill'],
    ['711', '137', 'C min', 'DRILL', INDIGO, 'drill'],
    ['BILLIONAIRE', '160', 'B min', 'DRILL', INDIGO, 'drill'],
    ['PORTAL RIFT', '137', 'F min', 'DRILL', INDIGO, 'drill'],
    ['SOHO LIGHTS', '136', 'A min', 'UK GARAGE', GREEN, 'uk-garage'],
    ['LATE TRAIN', '134', 'F# min', 'UK GARAGE', GREEN, 'uk-garage'],
    ['STICKS', '133', 'G min', 'UK GARAGE', GREEN, 'uk-garage'],
    ['CHROME HEARTS', '140', 'C min', 'UK GARAGE', GREEN, 'uk-garage'],
    ['BASEMENT SOUL', '132', 'D min', 'UK GARAGE', GREEN, 'uk-garage']
  ];

  // [title, bpm, key, tag, color, genre, instrumentation]
  var LOOPS = [
    ['DAD’S VINYL', '82', 'F min', 'TRAP SOUL', ORANGE, 'trap-soul', 'Soul flip · Rhodes'],
    ['SMOKE ROOM', '88', 'C min', 'TRAP SOUL', ORANGE, 'trap-soul', 'Jazz guitar'],
    ['BLUES IN A', '76', 'A min', 'TRAP SOUL', ORANGE, 'trap-soul', 'Blues gtr · tape'],
    ['NIGHT CALL', '140', 'D# min', 'DARK TRAP', GRAY, 'dark-trap', 'Dark keys'],
    ['CORRIDOR', '146', 'D min', 'DARK TRAP', GRAY, 'dark-trap', 'Cinematic strings'],
    ['ASHTRAY', '132', 'G min', 'DARK TRAP', GRAY, 'dark-trap', 'Detuned bells'],
    ['SILK DOOR', '96', 'A min', 'ATMO RNB', SKY, 'atmo-rnb', 'Pads · vox chop'],
    ['WATER LIGHT', '104', 'E min', 'ATMO RNB', SKY, 'atmo-rnb', 'Ambient keys'],
    ['DO U LIKE IT', '110', 'G min', 'RNB', PINK, 'rnb', ''],
    ['SLOW BURN', '88', 'D min', 'RNB', PINK, 'rnb', 'Rhodes · bass'],
    ['SUNDAY MORNING', '90', 'G min', 'RNB', PINK, 'rnb', 'Soul chops'],
    ['ENDZ', '142', 'B min', 'DRILL', INDIGO, 'drill', 'Sliding bass · gtr'],
    ['GLASSHOUSE', '144', 'F min', 'DRILL', INDIGO, 'drill', 'Dark flute'],
    ['2-STEP SOUL', '134', 'A min', 'UK GARAGE', GREEN, 'uk-garage', 'Chopped vox'],
    ['PIRATE FM', '136', 'C min', 'UK GARAGE', GREEN, 'uk-garage', 'Organ bass']
  ];

  var SOUND_GENRES = [
    ['Trap Soul', 'Punchy minimal drums under soul, jazz and blues samples. Warm, emotional, few notes.'],
    ['Dark Trap', 'Colder shades when the mood calls for it: heavy 808s, tense keys, cinematic space.'],
    ['Atmo RnB', 'Wide atmospheres, airy pads and vocal textures. Depth before density.'],
    ['RnB', 'Chords first. Rhodes, live keys and soul chops with room to sing.'],
    ['Drill', 'Precise drum programming, sliding bass, dark melodies with restraint.'],
    ['UK Garage', 'Swung two-step grooves, chopped vocals and basement-soul energy.']
  ];

  // [title, tag, description, tools]
  var SKILLS = [
    ['DAW Production', 'Core', 'Fluent in almost every major DAW. Full beats built from scratch, arranged and bounced session-ready.', 'FL Studio · Ableton · Logic · Studio One'],
    ['Samplemaking', 'Sources', 'Soul, jazz and blues sources played, recorded and chopped by hand, the emotion the beat is built on.', 'Vinyl · Tape · Live takes'],
    ['Loopmaking', 'Melody', 'Original melodic loops and sample flips, the hook that carries the whole record.', 'Serum · Omnisphere · Keyscape'],
    ['Drum Programming', 'Rhythm', 'Punchy, minimal patterns and custom 808 design. Few notes, precise placement, groove that knocks.', '808 design · Custom kits · Swing'],
    ['Drums', 'Instrument', 'Played drums first, produced second. Live grooves and fills tracked in when a beat needs a human feel.', 'Live kit · Fills · Feel'],
    ['Mix & Master', 'Engineering', 'Clean, loud, radio-ready mixes, balanced low end and punch that translates everywhere.', 'EQ · Comp · Saturation · Limiting'],
    ['DJing', 'Live', 'Reading a room and blending sets live. Transitions, energy and crowd control.', 'Sets · Transitions · Curation'],
    ['Piano', 'Instrument', 'Keys behind the chord progressions and melodies that give every beat its emotion.', 'Chords · Progressions · Melody'],
    ['Guitar', 'Instrument', 'Live guitar lines and textures layered in for organic, cinematic depth.', 'Riffs · Textures · Live takes']
  ];

  var REELS = [
    { id: 'reel-1', title: 'Beat Preview' },
    { id: 'reel-2', title: 'Studio Session' },
    { id: 'reel-3', title: 'Pack Drop' },
    { id: 'reel-4', title: 'Behind The Beat' }
  ];

  /* ---------- derived ---------- */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function slug(title) {
    return title
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function demo(n) {
    return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-' + n + '.mp3';
  }

  function mailto(subject) {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject);
  }

  var beats = BEATS.map(function (r, i) {
    return {
      id: 'b' + i,
      num: pad(i + 1),
      title: r[0],
      bpm: r[1],
      key: r[2],
      tag: r[3],
      color: r[4],
      genres: r[5],
      src: 'assets/audio/' + slug(r[0]) + '.mp3',
      fallback: DEMO_FALLBACK ? demo((i % 16) + 1) : '',
      mailto: mailto('Beat Placement Request – ' + r[0])
    };
  });

  var loops = LOOPS.map(function (r, i) {
    return {
      id: 'l' + i,
      num: pad(i + 1),
      title: r[0],
      bpm: r[1],
      key: r[2],
      tag: r[3],
      color: r[4],
      genres: r[5],
      instr: r[6],
      src: 'assets/audio/loop-' + slug(r[0]) + '.mp3',
      fallback: DEMO_FALLBACK ? demo(((i + 5) % 16) + 1) : '',
      mailto: mailto('Loop Request – ' + r[0])
    };
  });

  var soundGenres = SOUND_GENRES.map(function (r, i) {
    return { num: pad(i + 1), title: r[0], desc: r[1] };
  });

  var producerSkills = SKILLS.map(function (r, i) {
    return { num: pad(i + 1), title: r[0], tag: r[1], desc: r[2], tools: r[3] };
  });

  return {
    email: EMAIL,
    instagram: INSTAGRAM,
    instaUrl: 'https://instagram.com/' + INSTAGRAM.replace('@', ''),
    mailtoPlain: 'mailto:' + EMAIL,
    beats: beats,
    loops: loops,
    soundGenres: soundGenres,
    producerSkills: producerSkills,
    reels: REELS
  };
})();
