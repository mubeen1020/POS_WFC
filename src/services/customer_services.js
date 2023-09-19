import apiClient from "src/helpers/apiClient";
class CustomerService {
    createCustomer = (data) => apiClient().post(`api/customer`, data);
    getCustomer = (search) => search ? apiClient().get(`api/customer/search?query=${search}`) : apiClient().get('api/customer');
    getCustomerbyId = (id) => apiClient().get("api/customer/" + id);
    deleteCustomer = (id) => apiClient().delete("api/customer/" + id);
    updateCustomer = (id, data) => apiClient().put("api/customer/" + id, data);

}

export default CustomerService;