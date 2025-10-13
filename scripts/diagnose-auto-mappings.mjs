import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

if (process.argv.length < 3) {
  console.error('Usage: node scripts/diagnose-auto-mappings.mjs <pdf-path>');
  process.exit(2);
}
const pdfPath = process.argv[2];

const AUTO_RAW = {
  id: "\u000bÍØðqAÄŁ⁄/µØÀÆj‰¢0c$\u000b˙+˛jý:ÅØ³IAísﬁD\u0005Œd½gÞÏÏ\rˇp€HÔÃ¬¹\u0001>�®é\u0010NRy-˚",
  subtask: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  hazard: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  initialRisk: `\u0004⁄¶0"ÝäVÝa{n=„\\çWØ½9B\\u000fZ¶N™r}T;æ:z-oùÓ6úúªﬂheóÑÕ\\u0001Fµ⁄)–›y´�^q˚BS4×¤$[©ËŒ³à£É[-æWw~`,
  control: `Í„⁄ #d¸¦⁄ŁL°Z“N-¶Ł"í†d½{²_$‹p%çRõè�−4�\`ªk¦êNzÅ˘1`,
  implementation: `¼ðÊ\\u000e=mﬂ1™t¯“µ¤’ÕF]\\u0005¸þão-\\b:nÔì*±Mì†ˆ´w¥\\u0013~\\rÊF²\\u0005\\r¼q`,
  residualRisk: `\\bhQ�ÀÅì\\u0002ﬂ\\u0012ìﬂi0ö…V˝Ó´+’gºc˙\\u0017ÐAAiÈ=\\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\\u0003ÁâHÒ˙�Ç¾ü`,
  who: `\\bhQ�ÀÅì\\u0002ﬂ\\u0012ìﬂi0ö…V˝Ó´+’gºc˙\\u0017ÐAAiÈ=\\u0006ò–Jõk°u!¦AÝÔ�"¥rì[Í1siÙ9˝ôØãÊˆ#…Wﬁƒˇ\\u0003ÁâHÒ˙�Ç¾ü`,
  when: `ü%O\\u0012sÿ?\\u0002£µ”\\u0003\\u00175¿ıQ…ZVÁ\\rÂbaÙ\\ríŸ0´@–\\\\î¶Ï†‹éÐï\\u0014/NGª\\u0015½‚°ÒŁêwHÎÑÍÔ“Ê½N`,
};

function normalize(s) {
  if (s == null) return '';
  return String(s).replace(/[^\w]/g, '').toLowerCase();
}

(async () => {
  const bytes = fs.readFileSync(pdfPath);
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const fields = form.getFields();
  const names = fields.map(f => f.getName());

  console.log(`Loaded PDF: ${pdfPath} — found ${names.length} fields`);

  for (const [logical, raw] of Object.entries(AUTO_RAW)) {
    const normRaw = normalize(raw);
    const matches = names.filter(n => {
      if (!n) return false;
      const nn = normalize(n);
      return nn.includes(normRaw) || normRaw.includes(nn) || nn === normRaw;
    });
    console.log(`\nLogical: ${logical}`);
    console.log(`  AUTO_RAW: ${JSON.stringify(raw).slice(0,80)}...`);
    if (matches.length) {
      console.log(`  Matches (${matches.length}):`);
      for (const m of matches) console.log(`    - ${m}`);
    } else {
      // fallback: try fuzzy by token overlap
      const tokenMatches = names.filter(n => {
        if (!n) return false;
        const t1 = new Set(normalize(n).match(/.{1,8}/g) || []);
        const t2 = new Set(normalize(raw).match(/.{1,8}/g) || []);
        let inter = 0;
        for (const a of t1) if (t2.has(a)) inter++;
        return inter >= 2;
      });
      if (tokenMatches.length) {
        console.log(`  Token-fuzzy matches (${tokenMatches.length}):`);
        for (const m of tokenMatches) console.log(`    - ${m}`);
      } else {
        console.log('  No matches found');
      }
    }
  }
})();
