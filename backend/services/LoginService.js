const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require('./ApplicationConfig');
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
            }

            if (results.length === 0) {
                reject({
                    code: 500,
                    message: "Aucun utilisateur trouver avec l'identifiant : " + username
                });
            }

            if (results.length) {
                const passwordHashed = hashPassword(results[0].password);
                if (password !== results[0].password) {
                    reject({
                        code: 401,
                        message: "Invalid credentials"
                    });
                }
            }

            let data = {
                signInTime: Date.now(),
                username,
            };
            const token = jwt.sign(data, jwtSecretKey);
            resolve({
                username: username,
                token: token
            });
        });
    });
}

module.exports = {
    LoginService,
};