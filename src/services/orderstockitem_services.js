import apiClient from "src/helpers/apiClient";
class OrderitemsService {
    createorderitems = (data) => apiClient().post(`api/order-items`, data);
    getorderitems = (search) => search ? apiClient().get(`api/order-items/search?customerName=${search}`) : apiClient().get('api/order-items');
    getorderitemsbyId = (id) => apiClient().get("api/order-items/" + id);
    deleteorderitems = (id) => apiClient().delete("api/order-items/" + id);
    updateorderitems = (id, data) => apiClient().put("api/order-items/" + id, data);

}

export default OrderitemsService;