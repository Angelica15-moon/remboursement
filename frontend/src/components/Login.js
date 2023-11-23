import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Login.css';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Inscription from './inscription/Inscription';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loginUser = () => {

        fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.code) {
                    setErrorMessage(data.message);
                } else {
                    console.log(data);
                    setTokenStorage(data);
                    setErrorMessage("");
                }
                setUsername("dfg");
                setPassword("dfgfh");
            }).catch((error) => {
                console.log(error);
                setErrorMessage(error.message);
            });
    }

    function setTokenStorage(response) {
        console.log(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', response.username);
    }

    const goToResistration = () => {
        return <inscription></inscription>
    }

    return (
        <div className="m-5">
            <Card>
                <Card.Header className='text-center' >Connexion</Card.Header>
                <Card.Body className='p-3'>
                    {errorMessage && (
                        <FormLabel className='text-danger'>{errorMessage}</FormLabel>
                    )}
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
                            <Button xs={6} type='button' onClick={goToResistration} className='mx-3' variant="danger">s'inscrire</Button>
                            <Button type='submit' className='display-inline' variant="success">Enregistrer</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}