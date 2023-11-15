import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

Modal.setAppElement('#root');

function validateData(remboursementData) {
  let errors = "Veuillez remplire tous les champs"
  if (!remboursementData) {
    return errors;
  }
  if (!remboursementData.montantAPayer) {
    return errors;
  }
  if (!remboursementData.datePaiement) {
    return errors;
  }
  return;
}

function Payments() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRef, setSelectedRef] = useState("");
  const [montantAPayer, setMontantAPayer] = useState("");
  const [datePaiement, setDatePaiement] = useState("");
  const [collecteur, setCollecteur] = useState("");
  const [agence, setAgence] = useState("");
  const [numeroFacture, setNumeroFacture] = useState("");
  const [message, setMessage] = useState(""); // Pour le message d'alerte

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleRemboursementSubmit = (e) => {
    e.preventDefault();
    const remboursementData = {
      montantAPayer,
      datePaiement,
      collecteur,
      agence,
      numeroFacture,
      MontantAbandonne: selectedClient.MontantAbandonnee,
      refClient: selectedClient.RefClient,
    };


    if (validateData(remboursementData)) {
      setMessage(validateData(remboursementData));
      setModalIsOpen(true);
    } else {
      axios.post("http://localhost:3002/enregistrer-remboursement", remboursementData)
        .then((response) => {
          setMontantAPayer("");
          setDatePaiement("");
          setCollecteur("");
          setAgence("");
          setNumeroFacture("");
          setMessage("Paiement remboursement enregistré avec succès !");
          setModalIsOpen(true);
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du remboursement :", error);
          setMessage("Erreur lors de l'enregistrement du remboursement.");
          setModalIsOpen(true);
        });
    }
  }

  useEffect(() => {
    axios.get("http://localhost:3002/excel-data")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  const handleRefChange = (e) => {
    const selectedRefValue = e.target.value;
    setSelectedRef(selectedRefValue);
    const client = clients.find(
      (c) =>
        c.RefClient === selectedRefValue || c.RefCredit === selectedRefValue
    );
    setSelectedClient(client);
  }

  return (
    <div className='p-3'>
      <Card>
        <Card.Header>Payer un remboursement</Card.Header>
        <Row className='p-2'>
          <Col>
            <Form.Select aria-label="Default select example" size='sm' value={selectedRef} onChange={handleRefChange}>
              <option>Ref Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.RefClient}>
                  {client.RefClient}
                </option>
              ))}
              {clients.map((client) => (
                <option key={client.id} value={client.RefCredit}>
                  {client.RefCredit}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col></Col><Col></Col><Col></Col>
        </Row>
        
        {selectedClient && (
          <div className='px-2'>
            <Row className='p-2'>
              <Col>
                <Form.Label><strong as="h5">Nom :&nbsp;</strong>{selectedClient.nom}</Form.Label><br/>
                <Form.Label><strong as="h5">Ref Client :&nbsp;</strong>{selectedClient.RefClient}</Form.Label><br/>
                <Form.Label><strong as="h5">Ref Credit :&nbsp;</strong>{selectedClient.RefCredit}</Form.Label><br/>
                <Form.Label><strong as="h5">Montant Abandonné :&nbsp;</strong>{selectedClient.MontantAbandonnee}</Form.Label><br/>
              </Col>
              <Col>
                <Form.Label><strong>Date de passage en perte :&nbsp;</strong>{selectedClient.DatePassagePerte}</Form.Label><br/>
                <Form.Label><strong>CA Responsable :&nbsp;</strong>{selectedClient.CAResponsable}</Form.Label><br/>
                <Form.Label><strong>Agence :&nbsp;</strong>{selectedClient.Agence}</Form.Label><br/>
                <Form.Label><strong>Type :&nbsp;</strong>{selectedClient.Type}</Form.Label><br/>
              </Col>
            </Row>
            <hr />
            <h2>Champs à saisir ....</h2>
            <Form onSubmit={handleRemboursementSubmit}>
              <Row className='p-2'>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="montantAPayer">Montant à payer :</Form.Label>
                    <Form.Control type='number' id="montantAPayer" placeholder="Montant à payer" value={montantAPayer}
                      required
                      size='sm'
                      onChange={(e) => setMontantAPayer(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="datePaiement">Date de paiement :</Form.Label>
                      <Form.Control type='date' id="datePaiement" placeholder="Date de paiement :" required size='sm'
                        value={datePaiement} onChange={(e) => setDatePaiement(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="collecteur">Collecteur :</Form.Label>
                      <Form.Control type='text' id="collecteur" placeholder="Collecteur" required size='sm'
                            value={collecteur} onChange={(e) => setCollecteur(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="agence">Agence :</Form.Label>
                      <Form.Control type='text' id="agence" placeholder="Agence" value={agence}
                        required size='sm' onChange={(e) => setAgence(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label htmlFor="numeroFacture">Numéro de facture :</Form.Label>
                    <Form.Control type="text" id="numeroFacture" name="numeroFacture"
                      value={numeroFacture} required onChange={(e) => setNumeroFacture(e.target.value)}
                      size='sm' />
                    </Form.Group>
                    <div className='text-end mt-2'>
                      <Button type='cancel' className='mx-3' variant="danger">Annuler</Button>
                      <Button type='submit' variant="success">Enregistrer</Button>
                    </div>
                </Col>
              </Row>
            </Form>
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Message d'alerte"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              outline: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '400px',
              width: '100%'
            }
          }}
        >
          <p>{message}</p>
          <button onClick={() => setModalIsOpen(false)}>Fermer</button>
        </Modal>
      </Card>
    </div>
  );
}

export default Payments;
