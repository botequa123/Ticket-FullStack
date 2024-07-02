
import React from "react";
import { Link } from "react-router-dom";
import phongphuLogo from '../image/phongphu_logo.jpg';
import '../styles/Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <header className="welcome-header">
                <img src={phongphuLogo} className="company-logo" alt="Phong Phú Logo" />
                <h1>Chào mừng đến Phong Phú</h1>
                <h2>Hệ thống tạo Ticket phản hồi</h2>
                <div className="welcome-links">
                    <Link to="/Login" className="welcome-link">Chuyển Tiếp</Link>
                </div>
            </header>
        </div>
    );
};

export default Welcome;
