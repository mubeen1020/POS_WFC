import { useRecoilValue } from "recoil";
import { paymentmethodAtom } from "src/_state/paymentmethodAtom";
import apiClient from "src/helpers/apiClient";
class PaymentmethodService {
    createpaymentmethods = (data) => apiClient().post(`api/payment-methods`, data);
    getpaymentmethods = (search) => search ? apiClient().get(`api/payment-methods/search?query=${search}`) : apiClient().get('api/payment-methods');
    getpaymentmethodsbyId = (id) => apiClient().get("api/payment-methods/" + id);
    deletepaymentmethods = (id) => apiClient().delete("api/payment-methods/" + id);
    updatepaymentmethods = (id, data) => apiClient().put("api/payment-methods/" + id, data);
    static paymentmethodsname(row) {
        const paymentmethodsData = useRecoilValue(paymentmethodAtom)
        if (paymentmethodsData && Array.isArray(paymentmethodsData)) {
        const filteredpaymentmethods = paymentmethodsData.filter(item => row.payment_method == item.id);
        const paymentmethodsNames = filteredpaymentmethods.map(item => item.name);
        return paymentmethodsNames;
    } else {
        return [];
    }
    }

}


export default PaymentmethodService;