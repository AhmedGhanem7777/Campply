import axios from "axios";

const API = axios.create({
  baseURL: "https://camply.runasp.net",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
