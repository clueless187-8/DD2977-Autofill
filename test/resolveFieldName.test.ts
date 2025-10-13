import { resolveFieldName } from '../src/pdf/da2977-resolver';

describe('resolveFieldName', () => {
  test('finds field from fields map', () => {
    const form = { fields: { foo: {} } } as any;
    const res = resolveFieldName(form, ['not', 'foo', 'other']);
    expect(res).toBe('foo');
  });

  test('uses getTextField if present', () => {
    const form: any = { getTextField: (name: string) => (name === 'bar' ? {} : null) };
    const res = resolveFieldName(form, ['bar', 'baz']);
    expect(res).toBe('bar');
  });

  test('uses getFields list', () => {
    const form: any = { getFields: () => [{ name: 'a' }, 'b'] };
    const res = resolveFieldName(form, ['x', 'b', 'a']);
    expect(res).toBe('b');
  });

  test('returns null when no match', () => {
    const form = {} as any;
    expect(resolveFieldName(form, ['x', 'y'])).toBeNull();
  });
});
