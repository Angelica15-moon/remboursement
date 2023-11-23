import { useState } from "react";

export default function Resistration(user) {
    const [errorMessage, setErrorMessage] = useState("");
    const userResistration = () => {
        fetch('http://localhost:3002/resistration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        }).then((response) => response.json())
            .then((data) => {

            }).catch((error) => {
                console.log(errorMessage);
                setErrorMessage(error.message);
            });
    }
    return userResistration;
}