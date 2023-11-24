import React, { Component } from 'react';
import Clients from './Clients';
import Payments from './Payments';
import HistoryPaiment from './HistoryPaiment';
import Insertion from './Insertion.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Login from './components/Login';
import Inscription from './components/inscription/Inscription';
import Accordion from 'react-bootstrap/Accordion';
import PageUtilisateur from './components/utilisateur/page-utilisateur/PageUtilisateur'
import ChangerMotDePasse from './components/utilisateur/changer-mot-de-passe/ChangerMotDePasse';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuItem: 'clients',
      clientData: [], // Tableau pour stocker les données des clients
    };
  }

  handleMenuItemClick = (menuItem) => {
    this.setState({ activeMenuItem: menuItem });
  };

  getTonken() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    const { activeMenuItem, clientData } = this.state;

    if (!this.getTonken()) {
      return <Login className='p-4'></Login>;
    }

    return (
      <div className='bg-secondary height-100'>
        <Navbar bg="light" collapseOnSelect data-bs-theme="light" expand="lg" className="bg-body-tertiary hide-on-pc px-2">
          <Container fluid>
            <Navbar.Brand href="#" onClick={() => this.handleMenuItemClick('clients')}>Cefor - GAP</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '200px' }} navbarScroll >
                <Nav.Link href="#" className={activeMenuItem === 'clients' ? 'bg-primary active-menu p-0 px-2 small text-white' : 'p-0 px-2 small'} onClick={() => this.handleMenuItemClick('clients')}>Clients</Nav.Link>
                <Nav.Link href="#" className={activeMenuItem === 'payments' ? 'bg-primary active-menu p-0 px-2 small text-white' : 'p-0 px-2 small'} onClick={() => this.handleMenuItemClick('payments')}>Paiements</Nav.Link>
                <Nav.Link href="#" className={activeMenuItem === 'historyPaiment' ? 'bg-primary active-menu p-0 px-2 small text-white' : 'p-0 px-2 small'} onClick={() => this.handleMenuItemClick('historyPaiment')}>Releve de compres</Nav.Link>
                <Nav.Link href="#" className={activeMenuItem === 'insertion' ? 'bg-primary active-menu p-0 px-2 small text-white' : 'p-0 px-2 small'} onClick={() => this.handleMenuItemClick('insertion')}>Insertion</Nav.Link>
                <Nav.Link href="#" className={activeMenuItem === 'inscription' ? 'bg-primary active-menu p-0 px-2 small text-white' : 'p-0 px-2 small'} onClick={() => this.handleMenuItemClick('inscription')}>Créer un agent</Nav.Link>
                <Nav.Link href="#" className='p-0 px-2 small' onClick={() => this.logout()}>Déconnection</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Row>
          <Col lg={2} sm={2} xs={12} className='m-0 p-0'>
            <Card className='show-on-pc'>
              <Card.Header className='mb-4'>Cefor - GAP</Card.Header>
              <Card.Text className='px-4 mb-0 small-text' >NAVIGATION</Card.Text>
              <ListGroup variant="flush" className='mt-0 p-2 height-100' >
                <ListGroup.Item className={activeMenuItem === 'clients' ? 'bg-primary active-menu' : ''}>
                  <a href="#" onClick={() => this.handleMenuItemClick('clients')}>Clients</a>
                </ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'payments' ? 'bg-primary active-menu' : ''}>
                  <a href="#" onClick={() => this.handleMenuItemClick('payments')}>Paiements</a>
                </ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'historyPaiment' ? 'bg-primary active-menu' : ''}>
                  <a href="#" onClick={() => this.handleMenuItemClick('historyPaiment')}>Releve de compres</a>
                </ListGroup.Item>
                <ListGroup.Item className={activeMenuItem === 'insertion' ? 'bg-primary active-menu' : ''}>
                  <a href="#" onClick={() => this.handleMenuItemClick('insertion')}>Insertion</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Accordion sm>
                    <Accordion.Item eventKey="0" fluid flush>
                      <Accordion.Header>Parametres</Accordion.Header>
                      <Accordion.Body className='m-0 p-0 small'>
                        <ListGroup variant="flush" className='mt-0 p-0'>
                          <ListGroup.Item className={activeMenuItem === 'profil' ? 'bg-primary active-menu' : ''}>
                            <a href="#" onClick={() => this.handleMenuItemClick('profil')}>Profil</a>
                          </ListGroup.Item>
                          <ListGroup.Item className={activeMenuItem === 'utilisateurs' ? 'bg-primary active-menu' : ''}>
                            <a href="#" onClick={() => this.handleMenuItemClick('utilisateurs')}>Utilisateurs</a>
                          </ListGroup.Item>
                          <ListGroup.Item className={activeMenuItem === 'inscription' ? 'bg-primary active-menu' : ''}>
                            <a href="#" onClick={() => this.handleMenuItemClick('inscription')}>Créer un agent</a>
                          </ListGroup.Item>
                          <ListGroup.Item className={activeMenuItem === 'Changer-mdp' ? 'bg-primary active-menu' : ''}>
                            <a href="#" onClick={() => this.handleMenuItemClick('Changer-mdp')}>Changer mdp</a>
                          </ListGroup.Item>
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="#" onClick={() => this.logout()}>Déconnection</a>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col lg={10} sm={10} xs={12} className='full-width m-0 p-0'>
            {activeMenuItem === 'insertion' && <Insertion />}
            {activeMenuItem === 'clients' && <Clients clientData={clientData} />}
            {activeMenuItem === 'payments' && <Payments />}
            {activeMenuItem === 'historyPaiment' && <HistoryPaiment />}
            {activeMenuItem === 'profil' && <Inscription />}
            {activeMenuItem === 'utilisateurs' && <PageUtilisateur />}
            {activeMenuItem === 'inscription' && <Inscription />}
            {activeMenuItem === 'Changer-mdp' && <ChangerMotDePasse />}
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
