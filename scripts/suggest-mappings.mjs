import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

const LOGICAL = [
  'id','subtask','hazard','initialRisk','control','implementation','residualRisk','who','when'
];

function normalize(s){
  if (!s) return '';
  return String(s).replace(/[^a-z0-9]+/gi,'').toLowerCase();
}

function bigrams(s){
  const t = normalize(s);
  const arr = [];
  for (let i=0;i<t.length-1;i++) arr.push(t.slice(i,i+2));
  return arr;
}

function dice(a,b){
  if (!a.length && !b.length) return 1;
  const A = bigrams(a);
  const B = bigrams(b);
  if (!A.length || !B.length) return 0;
  let inter = 0;
  const Bcopy = B.slice();
  for (const x of A){
    const idx = Bcopy.indexOf(x);
    if (idx>=0){ inter++; Bcopy.splice(idx,1); }
  }
  return (2*inter)/(A.length+B.length);
}

async function run(pdfPath){
  if (!fs.existsSync(pdfPath)){ console.error('PDF not found:', pdfPath); process.exit(1); }
  const data = fs.readFileSync(pdfPath);
  const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
  const form = pdf.getForm();
  const fields = form.getFields();
  const names = fields.map(f=>{ try{ if (typeof f.getName==='function') return f.getName(); }catch{}; if (typeof f.name==='string') return f.name; return String(f); });
  console.log('Found',names.length,'fields');

  for (const L of LOGICAL){
    const scores = names.map(n=>({name:n,score:dice(L,n)})).sort((a,b)=>b.score-a.score).slice(0,6);
    console.log('\nLogical:',L);
    for (const s of scores) console.log(' ',(s.score>0? (s.score.toFixed(3)) : '---'), s.name);
  }
}

const path = process.argv[2] || 'draw2297.pdf';
run(path).catch(e=>{ console.error(e); process.exit(1); });
