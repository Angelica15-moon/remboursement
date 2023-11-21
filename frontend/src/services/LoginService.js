import { useState } from "react";

/**
 * Fonction pour valider la connexion utilisateur
 * @param {*} userConnected 
 */
export function LoginService(userConnected) {
    const { response, setResponse } = useState(null);
    const [token, setToken] = useState();
    if (userConnected) {
        // Envoi des données au backend pour l'insertion en base de données
        fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userConnected
        }).then(response => response.json())
            .then(data => {
                console.log('Réponse du serveur:', data);
                if (data.message === 'Utilisateur authentifié') {
                    setResponse(data);
                    this.setState({ loggedIn: true });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    }
}