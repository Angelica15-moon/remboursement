import React, { Component } from 'react';

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: [],
    };
  }

  componentDidMount() {
    fetch('/clients') // Assurez-vous que l'URL correspond à votre serveur backend
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Ajoutez cette ligne pour vérifier la réponse du serveur
      this.setState({ clientData: data });
    })
    
  }

  render() {
    const { clientData } = this.state;

    return (
      <div>
        <h2>Liste des clients</h2>
        <ul>
          {clientData.map((client, index) => (
            <li key={index}>
              <p>Ref Client: {client['Ref Client']}</p>
              <p>Ref Credit: {client['Ref Credit']}</p>
              <p>Nom: {client.nom}</p>
              <p>Montant Abandonnée: {client['Montant Abandonnee']}</p>
              <p>Date de passage en perte: {client['Date de passage en perte']}</p>
              <p>CA Responsable: {client['CA Responsable']}</p>
              <p>Agence: {client.Agence}</p>
              <p>Type: {client.Type}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Clients;
