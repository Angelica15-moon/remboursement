import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import DataTable from 'react-data-table-component';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import JsPDF from 'jspdf';
import 'jspdf-autotable';

function HistoriquePaiements() {
  const [excelData, setExcelData] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [clients, setClients] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [historiques, setHistoriques] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const headersDoc = ["Ref Credit", "Montant payé", "Reste", "Agent", "Agence", "Numéro facture" ];

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function getCustomersHistory(refClient) {
    fetch(`http://localhost:3002/historique-client?client=${encodeURIComponent(refClient)}`, {
      method: 'GET', headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        setHistoriques(data.results);
      }).catch((error) => {
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    // Effectuez une requête pour récupérer les données de la table excel_data
    axios.get("http://localhost:3002/excel-data")
      .then((response) => {
        setExcelData(response.data);
        setSelectedRef(response.data[0].RefClient);
        setClients(response.data[0]);
        getCustomersHistory(selectedRef);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données Excel :", error);
      });
    
  }, []);

  const handleRefChange = (e) => {
    const selectedRefValue = e.target.value;
    setSelectedRef(selectedRefValue);
    const client = excelData.find((c) => c.RefClient === selectedRefValue);
    setClients(client);
    getCustomersHistory(selectedRefValue);
  }

  const columns = [
    { name: 'Ref Credit', selector: row => row.RefCredit, sortable: true },
    { name: 'Date', selector: row => row.datePaiement, sortable: true },
    { name: 'Montant payé', selector: row => row.montantAPayer, sortable: true },
    { name: 'Reste', selector: row => row.ResteApayer, sortable: true },
    { name: 'Agent', selector: row => row.collecteur, sortable: true },
    { name: 'Agence', selector: row => row.agence, sortable: true },
    { name: 'Numéro facture', selector: row => row.numeroFacture, sortable: true }
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Lignes par page',
    rangeSeparatorText: 'sur',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tous',
  };

  const filteredItems = useMemo(
    () => historiques && historiques.filter(
      item => (item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.RefCredit && item.RefCredit.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.datePaiement && item.datePaiement.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.montantAPayer && item.montantAPayer.toString().includes(filterText.toLowerCase())) ||
        (item.ResteApayer && item.ResteApayer.toString().includes(filterText.toLowerCase())) ||
        (item.collecteur && item.collecteur.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.agence && item.agence.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.numeroFacture && item.numeroFacture.toLowerCase().includes(filterText.toLowerCase())),
    ),
    [historiques, filterText]
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <Row>
        <Col>
          <Button className='mb-3' size='sm' onClick={() => exportPDF()}>
                <FontAwesomeIcon icon={faFilePdf} />
          </Button>
          <InputGroup className="mb-3" size='sm'>
            <Form.Control size='sm'
              onChange={e => setFilterText(e.target.value)} placeholder="Rechercher"
              aria-label="Rechercher" aria-describedby="rechercher" />
          </InputGroup>
        </Col>
      </Row>
    );
  }, []);

  function exportPDF() {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const doc = new JsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "Releve de comptes " + selectedRef;
  
    // Vérifier si historiques existe et n'est pas vide
    if (filteredItems && filteredItems.length > 0) {
      // Mapping des données pour formater
      const data = filteredItems.map((item) => new Historique(
        item.RefCredit,
        item.datePaiement,
        item.ResteApayer,
        item.collecteur,
        item.agence,
        item.numeroFacture
      ));
  
      // Vérifier si la première ligne de données a toutes les propriétés nécessaires
      const firstDataRow = data[0];
      const hasRequiredProperties = headersDoc.every(header => Object.prototype.hasOwnProperty.call(firstDataRow, header));
  
      if (hasRequiredProperties) {
        // Formater le contenu pour autoTable
        const headers = [headersDoc];
        const content = {
          startY: 50,
          head: headers,
          body: data
        };
  
        // Générer le PDF
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Releve de comptes-" + selectedRef + ".pdf");
      } else {
        alert("Les propriétés des données ne correspondent pas aux en-têtes.");
      }
    } else {
      alert("Aucune donnée à exporter.");
    }
  }

  return (
    <div className='p-3 pt-0'>
      <Card>
        <Card.Header className='mb-2'>Releve de comptes</Card.Header>
        <Card.Body className='p-2'>
          <Row className='p-2'>
            <Col xs={12} sm={6} lg={3}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="ref-client">Ref Client</InputGroup.Text>
                <Form.Select aria-label="Reference client" size='sm'
                  value={selectedRef} aria-describedby="ref-client" onChange={handleRefChange}>
                  <option>Ref Client</option>
                  {excelData.map((client) => (
                    <option key={client.id} value={client.RefClient}>{client.RefClient}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col className='show-on-pc'></Col>
            <Col className='show-on-pc'></Col><Col className='show-on-pc'></Col>
          </Row>
          <hr className='mb-3' />
          {errorMessage && (
            <FormLabel className='text-danger'>{errorMessage}</FormLabel>
          )}
          {clients && (
            <div className='px-3 mb-3'>
              <DataTable className='table table-bordered' title={clients.nom} columns={columns} data={filteredItems} dense direction="auto"
                pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
                fixedHeaderScrollHeight="305px" highlightOnHover pointerOnHover persistTableHead responsive
                subHeader subHeaderComponent={subHeaderComponentMemo}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

class Historique {
  constructor(refCredit, datePaiement, montantAPayer, resteApayer, collecteur, agence, numeroFacture){
    this.refCredit = refCredit;
    this.datePaiement = datePaiement;
    this.montantAPayer = montantAPayer;
    this.resteApayer = resteApayer;
    this.collecteur = collecteur;
    this.agence = agence;
    this.numeroFacture = numeroFacture;
  }
}

export default HistoriquePaiements;
