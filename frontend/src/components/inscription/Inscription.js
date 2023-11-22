import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './inscription.css';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Resistration from '../../services/ResitrationService';


export default function inscription() {
    const [error, setErrorMessage] = useState();
    const [user, setUtilisateur] = useState([]);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [adresse, setAdresse] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTelephone] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");

    const handleUserFormSubimt = (e) =>{
        e.preventDefault();
        if (password !== cpassword) {
            setErrorMessage("Les deux mots mot de passe ne correspond pas!");
        }else {
            setUtilisateur(new Utilisateur(nom, prenom, adresse, username, password, email, tel, role));
            Resistration(user);
        }
    }

    const handleRoleChange  = (e) => {
        const selectedRefValue = e.target.value;
        setRole(selectedRefValue);
      }

    return (
        <div>
            <Card>
                <Card.Header>S'inscrire</Card.Header>
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
                                    <Form.Control type='text' id="prenom" placeholder="Prenom" value={password}
                                        required size='sm' onChange={(e) => setPrenom(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="adresse">adresse</Form.Label>
                                    <Form.Control type='text' id="adresse" placeholder="Adresse" value={password}
                                        required size='sm' onChange={(e) => setAdresse(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="email">E-mail</Form.Label>
                                    <Form.Control type='mail' id="email" placeholder="email" value={password}
                                        required size='sm' onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="tel">Téléphone</Form.Label>
                                    <Form.Control type='text' id="tel" placeholder="tel" value={nom}
                                        required size='sm' onChange={(e) => setTelephone(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="username">Nom d'utilisateur</Form.Label>
                                    <Form.Control type='text' id="username" placeholder="Nom d'utilisateur" value={password}
                                        required size='sm' onChange={(e) => setUsername(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="role">Role</Form.Label>
                                    <Form.Select aria-label="Role" size='sm' id='role'
                                        value={selectedRef} aria-describedby="role" onChange={handleRoleChange}>
                                        <option value="">Ref Client</option>
                                        <option value="admin">Adimn</option>
                                        <option value="agent">Agent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="password">Mot de passe</Form.Label>
                                    <Form.Control type='password' id="email" placeholder="password" value={password}
                                        required size='sm' onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="cpassword">Confirmer</Form.Label>
                                    <Form.Control type='password' id="cpassword" placeholder="Confirmer le mot de passe" value={password}
                                        required size='sm' onChange={(e) => setCPassword(e.target.value)} />
                                </Form.Group>
                                {error && (
                                    <FormLabel className='text-danger'>{error}</FormLabel>
                                )}
                            </Col>
                        </Row>
                        <div className='text-end mt-2'>
                            <Button xs={6} type='button' onClick={clearData} className='mx-3' variant="danger">Login</Button>
                            <Button type='submit' className='display-inline' variant="success">S'inscrire</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );


}

class Utilisateur {
    constructor(nom, prenom, adresse, username, password, email, tel, role){
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.tel = tel;
    }
}