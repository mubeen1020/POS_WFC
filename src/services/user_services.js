import apiClient from "src/helpers/apiClient";
class UsersService{
    createUser   = (data) => apiClient().post(`api/users/signup`, data);
    loginUser    =  (data) => apiClient().post(`api/users/login`, data);
}

export default UsersService;