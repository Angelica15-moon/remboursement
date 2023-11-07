import React, { Component } from 'react';
import Clients from './Clients';
import Payments from './Payments';
import PaymentHistory from './PaymentHistory';

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
          <button onClick={() => this.handleMenuItemClick('clients')}>Clients</button>
          <button onClick={() => this.handleMenuItemClick('payments')}>Paiements</button>
          <button onClick={() => this.handleMenuItemClick('paymentHistory')}>Historique des paiements</button>
        </div>
        <div className="content">
          {activeMenuItem === 'clients' && <Clients clientData={clientData} />}
          {activeMenuItem === 'payments' && <Payments />}
          {activeMenuItem === 'paymentHistory' && <PaymentHistory />}
        </div>
      </div>
    );
  }
}

export default App;
