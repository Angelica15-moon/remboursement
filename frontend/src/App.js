import React, { Component } from 'react';
import Clients from './Clients';
import Payments from './Payments';
import HistoryPaiment from './HistoryPaiment';
import Insertion from './Insertion.js';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'clients',
      clientData: [], // Tableau pour stocker les données des clients
    };
  }

  componentDidMount() {
    // Récupération des données clients depuis votre API ou base de données ici
    fetch('/clients')
      .then((response) => response.json())
      .then((data) => this.setState({ clientData: data }))
      .catch((error) => console.error('Erreur lors de la récupération des données :', error));
  }

  handleMenuItemClick = (menuItem) => {
    this.setState({ activeMenuItem: menuItem });
  };

  render() {
    const { activeMenuItem, clientData } = this.state;

    return (
      <div>
        <div className="menu">
        <button onClick={() => this.handleMenuItemClick('insertion')}>insertion</button>
          <button onClick={() => this.handleMenuItemClick('clients')}>Clients</button>
          <button onClick={() => this.handleMenuItemClick('payments')}>Paiements</button>
          <button onClick={() => this.handleMenuItemClick('historyPaiment')}>Historique des paiments</button>
         
         
        </div>
        <div className="content">
        {activeMenuItem === 'insertion' && <Insertion />}
          {activeMenuItem === 'clients' && <Clients clientData={clientData} />}
          {activeMenuItem === 'payments' && <Payments />}
          {activeMenuItem === 'historyPaiment' && <HistoryPaiment />}
          
        
        </div>
      </div>
    );
  }
}

export default App;
