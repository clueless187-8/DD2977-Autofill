import fs from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { fillSectionWithResolver } from '../src/pdf/da2977';

const LOGICAL_FIELDS = [
  'id',
  'subtask',
  'hazard',
  'initialRisk',
  'control',
  'implementation',
  'residualRisk',
  'who',
  'when',
];

async function createSamplePDF(path: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText('Sample form - sections 4-9', { x: 50, y: 760, size: 14, font });

  const form = pdfDoc.getForm();

  // create fields for sections 4-9 and logical fields
  for (let n = 4; n <= 9; n++) {
    for (const f of LOGICAL_FIELDS) {
      const name = `section${n}_${f}`;
      form.createTextField(name).setText('');
    }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path, pdfBytes);
  return path;
}

async function run() {
  const sample = 'sample-form.pdf';
  if (!fs.existsSync(sample)) {
    console.log('Creating sample PDF with fields:', sample);
    await createSamplePDF(sample);
  } else {
    console.log('Using existing sample PDF:', sample);
  }

  const hazardsPath = process.argv[2] || 'data/hazards.json';
  if (!fs.existsSync(hazardsPath)) {
    console.log('No hazards file found at', hazardsPath, '- creating example data');
    const example: any = { sections: [] };
    for (let n = 4; n <= 9; n++) {
      example.sections.push({
        id: n,
        subtask: `Subtask ${n}`,
        hazard: `Hazard ${n}`,
        initialRisk: 'medium',
        control: `Control ${n}`,
        implementation: `Implementation ${n}`,
        residualRisk: 'low',
        who: `Owner ${n}`,
        when: `2025-10-${(n + 10).toString().padStart(2, '0')}`,
      });
    }
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(hazardsPath, JSON.stringify(example, null, 2), 'utf8');
    console.log('Wrote example hazards to', hazardsPath);
  }

  const existing = fs.readFileSync(sample);
  const pdfDoc = await PDFDocument.load(existing);
  const form = pdfDoc.getForm();

  const hazards = JSON.parse(fs.readFileSync(hazardsPath, 'utf8'));
  if (!Array.isArray(hazards.sections)) throw new Error('hazards.json must have a sections array');

  const results: any[] = [];
  for (let i = 0; i < hazards.sections.length; i++) {
    const sec = hazards.sections[i];
    try {
      const res = fillSectionWithResolver(form as any, i, sec);
      results.push(res);
    } catch (e) {
      results.push({ section: 4 + i, error: String(e) });
    }
  }

  const out = 'filled-all.pdf';
  const bytes = await pdfDoc.save();
  fs.writeFileSync(out, bytes);
  console.log('Wrote', out);
  console.log('Results:', results);
}

import util from 'util';
run().catch((e) => { console.error(util.inspect(e, { depth: null })); process.exit(1); });
