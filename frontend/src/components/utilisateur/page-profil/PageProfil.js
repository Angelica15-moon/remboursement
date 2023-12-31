import { useState, useEffect, useMemo } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import './PageProfil.css';
import InputGroup from 'react-bootstrap/InputGroup';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import FormLabel from 'react-bootstrap/esm/FormLabel';

export default function PageProfil() {
    const [user, setUsers] = useState();
    const [historiques, setHistoriques] = useState([]);
    const [error, setErrorMessage] = useState("");
    const [filterText, setFilterText] = useState('');

    function getProfil() {
        const userConnected = localStorage.getItem('user');
        fetch(`http://localhost:3002/profil?user=${encodeURIComponent(userConnected)}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((data) => {
                setUsers(data.results[0]);
            }).catch((error) => {
                setErrorMessage(error.message);
            });

        fetch(`http://localhost:3002/historique-utilisateur?user=${encodeURIComponent(userConnected)}`, {
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
        getProfil();
    }, []);

    const columns = [
        { name: 'Ref Client', selector: row => row.refClient, sortable: true },
        { name: 'Ref Credit', selector: row => row.refCredit, sortable: true },
        { name: 'Nom Client', selector: row => row.nom, sortable: true },
        { name: 'date', selector: row => row.datePaiement, sortable: true },
        { name: 'Montant', selector: row => row.montantAPayer, sortable: true },
        { name: 'Facture', selector: row => row.numeroFacture, sortable: true },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'sur',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };

    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    let listHistorique = historiques && historiques.map(item => new Historique(
        item.RefClient, item.RefCredit, item.nom, formatDate(item.datePaiement),
        item.montantAPayer, item.numeroFacture
    ));

    const filteredItems = useMemo(
        () => listHistorique && listHistorique.filter(
            item => (item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.refClient && item.refClient.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.refCredit && item.refCredit.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.montantAPayer && item.montantAPayer.toString().includes(filterText.toLowerCase())) ||
                (item.datePaiement && item.datePaiement.toString().includes(filterText.toLowerCase())) ||
                (item.numeroFacture && item.numeroFacture.toLowerCase().includes(filterText.toLowerCase())),
        ), [listHistorique, filterText]
    );

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <Row>
                <Col>
                    <InputGroup className="my-2" size='sm'>
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
                <Card.Header>Mon profil</Card.Header>
                <Card.Body>
                    {user && (
                        <div>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <Form.Label className='small'><strong>{user.nom}&nbsp;{user.prenom}</strong></Form.Label><br />
                                    <Form.Label className='small'><strong>Adresse :&nbsp;</strong>{user.adresse}</Form.Label><br />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Label className='small'><strong>E-mail :&nbsp;</strong>{user.email}</Form.Label><br />
                                    <Form.Label className='small'><strong>Téléphone :&nbsp;</strong>{user.tel}</Form.Label><br />
                                </Col>
                            </Row>
                            <hr />
                            {error && (
                                <FormLabel className='text-danger'>{error}</FormLabel>
                            )}
                            <DataTable className='table table-bordered' data={filteredItems} columns={columns} dense direction="auto"
                                pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
                                fixedHeaderScrollHeight="350px" highlightOnHover pointerOnHover persistTableHead responsive
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
    constructor(refClient, refCredit, nom, datePaiement, montantAPayer, numeroFacture) {
        this.refClient = refClient;
        this.refCredit = refCredit;
        this.nom = nom;
        this.datePaiement = datePaiement;
        this.montantAPayer = montantAPayer;
        this.numeroFacture = numeroFacture;
    }
}