import axios from "axios";
import { getSecrets } from "src/config";


const apiClient = () => {
   
    const API_URL = getSecrets.API_URL
    const axiosInstance = axios.create({
        baseURL: API_URL,
        responseType: "json",
        headers: {
            'Authorization': `${localStorage.getItem('token')}`,            
        },
       
    });

    return axiosInstance;
}

export default apiClient;

