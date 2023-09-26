import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import OrdersService from "src/services/order_services";
import CustomerService from "src/services/customer_services";
import OrderStatusService from "src/services/orderstatus_services";
import PaymentmodeService from "src/services/paymentmode_services";
import PaymentstatusService from "src/services/paymentstatus_services";


export default function Orders() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Customer, setCustomer] = useState('')
    const [Customer_id, setCustomer_id] = useState('')
    const [Order_date, setOrder_date] = useState('')
    const [Delivery_deadline, setDelivery_deadline] = useState('')
    const [Order_status, setOrder_status] = useState('')
    const [Delivery_charges, setDelivery_charges] = useState(0)
    const [Urgent_delivery_charges, setUrgent_delivery_charges] = useState()
    const [Order_total, setOrder_total] = useState('')
    const [Payment_status, setPayment_status] = useState('')
    const [Payment_mode, setPayment_mode] = useState('')

    const [Order_Data, setOrder_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [CustomerData, setCustomerData] = useState([])
    const [Orderstatusdata, setOrderstatusdata] = useState([])
    const [Paymentmodedata, setPaymentmodedata] = useState([])
    const [Paymentstatusdata, setPaymentstatusdata] = useState([])

    const [customerNotFound, setCustomerNotFound] = useState(false)


    const handlecustomer = (e) => {
        const value = e.target.value;
        setCustomer(value)
        const selectedCustomer = CustomerData.find((customer) =>
            customer.full_name.toLowerCase() === value.toLowerCase()
        );
        if (selectedCustomer) {

            setCustomer_id(selectedCustomer.id);
            setCustomerNotFound(false);
            setDelivery_charges(selectedCustomer.delivery_charges);

        } else {
            setCustomer_id(null);
            setCustomerNotFound(true);
            setDelivery_charges(0);
        }
        const filtered = CustomerData.filter((customer) =>
            customer.full_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
        if (params.id) {
            if (filteredCustomers && filteredCustomers.length > 0) {
                setDelivery_charges(filteredCustomers[0].delivery_charges);
            }
        }
    }
    const handleorderstatus = (e) => { setOrder_status(e.target.value) }
    const handledeliverycharges = (e) => { setDelivery_charges(e.target.value); }
    const handlenurgentdeliverycharges = (e) => {
        const urgentDeliveryCharge = Number(e.target.value);
        const newDeliveryCharge = Number(Delivery_charges) + urgentDeliveryCharge;
        setUrgent_delivery_charges(urgentDeliveryCharge);
        // setDelivery_charges(newDeliveryCharge);
    };


    const handleordertotal = (e) => { setOrder_total(e.target.value) }
    const handlepaymentstatus = (e) => { setPayment_status(e.target.value) }
    const handlepaymentmode = (e) => { setPayment_mode(e.target.value) }

    let get_order_data = () => {
        let api = new OrdersService;
        api.getordersbyId(params.id).then((res) => {
            setOrder_Data(res.data.order);
            setDelivery_charges(res.data.order.delivery_charges)
            setOrder_date(res.data.order.order_date)
            const orderDate = res.data.order.order_date;
            const deliverydeadlineDate = res.data.order.delivery_deadline
            if (orderDate) {
                const parsedDate = new Date(orderDate);
                parsedDate.setHours(parsedDate.getHours() + 5);
                const formattedDate = parsedDate.toISOString().split('T')[0];
                setOrder_date(formattedDate);
            }
            if (deliverydeadlineDate) {
                const parsedDate = new Date(deliverydeadlineDate);
                parsedDate.setHours(parsedDate.getHours() + 5);
                const formattedDate = parsedDate.toISOString().split('T')[0];
                setDelivery_deadline(formattedDate);
            }
        }).catch((err) => { });
    }

    const orderDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id,
            order_date: Order_date,
            delivery_deadline: Delivery_deadline,
            order_status: Order_status,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges),
            urgent_delivery_charges: Urgent_delivery_charges,
            order_total: Order_total,
            payment_status: Payment_status,
            payment_mode: Payment_mode
        };

        const api = new OrdersService();
        api
            .createorders(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your order information has been successfully submitted and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Order/OrderList');
                }, [2000])

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

    const orderDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id || Order_Data.customer,
            order_date: Order_date || Order_Data.order_date,
            delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
            order_status: Order_status || Order_Data.order_status,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges) || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: Payment_status || Order_Data.payment_status,
            payment_mode: Payment_mode || Order_Data.payment_mode
        };

        const api = new OrdersService();
        api
            .updateorders(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your order information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Order/OrderList');
                }, [2000])

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


    const Customer_Data_Get = (search = "") => {
        let api = new CustomerService;
        api.getCustomer(search).then((res) => { setCustomerData(res.data.customers); })
            .catch((err) => { });
    }

    const orderstatus_Data_Get = (search = "") => {
        let api = new OrderStatusService;
        api.getorderStatus(search).then((res) => { setOrderstatusdata(res.data.orderStatuses); })
            .catch((err) => { });
    }

    const paymentmode_Data_Get = (search = "") => {
        let api = new PaymentmodeService;
        api.getpaymentmode(search).then((res) => { setPaymentmodedata(res.data.paymentmodes); })
            .catch((err) => { });
    }

    const paymentstatus_Data_Get = (search = "") => {
        let api = new PaymentstatusService;
        api.getpaymentStatus(search).then((res) => { setPaymentstatusdata(res.data.paymentStatuses); })
            .catch((err) => { });
    }

    const filter_name = CustomerData.filter((customer) => {
        return customer.id === Order_Data.customer;

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
        Customer_Data_Get();
        orderstatus_Data_Get();
        paymentmode_Data_Get();
        paymentstatus_Data_Get();
        const currentDate = new Date().toISOString().split('T')[0];
        params.id ? get_order_data() : setOrder_date(currentDate)

    }, [])


    useEffect(() => {
        if (Order_date) {
            const orderDate = new Date(Order_date);
            orderDate.setDate(orderDate.getDate() + 2);
            const deliveryDeadline = orderDate.toISOString().split('T')[0];
            setDelivery_deadline(deliveryDeadline);
        }
    }, [Order_date]);


    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Order/OrderList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Orders</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => {
                                    params.id ? orderDataupdateSubmit(event) : orderDataSubmit(event);
                                }}
                            >

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Care of Customer</CFormLabel>
                                        <CFormInput
                                            onChange={handlecustomer}
                                            defaultValue={
                                                params.id && filter_name.length > 0 ? filter_name[0].name : Customer
                                            }
                                            list="customerSuggestions"
                                            type="text"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            className={`form-control ${customerNotFound ? 'is-invalid' : ''}`}
                                            style={{ borderColor: customerNotFound ? 'red' : '' }}
                                        />
                                        {customerNotFound && (
                                            <CFormFeedback invalid>Please choose a valid Care of Customer.</CFormFeedback>
                                        )}
                                    </CCol>
                                </div>

                                <datalist id="customerSuggestions" >
                                    {filteredCustomers.map((customer) => (
                                        <option key={customer.id} value={customer.full_name} />
                                    ))}
                                </datalist>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Order Date</CFormLabel>
                                        <CFormInput
                                            name="order_date"
                                            type="date"
                                            value={Order_date}
                                            onChange={(e) => setOrder_date(e.target.value)}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
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
                                            value={Delivery_deadline}
                                            onChange={(e) => setDelivery_deadline(e.target.value)}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Delivery Deadline.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Order Status</CFormLabel>
                                        <CFormSelect
                                            name="order_status"
                                            onChange={handleorderstatus}
                                            value={params.id ? Order_Data.order_status : Order_status}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        >
                                            <option>Select</option>
                                            {
                                                Orderstatusdata.map((i) => {
                                                    return (
                                                        <option key={i.id} value={i.id}>{i.order_status}</option>
                                                    )
                                                })
                                            }

                                        </CFormSelect>
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
                                            value={Delivery_charges}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
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
                                            defaultValue={params.id ? Order_Data.urgent_delivery_charges : Urgent_delivery_charges}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please enter Urgent Delivery Charges.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Order Total</CFormLabel>
                                        <CFormInput
                                            name="order_total"
                                            type="number"
                                            onChange={handleordertotal}
                                            defaultValue={params.id ? Order_Data.order_total : Order_total}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please enter Order Total.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Payment Status</CFormLabel>
                                        <CFormSelect
                                            name="payment_status"
                                            onChange={handlepaymentstatus}
                                            value={params.id ? Order_Data.payment_status : Payment_status}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        >
                                            <option>Select</option>
                                            {
                                                Paymentstatusdata.map((i) => {
                                                    return (
                                                        <option key={i.id} value={i.id}>{i.payment_status}</option>
                                                    )
                                                })
                                            }
                                        </CFormSelect>
                                        <CFormFeedback invalid>Please choose a Payment Status.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Payment Mode</CFormLabel>
                                        <CFormSelect
                                            name="payment_mode"
                                            onChange={handlepaymentmode}
                                            value={params.id ? Order_Data.payment_mode : Payment_mode}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        >
                                            <option>Select</option>
                                            {
                                                Paymentmodedata.map((i) => {
                                                    return (
                                                        <option key={i.id} value={i.id}>{i.payment_mode}</option>
                                                    )
                                                })
                                            }
                                        </CFormSelect>
                                        <CFormFeedback invalid>Please enter Payment Mode.</CFormFeedback>
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