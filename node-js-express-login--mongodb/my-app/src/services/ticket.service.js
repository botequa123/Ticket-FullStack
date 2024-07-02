import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/tickets";

const getTickets = (page = 1, limit = 10) => {
    return axios.get(`${API_URL}?page=${page}&limit=${limit}`, { headers: authHeader() });
};

const createTicket = (ticket) => {
    return axios.post(API_URL, ticket, { headers: authHeader() });
};

const updateTicket = (id, ticket) => {
    return axios.put(`${API_URL}/${id}`, ticket, { headers: authHeader() });
};

const deleteTicket = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const ticketService = {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket,
};

export default ticketService;
