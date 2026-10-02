export function parseDateString(value) {
    const date = new Date();
    const [day, month, year] = value.split('.').map(Number);
    if (day) {
        date.setDate(day);
    }
    if (month) {
        date.setMonth(month - 1);
    }
    if (year) {
        date.setFullYear(year);
    }
    return date;
}
//# sourceMappingURL=date.js.map