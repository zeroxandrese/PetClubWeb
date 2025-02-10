import axios from "axios";

const apiUrl = import.meta.env.VITE_URL_KEY;

const baseURL = apiUrl;

const petClubApiReports = axios.create({ baseURL });

petClubApiReports.interceptors.request.use(
    async (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['z-token'] = token;
        }
        return config;
    }
)


export default petClubApiReports;