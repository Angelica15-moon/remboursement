import React, { Component } from 'react';
import Clients from './Clients';
import Payments from './Payments';
import HistoryPaiment from './HistoryPaiment';
import Insertion from './Insertion.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

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
        <Row>
          <Col sm={2}>
            <Card>
              <Card.Header>Cefor - GAP</Card.Header>
              <Card.Text className='px-2 text-sm' >NAVIGATION</Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item><a href="#" onClick={() => this.handleMenuItemClick('clients')}>Clients</a></ListGroup.Item>
                <ListGroup.Item><a href="#" onClick={() => this.handleMenuItemClick('payments')}>Paiements</a></ListGroup.Item>
                <ListGroup.Item><a href="#" onClick={() => this.handleMenuItemClick('historyPaiment')}>Releve de compres</a></ListGroup.Item>
                <ListGroup.Item><a href="#" onClick={() => this.handleMenuItemClick('insertion')}>insertion</a></ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col sm={10}>
            {activeMenuItem === 'insertion' && <Insertion />}
            {activeMenuItem === 'clients' && <Clients clientData={clientData} />}
            {activeMenuItem === 'payments' && <Payments />}
            {activeMenuItem === 'historyPaiment' && <HistoryPaiment />}
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
