import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

function normalize(s) {
  if (!s) return '';
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

async function writeMapping(path, outJson) {
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

  const suggestions = {};
  for (const lf of LOGICAL_FIELDS) {
    const matches = candidates.filter(c => c.norm.includes(lf));
    suggestions[lf] = matches.map(m => m.raw);
  }

  fs.writeFileSync(outJson, JSON.stringify({ suggestions, candidates }, null, 2), 'utf8');
  console.log('Wrote mapping to', outJson);
}

const path = process.argv[2] || 'draw2297.pdf';
const out = process.argv[3] || 'field-mapping.json';
writeMapping(path, out).catch((e) => { console.error(e); process.exit(1); });
