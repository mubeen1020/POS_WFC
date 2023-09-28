import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck, cilPlus, cilTrash } from "@coreui/icons";
import OrdersService from "src/services/order_services";
import CustomerService from "src/services/customer_services";
import OrderStatusService from "src/services/orderstatus_services";
import PaymentmodeService from "src/services/paymentmode_services";
import PaymentstatusService from "src/services/paymentstatus_services";
import OrderitemsService from "src/services/orderstockitem_services";
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FishpackService from "src/services/fishpack_services";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import OrderStockItem from "../orderstockitem/orderstockitem";
import { orderAtom } from "src/_state/orderAtom";


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
    const [OrderID, setOrderID] = useState([])

    const [modalVisible, setModalVisible] = useState(false);
    const [Popup,setPopup] = useState(false)

    const [Order_Data, setOrder_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [CustomerData, setCustomerData] = useState([])
    const [Orderstatusdata, setOrderstatusdata] = useState([])
    const [Paymentmodedata, setPaymentmodedata] = useState([])
    const [Paymentstatusdata, setPaymentstatusdata] = useState([])

    const [customerNotFound, setCustomerNotFound] = useState(false)

    const [selectedRows, setSelectedRows] = useState([]);
    const [TableData, setTableData] = useState([])
    const setGlobatEvent = useSetRecoilState(globalEventAtom)
    const orederData = useRecoilValue(orderAtom)


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
                setOrderID(res.data.newOrder.id)
                setModalVisible(true);setPopup(true)
                // toast.current.show({
                //     severity: 'success',
                //     summary: 'Data Submitted',
                //     detail: 'Your order information has been successfully submitted and recorded.',
                //     life: 3000,
                // });
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
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges || 0) || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: Payment_status || Order_Data.payment_status,
            payment_mode: Payment_mode || Order_Data.payment_mode
        };

        const api = new OrdersService();
        api
            .updateorders(params.id, formData)
            .then((res) => {
                setModalVisible(true)
                // toast.current.show({
                //     severity: 'success',
                //     summary: 'Data Submitted',
                //     detail: 'Your order information has been successfully update and recorded.',
                //     life: 3000,
                // });
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
        params.id ? get_order_data(): setOrder_date(currentDate)

    }, [])


    useEffect(() => {
        if (Order_date) {
            const orderDate = new Date(Order_date);
            orderDate.setDate(orderDate.getDate() + 2);
            const deliveryDeadline = orderDate.toISOString().split('T')[0];
            setDelivery_deadline(deliveryDeadline);
        }
    }, [Order_date]);


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <CButton onClick={handleDelete} style={{ width: 100, padding: 10, marginRight: 5 }}>
                        <CIcon icon={cilTrash} className="mr-2" />Delete
                    </CButton> 
                </span>

            </div>
        )
    }


    const handleClick = (event) => {
        const clickedRowData = event.data;
        const clickedRowId = clickedRowData.id;
    }


    let delete_record = () => {
        let _data = selectedRows.map(i => i.id);
        let api = new OrderitemsService();
        _data.forEach((id) => {

            api.deleteorderitems(id)
                .then((res) => {
                    get_data();
                    toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Deleted Successfully' });
                })
                .catch((err) => { })
        });
    };

    const handleDelete = () => {
        if (selectedRows.length > 0) {
            confirmDialog({
                message: 'Are you sure you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: delete_record,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select the row that says to Delete' });
        }
    };

    const header = renderHeader();

 
    const get_data = (search = '') => {
        console.log(OrderID)
        setGlobatEvent({ eventName: 'refreshorderitems' });
        const api = new OrderitemsService;
        api.getorderitems(search).then((res) => {
            const propID =Order_Data.id === undefined ? OrderID :  Order_Data.id;
            const filteredData = res.data.orderItems.filter((item) => item.order_id === propID );
            console.log(params.id );
            console.log(res.data.orderItems)
            
            if (Array.isArray(filteredData) && filteredData.length > 0) {
              setTableData(filteredData);
            } else {
              if (res.data && res.data.message === "orderItems not found.") {
                setTableData([]);
              } else {
                console.log('3333333333')
                setTableData(filteredData);
              }
            }
            

        }).catch((err) => { });
    }

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
        get_data();
    }, [])

    useEffect(()=>{
        if(!modalVisible || !OrderID){
            get_data(); 
        }
    },[modalVisible,OrderID,Order_Data])
    const propID = Order_Data.id === undefined ? OrderID :  Order_Data.id;
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
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Customer</CFormLabel>
                                            <CFormInput
                                                onChange={handlecustomer}
                                                defaultValue={
                                                    params.id && filter_name.length > 0 ? filter_name[0].full_name : Customer
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
                                        <datalist id="customerSuggestions" >
                                            {filteredCustomers.map((customer) => (
                                                <option key={customer.id} value={customer.full_name} />
                                            ))}
                                        </datalist>
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
                                    </CRow>
                                </div>
                                <div>
                                    <CRow>

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

                                    </CRow>
                                </div>


                                <div>
                                    <CRow>
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
                                    </CRow>
                                </div>

                                <CCol xs={12}>
                                    <CButton style={{ float: 'right' }} color="primary" type="submit">
                                        <CIcon icon={cilCheck} className="mr-1" /> Add a line
                                    </CButton>
                                </CCol>
                            </CForm>
                            <br />
                            <div>
                                <Dialog header="Order Item" visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                                    <OrderStockItem propName={propID} setVisible={setModalVisible} ispopup={true}  />
                                </Dialog>
                             </div>
                             {Popup || params.id&&
                            <div>
                                <ConfirmDialog />
                                <DataTable
                                    className="responsive-table"
                                    selectionMode={'checkbox'}
                                    selection={selectedRows}
                                    onSelectionChange={(e) => { setSelectedRows(e.value); }}
                                    onRowDoubleClick={(e) => { handleClick(e) }}
                                    value={TableData}
                                    header={header}
                                    showGridlines
                                    responsiveLayout="scroll"
                                    size="small" paginator
                                    rowHover
                                    rows={10}
                                    rowsPerPageOptions={[10, 20, 50]}>
                                    <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    {/* <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_id" header="Order" body={OrdersService.ordername} ></Column> */}
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_pack_ref" header="Fish Pack Refrence" body={FishpackService.fishpackname} sortable></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="total_packs_ordered" header="Total Packs Ordered" sortable></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_weight" header="Fish Weight" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="meat_weight" header="Meat Weight" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_rate" header="Fish Rate" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="meat_rate" header="Meat Rate" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="skin" header="Skin" body={(rowData) => (rowData.skin === 1 ? 'Yes' : 'No')} ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="kante" header="Kante" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="pack_price" header="Pack Price" ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="item_discount_absolute" header="Item Discount Absolute"  ></Column>
                                    <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="item_discount_percent" header="Item Discount Percent" ></Column>
                                </DataTable>
                            </div>
}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>

    )
}