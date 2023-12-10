const jwt = require("jsonwebtoken");
const { comparePassword } = require('./ApplicationConfig');
require('dotenv').config();

/**
 * Sevrice de connexion pour les utilisateur
 * @param {*} db 
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
function LoginService(db, username, password) {
    const jwtSecretKey = process.env.DIY_JWT_SECRET;

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM collecteur WHERE username='" + username + "'";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des collecteur :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la récupération des collecteur."
                });
                return;
            }

            if (results.length === 0) {
                reject({
                    code: 500,
                    message: "Aucun utilisateur trouver avec l'identifiant : " + username
                });
                return;
            }

            if (!results[0].active) {
                reject({
                    code: 402,
                    message: "Votre compte a ete desactive, veuillez contactez votre administrateur."
                });
                return;
            }

            if (results.length) {
                if (!comparePassword(password, results[0].password)) {
                    reject({
                        code: 401,
                        message: "Invalid credentials"
                    });
                }
                return;
            }

            let data = {
                signInTime: Date.now(),
                username,
            };
            const token = jwt.sign(data, jwtSecretKey);
            resolve({
                username: username,
                fonction: results[0].role,
                token: token
            });
        });
    });
}

module.exports = {
    LoginService,
};