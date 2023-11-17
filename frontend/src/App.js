import React, { Component } from 'react';
import Clients from './Clients';
import Payments from './Payments';
import HistoryPaiment from './HistoryPaiment';
import Insertion from './Insertion.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
      <div className='bg-secondary height-100'>
        <Navbar bg="light" data-bs-theme="light" className='hide-on-pc px-2'>
          <Navbar.Brand href="#">Cefor - GAP</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#" className={activeMenuItem === 'clients' ? 'bg-primary active-menu' : ''} onClick={() => this.handleMenuItemClick('clients')}>Clients</Nav.Link>
            <Nav.Link href="#" className={activeMenuItem === 'payments' ? 'bg-primary active-menu' : ''} onClick={() => this.handleMenuItemClick('payments')}>Paiements</Nav.Link>
            <Nav.Link href="#" className={activeMenuItem === 'historyPaiment' ? 'bg-primary active-menu' : ''} onClick={() => this.handleMenuItemClick('historyPaiment')}>Releve de compres</Nav.Link>
            <Nav.Link href="#" className={activeMenuItem === 'insertion' ? 'bg-primary active-menu' : ''} onClick={() => this.handleMenuItemClick('insertion')}>Insertion</Nav.Link>
          </Nav>
        </Navbar>
        <Row>
          <Col lg={2} sm={2} xs={12}>
            <Card className='show-on-pc'>
              <Card.Header className='mb-4'>Cefor - GAP</Card.Header>
              <Card.Text className='px-4 mb-0 small-text' >NAVIGATION</Card.Text>
              <ListGroup variant="flush" className='mt-0 height-100' >
                <ListGroup.Item className={activeMenuItem === 'clients' ? 'bg-primary active-menu' : ''}><a href="#" onClick={() => this.handleMenuItemClick('clients')}>Clients</a></ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'payments' ? 'bg-primary active-menu' : ''}><a href="#" onClick={() => this.handleMenuItemClick('payments')}>Paiements</a></ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'historyPaiment' ? 'bg-primary active-menu' : ''}><a href="#" onClick={() => this.handleMenuItemClick('historyPaiment')}>Releve de compres</a></ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'insertion' ? 'bg-primary active-menu' : ''}><a href="#" onClick={() => this.handleMenuItemClick('insertion')}>Insertion</a></ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col lg={10} sm={10} xs={12}>
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
