import axios from "axios";

const baseURL = 'https://ts-backend-reportspetclub.onrender.com';

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