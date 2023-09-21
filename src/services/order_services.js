import apiClient from "src/helpers/apiClient";
class OrdersService {
    createorders = (data) => apiClient().post(`api/orders`, data);
    getorders = (search) => search ? apiClient().get(`api/orders/search?customerName=${search}`) : apiClient().get('api/orders');
    getordersbyId = (id) => apiClient().get("api/orders/" + id);
    deleteorders = (id) => apiClient().delete("api/orders/" + id);
    updateorders = (id, data) => apiClient().put("api/orders/" + id, data);

}

export default OrdersService;