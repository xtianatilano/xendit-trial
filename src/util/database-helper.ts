export const generateValuePlaceholder = (data: any) => {
    const valuePlaceholder = Object.keys(data).map((_value, index) => `$${index + 1}`).join(', ');
}

export const generateInsertPlaceholder = (data: any) => {
    const insertPlaceholder = Object.keys(data).map(value => value.replace( /([A-Z])/g, "_$1").toLowerCase()).join(', ');
}
