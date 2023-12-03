import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './inscription.css';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export default function Inscription() {
    const [error, setErrorMessage] = useState();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [adresse, setAdresse] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTelephone] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [agence, setAgence] = useState("");

    const handleUserFormSubimt = (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            setErrorMessage("Les deux mots mot de passe ne correspond pas!");
        } else {
            const agent = new Utilisateur(nom, prenom, adresse, username, password, email, tel, role, agence);
            fetch('http://localhost:3002/resistration', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agent),
            }).then((response) => response.json())
                .then((data) => {
                    clearData(data);
                    window.location.reload();
                }).catch((error) => {
                    setErrorMessage(error.message);
                });
        }
    }

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    }
    const handleAgenceChange = (e) => {
        setAgence(e.target.value);
    }

    function clearData(params) {
        setErrorMessage("");
        setNom("");
        setPrenom("");
        setAdresse("");
        setEmail("");
        setTelephone("");
        setPassword("");
        setCPassword("");
        setUsername("");
    }

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Créer un agent / Collecteur</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleUserFormSubimt}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="nom">Nom</Form.Label>
                                    <Form.Control type='text' id="nom" placeholder="Nom" value={nom}
                                        required size='sm' onChange={(e) => setNom(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="prenom">Prenom</Form.Label>
                                    <Form.Control type='text' id="prenom" placeholder="Prenom" value={prenom}
                                        required size='sm' onChange={(e) => setPrenom(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="adresse">adresse</Form.Label>
                                    <Form.Control type='text' id="adresse" placeholder="Adresse" value={adresse}
                                        required size='sm' onChange={(e) => setAdresse(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="email">E-mail</Form.Label>
                                    <Form.Control type='email' id="email" placeholder="email" value={email}
                                        required size='sm' onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="agence">Agence</Form.Label>
                                    <Form.Select aria-label="Agence" size='sm' id='agence' onChange={handleAgenceChange}
                                        value={agence} aria-describedby="agence">
                                        <option value="">Séléctione l'agence</option>
                                        <option value="Andoranofotsy">Andoranofotsy</option>
                                        <option value="Antananarivo">Antananarivo</option>
                                        <option value="Tamatave">Tamatave</option>
                                        <option value="Nosy Be">Nosy Be</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="tel">Téléphone</Form.Label>
                                    <Form.Control type='text' id="tel" placeholder="tel" value={tel}
                                        required size='sm' onChange={(e) => setTelephone(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="username">Nom d'utilisateur</Form.Label>
                                    <Form.Control type='text' id="username" placeholder="Nom d'utilisateur" value={username}
                                        required size='sm' onChange={(e) => setUsername(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="role">Role</Form.Label>
                                    <Form.Select aria-label="Role" size='sm' id='role'
                                        value={role} aria-describedby="role" onChange={handleRoleChange}>
                                        <option value="">Role utilisateur</option>
                                        <option value="admin">Adimn</option>
                                        <option value="agent">Agent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="password">Mot de passe</Form.Label>
                                    <Form.Control type='password' id="password" placeholder="password" value={password}
                                        required size='sm' onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="cpassword">Confirmer</Form.Label>
                                    <Form.Control type='password' id="cpassword" placeholder="Confirmer le mot de passe" value={cpassword}
                                        required size='sm' onChange={(e) => setCPassword(e.target.value)} />
                                </Form.Group>
                                {error && (
                                    <FormLabel className='text-danger'>{error}</FormLabel>
                                )}
                            </Col>
                        </Row>
                        <div className='text-end mt-2'>
                            <Button xs={6} type='button' onClick={(e) => clearData()} className='mx-3' variant="danger">Annuler</Button>
                            <Button type='submit' className='display-inline' variant="success">Valider</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

class Utilisateur {
    constructor(nom, prenom, adresse, username, password, email, tel, role, agence) {
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.tel = tel;
        this.agence = agence;
    }
}