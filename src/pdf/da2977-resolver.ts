/**
 * Field resolution helpers for DD2977 autofill.
 * Tries a list of candidate AcroForm field names in order and returns the first
 * existing one. If none exist, returns null (caller may fall back to coordinates).
 */
export function resolveFieldName(form: any, candidates: string[]): string | null {
  if (!form || !Array.isArray(candidates) || candidates.length === 0) return null;

  const normalize = (s: unknown) => {
    try {
      if (s == null) return '';
      return String(s).replace(/\s+/g, '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/[^\w]/g, '').toLowerCase();
    } catch {
      return '';
    }
  };

  // Attempt to build a normalized set of known field names if the API exposes them.
  try {
    if (typeof form.getFields === 'function') {
      const fields = form.getFields();
      if (Array.isArray(fields)) {
        const names = new Map<string, string>(); // normalized -> original
        for (const f of fields) {
          if (!f) continue;
          let n: string | undefined;
          if (typeof f === 'string') n = f;
          else if (typeof f.name === 'string') n = f.name;
          else if (typeof f.getName === 'function') {
            try { const t = f.getName(); if (typeof t === 'string') n = t; } catch { /* ignore */ }
          }
          if (n) names.set(normalize(n), n);
        }

        for (const c of candidates) {
          if (names.has(normalize(c))) return names.get(normalize(c)) || c;
        }
      }
    }
  } catch {
    // ignore and fallthrough to per-candidate checks
  }

  // Per-candidate best-effort checks using common APIs, also try normalized comparisons
  const candidateNorms = candidates.map(c => ({raw: c, norm: normalize(c)}));

  // Try direct API lookups first (non-normalized)
  for (const {raw} of candidateNorms) {
    try {
      if (typeof form.getTextField === 'function') {
        try { const tf = form.getTextField(raw); if (tf != null) return raw; } catch {}
      }
      if (typeof form.getField === 'function') {
        try { const f = form.getField(raw); if (f != null) return raw; } catch {}
      }
      if (form.fields && (raw in form.fields)) return raw;
      if (form.acroForm && form.acroForm[raw]) return raw;
    } catch {
      /* ignore */
    }
  }

  // Fallback: normalized comparison against form fields
  try {
    if (typeof form.getFields === 'function') {
      const fields = form.getFields();
      if (Array.isArray(fields)) {
        const names = new Map<string, string>();
        for (const f of fields) {
          let n: string | undefined;
          if (typeof f === 'string') n = f;
          else if (typeof f.name === 'string') n = f.name;
          else if (typeof f.getName === 'function') {
            try { const t = f.getName(); if (typeof t === 'string') n = t; } catch {}
          }
          if (n) names.set(normalize(n), n);
        }
        for (const {raw,norm} of candidateNorms) {
          if (names.has(norm)) return names.get(norm) || raw;
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}
1