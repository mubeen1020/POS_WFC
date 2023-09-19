import apiClient from "src/helpers/apiClient";
class UsersService {
    createUser = (data) => apiClient().post(`/api/auth/register`, data);
    loginUser = (data) => apiClient().post(`/api/auth/login`, data);
}

export default UsersService;