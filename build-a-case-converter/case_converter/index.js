function getUpperCase(str) {
    return str.toUpperCase()
}
function getLowerCase(str) {
    return str.toLowerCase()
}
function getSentenceCase(str) {
    return getUpperCase(str[0]) + getLowerCase(str.substring(1))
}
function getProperCase(str) {
    return str.split(' ').map(word => getSentenceCase(word)).join(' ');
}

module.exports = {
    getUpperCase,
    getLowerCase,
    getSentenceCase,
    getProperCase
};