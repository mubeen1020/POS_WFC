import apiClient from "src/helpers/apiClient";
class OrderpurchaseitemService {
    createorderpurchaseitem = (data) => apiClient().post(`api/order-purchase-item`, data);
    getorderpurchaseitem = (search) => search ? apiClient().get(`api/order-purchase-item/search?searchTerm=${search}`) : apiClient().get('api/order-purchase-item');
    getorderpurchaseitembyId = (id) => apiClient().get("api/order-purchase-item/" + id);
    deleteorderpurchaseitem = (id) => apiClient().delete("api/order-purchase-item/" + id);
    updateorderpurchaseitem = (id, data) => apiClient().put("api/order-purchase-item/" + id, data);
    getfishrefandfishcut = (search) => search ? apiClient().get(`api/order-purchase-item/search?searchTerm=${search}`) : apiClient().get("api/fishrefandfishcut");

}

export default OrderpurchaseitemService;