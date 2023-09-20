import { useRecoilValue } from "recoil";
import { customerAtom } from "src/_state/customerAtom";
import apiClient from "src/helpers/apiClient";
class CustomerService {
    createCustomer = (data) => apiClient().post(`api/customer`, data);
    getCustomer = (search) => search ? apiClient().get(`api/customer/search?query=${search}`) : apiClient().get('api/customer');
    getCustomerbyId = (id) => apiClient().get("api/customer/" + id);
    deleteCustomer = (id) => apiClient().delete("api/customer/" + id);
    updateCustomer = (id, data) => apiClient().put("api/customer/" + id, data);
    static Customername(row){
        const customerData = useRecoilValue(customerAtom)
        const filteredcustomer = customerData.filter(item => row.customer == item.id);
        const customerNames = filteredcustomer.map(item => item.name);
        return customerNames;
    }

}

export default CustomerService;