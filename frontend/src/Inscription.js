import React, { Component } from 'react';

class Inscription extends Component {
  constructor() {
    super();
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: ''
    };
  }

  handleInputChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  }

  handleRegistration = () => {
    const { firstname, lastname, email, username, password } = this.state;

    // Envoi des données d'inscription au backend
    fetch('http://localhost:3002/inscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstname, lastname, email, username, password })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Réponse du serveur:', data);
      // Efface les champs de saisie après l'inscription
      this.setState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: ''
      });
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  }

  render() {
    return (
      <div>
        <h2>Inscription</h2>
        <div>
          <input
            type="text"
            placeholder="Prénom"
            value={this.state.firstname}
            onChange={(e) => this.handleInputChange(e, 'firstname')}
          />
          <input
            type="text"
            placeholder="Nom de famille"
            value={this.state.lastname}
            onChange={(e) => this.handleInputChange(e, 'lastname')}
          />
          <input
            type="text"
            placeholder="Adresse e-mail"
            value={this.state.email}
            onChange={(e) => this.handleInputChange(e, 'email')}
          />
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={this.state.username}
            onChange={(e) => this.handleInputChange(e, 'username')}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={this.state.password}
            onChange={(e) => this.handleInputChange(e, 'password')}
          />
          <button onClick={this.handleRegistration}>S'inscrire</button>
        </div>
      </div>
    );
  }
}

export default Inscription;
