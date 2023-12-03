const { hashPassword } = require('./ApplicationConfig');

/**
 * Enregistrement d'un agent ou collecteur
 * @param {*} db 
 * @param {*} agent 
 * @returns 
 */
function RegistrationServices(db, agent) {

    return new Promise((resolve, reject) => {

        if (!agent) {
            console.error("Agent ou collecteur invalide : ", err);
            reject({
                code: 500,
                message: "Agent ou collecteur invalide : "
            });
        }
        const sql = "INSERT INTO collecteur (nom, prenom, adresse, username, password, email, role, tel, active, agence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [
            agent.nom, agent.prenom, agent.adresse, agent.username,
            hashPassword(agent.password), agent.email, agent.role, agent.tel, true, agent.agence
        ], (err, results) => {
            if (err) {
                console.error("Erreur lors de l'enregistrement du collecteur : ", err);
                reject({
                    code: 500,
                    message: "Erreur lors de l'enregistrement du collecteur."
                });
            }
            resolve({
                code: 200,
                message: "Agent ou collecteur enregistrer avec success."
            });
        });
    });
}

module.exports = {
    RegistrationServices,
};