import axios from "axios";
import authHeader from "./auth-header";

const API_URL = window.location.protocol === 'https:'
    ? process.env.REACT_APP_API_URL_HTTPS
    : process.env.REACT_APP_API_URL_HTTP;

class TicketService {
    getTickets = (page = 1, limit = 10) => {
        return axios.get(`${API_URL}tickets?page=${page}&limit=${limit}`, { headers: authHeader() });
    };

    createTicket = (ticket) => {
        return axios.post(`${API_URL}tickets`, ticket, { headers: authHeader() });
    };

    updateTicket = (id, ticket) => {
        return axios.put(`${API_URL}tickets/${id}`, ticket, { headers: authHeader() });
    };

    deleteTicket = (id) => {
        return axios.delete(`${API_URL}tickets/${id}`, { headers: authHeader() });
    };
    getTotalTickets = () => {
        return axios.get(`${API_URL}tickets/total`, { headers: authHeader() });
    };
}
const ticketService = new TicketService();
export default ticketService;
