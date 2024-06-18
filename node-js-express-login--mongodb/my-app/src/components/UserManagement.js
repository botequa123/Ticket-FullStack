import React, { useState, useEffect } from "react";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import "../styles/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState({ username: "", email: "", password: "", roles: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate("/Home");
    };
    const redirectToTicketManagement = () => {
        navigate("/TicketManagement");
    };
    const redirectToUserManagement = () => {
        navigate("/UserManagement");
    };

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setLoggedInUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
            if (!roles.includes("admin")) {
                navigate("/Home");
            } else {
                fetchUsers();
                fetchRoles();
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await authService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Tải lại danh sách người dùng thất bại!", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await authService.getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Tải lại danh sách vai trò thất bại!", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleRoleChange = (e) => {
        setCurrentUser({ ...currentUser, roles: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updatedUser = { ...currentUser };

                if (!updatedUser.password) {
                    delete updatedUser.password;
                }
                if (!updatedUser.username) {
                    delete updatedUser.username;
                }
                if (!updatedUser.email) {
                    delete updatedUser.email;
                }

                await userService.updateUser(updatedUser._id, updatedUser);
                Swal.fire('Đã cập nhật!', '', 'success');
            } else {
                await userService.createUser(currentUser);
                Swal.fire('Đã tạo!', '', 'success');
            }

            fetchUsers();
            setCurrentUser({ username: "", email: "", password: "", roles: "" });
            setIsEditing(false);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Failed to save user:", error.response ? error.response.data.message : error.message);
            if (error.response && error.response.data.message.includes("Tên người dùng hoặc email đã tồn tại")) {
                Swal.fire('Lỗi!', 'Tên người dùng hoặc email đã tồn tại.', 'error');
            }
        }
    };

    const handleEdit = (user) => {
        const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : "";
        setCurrentUser({ ...user, password: "", roles: roleName });
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa người dùng?',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await userService.deleteUser(userId);
                    fetchUsers();
                    Swal.fire('Đã xóa!', '', 'success');
                } catch (error) {
                    console.error("Failed to delete user:", error.response ? error.response.data.message : error.message);
                    Swal.fire('Lỗi!', 'Không thể xóa người dùng.', 'error');
                }
            }
        });
    };

    const handleAddNewUser = () => {
        setCurrentUser({ username: "", email: "", password: "", roles: [] });
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
    };

    return (
        <div className="user-management-container">
            <div className="user-management-navbar">
                <div className="user-management-navbar-left" onClick={redirectToHome}>
                    {loggedInUser && <span>Chào mừng, {loggedInUser.username}!</span>}
                </div>
                <h1 className="user-management-logo">Quản lý người dùng</h1>
                <button className="user-management-logout-button" onClick={authService.logout}>Đăng xuất</button>
            </div>
            <div className="user-management-sidebar">
                <ul className="user-management-menu">
                    {userRoles.includes("admin") && (
                        <li className="user-management-menu-item" onClick={redirectToUserManagement}>
                            <FontAwesomeIcon icon={faUser} /> Quản lý người dùng
                        </li>
                    )}
                    <li className="user-management-menu-item" onClick={redirectToTicketManagement}>
                        <FontAwesomeIcon icon={faTicketAlt} /> Quản lý Ticket
                    </li>
                </ul>
            </div>
            <div className="user-management-content">
                <button className="add-user-button" onClick={handleAddNewUser}>Thêm người dùng</button>
                <table>
                    <thead>
                        <tr>
                            <th>Tài khoản</th>
                            <th>Email</th>
                            <th className="role-column">Vai trò</th>
                            <th className="actions-column">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                onClick={() => handleRowClick(user._id)}
                                className={selectedUserId === user._id ? 'selected-row' : ''}
                            >
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.roles.map((role) => role.name).join(", ")}</td>
                                <td className="actions-column">
                                    <button className="actions-button edit" onClick={() => handleEdit(user)}>Sửa</button>
                                    <button className="actions-button delete" onClick={() => handleDelete(user._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <form className="user-management-form" onSubmit={handleSubmit}>
                            <p>Tài khoản</p>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={currentUser.username || ""}
                                onChange={handleInputChange}
                            />
                            <p>Email</p>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={currentUser.email || ""}
                                onChange={handleInputChange}
                            />
                            <p>Mật khẩu</p>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={currentUser.password}
                                onChange={handleInputChange}
                            />
                            <p>Vai trò </p>
                            <select
                                name="role"
                                value={currentUser.roles}
                                onChange={handleRoleChange}
                                required
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">{isEditing ? "Cập nhật" : "Tạo mới"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
