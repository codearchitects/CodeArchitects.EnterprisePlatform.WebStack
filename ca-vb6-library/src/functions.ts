/**
 * Truncate or extends a string
 * @param value String value
 * @param size String max size
 * @param padChar 
 */
export function VB6Truncate(value: string, size: number, padChar = ' ') {
    if (!value) {
        let retval = '';
        for (let index = 0; index < size; index++) {
            retval += padChar;
        }
        return retval;
    } else if (typeof value === 'string' && value.length >= size) {
        return value.substring(0, size);
    } else {
        return value.padEnd(size, padChar);
    }
}

/**
 * Return the buffer for a given size
 */
export function GetEmptyBuffer(size: number) {
    let retval = '';
    for (let index = 0; index < size; index++) {
        retval += ' ';
    }
    return retval;
}

/**
 * Throws an error or executes an handler when label matches a specified when condition
 * @param error Error to be thrown
 * @param label When label
 * @param when When conditions
 */
export function catchWhen(error: Error, label: string, when?: { [key: string]: Function }, store = true) {
    if (store) {
        window['error'] = error;
    }
    if (label && when) {
        const handler = when[label];
        if (handler) {
            handler();
        } else {
            throw error;
        }
    } else {
        throw error;
    }
}