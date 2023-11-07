import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom

class Connexion extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  addUserMapping = () => {
    const { username, password } = this.state;

    // Afficher les données que vous envoyez au serveur dans la console
    console.log(JSON.stringify({ username, password }));

    if (username && password) {
      // Envoi des données au backend pour l'insertion en base de données
      fetch('http://localhost:3002/collecteur', {
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
            this.setState({ loggedIn: true });
          }
          // Efface les champs de saisie après l'insertion
          this.setState({ username: '', password: '' });
        })
        .catch(error => {
          console.error('Erreur:', error);
        });
    }
  }

  render() {
    const { loggedIn, username } = this.state;

    return (
      <div>
        <h2>Connexion</h2>
        {loggedIn ? (
          <p>Bonjour, {username} !</p>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <button onClick={this.addUserMapping}>Ajouter la correspondance</button>
          </div>
        )}
        <p>Vous n'avez pas de compte ? <Link to="/inscription">S'inscrire</Link></p>
      </div>
    );
  }
}

export default Connexion;
