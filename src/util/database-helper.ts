/**
 * Utility helper to generate dynamic count of values for insert
 * @param data
 */
export const generateValuePlaceholder = (data: any): string => {
    const valuePlaceholder = Object.keys(data).map((_value, index) => `$${index + 1}`).join(', ');
    return valuePlaceholder
}

/**
 * Utility helper to generate insert columns from camelCase to snake_case
 * @param data
 */
export const generateInsertPlaceholder = (data: any): string => {
    const insertPlaceholder = Object.keys(data).map(value => value.replace( /([A-Z])/g, "_$1").toLowerCase()).join(', ');
    return insertPlaceholder;
}
