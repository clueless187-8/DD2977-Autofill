import { resolveFieldName } from "./da2977-resolver";

// Candidate field names for sections 4-9.
// These are best-effort guesses following common naming conventions. Replace or
// extend them with your real AcroForm field names if you have them.
const FIELD_CANDIDATES: Record<number, Record<string, string[]>> = {};

// Use a canonical single candidate name per logical field: section{n}_{field}
const LOGICAL_FIELDS = [
  "id",
  "subtask",
  "hazard",
  "initialRisk",
  "control",
  "implementation",
  "residualRisk",
  "who",
  "when",
];

for (let n = 4; n <= 9; n++) {
  const map: Record<string, string[]> = {};
  for (const f of LOGICAL_FIELDS) {
    map[f] = [`section${n}_${f}`];
  }
  FIELD_CANDIDATES[n] = map;
}

// Auto-generated best-effort raw-name mappings. These are defensive: they
// prepend a likely raw AcroForm field name per logical field for sections 4..9
// so runtime resolution can pick up obfuscated PDF field names. We mirror both
// camelCase and lowercase logical names to be tolerant of older injected code.
const AUTO_RAW: Record<string, string> = {
  id: "\u000bÍØðqAÄŁ⁄/µØÀÆj‰¢0c$\u000b˙+˛jý:ÅØ³IAísﬁD\u0005Œd½gÞÏÏ\rˇp€HÔÃ¬¹\u0001>�®é\u0010NRy-˚",
  subtask: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  hazard: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  initialRisk: `\u0004⁄¶0"ÝäVÝa{n=„\\çWØ½9B\u000fZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕ\u0001Fµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  control: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  implementation: `¼ðÊ\u000e=mﬂ1™t¯“µ¤’ÕF]\u0005¸þão-\b:nÔì*±Mì†ˆ´w¥\u0013~\rÊF²\u0005\r¼q`,
  residualRisk: `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`,
  who: `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`,
  when: `ü%O\u0012sÿ?\u0002£µ”\u0003\u00175¿ıQ…ZVÁ\rÂbaÙ\ríŸ0´@–\\î¶Ï†‹éÐï\u0014/NGª\u0015½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
};

for (let n = 4; n <= 9; n++) {
  for (const key of LOGICAL_FIELDS) {
    const raw = AUTO_RAW[key as keyof typeof AUTO_RAW] || AUTO_RAW[key.toLowerCase()];
    if (!raw) continue;
    // Ensure the candidate list exists and prepend the raw name.
    FIELD_CANDIDATES[n][key] = [raw, ...(FIELD_CANDIDATES[n][key] || [])];
    // Also mirror lowercase to be tolerant of older code
    const lower = key.toLowerCase();
    FIELD_CANDIDATES[n][lower] = [raw, ...(FIELD_CANDIDATES[n][lower] || [])];
  }
}

// Top-match suggestions derived from the PDF field names (bigram similarity).
// These were chosen automatically; they are applied defensively across sections
// 4..9 so resolveFieldName has a concrete raw name to test at runtime.
const TOP_MATCHES = {
  id: 'm\u000eãl(¡˚ ˛ËÂ\u0003?A\u0007——\tfiÈ \n ‰\rÉÝ|¡âÁ2A\u000eý¯\u0015‘a¤ðæ9ew¶ä',
  subtask: 'V„»é�m%Èë\n\t\rˇ˛J\u00071ä2�uØ;øb¬GÉŒ\u0015ÑÖłzò„+Gü\b{x\u000fˇãÎå8F',
  hazard: '\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü',
  initialRisk: 'Ä\\ù&\\u0001û`e&#[Wí>\u0002¿}ðÅ&Ë–"Tº³c�6\\u0007\\u00013N¶«I\tÏ½ãñ×OQ¦D÷9C}t§àXˇÑ…\\u0002\\u0005\\u0017É\\u0013¤Ó¹',
  control: 'ðžäR·.Ç/Ñ\\u0007\\u0002o}\\u0003SêÄÅ`Gõ\\u000fT˘\\u0002®Ý©ë¸\\u0005”ê\\u0017|‰Rö=\\n]ÒÖ»£G4óëƒäùâ¹Kîò\\u0003³N±½KJ',
  implementation: '−eÐÎ–ü±r\\u0000ŸöŽè\\u0001ﬂra§‰äí\\u0017NûÒ\\u0003\\u0014−\\bðTúEbz"1káý?“Åå0îvóBÁ˜[ú¥zâž³J™M—Pö',
  residualRisk: '\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü',
  who: 'ü%O\u0012sÿ?\u0002£µ”\u0003\u00175¿ıQ…ZVÁ\rÂbaÙ\ríŸ0´@–\\\î¶Ï†‹éÐï\\u0014/NGª\\u0015½‚°ÒŁêwHÎÑÍÔ“Ê½N',
  when: '\u0010PłÈ†C)(−öéžG¡†H³Õºe³\u0015ÕnÃ{\u0005p!Tš\\fº~€−§\\ \ ·ˆ;O`¦¨c¼'
};

for (let n = 4; n <= 9; n++) {
  const m = FIELD_CANDIDATES[n] || (FIELD_CANDIDATES[n] = {} as any);
  for (const k of Object.keys(TOP_MATCHES)) {
    const val = TOP_MATCHES[k as keyof typeof TOP_MATCHES];
    if (!val) continue;
    m[k] = [val, ...(m[k] || [])];
    m[k.toLowerCase()] = [val, ...(m[k.toLowerCase()] || [])];
  }
}

// Auto-applied top-match raw candidates per logical field (explicit mapping)
for (let n = 4; n <= 9; n++) {
  FIELD_CANDIDATES[n].id = [
    "m\u000eãl(¡˚ ˛ËÂ\u0003?A\u0007——\tfiÈ \n ‰\rÉÝ|¡âÁ2A\u000eý¯\u0015‘a¤ðæ9ew¶ä",
    ...(FIELD_CANDIDATES[n].id || []),
  ];
  FIELD_CANDIDATES[n].subtask = [
    "V„»é�m%Èë\t\rˇ˛J\u00071ä2�uØ;øb¬GÉŒ\u0015ÑÖłzò„+Gü\\b{x\u000fˇãÎå8F",
    ...(FIELD_CANDIDATES[n].subtask || []),
  ];
  FIELD_CANDIDATES[n].hazard = [
    "\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�\"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü",
    ...(FIELD_CANDIDATES[n].hazard || []),
  ];
  FIELD_CANDIDATES[n].initialRisk = [
    "Ä\\ù&\\u0001û`e&#[Wí>\\u0002¿}ðÅ&Ë–\"Tº³c�6\\u0017\\u0013N¶«I\\tÏ½ãñ×OQ¦D÷9C}t§àXˇÑ…\\u0002\\u0005\\u0017É\\u0013¤Ó¹",
    ...(FIELD_CANDIDATES[n].initialRisk || []),
  ];
  FIELD_CANDIDATES[n].control = [
    "ðžäR·.Ç/Ñ\\u0007\\u0002o}\\u0003SêÄÅ`Gõ\\u000fT˘\\u0002®Ý©ë¸\\u0005”ê\\u0017|‰Rö=\\n]ÒÖ»£G4óëƒäùâ¹Kîò\\u0003³N±½KJ",
    ...(FIELD_CANDIDATES[n].control || []),
  ];
  FIELD_CANDIDATES[n].implementation = [
    "−eÐÎ–ü±r\\u0000ŸöŽè\\u0001ﬂra§‰äí\\u0017NûÒ\\u0003\\u0014−\\bðTúEbz\"1káý?“Åå0îvóBÁ˜[ú¥zâž³J™M—Pö",
    ...(FIELD_CANDIDATES[n].implementation || []),
  ];
  FIELD_CANDIDATES[n].residualRisk = [
    "\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�\"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü",
    ...(FIELD_CANDIDATES[n].residualRisk || []),
  ];
  FIELD_CANDIDATES[n].who = [
    "ü%O\u0012sÿ?\\u0002£µ”\\u0003\\u00175¿ıQ…ZVÁ\\rÂbaÙ\\ríŸ0´@–\\\\î¶Ï†‹éÐï\\u0014/NGª\\u0015½‚°ÒŁêwHÎÑÍÔ“Ê½N",
    ...(FIELD_CANDIDATES[n].who || []),
  ];
  FIELD_CANDIDATES[n].when = [
    "\u0010PłÈ†C)(−öéžG¡†H³Õºe³\\u0015ÕnÃ{\\u0005p!Tš\\fº~€−§\\ \\ ·ˆ;O`¦¨c¼",
    ...(FIELD_CANDIDATES[n].when || []),
  ];
}

// Final auto-top picks for fields that still reported missing in the run
for (let n = 4; n <= 9; n++) {
  FIELD_CANDIDATES[n].initialRisk = [
    "Ä\\ù&\\u0001û`e&#[Wí>\\u0002¿}ðÅ&Ë–\"Tº³c�6\\u0017\\u0013N¶«I\\tÏ½ãñ×OQ¦D÷9C}t§àXˇÑ…\\u0002\\u0005\\u0017É\\u0013¤Ó¹",
    ...(FIELD_CANDIDATES[n].initialRisk || []),
  ];
  FIELD_CANDIDATES[n].implementation = [
    "−eÐÎ–ü±r\\u0000ŸöŽè\\u0001ﬂra§‰äí\\u0017NûÒ\\u0003\\u0014−\\bðTúEbz\"1káý?“Åå0îvóBÁ˜[ú¥zâž³J™M—Pö",
    ...(FIELD_CANDIDATES[n].implementation || []),
  ];
  FIELD_CANDIDATES[n].when = [
    "PłÈ†C)(−öéžG¡†H³Õºe³ÕnÃ{p!Tš",
    ...(FIELD_CANDIDATES[n].when || []),
  ];
}

// Apply top-6 suggestions per logical field (from tmp/top6.json) to expand candidates
const TOP6 = JSON.parse(
  `
${require('fs').readFileSync(__dirname + '/../../tmp/top6.json', 'utf8')}
`
);
for (let n = 4; n <= 9; n++) {
  const m = FIELD_CANDIDATES[n] || (FIELD_CANDIDATES[n] = {} as any);
  for (const key of Object.keys(TOP6)) {
    const arr: string[] = TOP6[key] || [];
    if (!Array.isArray(arr) || arr.length === 0) continue;
    // Prepend all top6 candidates defensively, preserving existing list
    m[key] = [...arr, ...(m[key] || [])];
    m[key.toLowerCase()] = [...arr, ...(m[key.toLowerCase()] || [])];
  }
}

// Best-effort auto-mappings (defensive). These pick one likely raw AcroForm
// name per logical field and prepend it to the candidate list for sections 4-9.
// Use defensive spreads (FIELD_CANDIDATES[n].x || []) to avoid import-time
// exceptions if arrays are missing or were programmatically changed.
const AUTO_ID = `\u000bÍØðqAÄŁ⁄/µØÀÆj‰¢0c$\u000b˙+˛jý:ÅØ³IAísﬁD\u0005Œd½gÞÏÏ\rˇp€HÔÃ¬¹\u0001>�®é\u0010NRy-˚`;
const AUTO_SUBTASK = `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`;
const AUTO_HAZARD = AUTO_SUBTASK;
const AUTO_INITIAL = `\u0004⁄¶0"ÝäVÝa{n=„\\çWØ½9B\u000fZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕ\u0001Fµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`;
const AUTO_CONTROL = AUTO_SUBTASK;
const AUTO_IMPLEMENTATION = `¼ðÊ\u000e= mﬂ1™t¯“µ¤’ÕF]`;
const AUTO_RESIDUAL = `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`;
const AUTO_WHO = `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`;
const AUTO_WHEN = `ü%O\u0012sÿ?\u0002£µ”\u0003\u00175¿ıQ…ZVÁ\nÂbaÙ\níŸ0´@–\\î¶Ï†‹éÐï\u0014/NGª\u0015½‚°ÒŁêwHÎÑÍÔ“Ê½N`;

for (let n = 4; n <= 9; n++) {
  FIELD_CANDIDATES[n].id = [AUTO_ID, ...(FIELD_CANDIDATES[n].id || [])];
  FIELD_CANDIDATES[n].subtask = [AUTO_SUBTASK, ...(FIELD_CANDIDATES[n].subtask || [])];
  FIELD_CANDIDATES[n].hazard = [AUTO_HAZARD, ...(FIELD_CANDIDATES[n].hazard || [])];
  FIELD_CANDIDATES[n].initialRisk = [AUTO_INITIAL, ...(FIELD_CANDIDATES[n].initialRisk || [])];
  FIELD_CANDIDATES[n].control = [AUTO_CONTROL, ...(FIELD_CANDIDATES[n].control || [])];
  FIELD_CANDIDATES[n].implementation = [AUTO_IMPLEMENTATION, ...(FIELD_CANDIDATES[n].implementation || [])];
  FIELD_CANDIDATES[n].residualRisk = [AUTO_RESIDUAL, ...(FIELD_CANDIDATES[n].residualRisk || [])];
  FIELD_CANDIDATES[n].who = [AUTO_WHO, ...(FIELD_CANDIDATES[n].who || [])];
  FIELD_CANDIDATES[n].when = [AUTO_WHEN, ...(FIELD_CANDIDATES[n].when || [])];
}

// Auto-applied mapping for section 4: use first detected raw name for 'id' if present
FIELD_CANDIDATES[4].id = [
  "\u000bÍØðqAÄŁ⁄/µØÀÆj‰¢0c$\u000b˙+˛jý:ÅØ³IAísﬁD\u0005Œd½gÞÏÏ\rˇp€HÔÃ¬¹\u0001>�®é\u0010NRy-˚",
  ...FIELD_CANDIDATES[4].id,
];
// Aggressive auto-mapped candidates inserted by script
FIELD_CANDIDATES[4].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[4].id,
];

FIELD_CANDIDATES[4].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[4].subtask,
];

FIELD_CANDIDATES[4].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[4].hazard,
];

FIELD_CANDIDATES[4].initialRisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕFµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...FIELD_CANDIDATES[4].initialRisk,
];

FIELD_CANDIDATES[4].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[4].control,
];

FIELD_CANDIDATES[4].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[4].implementation,
];

FIELD_CANDIDATES[4].residualrisk = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...(FIELD_CANDIDATES[4].residualRisk || []),
];

FIELD_CANDIDATES[4].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[4].who,
];

FIELD_CANDIDATES[4].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[4].when,
];

FIELD_CANDIDATES[5].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[5].id,
];

FIELD_CANDIDATES[5].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[5].subtask,
];

FIELD_CANDIDATES[5].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[5].hazard,
];

FIELD_CANDIDATES[4].initialRisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕ\u0001Fµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...FIELD_CANDIDATES[4].initialRisk,
];

FIELD_CANDIDATES[5].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[5].control,
];

FIELD_CANDIDATES[5].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[5].implementation,
];

FIELD_CANDIDATES[4].residualRisk = [
  `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[4].residualRisk,
];

FIELD_CANDIDATES[5].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[5].who,
];

FIELD_CANDIDATES[5].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[5].when,
];

FIELD_CANDIDATES[6].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[6].id,
];

FIELD_CANDIDATES[6].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[6].subtask,
];

FIELD_CANDIDATES[6].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[6].hazard,
];

FIELD_CANDIDATES[5].initialRisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕ\u0001Fµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...FIELD_CANDIDATES[5].initialRisk,
];

FIELD_CANDIDATES[6].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[6].control,
];

FIELD_CANDIDATES[6].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[6].implementation,
];

FIELD_CANDIDATES[5].residualRisk = [
  `\bhQ�ÀÅì\u0002ﬂ\u0012ìﬂi0ö…V˝Ó´+’gºc˙\u0017ÐAAiÈ=\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\u0003ÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[5].residualRisk,
];

FIELD_CANDIDATES[6].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[6].who,
];

FIELD_CANDIDATES[6].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[6].when,
];

FIELD_CANDIDATES[7].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[7].id,
];

FIELD_CANDIDATES[7].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[7].subtask,
];

FIELD_CANDIDATES[7].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[7].hazard,
];

FIELD_CANDIDATES[7].initialrisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕFµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...(FIELD_CANDIDATES[7].initialRisk || []),
];

FIELD_CANDIDATES[7].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[7].control,
];

FIELD_CANDIDATES[7].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[7].implementation,
];

FIELD_CANDIDATES[7].residualrisk = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...(FIELD_CANDIDATES[7].residualRisk || []),
];

FIELD_CANDIDATES[7].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[7].who,
];

FIELD_CANDIDATES[7].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[7].when,
];

FIELD_CANDIDATES[8].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[8].id,
];

FIELD_CANDIDATES[8].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[8].subtask,
];

FIELD_CANDIDATES[8].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[8].hazard,
];

FIELD_CANDIDATES[8].initialrisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕFµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...(FIELD_CANDIDATES[8].initialRisk || []),
];

FIELD_CANDIDATES[8].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[8].control,
];

FIELD_CANDIDATES[8].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[8].implementation,
];

FIELD_CANDIDATES[8].residualrisk = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...(FIELD_CANDIDATES[8].residualRisk || []),
];

FIELD_CANDIDATES[8].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[8].who,
];

FIELD_CANDIDATES[8].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[8].when,
];

FIELD_CANDIDATES[9].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[9].id,
];

FIELD_CANDIDATES[9].subtask = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[9].subtask,
];

FIELD_CANDIDATES[9].hazard = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[9].hazard,
];

FIELD_CANDIDATES[9].initialrisk = [
  `⁄¶0"ÝäVÝa{n=„\çWØ½9BZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕFµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  ...(FIELD_CANDIDATES[9].initialRisk || []),
];

FIELD_CANDIDATES[9].control = [
  `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  ...FIELD_CANDIDATES[9].control,
];

FIELD_CANDIDATES[9].implementation = [
  `¼ðÊ=mﬂ1™t¯“µ¤’ÕF]¸þão-:nÔì*±Mì†ˆ´w¥~
ÊF²
¼q`,
  ...FIELD_CANDIDATES[9].implementation,
];

FIELD_CANDIDATES[9].residualrisk = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...(FIELD_CANDIDATES[9].residualRisk || []),
];

FIELD_CANDIDATES[9].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[9].who,
];

FIELD_CANDIDATES[9].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[9].when,
];



FIELD_CANDIDATES[9].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[9].when,
];


FIELD_CANDIDATES[9].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[9].who,
];


FIELD_CANDIDATES[8].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[8].when,
];


FIELD_CANDIDATES[8].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[8].who,
];


FIELD_CANDIDATES[7].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[7].when,
];


FIELD_CANDIDATES[7].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[7].who,
];


FIELD_CANDIDATES[6].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[6].when,
];


FIELD_CANDIDATES[6].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[6].who,
];


FIELD_CANDIDATES[5].when = [
  `ü%Osÿ?£µ”5¿ıQ…ZVÁ
ÂbaÙ
íŸ0´@–\\î¶Ï†‹éÐï/NGª½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
  ...FIELD_CANDIDATES[5].when,
];


FIELD_CANDIDATES[5].who = [
  `hQ�ÀÅìﬂìﬂi0ö…V˝Ó´+’gºc˙ÐAAiÈ=ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…WﬁƒˇÁâHÒ˙�Ç¾ü`,
  ...FIELD_CANDIDATES[5].who,
];


FIELD_CANDIDATES[9].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[9].id,
];


FIELD_CANDIDATES[8].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[8].id,
];


FIELD_CANDIDATES[7].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[7].id,
];


FIELD_CANDIDATES[6].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[6].id,
];


FIELD_CANDIDATES[5].id = [
  `ÍØðqAÄŁ⁄/µØÀÆj‰¢0c$˙+˛jý:ÅØ³IAísﬁDŒd½gÞÏÏ
ˇp€HÔÃ¬¹>�®éNRy-˚`,
  ...FIELD_CANDIDATES[5].id,
];


function tryWriteField(form: any, fieldName: string, value: any): boolean {
  try {
    // pdf-lib style: getTextField returns a field object with setText
    if (typeof form.getTextField === "function") {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          if (typeof field.setText === "function") {
            field.setText(String(value));
            return true;
          }
          // some libs expose set; try common names
          if (typeof field.set === "function") {
            field.set(String(value));
            return true;
          }
        }
      } catch {
        // missing field -> continue trying other APIs
      }
    }

    // generic getField
    if (typeof form.getField === "function") {
      try {
        const f = form.getField(fieldName);
        if (f) {
          if (typeof f.setText === "function") {
            f.setText(String(value));
            return true;
          }
          if (typeof f.set === "function") {
            f.set(String(value));
            return true;
          }
          // fallback: assign a value property
          if ("value" in f) {
            f.value = String(value);
            return true;
          }
        }
      } catch {
        // ignore
      }
    }

    // direct setter on form
    if (typeof form.setTextField === "function") {
      try {
        form.setTextField(fieldName, String(value));
        return true;
      } catch {
        // ignore
      }
    }

    // look for simple maps
    if (form.fields && fieldName in form.fields) {
      try {
        const f = form.fields[fieldName];
        if (f && typeof f.setText === "function") {
          f.setText(String(value));
          return true;
        }
        if (f) {
          f.value = String(value);
          return true;
        }
      } catch {
        // ignore
      }
    }

    if (form.acroForm && fieldName in form.acroForm) {
      try {
        form.acroForm[fieldName] = String(value);
        return true;
      } catch {
        // ignore
      }
    }

    // last resort: some libraries provide a generic setFieldValue
    if (typeof form.setFieldValue === "function") {
      try {
        form.setFieldValue(fieldName, String(value));
        return true;
      } catch {
        // ignore
      }
    }
  } catch {
    // swallow any unexpected errors per-field
  }
  return false;
}

export function fillSectionWithResolver(form: any, sectionIndex: number, section: any) {
  return fillSectionWithResolverStrict(form, sectionIndex, section, { strict: false });
}

// Backwards-compatible strict variant. If `strict` is true a missing 'id'
// will throw (previous behavior). Default is non-strict: collect missing fields
// and continue so integration can process all sections.
export function fillSectionWithResolverStrict(
  form: any,
  sectionIndex: number,
  section: any,
  opts: { strict?: boolean } = {}
) {
  const sectionNumber = 4 + sectionIndex;
  const candidatesMap = FIELD_CANDIDATES[sectionNumber];
  if (!candidatesMap) {
    if (opts.strict) throw new Error(`No candidate map for section ${sectionNumber}`);
    return { section: sectionNumber, missingFields: Object.keys(LOGICAL_FIELDS) };
  }

  const missingFields: string[] = [];

  for (const [logicalName, candidateList] of Object.entries(candidatesMap)) {
    const resolved = resolveFieldName(form, candidateList);
    if (!resolved) {
      if (logicalName === 'id' && opts.strict) {
        throw new Error(`Could not resolve field for section ${sectionNumber} 'id'`);
      }
      missingFields.push(logicalName);
      continue;
    }

    const value = section[logicalName as keyof typeof section];
    // Skip undefined/null values
    if (value === undefined || value === null) continue;

    const written = tryWriteField(form, resolved, value);
    if (!written) missingFields.push(logicalName);
  }

  return { section: sectionNumber, missingFields };
}

