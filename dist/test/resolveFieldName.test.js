import { resolveFieldName } from '../src/pdf/da2977-resolver';
describe('resolveFieldName', () => {
    test('finds field from fields map', () => {
        const form = { fields: { foo: {} } };
        const res = resolveFieldName(form, ['not', 'foo', 'other']);
        expect(res).toBe('foo');
    });
    test('uses getTextField if present', () => {
        const form = { getTextField: (name) => (name === 'bar' ? {} : null) };
        const res = resolveFieldName(form, ['bar', 'baz']);
        expect(res).toBe('bar');
    });
    test('uses getFields list', () => {
        const form = { getFields: () => [{ name: 'a' }, 'b'] };
        const res = resolveFieldName(form, ['x', 'b', 'a']);
        expect(res).toBe('b');
    });
    test('returns null when no match', () => {
        const form = {};
        expect(resolveFieldName(form, ['x', 'y'])).toBeNull();
    });
});
