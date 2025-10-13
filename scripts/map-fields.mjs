import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

function normalize(s) {
  if (!s) return '';
  // Normalize to simple ascii-like lowercase token string
  return s
    .toString()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

const LOGICAL_FIELDS = [
  'id', 'subtask', 'hazard', 'initialrisk', 'control', 'implementation', 'residualrisk', 'who', 'when'
];

async function mapFields(path) {
  if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
  }
  const data = fs.readFileSync(path);
  const pdfDoc = await PDFDocument.load(data, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const candidates = fields.map((f) => {
    let name = '';
    try { if (typeof f.getName === 'function') name = f.getName(); } catch(e) {}
    if (!name) name = f.name || '';
    const norm = normalize(name);
    return { raw: name, norm };
  });

  // For each logical field, find best candidate by token inclusion or similarity
  const suggestions = {};
  for (const lf of LOGICAL_FIELDS) {
    const matches = candidates.filter(c => c.norm.includes(lf));
    if (matches.length > 0) {
      suggestions[lf] = matches.map(m => m.raw);
      continue;
    }
    // fallback: token overlap
    const tokenMatches = candidates.filter(c => {
      return lf.split(/(?=[A-Z])|_/).some(tok => tok && c.norm.includes(tok));
    });
    if (tokenMatches.length > 0) suggestions[lf] = tokenMatches.map(m => m.raw);
    else suggestions[lf] = [];
  }

  console.log('Field mapping suggestions for', path);
  for (const lf of LOGICAL_FIELDS) {
    console.log(lf + ':', suggestions[lf].length ? suggestions[lf].slice(0,5) : ['<no match>']);
  }
  console.log('\nFull field list (normalized):');
  for (const c of candidates) console.log('-', c.norm || '<empty>', '=>', c.raw);
}

const path = process.argv[2] || 'draw2297.pdf';
mapFields(path).catch((e) => { console.error(e); process.exit(1); });
