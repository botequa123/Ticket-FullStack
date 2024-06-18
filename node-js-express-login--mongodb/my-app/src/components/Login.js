// components/Login.js
import React, { useState } from "react";
import authService from "../services/auth.service";
import phongphuLogo from '../image/phongphu_logo.jpg';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        authService.login(username, password).then(
            (accessToken) => {
                if (accessToken) {
                    window.location.href = "/Home";
                } else {
                    setMessage("Đăng nhập không thành công. Vui lòng thử lại.");
                }
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <img src={phongphuLogo} className="company-logo" alt="Phong Phú Logo" />
                <h1>Trang Đăng Nhập</h1>
            </div>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label>Tài Khoản:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Mật khẩu: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Đăng Nhập</button>
                {message && <div className="error-message">{message}</div>}
            </form>
        </div>
    );
};

export default Login;
