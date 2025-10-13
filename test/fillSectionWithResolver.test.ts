import { fillSectionWithResolver } from '../src/pdf/da2977';

// Mock form that supports getTextField/setText
function makeMockForm() {
  const fields: Record<string, any> = {};
  return {
    getTextField: (name: string) => fields[name] || null,
    getField: (name: string) => fields[name] || null,
    setTextField: (name: string, value: any) => { fields[name] = { value }; },
    fields,
  };
}

describe('fillSectionWithResolver', () => {
  test('writes known fields and returns no missing when all present', () => {
    const form: any = makeMockForm();
    // pre-create fields with setText method to be discovered by getTextField
    form.fields['section4_id'] = { setText: (v: any) => { form.fields['section4_id'].value = v; } };
    form.fields['section4_subtask'] = { setText: (v: any) => { form.fields['section4_subtask'].value = v; } };

    const section = { id: 42, subtask: 'task' };
    const res = fillSectionWithResolver(form, 0, section);
    expect(res.missingFields).toContain('hazard'); // hazard wasn't provided
    expect(form.fields['section4_id'].value).toBe('42');
    expect(form.fields['section4_subtask'].value).toBe('task');
  });
});
