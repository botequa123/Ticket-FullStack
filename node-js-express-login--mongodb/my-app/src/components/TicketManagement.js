import React, { useState, useEffect } from "react";
import ticketService from "../services/ticket.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import "./TicketManagement.css";

const TicketManagement = () => {
    const [tickets, setTickets] = useState([]);
    const [currentTicket, setCurrentTicket] = useState({ title: "", description: "", department: "", priority: "Low", status: "Chưa xử lý", createdDate: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);

    const navigate = useNavigate();

    const redirectToUserManagement = () => {
        navigate("/UserManagement");
    };
    const redirectToTicketManagement = () => {
        navigate("/TicketManagement");
    };
    const redirectToHome = () => {
        navigate("/Home");
    };
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setLoggedInUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
            fetchTickets();
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            const response = await ticketService.getTickets();
            setTickets(response.data);
        } catch (error) {
            console.error("Lỗi khi tải ticket", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket({ ...currentTicket, [name]: value });
    };
    const createTicket = async () => {
        try {
            await ticketService.createTicket(currentTicket);
            Swal.fire('Tạo thành công ticket!', '', 'success');
            fetchTickets();
            resetForm();
        } catch (error) {
            Swal.fire('Error!', 'Không thể tạo ticket', 'error');
        }
    };

    const updateTicket = async () => {
        try {
            await ticketService.updateTicket(currentTicket._id, currentTicket);
            Swal.fire('Cập nhật ticket thành công !', '', 'success');
            fetchTickets();
            resetForm();
        } catch (error) {
            Swal.fire('Error!', 'Không thể cập nhật ticket', 'error');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateTicket();
        } else {
            await createTicket();
        }
        setIsModalVisible(false);
    };

    const handleEdit = (ticket) => {
        if (userRoles.includes('admin') || userRoles.includes('IT')) {
            setCurrentTicket(ticket);
            setIsEditing(true);
            setIsModalVisible(true);
        } else {
            Swal.fire('Bạn không có quyền sửa ticket!', '', 'error');
        }
    };

    const handleDelete = (ticketId) => {
        if (userRoles.includes('admin') || userRoles.includes('IT')) {
            Swal.fire({
                title: 'Bạn có chắc muốn xóa ticket không?',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await ticketService.deleteTicket(ticketId);
                        fetchTickets();
                        Swal.fire('Đã xóa !', '', 'success');
                    } catch (error) {
                        console.error("Lỗi ! Xóa ticket thất bại", error);
                        Swal.fire('Error!', 'Không thể xóa ticket', 'error');
                    }
                }
            });
        } else {
            Swal.fire('Bạn không có quyền xóa ticket!', '', 'error');
        }
    };

    const handleAddNewTicket = () => {
        resetForm();
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleRowClick = (ticketId) => {
        setSelectedTicketId(ticketId);
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'priority-high';
            case 'Medium':
                return 'priority-medium';
            case 'Low':
                return 'priority-low';
            default:
                return '';
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 'Chưa xử lý':
                return 'status-chua-xu-ly';
            case 'Đang xử lý':
                return 'status-dang-xu-ly';
            case 'Đã xử lý':
                return 'status-da-xu-ly';
            default:
                return '';
        }
    };
    const resetForm = () => {
        setCurrentTicket({ title: "", description: "", department: "", priority: "Low", status: "Chưa xử lý", createdDate: "" });
        setIsEditing(false);
        setIsModalVisible(false);
    };
    return (
        <div className="ticket-management-container">
            <div className="ticket-management-navbar">
                <div className="ticket-management-navbar-left" onClick={redirectToHome}>
                    {loggedInUser && <span>Chào mừng, {loggedInUser.username}!</span>}
                </div>
                <h1 className="ticket-management-logo">Quản lý Ticket</h1>
                <button className="ticket-management-logout-button" onClick={authService.logout}>Đăng xuất</button>
            </div>
            <div className="ticket-management-sidebar">
                <ul className="ticket-management-menu">
                    {userRoles.includes("admin") && (
                        <li className="ticket-management-menu-item" onClick={redirectToUserManagement}>
                            <FontAwesomeIcon icon={faUser} /> Quản lý người dùng
                        </li>
                    )}
                    <li className="ticket-management-menu-item" onClick={redirectToTicketManagement}>
                        <FontAwesomeIcon icon={faTicketAlt} /> Quản lý Ticket
                    </li>

                </ul>
            </div>
            <div className="ticket-management-content">
                <button className="add-ticket-button" onClick={handleAddNewTicket}>Thêm ticket</button>
                <table>
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>ID</th>
                            <th>Ưu tiên</th>
                            <th>Ngày tạo</th>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                            <th>Bộ phận xử lý</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, index) => (
                            <tr
                                key={ticket._id}
                                onClick={() => handleRowClick(ticket._id)}
                                className={selectedTicketId === ticket._id ? 'selected-row' : ''}
                            >
                                <td className={getStatusClass(ticket.status)}>{ticket.status}</td>
                                <td>{index + 1}</td>
                                <td className={getPriorityClass(ticket.priority)}>{ticket.priority}</td>
                                <td>{new Date(ticket.createdDate).toLocaleString()}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.department}</td>
                                <td className="actions-column">
                                    <button className="actions-button edit" onClick={() => handleEdit(ticket)}>Sửa</button>
                                    <button className="actions-button delete" onClick={() => handleDelete(ticket._id)}>Xóa</button>
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
                        <form className="ticket-management-form" onSubmit={handleSubmit}>
                            <label>Tiêu đề
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={currentTicket.title || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>Mô tả
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={currentTicket.description || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            {!userRoles.includes('user') && (
                                <>
                                    <label>
                                        Bộ phận xử lý:
                                        <input type="text"
                                            name="department"
                                            placeholder="Department"
                                            value={currentTicket.department}
                                            onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        Ưu tiên:
                                        <select name="priority"
                                            placeholder="Priority"
                                            value={currentTicket.priority}
                                            onChange={handleInputChange}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </label>
                                    <label>
                                        Trạng thái:
                                        <select name="status"
                                            placeholder="Status"
                                            value={currentTicket.status}
                                            onChange={handleInputChange}>
                                            <option value="Chưa xử lý">Chưa xử lý</option>
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đã xử lý">Đã xử lý</option>
                                        </select>
                                    </label>
                                </>
                            )}
                            <button type="submit">{isEditing ? "Cập nhật" : "Tạo"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketManagement;
