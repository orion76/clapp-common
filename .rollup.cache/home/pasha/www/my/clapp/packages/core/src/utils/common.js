export function commandFindDefault(fileName) {
    return fileName.endsWith('/definition.ts') || fileName.endsWith('.definition.ts');
}
export function isNotEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
//# sourceMappingURL=common.js.map