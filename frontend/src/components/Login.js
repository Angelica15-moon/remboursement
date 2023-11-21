import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LoginService } from '../services/LoginService';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let response;

    const loginUser = (e) => {
        e.preventDefault();
        const userConnected = {
            username,
            password
        };
        response = LoginService(userConnected);
    }

    function clearData() {
        setUsername("");
        setPassword("");
    }

    return (
        <div className="login-wrapper m-5">
            <Card>
                <Card.Header className='text-center' >Connexion</Card.Header>
                <Card.Body className='p-3'>
                    <Form onSubmit={loginUser}>
                        <Form.Group className="mb-3">
                            <Form.Label className='small' htmlFor="username">Nom d'utilisateur</Form.Label>
                            <Form.Control type='text' id="username" placeholder="Nom d'utilisateur" value={username}
                                required size='sm' onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='small' htmlFor="password">Mot de passe</Form.Label>
                            <Form.Control type='password' id="password" placeholder="Mot de passe" value={password}
                                required size='sm' onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <div className='text-end mt-2'>
                            <Button xs={6} type='button' onClick={clearData} className='mx-3' variant="danger">Annuler</Button>
                            <Button type='submit' className='display-inline' variant="success">Enregistrer</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}