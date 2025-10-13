#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import child from 'child_process';

const mappingPath = path.resolve('field-mapping.json');
const srcPath = path.resolve('src/pdf/da2977.ts');
const distPath = path.resolve('dist/src/pdf/da2977.js');
if (!fs.existsSync(mappingPath)) { console.error('missing', mappingPath); process.exit(1); }
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const candidates = mapping.candidates || [];
const logicals = ['id','subtask','hazard','initialrisk','control','implementation','residualrisk','who','when'];

function levenshtein(a,b){ const A=String(a||''),B=String(b||''); const m=A.length,n=B.length; const dp=Array.from({length:m+1},()=>Array(n+1).fill(0)); for(let i=0;i<=m;i++)dp[i][0]=i; for(let j=0;j<=n;j++)dp[0][j]=j; for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=A[i-1]===B[j-1]?0:1; dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c);} return dp[m][n]; }

function normalize(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'_'); }

function pickBest(logical){
  const token = logical.replace(/[^a-z0-9]/gi,'').toLowerCase();
  // exact suggestion first
  if (mapping.suggestions && mapping.suggestions[logical] && mapping.suggestions[logical].length) return mapping.suggestions[logical][0];
  let best=null; let bestScore=Infinity;
  for(const c of candidates){
    const norm = normalize(c.norm||c.raw||'');
    if (!norm) continue;
    if (norm.includes(token)) return c.raw;
    const parts = norm.split('_').filter(Boolean);
    for(const p of parts){ const d=levenshtein(p, token); if (d<bestScore){ best=c.raw; bestScore=d; } }
    const d2 = levenshtein(norm, token);
    if (d2<bestScore){ best=c.raw; bestScore=d2; }
  }
  return best;
}

const chosen = {};
for(const L of logicals){ const pick = pickBest(L); if (pick) chosen[L]=pick; }
console.log('Chosen mappings:', chosen);

if (Object.keys(chosen).length===0){ console.log('No mappings chosen — abort'); process.exit(0); }

function patchFile(filePath){
  if (!fs.existsSync(filePath)) { console.warn('file missing', filePath); return; }
  let src = fs.readFileSync(filePath, 'utf8');
  // find insertion point after FIELD_CANDIDATES[4].id assignment
  const marker = 'FIELD_CANDIDATES[4].id =';
  const idx = src.indexOf(marker);
  let insertAt = 0;
  if (idx!==-1){
    const sem = src.indexOf('];', idx);
    insertAt = sem !== -1 ? sem + 2 : idx + marker.length;
  } else {
    // fallback: after initial candidate map loop
    const loopEnd = src.indexOf('FIELD_CANDIDATES[4]');
    insertAt = loopEnd!==-1? loopEnd: 0;
  }

  let block = '\n// Aggressive auto-mapped candidates inserted by script\n';
  for(let n=4;n<=9;n++){
    for(const [logical, raw] of Object.entries(chosen)){
      const key = logical;
      const safeRaw = raw.replace(/`/g,'\\`');
      block += `FIELD_CANDIDATES[${n}].${key} = [\n  `+"`"+safeRaw+"`"+`,\n  ...FIELD_CANDIDATES[${n}].${key},\n];\n\n`;
    }
  }
  if (!src.includes('// Aggressive auto-mapped candidates inserted by script')){
    src = src.slice(0, insertAt) + block + src.slice(insertAt);
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('Patched', filePath);
  } else {
    console.log('Already patched', filePath);
  }
}

patchFile(srcPath);
patchFile(distPath);

// run integration
try{
  console.log('Running integration...');
  child.execSync('node dist/scripts/integrate.js data/hazards.json', { stdio: 'inherit' });
}catch(e){ console.error('Integration failed', e); process.exit(1); }

console.log('Done — check filled-all.pdf');
