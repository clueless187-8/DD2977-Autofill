#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const mappingPath = path.resolve('field-mapping.json');
const targetPath = path.resolve('src/pdf/da2977.ts');

if (!fs.existsSync(mappingPath)) {
  console.error('field-mapping.json not found');
  process.exit(1);
}
if (!fs.existsSync(targetPath)) {
  console.error('target file not found:', targetPath);
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const candidates = mapping.candidates || [];

// Logical fields we care about (normalized lowercase keys expected in suggestions)
const logicals = ['id','subtask','hazard','initialrisk','control','implementation','residualrisk','who','when'];

// Aggressive heuristics: substring match, token overlap, and short-string fuzzy match
function levenshtein(a, b) {
  const A = String(a || ''), B = String(b || '');
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function findCandidateFor(logical) {
  const token = logical.replace(/[^a-z0-9]/gi, '').toLowerCase();
  let best = null;
  let bestScore = Infinity;
  for (const c of candidates) {
    const norm = String(c.norm || '').toLowerCase();
    const raw = String(c.raw || '');
    // 1) exact substring match in norm
    if (norm.includes(token)) return raw;
    // 2) tokenized overlap
    const parts = norm.split(/[^a-z0-9]+/);
    for (const p of parts) {
      if (!p) continue;
      if (p === token) return raw;
      const d = levenshtein(p, token);
      if (d <= 2 && d < bestScore) {
        best = raw;
        bestScore = d;
      }
    }
    // 3) as fallback, compute levenshtein between norm and token (short norms)
    if (norm.length <= 12) {
      const d2 = levenshtein(norm, token);
      if (d2 < bestScore) {
        best = raw;
        bestScore = d2;
      }
    }
  }
  return best;
}

const found = {};
for (const L of logicals) {
  const r = findCandidateFor(L);
  if (r) found[L] = r;
}

if (Object.keys(found).length === 0) {
  console.log('No heuristic matches found to auto-map. Exiting.');
  process.exit(0);
}

console.log('Auto-mapper found candidates for:', Object.keys(found));

// Read target file and inject into FIELD_CANDIDATES for sections 5-9
let src = fs.readFileSync(targetPath, 'utf8');

// For each section 5..9 and each logical field with a found candidate, prepend the
// raw name into FIELD_CANDIDATES[section][field]
for (let n = 5; n <= 9; n++) {
  for (const [logical, raw] of Object.entries(found)) {
    // build the code snippet we expect to insert if not already present
    const marker = `FIELD_CANDIDATES[${n}].${logical}`;
    const escaped = raw.replace(/\\/g, '\\\\').replace(/`/g, '\`');
    const insertLine = `${marker} = [\n  \`${escaped}\`,\n  ...FIELD_CANDIDATES[${n}].${logical},\n];`;

    if (src.includes(insertLine)) continue; // already applied

    // naive: insert after the comment or after the FIELD_CANDIDATES[4].id block
    const insertAfter = "// Auto-applied mapping for section 4: use first detected raw name for 'id' if present";
    const pos = src.indexOf(insertAfter);
    if (pos !== -1) {
      // find end of that block (the next closing bracket "];\n") and insert after
      const blockEnd = src.indexOf('];', pos);
      if (blockEnd !== -1) {
        const insertAt = blockEnd + 2;
        src = src.slice(0, insertAt) + '\n\n' + insertLine + '\n' + src.slice(insertAt);
      }
    }
  }
}

fs.writeFileSync(targetPath, src, 'utf8');
console.log('Patched', targetPath, 'with auto-mappings (if any).');
