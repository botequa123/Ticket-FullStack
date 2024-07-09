import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.47.3:8080/api",
    headers: {
        "Content-type": "application/json"
    }
});