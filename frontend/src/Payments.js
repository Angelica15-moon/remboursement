import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormLabel from "react-bootstrap/esm/FormLabel";
import JsPDF from "jspdf";
import "jspdf-autotable";
import logoImage from "./assets/logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheckToSlot } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

function validateData(remboursementData) {
  let errors = "Veuillez remplire tous les champs";
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
  const [userConnected, setUserConnected] = useState(null);
  const collecteur = localStorage.getItem("user");
  const [agence, setAgence] = useState("");
  const numeroFacture = "FACT" + Date.now();
  const [message, setMessage] = useState("");
  const [error, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function getProfil() {
    fetch(
      `http://localhost:3002/profil?user=${encodeURIComponent(collecteur)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserConnected(data.results[0]);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  function formatDate() {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(Date.now()).toLocaleDateString(undefined, options);
  }

  function remboursementSubmit() {
    const formattedDate = new Date().toISOString().split("T")[0];
    const remboursementData = {
      montantAPayer,
      datePaiement: formattedDate,
      collecteur: collecteur,
      agence: userConnected.agence,
      numeroFacture: numeroFacture,
      MontantAbandonne: selectedClient.MontantAbandonnee,
      refClient: selectedClient.RefClient,
    };

    if (validateData(remboursementData)) {
      setMessage(validateData(remboursementData));
    } else {
      axios
        .post(
          "http://localhost:3002/enregistrer-remboursement",
          remboursementData
        )
        .then((response) => {
          setMontantAPayer("");
          setMessage(response.data.message);
          generateFacture(
            selectedClient,
            remboursementData,
            response.data.rest
          );
          setShow(false);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'enregistrement du remboursement :",
            error
          );
          setMessage(error.response.data.message);
          setShow(false);
        });
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:3002/excel-data")
      .then((response) => {
        setClients(response.data);
        getProfil();
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
    setAgence(userConnected.agence);
  };

  function clearData(params) {
    setMontantAPayer(0);
  }

  const generateFacture = (client, donnee, rest) => {
    const doc = new JsPDF();
    const title = "FACTURE";
    const logoWidth = 60;
    const logoHeight = 20;
    const fontSize = 12;
    doc.setFillColor(200, 200, 200); // Couleur du fond (RGB)
    doc.rect(0, 0, 500, 1000, 'F');
    doc.addImage(logoImage, "PNG", 130, 10, logoWidth, logoHeight);
    doc.setFontSize(fontSize + 15);
    doc.text(title, 15, 30);
    doc.setFontSize(fontSize + 5);
    doc.text(client.nom, 15, 58);
    doc.setFontSize(fontSize);
    doc.text("Date : " + formatDate(Date.now()), 130, 64);
    doc.text("Reference : " + donnee.numeroFacture, 130, 70);
    doc.text("Reference client : " + client.RefClient, 15, 64);
    doc.text("Reférence crédit : " + client.RefCredit, 15, 70);
    doc.setFontSize(fontSize + 5);
    doc.text("VERSEMENT EN ESPECE", 15, 88);
    doc.setFontSize(fontSize);
    doc.text("Nous avons reçue en espece le montant de " + donnee.montantAPayer + " MGA",
      15, 94
    );
    doc.text("Reste a payé : " + rest + " MGA", 15, 102);
    doc.text("Siege : Lot IV P 64 Ter BA Antsalovana, Antananarivo 101", 15, 132);
    doc.text("Tél : 020 22 336 52", 15, 138);
    doc.text("E-mail : cefor@blueline.mg", 60, 138);
    doc.text("Site web : www.cefor.mg", 125, 138);
    doc.save(`${donnee.numeroFacture}.pdf`);
    setTimeout(() => {
      setErrorMessage("");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="p-3 pt-0">
      <Card className="height-100">
        <Card.Header className="mb-2">Payer un remboursement</Card.Header>
        <Row className="p-2">
          <Col xs={12} sm={3} className="width-50">
            <InputGroup className="mb-3">
              <InputGroup.Text id="ref-client">Ref Client</InputGroup.Text>
              <Form.Select
                aria-label="Reference client"
                size="sm"
                value={selectedRef}
                aria-describedby="ref-client"
                onChange={handleRefChange}
              >
                <option>Ref Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.RefClient}>
                    {client.RefClient}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col xs={12} sm={3} className="width-50">
            <InputGroup className="mb-3">
              <InputGroup.Text id="ref-credit">Ref Credit</InputGroup.Text>
              <Form.Select
                aria-label="Reference credit"
                size="sm"
                value={selectedRef}
                aria-describedby="ref-credit"
                onChange={handleRefChange}
              >
                <option>Ref Credit</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.RefCredit}>
                    {client.RefCredit}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col className="show-on-pc"></Col>
          <Col className="show-on-pc"></Col>
        </Row>
        {selectedClient && (
          <div className="px-2">
            <Row className="p-2">
              <Col sm={6} xs={12}>
                <Form.Label className="small">
                  <strong>Nom :&nbsp;</strong>
                  {selectedClient.nom}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>Ref Client :&nbsp;</strong>
                  {selectedClient.RefClient}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>Ref Credit :&nbsp;</strong>
                  {selectedClient.RefCredit}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>Montant Abandonné :&nbsp;</strong>
                  {selectedClient.MontantAbandonnee}
                </Form.Label>
                <br />
              </Col>
              <Col sm={6} xs={12}>
                <Form.Label className="small">
                  <strong>Date de passage en perte :&nbsp;</strong>
                  {selectedClient.DatePassagePerte}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>CA Responsable :&nbsp;</strong>
                  {selectedClient.CAResponsable}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>Agence :&nbsp;</strong>
                  {selectedClient.Agence}
                </Form.Label>
                <br />
                <Form.Label className="small">
                  <strong>Type :&nbsp;</strong>
                  {selectedClient.Type}
                </Form.Label>
                <br />
              </Col>
            </Row>
            <hr />
            <h2 className="small">Champs à saisir ....</h2>
            <Form>
              {error ? (
                <FormLabel className="text-danger">{error}</FormLabel>
              ) : (
                <FormLabel className="text-success">{message}</FormLabel>
              )}
              <Row className="p-2">
                <Col>
                  <Form.Label className="small">
                    <strong>Agent :&nbsp;{collecteur}</strong>
                  </Form.Label>
                  <br />
                  <Form.Label className="small">
                    <strong>Agence :&nbsp;{agence}</strong>
                  </Form.Label>
                  <br />
                  <Form.Label className="small">
                    <strong>Numéro de facture :&nbsp;{numeroFacture}</strong>
                  </Form.Label>
                  <br />
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="small">
                      <strong>Date de paiement :&nbsp;{formatDate()}</strong>
                    </Form.Label>
                    <br />
                    <Form.Label className="small" htmlFor="montantAPayer">
                      <strong>Montant à payer :</strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      autoFocus
                      id="montantAPayer"
                      placeholder="Montant à payer"
                      value={montantAPayer}
                      required
                      size="sm"
                      onChange={(e) => setMontantAPayer(e.target.value)}
                    />
                  </Form.Group>
                  <div className="text-end mt-2">
                    <Button
                      xs={6}
                      type="button"
                      onClick={clearData}
                      className="mx-3"
                      variant="danger"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      className="display-inline"
                      onClick={handleShow}
                      variant="success"
                    >
                      Enregistrer
                    </Button>
                  </div>
                </Col>
                <Modal
                  show={show}
                  onHide={handleClose}
                  centered
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Information</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <FormLabel>
                      Confirmez vous l'enregistrement de cet remboursement ?
                    </FormLabel>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      <FontAwesomeIcon icon={faCancel} />
                      &nbsp;Annuler
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => remboursementSubmit()}
                    >
                      <FontAwesomeIcon icon={faCheckToSlot} />
                      &nbsp;Confirmer
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            </Form>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Payments;
