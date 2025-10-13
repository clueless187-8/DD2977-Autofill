import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function listFields(path) {
  if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
  }
  const data = fs.readFileSync(path);
  const pdfDoc = await PDFDocument.load(data, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const names = fields.map((f) => {
    try {
      if (typeof f.getName === 'function') return f.getName();
    } catch {
      // ignore
    }
    if (typeof f.name === 'string') return f.name;
    // fallback inspect
    return String(f);
  });
  console.log('Found', names.length, 'fields:');
  for (const n of names) console.log('-', n);
}

const path = process.argv[2] || 'draw2297.pdf';
listFields(path).catch((e) => { console.error(e); process.exit(1); });
