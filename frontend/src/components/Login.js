import React, { useState } from 'react';

export default function Login() {
    const [token, setToken] = useState(null);
    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form>
                <label>
                    <p>Username</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}