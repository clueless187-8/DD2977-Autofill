/**
 * Field resolution helpers for DD2977 autofill.
 * Tries a list of candidate AcroForm field names in order and returns the first
 * existing one. If none exist, returns null (caller may fall back to coordinates).
 */
export function resolveFieldName(form, candidates) {
    if (!form || !Array.isArray(candidates) || candidates.length === 0)
        return null;
    // Try to build a set of known field names if the API exposes them.
    try {
        if (typeof form.getFields === "function") {
            const fields = form.getFields();
            if (Array.isArray(fields)) {
                // fields may be objects with a .name or just strings depending on library
                const names = new Set();
                    for (const f of fields) {
                        if (!f)
                            continue;
                        let n;
                        if (typeof f === 'string')
                            n = f;
                        else if (typeof f.name === 'string')
                            n = f.name;
                        else if (typeof f.getName === 'function') {
                            try {
                                const t = f.getName();
                                if (typeof t === 'string')
                                    n = t;
                            }
                            catch (_b) { }
                        }
                        if (n)
                            names.set(normalize(n), n);
                    }
                    for (const c of candidates)
                        if (names.has(normalize(c)))
                            return names.get(normalize(c)) || c;
            }
        }
    }
    catch {
        // ignore and fallthrough to per-candidate checks
    }
    // Per-candidate best-effort checks using common APIs
    for (const name of candidates) {
        try {
            // pdf-lib style: getTextField returns a field object or throws if not present
            if (typeof form.getTextField === "function") {
                try {
                    const tf = form.getTextField(name);
                    if (tf != null)
                        return name;
                }
                catch {
                    // some libs throw when field missing; treat as not found
                }
            }
            // generic PDF libraries may expose getField
            if (typeof form.getField === "function") {
                try {
                    const f = form.getField(name);
                    if (f != null)
                        return name;
                }
                catch {
                    // ignore
                }
            }
            // As a last resort, some forms expose a plain object `fields` or `acroForm` map
            if (form.fields && (name in form.fields))
                return name;
            if (form.acroForm && form.acroForm[name])
                return name;
        }
        catch {
            // ignore and try next candidate
        }
    }
    return null;
}
1;
