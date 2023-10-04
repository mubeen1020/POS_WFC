import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect, CFormTextarea } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import { orderAtom } from "src/_state/orderAtom";
import { useRecoilValue } from "recoil";
import { customerAtom } from "src/_state/customerAtom";
import { paymentmethodAtom } from "src/_state/paymentmethodAtom";
import PaymentsService from "src/services/payment_services";


export default function Payments() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Customer, setCustomer] = useState('')
    const [Payment_date, setPayment_date] = useState('')
    const [Payment_amount, setPayment_amount] = useState('')
    const [Payment_method, setPayment_method] = useState('')
    const [Recieving_staff, setRecieving_staff] = useState('')
    const [Recieving_account, setRecieving_account] = useState('')
    const [Payment_balance, setPayment_balance] = useState('')
    const [Customer_data, setCustomer_data] = useState('')
    const [Tip_for_rider, setTip_for_rider] = useState('')
    const [Payment_tip, setPayment_tip] = useState('')
    const [Customer_id, setCustomer_id] = useState('')

    const [Payment_Data, setPayment_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])

    const orderData = useRecoilValue(orderAtom)
    const customerData = useRecoilValue(customerAtom)
    const paymentmethods = useRecoilValue(paymentmethodAtom)

    const [customerNotFound, setCustomerNotFound] = useState(false)

    const handlecustomer = (e) => {
        const value = e.target.value;
        setCustomer(value);
        const selectedCustomer = customerData.find((customer) =>
            customer.full_name.toLowerCase() === value.toLowerCase()
        );
        if (selectedCustomer) {
            setCustomer_id(selectedCustomer.id);
            setCustomerNotFound(false);
        } else {
            setCustomer_id(null);
            setCustomerNotFound(true);
        }
        const filtered = customerData.filter((customer) =>
            customer.full_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }
    const handlepayment = (e) => { setPayment_date(e.target.value) }
    const handlepaymentamount = (e) => { setPayment_amount(e.target.value) }
    const handlepaymentmethod = (e) => { setPayment_method(e.target.value) }
    const handlerecievingstaff = (e) => { setRecieving_staff(e.target.value) }
    const handlerecievingaccount = (e) => { setRecieving_account(e.target.value) }
    const handlepaymentbalance = (e) => { setPayment_balance(e.target.value) }
    const handletipforrider = (e) => { setTip_for_rider(e.target.value) }
    const handlepaymenttip = (e) => { setPayment_tip(e.target.value) }


    let get_Payment_data = () => {
        let api = new PaymentsService;
        api.getpaymentsbyId(params.id).then((res) => {
            setPayment_Data(res.data.payment);
            setPayment_method(res.data.payment.payment_method)
            const isoDate = res.data.payment.payment_date;
            if (isoDate) {
                const parsedDate = new Date(isoDate);
                parsedDate.setHours(parsedDate.getHours() + 5);
                const formattedDate = parsedDate.toISOString().split('T')[0];
                setPayment_date(formattedDate);
            } else {
            }
        }).catch((err) => { });
    }

    const paymentDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id,
            payment_date: Payment_date,
            payment_amount: Payment_amount,
            payment_method: Payment_method || 0,
            recieving_staff: Recieving_staff || 0,
            recieving_account: Recieving_account,
            payment_balance: Payment_balance || 'N/A',
            payment_tip: Payment_tip,
            tip_for_rider: Tip_for_rider
        };

        const api = new PaymentsService();
        api
            .createpayments(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your payment information has been successfully submitted and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Payment/PaymentList');
                }, [2000])

            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });
               
            });
    }

    const paymentDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id || Payment_Data.customer,
            payment_date: Payment_date || Payment_Data.payment_date,
            payment_amount: Payment_amount || Payment_Data.payment_amount,
            payment_method: Payment_method || Payment_Data.payment_method,
            recieving_staff: Recieving_staff || Payment_Data.recieving_staff,
            recieving_account: Recieving_account || Payment_Data.recieving_account,
            payment_balance: Payment_balance || Payment_Data.payment_balance,
            payment_tip: Payment_tip || Payment_Data.payment_tip,
            tip_for_rider: Tip_for_rider || Payment_Data.tip_for_rider
        };

        const api = new PaymentsService();
        api
            .updatepayments(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your payment information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Payment/PaymentList');
                }, [2000])

            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });
              ;
            });
    }


    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const filter_name = customerData.filter((customer) => {
        return orderData.some((order) => {
            if (Number(customer.id) === Number(order.customer)) {
                return order.id === Payment_Data.customer;
            }
            return false;
        });
    });



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
        } else {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const tokenExpirationTimestamp = tokenData.exp * 1000;
            if (Date.now() >= tokenExpirationTimestamp) {
                localStorage.removeItem('token')
                navigate("/");
            }
        }
        params.id ? get_Payment_data() : ''
    }, [])

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Payment/PaymentList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Payment</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => { params.id ? paymentDataupdateSubmit(event) : paymentDataSubmit(event) }}
                            >

                                <div>
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Customer</CFormLabel>
                                            <CFormInput
                                                onChange={handlecustomer}
                                                defaultValue={params.id && filter_name.length > 0 && filter_name[0].full_name ? filter_name[0].full_name : Customer}
                                                list="orderSuggestions"
                                                type="text"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                className={`form-control ${customerNotFound ? 'is-invalid' : ''}`}
                                                style={{ borderColor: customerNotFound ? 'red' : '' }}
                                            />
                                            {customerNotFound && (
                                                <CFormFeedback invalid>Please choose a valid Customer.</CFormFeedback>
                                            )}
                                        </CCol>

                                        <datalist id="orderSuggestions" >
                                            {filteredCustomers.map((customer) => (
                                                <option key={customer.id} value={customer.full_name} />
                                            ))}
                                        </datalist>



                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Date</CFormLabel>
                                            <CFormInput
                                                onChange={(e) => { setPayment_date(e.target.value) }}
                                                value={Payment_date}
                                                type="date"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required

                                            />
                                            <CFormFeedback invalid>Please choose a Payment Date.</CFormFeedback>

                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Amount</CFormLabel>
                                            <CFormInput
                                                onChange={handlepaymentamount}
                                                onKeyPress={(e) => {
                                                    const allowedKeys = /[0-9.]|\./;
                                                    const key = e.key;

                                                    if (!allowedKeys.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                type="text"
                                                defaultValue={params.id ? Payment_Data.payment_amount : Payment_amount}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />

                                            <CFormFeedback invalid>Please choose a Payment Amount.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Method</CFormLabel>
                                            <CFormSelect
                                                onChange={handlepaymentmethod}
                                                value={Payment_method}
                                                list="customerSuggestions"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required

                                            >
                                                <option>Select</option>
                                                {
                                                    paymentmethods.map((i) => {
                                                        return (
                                                            <option key={i.id} value={i.id}>{i.name}</option>
                                                        )
                                                    })
                                                }
                                            </CFormSelect>

                                            <CFormFeedback invalid>Please choose a valid Payment Method.</CFormFeedback>

                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Recieving Staff</CFormLabel>
                                            <CFormInput
                                                onChange={handlerecievingstaff}
                                                defaultValue={params.id ? Payment_Data.recieving_staff : Recieving_staff}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Recieving Staff.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Recieving Account</CFormLabel>
                                            <CFormInput
                                                onChange={handlerecievingaccount}
                                                type="number"
                                                defaultValue={params.id ? Payment_Data.recieving_account : Recieving_account}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />

                                            <CFormFeedback invalid>Please choose a Recieving Account.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Balance</CFormLabel>
                                            <CFormInput
                                                onChange={handlepaymentbalance}
                                                onKeyPress={(e) => {
                                                    const allowedKeys = /[0-9.]|\./;
                                                    const key = e.key;

                                                    if (!allowedKeys.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                type="text"
                                                defaultValue={params.id ? Payment_Data.payment_balance : Payment_balance}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Payment Balance.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Tip</CFormLabel>
                                            <CFormInput
                                                onChange={handlepaymenttip}
                                                onKeyPress={(e) => {
                                                    const allowedKeys = /[0-9.]|\./;
                                                    const key = e.key;

                                                    if (!allowedKeys.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                type="text"
                                                defaultValue={params.id ? Payment_Data.payment_tip : Payment_tip}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Payment Tip.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Tip For Rider</CFormLabel>
                                            <CFormInput
                                                onChange={handletipforrider}
                                                onKeyPress={(e) => {
                                                    const allowedKeys = /[0-9.]|\./;
                                                    const key = e.key;

                                                    if (!allowedKeys.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                type="text"
                                                defaultValue={params.id ? Payment_Data.tip_for_rider : Tip_for_rider}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Tip For Rider.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <CCol xs={12}>
                                    <CButton style={{ float: 'right' }} color="primary" type="submit">
                                        <CIcon icon={cilCheck} className="mr-1" /> Submit
                                    </CButton>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>

    )
}