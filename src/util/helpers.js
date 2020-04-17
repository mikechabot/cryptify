/**
 * Look in an array for an array of values
 * @param lookIn
 * @param lookFor
 * @returns {*|boolean}
 */
export function someInclude (lookIn, lookFor) {
    if (!lookIn || !lookFor) return false;
    if (!Array.isArray(lookIn) || !Array.isArray(lookFor)) return false;
    if (lookIn.length === 0 || lookFor.length === 0) return false;
    return lookFor.some(entry => {
        return lookIn.includes(entry);
    });
}

/**
 * Ensure the string contains an uppercase character
 * @param str
 * @returns {boolean}
 */
export function hasUpperCase (str) {
    if (!str || typeof str !== 'string') return false;
    return str.trim().toLowerCase() !== str;
}

/**
 * Ensure the string contains a lowercase character
 * @param str
 * @returns {boolean}
 */
export function hasLowerCase (str) {
    if (!str || typeof str !== 'string') return false;
    return str.trim().toUpperCase() !== str;
}

/**
 * Ensure the string contains a number
 * @param str
 * @returns {boolean}
 */
export function hasNumber (str) {
    if (!str || typeof str !== 'string') return false;
    return /\d/.test(str);
}
