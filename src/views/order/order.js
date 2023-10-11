import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck, cilDollar, cilPlus, cilSend, cilTrash, cilWarning } from "@coreui/icons";
import OrdersService from "src/services/order_services";
import CustomerService from "src/services/customer_services";
import OrderStatusService from "src/services/orderstatus_services";
import PaymentmodeService from "src/services/paymentmode_services";
import PaymentstatusService from "src/services/paymentstatus_services";
import OrderitemsService from "src/services/orderstockitem_services";
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FishpackService from "src/services/fishpack_services";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import OrderStockItem from "../orderstockitem/orderstockitem";
import OrderpurchaseitemService from "src/services/orderpurchaseitem_services";
import FishService from "src/services/fish_services";
import FishCutsService from "src/services/fishcut_services";
import Order_Purchase_Item from "../orderpurchaseitem/orderpurchaseitem";
import { fishpackAtom } from "src/_state/fishpackAtom";
import { fishcutAtom } from "src/_state/fishcutAtom";
import { fishAtom } from "src/_state/fishAtom";


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
    const [Urgent_delivery_charges, setUrgent_delivery_charges] = useState(0)
    const [Order_total, setOrder_total] = useState(0)
    const [Payment_mode, setPayment_mode] = useState('')
    const [OrderID, setOrderID] = useState([])

    const [modalVisible, setModalVisible] = useState(false);
    const [ItemPurchaseModal, setItemPurchaseModal] = useState(false);
    const [Popup, setPopup] = useState(false)

    const [Order_Data, setOrder_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [CustomerData, setCustomerData] = useState([])
    const [Orderstatusdata, setOrderstatusdata] = useState([])
    const [OrderstatusID, setOrderstatusID] = useState([])
    const [Paymentmodedata, setPaymentmodedata] = useState([])
    const [Paymentstatusdata, setPaymentstatusdata] = useState([])
    const [OrderstockID, setOrderstockID] = useState([])
    const [PurchaseID, setPurchaseID] = useState([])

    const [customerNotFound, setCustomerNotFound] = useState(false)

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedItemPurchaseRows, setselectedItemPurchaseRows] = useState([])
    const [TableData, setTableData] = useState([])
    const [ItemPurchaseTableData, setItemPurchaseTableData] = useState([])
    const setGlobatEvent = useSetRecoilState(globalEventAtom)
    const fishData = useRecoilValue(fishAtom)
    const fishpackData = useRecoilValue(fishpackAtom)
    const fishcutData = useRecoilValue(fishcutAtom)


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
                setOrder_total(TableData.length)

            }
        }
    }

    const handledeliverycharges = (e) => { setDelivery_charges(e.target.value); }
    const handlenurgentdeliverycharges = (e) => {
        const urgentDeliveryCharge = Number(e.target.value);
        const newDeliveryCharge = Number(Delivery_charges) + urgentDeliveryCharge;
        setUrgent_delivery_charges(urgentDeliveryCharge);
    };

    const handleordertotal = (e) => { 
        setOrder_total(e.target.value) }
    const handlepaymentmode = (e) => { setPayment_mode(e.target.value) }





    let get_order_data = (id) => {
        let api = new OrdersService;
        api.getordersbyId(params.id || id).then((res) => {
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
            setPayment_mode(res.data.order.payment_mode)
            const orderStatusId = parseInt(res.data.order.order_status, 10);
            orderstatus_Data_Get(orderStatusId)

        }).catch((err) => { });
    }

    const statusId = Paymentstatusdata.map(i => i.id)

    const orderDataSubmit = (event) => {
        setPurchaseID(0)
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id,
            order_date: Order_date,
            delivery_deadline: Delivery_deadline,
            order_status: 15,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges),
            urgent_delivery_charges: Urgent_delivery_charges,
            order_total: Order_total,
            payment_status: statusId[1],
            payment_mode: Payment_mode
        };
        if (Popup) {
            setPopup(true)
            setModalVisible(true)
        }
        if (Popup == false) {
            const api = new OrdersService();
            api
                .createorders(formData)
                .then((res) => {
                    get_order_data(res.data.newOrder.id)
                    setOrderID(res.data.newOrder.id)
                    setModalVisible(true); setPopup(true)
                })
                .catch((error) => {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Error',
                        detail: `${error}`,
                        life: 3000,
                    });

                })
        }

    }




    const orderDataupdateSubmit = (event) => {
        get_order_data()
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            customer: Customer_id || Order_Data.customer,
            order_date: Order_date || Order_Data.order_date,
            delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
            order_status: Order_Data.order_status,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges || 0) || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: Order_Data.payment_status,
            payment_mode: Payment_mode || Order_Data.payment_mode
        };

        const api = new OrdersService();
        api
            .updateorders(params.id, formData)
            .then((res) => {
                get_order_data()
                setModalVisible(true)
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

    const Paymentstatusunpaid = Paymentstatusdata.filter((item) => item.id == Order_Data.payment_status);
    const status = Paymentstatusunpaid.map(i => i.payment_status)
    const orderDataunpaidSubmit = (event) => {
        handleSubmit(event);
        event.preventDefault();

        let formData = {
            customer: Customer_id || Order_Data.customer,
            order_date: Order_date || Order_Data.order_date,
            delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
            order_status: Order_Data.order_status,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges || 0) || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: status == 'paid' ? statusId[0] : statusId[0],
            payment_mode: Payment_mode || Order_Data.payment_mode
        };

        const api = new OrdersService();
        api
            .updateorders(params.id, formData)
            .then((res) => {
                get_order_data()
                status == 'unpaid' ?
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully Paid' }) : toast.current.show({ severity: 'warn', summary: 'warning', detail: 'Already Paid' })
            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });

            });
    };

    const orderDataorderstatusSubmit = (event, orderdata) => {
        handleSubmit(event);
        event.preventDefault();
        const data = OrderstatusID.filter((i) => i.order_status === orderdata);
        let formData = {
            customer: Customer_id || Order_Data.customer,
            order_date: Order_date || Order_Data.order_date,
            delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
            order_status: data[0].id || Order_Data.order_status,
            delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges || 0) || Order_Data.delivery_charges,
            urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
            order_total: Order_total || Order_Data.order_total,
            payment_status: Order_Data.payment_status,
            payment_mode: Payment_mode || Order_Data.payment_mode
        };

        const api = new OrdersService();
        api
            .updateorders(params.id, formData)
            .then((res) => {
                get_order_data()
                orderItem()
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Successfully ${data[0].order_status}` })
            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });

            });
    };
    const orderItem = (orderdata) => {
        setGlobatEvent({ eventName: 'refreshorderitems' });
        const api = new OrderitemsService;
        api.getorderitems().then((res) => {
            if (orderdata === 'returned') {
                const filterdata = res.data.orderItems.filter((item) => item.order_id === parseInt(params.id));

                const fishpackapi = new FishpackService();
                let totalPacksOrdered = 0;

                filterdata.forEach((item) => {
                    totalPacksOrdered += item.total_packs_ordered;
                });

                const fishPackRef = filterdata[0].fish_pack_ref;

                fishpackapi.getfishpackbyId(fishPackRef).then((res) => {
                    const currentFishPack = res.data.fishPack;

                    const formData = {
                        available_meat_packs: currentFishPack.available_meat_packs + totalPacksOrdered,
                    };

                    fishpackapi
                        .updatefishpack(fishPackRef, formData)
                        .then((res) => {
                        })
                        .catch((error) => {
                        });
                }).catch((err) => { });
            }
        }).catch((err) => { });



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

    const orderstatus_Data_Get = (orderStatusId) => {
        let api = new OrderStatusService;
        api.getorderStatus().then((res) => {
            const data = res.data.orderStatuses.filter((i) => i.id === orderStatusId);
            setOrder_status(data[0].order_status)
            setOrderstatusdata(data[0].order_status);
            setOrderstatusID(res.data.orderStatuses)
            orderItem(data[0].order_status)
        })
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
                <h4><strong style={{ fontWeight: 550 }}>Order Stock Item</strong></h4>
                <span className="p-input-icon-left">
                    <CButton disabled={Order_status === 'closed'} onClick={handleDelete} style={{ marginRight: 5 }}>
                        <CIcon icon={cilTrash} className="mr-2" />Delete stock item
                    </CButton>
                </span>

            </div>
        )
    }

    const orderstockitemDataSubmit = (orderDatastring) => {
        let formdata = {};
        let Purchasedata = {};
        let orderdata = {};
        let purcgaseid;
        let fishpackid;
        const data = OrderstatusID.filter((i) => i.order_status === orderDatastring);
        const selectedData = ItemPurchaseTableData.map((item) => {

            fishpackData.filter((fishpack) => {
                if (Number(fishpack.fish_ref) === Number(item.fish_ref) && Number(fishpack.fish_cut) === Number(item.fish_cut)) {
                    return fishpackid = fishpack.id
                }
                return false;
            });


           
            if(fishpackid){
            purcgaseid = item.id
            formdata = {
                order_id: item.order_id,
                fish_pack_ref: fishpackid,
                total_packs_ordered: 0,
                fish_weight: item.fish_weight,
                meat_weight: item.meat_weight,
                fish_rate: 0,
                meat_rate: 0,
                skin: 0,
                kante: 0,
                pack_price: 0,
                item_discount_absolute: 0,
                item_discount_percent: 0,
            },
                Purchasedata = {
                    order_id: item.order_id,
                    fish_ref: item.fish_ref,
                    fish_cut: item.fish_cut,
                    fish_weight: item.fish_weight || 0,
                    meat_weight: item.meat_weight || 0,
                    preferred_fish_size: item.preferred_fish_size,
                    other_instructions: item.other_instructions || 'N/A',
                    is_active: 1,
                    status : 'to_be_purchased'
                },
                orderdata = {
                    customer: Customer_id || Order_Data.customer,
                    order_date: Order_date || Order_Data.order_date,
                    delivery_deadline: Delivery_deadline || Order_Data.delivery_deadline,
                    order_status: data[0].id || Order_Data.order_status,
                    delivery_charges: Number(Delivery_charges) + Number(Urgent_delivery_charges || 0) || Order_Data.delivery_charges,
                    urgent_delivery_charges: Urgent_delivery_charges || Order_Data.urgent_delivery_charges,
                    order_total: Order_total || Order_Data.order_total,
                    payment_status: Order_Data.payment_status,
                    payment_mode: Payment_mode || Order_Data.payment_mode
                }
            }

        });
  

        if (selectedData.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one row to convert.',
                life: 3000,
            });
            return;
        }

        const api = new OrderitemsService();
        api
            .createorderitems(formdata)
            .then((res) => {
                get_data()
                const orderItem = res.data.orderItem;
                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your Order Stock Item information has been successfully submitted and recorded.',
                    life: 3000,
                });

                const Purchaseapi = new OrderpurchaseitemService();
                Purchaseapi
                    .updateorderpurchaseitem(purcgaseid, Purchasedata)
                    .then((res) => {

                        get_data()
                        const orderapi = new OrdersService();
                        orderapi
                            .updateorders(params.id, orderdata)
                            .then((res) => {
                                get_order_data()

                            })
                            .catch((error) => {
                                toast.current.show({
                                    severity: 'info',
                                    summary: 'Error',
                                    detail: `${error}`,
                                    life: 3000,
                                });

                            });

                    })
                    .catch((error) => {


                    });

            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `${error}`,
                    life: 3000,
                });
            });



    };

    const renderItemPurchaseHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h4><strong style={{ fontWeight: 550 }}>Order Purchase Item</strong></h4>

                <span className="p-input-icon-left">
                    <CButton disabled={Order_status === 'closed'} onClick={handleDeleteItemPurchase} style={{ marginRight: 5 }}>
                        <CIcon icon={cilTrash} className="mr-2" />Delete purchase item
                    </CButton>
                </span>
                <span className="p-input-icon-left" style={{ float: 'right' }}>
                    <CButton onClick={(event) => { orderstockitemDataSubmit('to_be_purchased') }} style={{ marginRight: 5 }}>
                        <CIcon icon={cilSend} className="mr-2" />Convert
                    </CButton>
                    <CButton color="primary" disabled={Order_status === 'closed'} onClick={() => { setItemPurchaseModal(true) }}>
                        <CIcon icon={cilCheck} className="mr-2" />Add a purchase item
                    </CButton>

                </span>

            </div>
        )
    }

    const handleClick = (event) => {
        const clickedRowData = event.data;
        const clickedRowId = clickedRowData.id;
        setOrderstockID(clickedRowId)
        setModalVisible(true)
    }

    let isDeleteInProgress = false;

    let delete_record = () => {
        if (!isDeleteInProgress) {
            isDeleteInProgress = true;

            let _data = selectedRows.map((i) => i.id);
            let api = new OrderitemsService();

            Promise.all(
                _data.map((id) =>
                    api
                        .deleteorderitems(id)
                        .then((res) => {
                        })
                        .catch((err) => {
                        })
                )
            )
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Deleted Successfully',
                    });
                    get_data();
                    isDeleteInProgress = false;
                })
                .catch((err) => {
                    isDeleteInProgress = false;
                });
        }
    };

    const handleDelete = () => {
        if (selectedRows.length > 0) {
            confirmDialog({
                message: 'Are you sure you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: delete_record || delete_record_item_purchase,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select the row that says to Delete' });
        }
    };

    const header = renderHeader();


    const handleItemPurchaseClick = (event) => {
        const clickedRowData = event.data;
        const clickedRowId = clickedRowData.id;
        setPurchaseID(clickedRowId)
        setItemPurchaseModal(true)
    }


    let delete_record_item_purchase = () => {
        let _data = selectedItemPurchaseRows.map(i => i.id);
        let api = new OrderpurchaseitemService();
        _data.forEach((id) => {
            api.deleteorderpurchaseitem(id)
                .then((res) => {
                    get_data();
                    toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Deleted Successfully' });
                })
                .catch((err) => { })
        });
    };

    const handleDeleteItemPurchase = () => {
        if (selectedItemPurchaseRows.length > 0) {
            confirmDialog({
                message: 'Are you sure you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: delete_record_item_purchase,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select the row that says to Delete' });
        }
    };


    const ItemPurchaseHeader = renderItemPurchaseHeader()
    const propID = Order_Data.id === undefined ? OrderID : Order_Data.id;

    const get_data = (search = '') => {
        setGlobatEvent({ eventName: 'refreshorderitems' });
        const api = new OrderitemsService;
        api.getorderitems(search).then((res) => {
            const filteredData = res.data.orderItems.filter((item) => item.order_id === propID);
            if (Array.isArray(filteredData) && filteredData.length > 0) {
                setTableData(filteredData);
                setOrder_total(filteredData.length)
            } else {
                if (res.data && res.data.message === "orderItems not found.") {
                    setTableData([]);
                } else {
                    setTableData(filteredData);
                    setOrder_total(filteredData.length)
                }
            }

          

        }).catch((err) => { });

        setGlobatEvent({ eventName: 'refreshorderpurchaseitem' });
        const apipurchase = new OrderpurchaseitemService;
        apipurchase.getorderpurchaseitem(search).then((res) => {
            const filteredData = res.data.filter((item) => item.order_id === propID && item.is_active === 0);
            if (Array.isArray(filteredData) && filteredData.length > 0) {
                setItemPurchaseTableData(filteredData);
            } else {
                if (res.data && res.data.message === "order purchase item not found.") {
                    setItemPurchaseTableData([]);
                } else {
                    setItemPurchaseTableData(filteredData);
                }
            }

        }).catch((err) => { });
        setOrder_total(TableData.length)


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
        Customer_Data_Get();
        orderstatus_Data_Get();
        paymentmode_Data_Get();
        paymentstatus_Data_Get();
        const currentDate = new Date().toISOString().split('T')[0];
        params.id ? get_order_data() : setOrder_date(currentDate)
    }, [])

    useEffect(() => {
        if (!modalVisible || !OrderID) {
            get_data();
            orderstatus_Data_Get();
            orderstockitemDataSubmit('to_be_purchased')
        }
    }, [modalVisible, OrderID, Order_Data, ItemPurchaseModal, PurchaseID])


    return (
        <>
            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Order/OrderList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Orders</strong>
                                {Order_status &&
                                    <>
                                        <span style={{ float: 'right', marginLeft: 5 }}>
                                            <p style={{
                                                fontSize: 18,
                                                color: 'black',
                                                fontWeight: 'bold',
                                                width: 200,
                                                padding: '10px',
                                                textAlign: 'center',
                                                position: 'relative',
                                                backgroundColor: '#ebedef',
                                                transition: 'opacity 0.5s ease', // Add a CSS transition for opacity
                                                opacity: 1, // Start with full opacity
                                            }}>
                                                {Order_status === 'available_booked' && 'Available Booked'
                                                    || Order_status === 'packed' && 'Packed' ||
                                                    Order_status === 'delivered' && 'Delivered' ||
                                                    Order_status === 'purchased_approve' && 'Purchased Approve' ||
                                                    Order_status === 'returned' && 'Returned' ||
                                                    Order_status === 'to_be_purchased' && 'To be purchased' ||
                                                    Order_status === 'closed' && 'Closed'
                                                }
                                                <span
                                                    style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        left: '50%',
                                                        bottom: '-15px',
                                                        border: 'solid transparent',
                                                        borderWidth: '8px',
                                                        borderColor: 'transparent',
                                                        borderTopColor: '#ebedef',
                                                        transform: 'translateX(-50%)',

                                                    }}
                                                ></span>
                                            </p>
                                        </span>
                                        <span style={{ float: 'right' }}>
                                            <p style={{
                                                fontSize: 18,
                                                color: 'black',
                                                fontWeight: 'bold',
                                                width: 200,
                                                padding: '10px',
                                                textAlign: 'center',
                                                position: 'relative',
                                                backgroundColor: '#ebedef',
                                                transition: 'opacity 0.5s ease', // Add a CSS transition for opacity
                                                opacity: 1, // Start with full opacity
                                            }}>
                                                {status == 'paid' ? 'Paid' : 'Pay'}

                                                <span
                                                    style={{
                                                        content: '',
                                                        position: 'absolute',
                                                        left: '50%',
                                                        bottom: '-15px',
                                                        border: 'solid transparent',
                                                        borderWidth: '8px',
                                                        borderColor: 'transparent',
                                                        borderTopColor: '#ebedef',
                                                        transform: 'translateX(-50%)',
                                                    }}
                                                ></span>
                                            </p>
                                        </span>


                                    </>
                                }

                            </h4>
                            {params.id &&
                                <h4>&nbsp;

                                    <span className="" >
                                        <CButton onClick={(event) => orderDataunpaidSubmit(event)} style={{ width: 100, padding: 10 }} color="primary">
                                            <CIcon icon={status == 'paid' ? cilCheck : cilDollar} className="mr-1" /> {status == 'paid' ? 'Paid' : 'Pay'}</CButton>
                                    </span>

                                    &nbsp;

                                    {Orderstatusdata === 'available_booked' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'packed')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Packed</CButton>

                                        </span>) : null}

                                    {Orderstatusdata === 'packed' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'delivered')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Delivered</CButton>
                                        </span>) : null}

                                    {Orderstatusdata === 'to_be_purchased' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'purchased_approve')} style={{ width: 200, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Purchased Approve</CButton>
                                        </span>) : null}

                                    {Orderstatusdata === 'purchased_approve' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'available_booked')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Approve</CButton>
                                        </span>) : null}


                                    {Orderstatusdata === 'returned' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'closed')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Closed</CButton>
                                        </span>) : null}

                                    {Orderstatusdata === 'delivered' ? (
                                        <span className="" >
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'closed')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Closed</CButton>
                                            <CButton onClick={(event) => orderDataorderstatusSubmit(event, 'returned')} style={{ width: 150, padding: 10, marginRight: 5 }} color="primary">
                                                <CIcon icon={cilCheck} className="mr-1" />Returned</CButton>
                                        </span>) : null}


                                </h4>
                            }


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
                                        <CCol sm={4} lg={4}>
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

                                                disabled={Order_status === 'closed'}
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

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Order Date</CFormLabel>
                                            <CFormInput
                                                name="order_date"
                                                type="date"
                                                value={Order_date}
                                                onChange={(e) => setOrder_date(e.target.value)}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                disabled={Order_status === 'closed'}
                                            />
                                            <CFormFeedback invalid>Please choose an Order Date.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Delivery Deadline</CFormLabel>
                                            <CFormInput
                                                name="delivery_deadline"
                                                type="date"
                                                value={Delivery_deadline}
                                                onChange={(e) => setDelivery_deadline(e.target.value)}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={Order_status === 'closed'}
                                            />
                                            <CFormFeedback invalid>Please choose a Delivery Deadline.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div>
                                    <CRow>

                                        {/* <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Order Status</CFormLabel>
                                           
                                            <CFormFeedback invalid>Please choose an Order Status.</CFormFeedback>
                                        </CCol> */}

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Delivery Charges</CFormLabel>
                                            <CFormInput
                                                name="delivery_charges"
                                                type="number"
                                                onChange={handledeliverycharges}
                                                value={Delivery_charges}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={Order_status === 'closed'}
                                            />
                                            <CFormFeedback invalid>Please enter Delivery Charges.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Urgent Delivery Charges</CFormLabel>
                                            <CFormInput
                                                name="urgent_delivery_charges"
                                                type="number"
                                                onChange={handlenurgentdeliverycharges}
                                                defaultValue={params.id ? Order_Data.urgent_delivery_charges : Urgent_delivery_charges}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"

                                                disabled={Order_status === 'closed'}
                                            />
                                            <CFormFeedback invalid>Please enter Urgent Delivery Charges.</CFormFeedback>
                                        </CCol>

                                    </CRow>
                                </div>

                                <div>
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Order Total</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="number"
                                                onChange={handleordertotal}
                                                value={Order_total}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"

                                                disabled={Order_status === 'closed'}
                                            />
                                            <CFormFeedback invalid>Please enter Order Total.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Payment Mode</CFormLabel>
                                            <CFormSelect
                                                name="payment_mode"
                                                onChange={handlepaymentmode}
                                                value={Payment_mode}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"

                                                disabled={Order_status === 'closed'}
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
                                    <CButton style={{ float: 'right' }} disabled={Order_status === 'closed'} color="primary" type="submit">
                                        <CIcon icon={cilCheck} className="mr-1" /> Add a stock item
                                    </CButton>
                                </CCol>
                            </CForm>
                            <br />
                            <div>
                                <Dialog header="Order Stock Item" visible={modalVisible} style={{ width: '50vw' }} onHide={() => {
                                    setModalVisible(false);
                                    setOrderstockID(null);
                                }}>
                                    <OrderStockItem stock_id={OrderstockID} setstock_id={setOrderstockID} propName={propID} setVisible={setModalVisible} ispopup={true} />
                                </Dialog>
                            </div>
                            {Popup || params.id ? (
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
                                </div>) : null
                            }

                            <br />
                            <div>
                                <Dialog header="Order Purchase Item" visible={ItemPurchaseModal} style={{ width: '50vw' }} onHide={() => {setItemPurchaseModal(false);setPurchaseID(null)}}>
                                    <Order_Purchase_Item purchase_id={PurchaseID} propName={propID} setVisible={setItemPurchaseModal} ispopup={true} />
                                </Dialog>
                            </div>
                            {Popup || params.id ? (
                                <div>
                                    <DataTable
                                        className="responsive-table"
                                        selectionMode={'checkbox'}
                                        selection={selectedItemPurchaseRows}
                                        onSelectionChange={(e) => { setselectedItemPurchaseRows(e.value); }}
                                        onRowDoubleClick={(e) => { handleItemPurchaseClick(e) }}
                                        value={ItemPurchaseTableData}
                                        header={ItemPurchaseHeader}
                                        showGridlines
                                        responsiveLayout="scroll"
                                        size="small" paginator
                                        rowHover
                                        rows={10}
                                        rowsPerPageOptions={[10, 20, 50]}>
                                        <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_ref" header="Fish Refrence" body={FishService.Fishname} sortable></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_cut" header="Fish Cut" body={FishCutsService.Fishcutname} sortable></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_weight" header="Fish Weight" ></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="meat_weight" header="Meat Weight" ></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="preferred_fish_size" header="Preferred Fish Size" ></Column>
                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="other_instructions" header="Other Instructions" ></Column>
                                    </DataTable>
                                </div>) : null
                            }


                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>

    )
}