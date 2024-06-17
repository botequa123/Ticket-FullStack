import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

class UserService {
    getUsers() {
        return axios.get(API_URL + 'auth/users', { headers: authHeader() });
    }

    getRoles() {
        return axios.get(API_URL + 'auth/roles', { headers: authHeader() });
    }

    createUser(user) {
        return axios.post(API_URL + 'auth/users', user, { headers: authHeader() });
    }

    updateUser(userId, user) {
        return axios.put(API_URL + `auth/users/${userId}`, user, { headers: authHeader() });
    }

    deleteUser(userId) {
        return axios.delete(API_URL + `auth/users/${userId}`, { headers: authHeader() });
    }
}

const userService = new UserService();
export default userService;
