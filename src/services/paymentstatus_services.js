import { useRecoilValue } from "recoil";
import { paymentstatusAtom } from "src/_state/paymentstatusAtom";
import apiClient from "src/helpers/apiClient";
class PaymentstatusService {
    createpaymentStatus = (data) => apiClient().post(`api/paymentStatus`, data);
    getpaymentStatus = (search) => search ? apiClient().get(`api/paymentStatus/search?query=${search}`) : apiClient().get('api/paymentStatus');
    getpaymentStatusbyId = (id) => apiClient().get("api/paymentStatus/" + id);
    deletepaymentStatus = (id) => apiClient().delete("api/paymentStatus/" + id);
    updatepaymentStatus = (id, data) => apiClient().put("api/paymentStatus/" + id, data);
    static paymentStatusname(row) {
        const paymentStatusData = useRecoilValue(paymentstatusAtom);
        if (paymentStatusData && Array.isArray(paymentStatusData)) {
            const filteredpaymentStatus = paymentStatusData.filter(item => row.payment_status == item.id);
            const paymentStatusNames = filteredpaymentStatus.map(item => item.payment_status);
            return paymentStatusNames;
        } else {
            return [];
        }
    }
    

}

export default PaymentstatusService;