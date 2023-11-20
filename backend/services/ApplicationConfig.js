const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Fonction pour hacher un mot de passe
 * @param {*} password 
 * @returns 
 */
function hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

/**
 * Fonction pour vérifier un mot de passe
 * @param {*} password 
 * @param {*} hashedPassword 
 * @returns 
 */
function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync([password], hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};