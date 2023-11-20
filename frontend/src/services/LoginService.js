export function LoginService(username, password) {
    const [token, setToken] = useState();
    if (username && password) {
        // Envoi des données au backend pour l'insertion en base de données
        fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Réponse du serveur:', data);
                if (data.message === 'Utilisateur authentifié') {
                    // Utilisateur authentifié avec succès, mettez à jour l'état loggedIn
                    setToken(data);
                    this.setState({ loggedIn: true });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    }
    retun
}