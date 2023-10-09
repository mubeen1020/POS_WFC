import { useRecoilValue } from "recoil";
import { orderstatusAtom } from "src/_state/orderstatusAtom";
import apiClient from "src/helpers/apiClient";
class OrderStatusService {
    createorderStatus = (data) => apiClient().post(`api/orderStatus`, data);
    getorderStatus = (search) => search ? apiClient().get(`api/orderStatus/search?query=${search}`) : apiClient().get('api/orderStatus');
    getorderStatusbyId = (id) => apiClient().get("api/orderStatus/" + id);
    deleteorderStatus = (id) => apiClient().delete("api/orderStatus/" + id);
    updateorderStatus = (id, data) => apiClient().put("api/orderStatus/" + id, data);
    static orderStatusname(row) {
        const orderStatusData = useRecoilValue(orderstatusAtom);
        const filteredorderStatus = orderStatusData.filter(item => row.order_status == item.id);
        const orderStatusNames = filteredorderStatus.map(item => item.order_status);
        if (orderStatusNames.length > 0) {
            const firstStatus = orderStatusNames[0];
            if (firstStatus === 'available_booked') {
                return 'Available Booked';
            } else if (firstStatus === 'packed') {
                return 'Packed';
            } else if (firstStatus === 'delivered') {
                return 'Delivered';
            } else if (firstStatus === 'purchased_approve') {
                return 'Purchased Approve';
            } else if (firstStatus === 'returned') {
                return 'Returned';
            } else if (firstStatus === 'to_be_purchased') {
                return 'To be purchased';
            } else if (firstStatus === 'closed') {
                return 'Closed';
            }
        }
        
        return '';
    }
    

}


export default OrderStatusService;