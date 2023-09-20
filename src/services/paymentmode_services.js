import { useRecoilValue } from "recoil";
import { paymentmodeAtom } from "src/_state/paymentmodeAtom";
import apiClient from "src/helpers/apiClient";
class PaymentmodeService {
    createpaymentmode = (data) => apiClient().post(`api/payment-mode`, data);
    getpaymentmode = (search) => search ? apiClient().get(`api/payment-mode/search?query=${search}`) : apiClient().get('api/payment-mode');
    getpaymentmodebyId = (id) => apiClient().get("api/payment-mode/" + id);
    deletepaymentmode = (id) => apiClient().delete("api/payment-mode/" + id);
    updatepaymentmode = (id, data) => apiClient().put("api/payment-mode/" + id, data);
    static paymentmodename(row) {
        const paymentmodeData = useRecoilValue(paymentmodeAtom)
        const filteredpaymentmode = paymentmodeData.filter(item => row.payment_mode == item.id);
        const paymentmodeNames = filteredpaymentmode.map(item => item.payment_mode);
        return paymentmodeNames;
    }

}

export default PaymentmodeService;