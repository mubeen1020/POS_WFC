import { useRecoilValue } from "recoil";
import { customerAtom } from "src/_state/customerAtom";
import { orderAtom } from "src/_state/orderAtom";
import apiClient from "src/helpers/apiClient";
class OrdersService {
    createorders = (data) => apiClient().post(`api/orders`, data);
    getorders = (search) => search ? apiClient().get(`api/orders/search?customerName=${search}`) : apiClient().get('api/orders');
    getordersbyId = (id) => apiClient().get("api/orders/" + id);
    deleteorders = (id) => apiClient().delete("api/orders/" + id);
    updateorders = (id, data) => apiClient().put("api/orders/" + id, data);
    static ordername(row){
        const orderData = useRecoilValue(orderAtom);
        const customerdata = useRecoilValue(customerAtom);
        const filteredOrders = orderData.filter(item => row.order_id === item.id);
        const customerIds = [...new Set(filteredOrders.map(item => item.customer))];
        const matchingCustomers = customerdata.filter(item => customerIds.includes(item.id));
        const finalNames = matchingCustomers.map(item => item.full_name);
        return finalNames;
      }
}

export default OrdersService;