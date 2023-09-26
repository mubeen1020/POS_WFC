import apiClient from "src/helpers/apiClient";
class PaymentsService {
    createpayments = (data) => apiClient().post(`api/payments`, data);
    getpayments = (search) => search ? apiClient().get(`api/payments/search?customerName=${search}`) : apiClient().get('api/payments');
    getpaymentsbyId = (id) => apiClient().get("api/payments/" + id);
    deletepayments = (id) => apiClient().delete("api/payments/" + id);
    updatepayments = (id, data) => apiClient().put("api/payments/" + id, data);

}

export default PaymentsService;