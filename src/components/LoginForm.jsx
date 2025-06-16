import React from 'react';
import './LoginForm.css';
const LoginForm = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Form submitted!');
    };
    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    required
                />
            </div>

            <button className="login-btn" type="submit">Login</button>
        </form>
    );
};
export default LoginForm;
