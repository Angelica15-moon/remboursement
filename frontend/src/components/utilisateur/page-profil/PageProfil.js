import { useState, useEffect, useMemo } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './PageProfil.css';
import InputGroup from 'react-bootstrap/InputGroup';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export default function PageProfil() {
    const [user, setUsers] = useState();
    const [error, setErrorMessage] = useState("");
    const [filterText, setFilterText] = useState('');

    function getProfil() {
        const userConnected = localStorage.getItem('user');
        fetch(`http://localhost:3002/profil?user=${encodeURIComponent(userConnected)}`, {
            method: 'GET', headers: { 'Content-Type': 'application/json'
         }
        }).then((response) => response.json())
            .then((data) => {
                setUsers(data.results[0]);
            }).catch((error) => {
                setErrorMessage(error.message);
            });
            
    }

    useEffect(() => {
        getProfil();
    }, []);

    const columns = [
        { name: 'Ref Client', selector: row => row.nom, sortable: true },
        { name: 'Ref Credit', selector: row => row.prenom, sortable: true },
        { name: 'Nom Client', selector: row => row.nom, sortable: true },
        { name: 'date', selector: row => row.adresse, sortable: true },
        { name: 'Montant', selector: row => row.tel, sortable: true },
        { name: '...', selector: row => row.action }
    ];

    const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'sur',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };
/*
    const filteredItems = listUtilisateur.filter(
        item => (item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.prenom && item.prenom.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.adresse && item.adresse.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.tel && item.tel.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.active && item.active.toLowerCase().includes(filterText.toLowerCase())),
    );
*/
    const subHeaderComponentMemo = useMemo(() => {
        return (
            <Row>
                <Col>
                    <InputGroup className="my-2" size='sm'>
                        <Form.Control size='sm'
                            onChange={e => setFilterText(e.target.value)} placeholder="Rechercher"
                            aria-label="Rechercher" aria-describedby="rechercher" />
                        <InputGroup.Text id="rechercher">Rechercher</InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
        );
    });

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Mon profil</Card.Header>
                <Card.Body>
                    {user && (
                        <div>
                            <Form.Label className='small'><strong>Nom :&nbsp;</strong>{user.nom}</Form.Label><br />
                            <Form.Label className='small'><strong>Prénom :&nbsp;</strong>{user.prenom}</Form.Label><br />
                            <Form.Label className='small'><strong>Adresse :&nbsp;</strong>{user.adresse}</Form.Label><br />
                            <Form.Label className='small'><strong>E-mail :&nbsp;</strong>{user.email}</Form.Label><br />
                            <Form.Label className='small'><strong>Téléphone :&nbsp;</strong>{user.tel}</Form.Label><br />
                            <hr/>
                            <DataTable className='table table-bordered' columns={columns} dense direction="auto"
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

class Utilisateur {
    constructor(nom, prenom, adresse, telephone, email) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.telephone = telephone;
        this.email = email;
    }
}