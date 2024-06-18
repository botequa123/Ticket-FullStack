import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import "../styles/Home.css";

const Home = () => {
    const [user, setUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    const redirectToUserManagement = () => {
        navigate("/UserManagement");
    };
    const redirectToTicketManagement = () => {
        navigate("/TicketManagement");
    };
    return (
        <div className="Home-container">
            <div className="Home-navbar">
                <div className="Home-navbar-left">
                    {user && <span>Chào mừng, {user.username}!</span>}
                </div>
                <h1 className="Home-logo">Hệ thống quản lí</h1>
                <button className="Home-logout-button" onClick={handleLogout}>Đăng Xuất</button>
            </div>
            <div className="Home-sidebar">
                <ul className="Home-management-menu">
                    {userRoles.includes("admin") && (
                        <li className="Home-management-menu-item" onClick={redirectToUserManagement}>
                            <FontAwesomeIcon icon={faUser} /> Quản lý người dùng
                        </li>
                    )}
                    <li className="Home-management-menu-item" onClick={redirectToTicketManagement}>
                        <FontAwesomeIcon icon={faTicketAlt} /> Quản lý Ticket
                    </li>
                </ul>
            </div>
            <div className="Home-content">
                {/* Nội dung của trang Home */}
            </div>
        </div>
    );
};

export default Home;
