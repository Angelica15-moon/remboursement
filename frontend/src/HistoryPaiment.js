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
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import JsPDF from 'jspdf';
import 'jspdf-autotable';

function HistoriquePaiements() {
  const [excelData, setExcelData] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [clients, setClients] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [historiques, setHistoriques] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
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
    { name: 'Ref Credit', selector: row => row.refCredit, sortable: true },
    { name: 'Date', selector: row => row.datePaiement, sortable: true },
    { name: 'Montant payé', selector: row => row.montantAPayer, sortable: true },
    { name: 'Reste', selector: row => row.resteApayer, sortable: true },
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

  let listHistorique = historiques && historiques.map(item => new Historique(
    item.RefCredit, formatDate(item.datePaiement), item.montantAPayer, item.ResteApayer,
    item.collecteur, item.agence, item.numeroFacture
  ));

  const filteredItems = useMemo(
    () => listHistorique && listHistorique.filter(
      item =>
        (item.refCredit && item.refCredit.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.datePaiement && item.datePaiement.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.montantAPayer && item.montantAPayer.toString().includes(filterText.toLowerCase())) ||
        (item.resteApayer && item.resteApayer.toString().includes(filterText.toLowerCase())) ||
        (item.collecteur && item.collecteur.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.agence && item.agence.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.numeroFacture && item.numeroFacture.toLowerCase().includes(filterText.toLowerCase())),
    ),
    [listHistorique, filterText]
  );

  const generatePdf = (ref, list) => {
    const doc = new JsPDF();
    const reference = ref.split(".");
    const title = "Releve de comptes " + reference[0];
    const columns = [
      { title: 'Ref Credit', dataKey: 'refCredit' },
      { title: 'Date de paiement', dataKey: 'datePaiement' },
      { title: 'Montant payé', dataKey: 'montantAPayer' },
      { title: 'Reste à payer', dataKey: 'resteApayer' },
      { title: 'Agent', dataKey: 'collecteur' },
      { title: 'Agence', dataKey: 'agence' },
      { title: 'Numéro facture', dataKey: 'numeroFacture' },
    ];
    const rows = list.map(row => ({
      refCredit: row.refCredit,
      datePaiement: row.datePaiement,
      montantAPayer: row.montantAPayer,
      resteApayer: row.resteApayer,
      collecteur: row.collecteur,
      agence: row.agence,
      numeroFacture: row.numeroFacture,
    }));

    doc.text(title, 15, 10);
    doc.text(clients.nom , 15, 16);
    doc.text("Id client : " + clients.id, 15, 22);
    doc.text("Reférence crédit : " + clients.RefCredit, 15, 28);
    doc.text("Montant Abandonnée : " + clients.MontantAbandonnee, 15, 34);
    doc.autoTable({startY: 40, styles: {lineWidth: 0.1, lineColor: 'black'}, columns, body: rows });
    doc.save(`Releve_de_comptes_${ref}`);
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <Row>
        <Col>
          <InputGroup className="mb-3" size='sm'>
            <Form.Control size='sm'
              onChange={e => setFilterText(e.target.value)} placeholder="Rechercher"
              aria-label="Rechercher" aria-describedby="rechercher" />
          </InputGroup>
        </Col>
      </Row>
    );
  }, []);

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
            <Col className='show-on-pc'></Col>
            <Col className='text-end'>
              {clients && (
                <><Button variant='danger' className='mb-3 mx-2' size='sm' onClick={() => generatePdf(selectedRef + ".pdf", listHistorique)}>
                  <FontAwesomeIcon icon={faFilePdf} />
                </Button><Button variant='success' className='mb-3' size='sm' onClick={() => generatePdf(selectedRef + ".csv", listHistorique)}>
                    <FontAwesomeIcon icon={faFileExcel} />
                  </Button></>
              )}
            </Col>
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
  constructor(refCredit, datePaiement, montantAPayer, resteApayer, collecteur, agence, numeroFacture) {
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
