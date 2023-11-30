import { useState, useMemo } from 'react';
import './PageUtilisateur.css';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FormLabel from 'react-bootstrap/esm/FormLabel';

export default function PageUtilisateur() {
    const [usersList, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [filterText, setFilterText] = useState('');

    fetch('http://localhost:3002/collecteur', {
        method: 'GET', headers: { 'Content-Type': 'application/json' }
    }).then((response) => response.json())
        .then((data) => {
            setUsers(data.results);
        }).catch((error) => {
            setErrorMessage(error.message);
        });

    function setAction(username) {
        return (
            <Button variant='danger' size='sm' onClick={() => desactiveUser(username)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        );
    }

    function desactiveUser(username) {
        alert(username);
    }

    const listUtilisateur = usersList.map(user => new User(
        user.nom, user.prenom, user.adresse,
        user.email, user.tel, user.active ? "Activer" : "Désactiver",
        setAction(user.username)
    ));

    const columns = [
        { name: 'Nom', selector: row => row.nom, sortable: true },
        { name: 'prenom', selector: row => row.prenom, sortable: true },
        { name: 'Adresse', selector: row => row.adresse, sortable: true },
        { name: 'Téléphone', selector: row => row.tel, sortable: true },
        { name: 'E-mail', selector: row => row.email, sortable: true },
        { name: 'Active', selector: row => row.active, sortable: true },
        { name: '...', selector: row => row.action }
    ];

    const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'sur',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };

    const filteredItems = useMemo(
        () => listUtilisateur.filter(
            item => (item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.prenom && item.prenom.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.adresse && item.adresse.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.tel && item.tel.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.active && item.active.toLowerCase().includes(filterText.toLowerCase())),
        ),
        [listUtilisateur, filterText]
    );

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
                <Card.Header>Liste des utilisateurs</Card.Header>
                <Card.Body>
                {errorMessage && (
                    <FormLabel className='text-danger'>{errorMessage}</FormLabel>
                )}
                    <DataTable className='table table-bordered' data={filteredItems} columns={columns} dense direction="auto"
                        pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
                        fixedHeaderScrollHeight="350px" highlightOnHover pointerOnHover persistTableHead responsive
                        subHeader subHeaderComponent={subHeaderComponentMemo}
                    />
                </Card.Body>
            </Card>
        </div>
    );
}

class User {
    constructor(nom, prenom, adresse, email, tel, active, action) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.email = email;
        this.tel = tel;
        this.active = active;
        this.action = action;
    }
}