import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton } from "@coreui/react";
import { Toast } from 'primereact/toast';
import CustomerService from "src/services/customer_services";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import FishService from "src/services/fish_services";


export default function Fish() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Customer, setCustomer] = useState('')
    const [Order_date, setOrder_date] = useState('')
    const [Delivery_deadline, setDelivery_deadline] = useState('')
    const [Order_status, setOrder_status] = useState('')
    const [Delivery_charges, setDelivery_charges] = useState('')
    const [Urgent_delivery_charges, setUrgent_delivery_charges] = useState('')
    const [Order_total, setOrder_total] = useState('')
    const [Payment_status, setPayment_status] = useState('')

    const [Order_Data, setOrder_Data] = useState([])


    const handlecustomer = (e) => { setCustomer(e.target.value) }
    const handleorderdate = (e) => { setOrder_date(e.target.value) }
    const handledeliverydeadline = (e) => { setDelivery_deadline(e.target.value) }
    const handleorderstatus = (e) => { setOrder_status(e.target.value) }
    const handledeliverycharges = (e) => { setDelivery_charges(e.target.value) }
    const handlenurgentdeliverycharges = (e) => { setUrgent_delivery_charges(e.target.value) }
    const handleordertotal = (e) => { setOrder_total(e.target.value) }
    const handlepaymentstatus = (e) => { setPayment_status(e.target.value) }

    let get_fish_data = () => {
        let api = new FishService;
        api.getfishbyId(params.id).then((res) => {
            setOrder_Data(res.data.fish[0]);

        }).catch((err) => { });
    }

    const fishDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer,
            order_date: Order_date,
            delivery_deadline: Delivery_deadline,
            order_status: Order_status,
            delivery_charges: Delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges,
            order_total: Order_total,
            payment_status: Payment_status
        };

        const api = new FishService();
        api
            .createfish(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your order information has been successfully submitted and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishList');
                }, [3000])

            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });
                console.log('error: ', error);
            });
    }

    const fishDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer || Order_Data.customer,
            order_date: Order_date || Order_Data.order_date,
            delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
            order_status: Order_status || Order_Data.order_status,
            delivery_charges: Delivery_charges || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: Payment_status || Order_Data.payment_status
        };

        const api = new FishService();
        api
            .updatefish(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your order information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishList');
                }, [3000])

            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });
                console.log('error: ', error);
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



    useEffect(() => {
        params.id ? get_fish_data() : ''
    }, [])

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Fish/FishList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Fish</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => {
                                    params.id ? fishDataupdateSubmit(event) : fishDataSubmit(event);
                                }}
                            >

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Customer</CFormLabel>
                                        <CSelect
                                            name="customer"
                                            onChange={handlecustomer}
                                            value={orderData.customer}
                                            required
                                        >
                                            <option value="">Select Customer</option>
                                        </CSelect>
                                        <CFormFeedback invalid>Please choose a customer.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Order Date</CFormLabel>
                                        <CFormInput
                                            name="order_date"
                                            type="date"
                                            onChange={handleorderdate}
                                            defaultValue={params.id ? Fish_Data.local_name : Local_name}
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose an Order Date.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Delivery Deadline</CFormLabel>
                                        <CFormInput
                                            name="delivery_deadline"
                                            type="date"
                                            onChange={handledeliverydeadline}
                                            value={orderData.delivery_deadline}
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Delivery Deadline.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Order Status</CFormLabel>
                                        <CSelect
                                            name="order_status"
                                            onChange={handleorderstatus}
                                            value={orderData.order_status}
                                            required
                                        >
                                            <option value="new">New</option>
                                            <option value="quotation">Quotation</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirm">Confirm</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="returned">Returned</option>
                                        </CSelect>
                                        <CFormFeedback invalid>Please choose an Order Status.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Delivery Charges</CFormLabel>
                                        <CFormInput
                                            name="delivery_charges"
                                            type="number"
                                            onChange={handledeliverycharges}
                                            value={orderData.delivery_charges}
                                            required
                                        />
                                        <CFormFeedback invalid>Please enter Delivery Charges.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Urgent Delivery Charges</CFormLabel>
                                        <CFormInput
                                            name="urgent_delivery_charges"
                                            type="number"
                                            onChange={handlenurgentdeliverycharges}
                                            value={orderData.urgent_delivery_charges}
                                        />
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Payment Status</CFormLabel>
                                        <CSelect
                                            name="payment_status"
                                            onChange={handlepaymentstatus}
                                            value={orderData.payment_status}
                                            required
                                        >
                                            <option value="unpaid">Unpaid</option>
                                            <option value="paid">Paid</option>
                                        </CSelect>
                                        <CFormFeedback invalid>Please choose a Payment Status.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Payment Mode</CFormLabel>
                                        <CSelect
                                            name="payment_mode"
                                            onChange={handlepa}
                                            value={orderData.payment_mode}
                                        >
                                            <option value="">Select Payment Mode</option>
                                            <option value="cash">Cash</option>
                                            <option value="easypaisa">Easypaisa</option>
                                            <option value="jazzcash">Jazzcash</option>
                                            <option value="meezan">Meezan</option>
                                        </CSelect>
                                    </CCol>
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