export const NOTIFICATION_TYPES = ['bank_transfer', 'invoice'];

export const BANKS = ['BNI', 'MANDIRI', 'BPI', 'BDO'];

const generateGuid = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const generateAmount = () => {
    return Math.floor(Math.random() * 500);
};

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 15);
};

const generateBank = () => {
    return BANKS[Math.floor(Math.random() * BANKS.length)];
};

export const generateSampleData = (notificationType: string) => {
    let data = {};
    switch (notificationType) {
        case 'bank_transfer':
            data = {
                amount: generateAmount(),
                transaction_id: generateGuid(),
                account_number: generateRandomCode(),
                bank_code: BANKS[Math.floor(Math.random() * BANKS.length)],
            };
            break;
        case 'invoice':
            data = {
                amount: generateAmount(),
                invoice_id: generateGuid(),
                bank_code: generateBank(),
                reference_code: generateRandomCode(),
            }
            break;
    }

    return data;
};