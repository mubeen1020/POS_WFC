import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CInputGroupText, CInputGroup, CModalHeader, CModalBody, CModal } from "@coreui/react";
import { Toast } from 'primereact/toast';
import CustomerService from "src/services/customer_services";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck, cilMap, cilUser } from "@coreui/icons";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from 'google-map-react';
import { DataTable } from "primereact/datatable";
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useSetRecoilState } from "recoil";
import OrdersService from "src/services/order_services";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import OrderStatusService from "src/services/orderstatus_services";
import PaymentstatusService from "src/services/paymentstatus_services";
import PaymentmodeService from "src/services/paymentmode_services";
import { Button } from "primereact/button";




export default function Customer() {
        const [validated, setValidated] = useState(false)
        const toast = useRef(null);
        const navigate = useNavigate();
        const params = useParams()
        const [UserName, setUserName] = useState('')
        const [Password, setPassword] = useState('')
        const [Name, setName] = useState('')
        const [Care_Of_Ref, setCare_Of_Ref] = useState('')
        const [Care_Of_Ref_id, setCare_Of_Ref_id] = useState('')
        const [Care_Of_Name, setCare_Of_Name] = useState('')
        const [Phone1, setPhone1] = useState('')
        const [Phone2, setPhone2] = useState('')
        const [Phone3, setPhone3] = useState('')
        const [Address, setAddress] = useState('')
        const [Area, setArea] = useState('')
        const [PinLocation, setPinLocation] = useState('')
        const [Distance, setDistance] = useState('')
        const [DeliveryCharges, setDeliveryCharges] = useState('')
        const [globalFilterValue, setGlobalFilterValue] = useState('');

        const [Customer_ref, setCustomer_ref] = useState([])
        const [filteredCustomers, setFilteredCustomers] = useState([])
        const [Customer_Data, setCustomer_Data] = useState([])
        const [TableData, setTableData] = useState([])

        const setGlobatEvent = useSetRecoilState(globalEventAtom)

        const [customerNotFound, setCustomerNotFound] = useState(false)
        const [modalVisible, setModalVisible] = useState(false);

        const handleusername = (e) => { setUserName(e.target.value) }
        const handlepassword = (e) => { setPassword(e.target.value) }
        const handlename = (e) => { setName(e.target.value) }
        const handlecare_of_ref = (e) => {
                const value = e.target.value;
                setCare_Of_Ref(value)
                const selectedCustomer = Customer_ref.find((customer) =>
                        customer.full_name.toLowerCase() === value.toLowerCase()
                );
                if (selectedCustomer) {
                        setCare_Of_Ref_id(selectedCustomer.id);
                        setCustomerNotFound(false);
                } else {
                        setCare_Of_Ref_id(null);
                        setCustomerNotFound(true);
                }
                const filtered = Customer_ref.filter((customer) =>
                        customer.full_name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredCustomers(filtered);



        }
        const handlecare_of_name = (e) => { setCare_Of_Name(e.target.value) }
        const handlephone1 = (e) => { setPhone1(e.target.value) }
        const handlephone2 = (e) => { setPhone2(e.target.value) }
        const handlephone3 = (e) => { setPhone3(e.target.value) }
        const handleaddress = (e) => { setAddress(e.target.value) }
        const handlearea = (e) => { setArea(e.target.value) }
        const handlepinlocation = (e) => {
                setPinLocation(e.target.value);
        };

        const openMapModal = () => {
                setModalVisible(true);
        };



        const handledistance = (e) => { setDistance(e.target.value) }
        const handledeliverycharges = (e) => { setDeliveryCharges(e.target.value) }

        let get_customer_data = (search) => {
                let customerApi = new CustomerService();
                customerApi.getCustomerbyId(params.id).then((customerRes) => {
                        setCustomer_Data(customerRes.data.customer)
                        const customerData = customerRes.data.customer;

                        let orderApi = new OrdersService();
                        orderApi.getorders(search).then((orderRes) => {

                                const orderData = orderRes.data;

                                const filterdata = orderData.orders.filter((item) => item.customer === customerData.id);

                                if (Array.isArray(filterdata)) {
                                        setTableData(filterdata);
                                } else {
                                        if (filterdata && filterdata.message === "orders not found.") {
                                                setTableData([]);
                                        } else {
                                                setTableData(filterdata);
                                        }
                                }
                        }).catch((err) => {
                        });
                }).catch((err) => {
                });
        };

        const customerDataSubmit = (event) => {
                handleSubmit(event)
                event.preventDefault();
                let formData = {
                        full_name: Name,
                        care_of_ref: Care_Of_Ref_id,
                        care_of_name: Care_Of_Name,
                        phone_1: Phone1,
                        phone_2: Phone2,
                        phone_3: Phone3,
                        address: Address,
                        area: Area,
                        pin_location: PinLocation,
                        distance: Distance,
                        delivery_charges: DeliveryCharges
                };

                const api = new CustomerService();
                api
                        .createCustomer(formData)
                        .then((res) => {

                                toast.current.show({
                                        severity: 'success',
                                        summary: 'Data Submitted',
                                        detail: 'Your customer information has been successfully submitted and recorded.',
                                        life: 3000,
                                });
                                setTimeout(() => {
                                        navigate('/Customer/customerList');
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

        const customerDataupdateSubmit = (event) => {
                handleSubmit(event)
                event.preventDefault();
                let formData = {
                        username: UserName || Customer_Data.username,
                        password: Password || Customer_Data.password,
                        full_name: Name || Customer_Data.full_name,
                        care_of_ref: Care_Of_Ref_id || Customer_Data.care_of_ref,
                        care_of_name: Care_Of_Name || Customer_Data.care_of_name,
                        phone_1: Phone1 || Customer_Data.phone_1,
                        phone_2: Phone2 || Customer_Data.phone_2,
                        phone_3: Phone3 || Customer_Data.phone_3,
                        address: Address || Customer_Data.address,
                        area: Area || Customer_Data.area,
                        pin_location: PinLocation || Customer_Data.pin_location,
                        distance: Distance || Customer_Data.distance,
                        delivery_charges: DeliveryCharges || Customer_Data.delivery_charges
                };

                const api = new CustomerService();
                api
                        .updateCustomer(params.id, formData)
                        .then((res) => {

                                toast.current.show({
                                        severity: 'success',
                                        summary: 'Data Submitted',
                                        detail: 'Your customer information has been successfully update and recorded.',
                                        life: 3000,
                                });
                                setTimeout(() => {
                                        navigate('/Customer/customerList');
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

        const Customer_Data_Get = (search = "") => {
                let api = new CustomerService;
                api.getCustomer(search).then((res) => { setCustomer_ref(res.data.customers); })
                        .catch((err) => { });
        }


        const handleSubmit = (event) => {
                const form = event.currentTarget
                if (form.checkValidity() === false) {
                        event.preventDefault()
                        event.stopPropagation()
                }
                setValidated(true)
        }

        const filter_name = Customer_ref.filter((customer) => {
                return customer.id === Customer_Data.care_of_ref;

        });

        const renderHeader = () => {
                return (
<div className="flex justify-between mb-3">
  <span className="p-input-icon-left">
    <h4><strong>Orders</strong></h4>
  </span>
  <span className="p-input-icon-right" style={{ float: "right" }}>
  <div className="p-inputgroup flex-1">
    <InputText placeholder="Keyword" onChange={onGlobalFilterChange} value={globalFilterValue} />
    <span className="p-inputgroup-addon">
        <i className="pi pi-search"></i>
    </span>
</div>
  </span>
</div>


                )
        }

        const onGlobalFilterChange = (e) => {
                const value = e.target.value;
                setGlobalFilterValue(value);
                get_customer_data(value);
        }

        const header = renderHeader();


        const formatDate = (dateStr, field) => {
                const date = new Date(dateStr[field]);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
        };




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
                params.id ? get_customer_data() : ''


        }, [])


        const AnyReactComponent = ({ text }) => <div>{text}</div>;
        const defaultProps = {
                center: {
                        lat: 10.99835602,
                        lng: 77.01502627
                },
                zoom: 11
        };

        return (
                <>

                        <CRow>
                                <Toast ref={toast} />
                                <CCol xs={12}>
                                        <CCard className="mb-4">
                                                <CCardHeader>
                                                        <h4><Link to="/Customer/customerList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Customer</strong></h4>
                                                </CCardHeader>
                                                <CCardBody>
                                                        <CForm
                                                                className="row g-3 needs-validation"
                                                                noValidate
                                                                validated={validated}
                                                                onSubmit={(event) => { params.id ? customerDataupdateSubmit(event) : customerDataSubmit(event) }}
                                                        >
                                                                {
                                                                        params.id &&
                                                                        <>

                                                                                <div >
                                                                                        <CRow>
                                                                                                <CCol sm={6} lg={6}>
                                                                                                        <CFormLabel htmlFor="validationCustomUsername">Username</CFormLabel>
                                                                                                        <CFormInput
                                                                                                                onChange={handleusername}
                                                                                                                defaultValue={params.id ? Customer_Data.username : UserName}
                                                                                                                type="text"
                                                                                                                id="validationCustomUsername"
                                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                                required
                                                                                                                disabled={params.id ? params.id : ''}
                                                                                                        />
                                                                                                        <CFormFeedback invalid>Please choose a Username.</CFormFeedback>
                                                                                                </CCol>

                                                                                                <CCol sm={6} lg={6}>
                                                                                                        <CFormLabel htmlFor="validationCustomPassword">Password</CFormLabel>
                                                                                                        <CFormInput
                                                                                                                onChange={handlepassword}
                                                                                                                defaultValue={params.id ? Customer_Data.password : Password}
                                                                                                                type="password" // Assuming it's a password input
                                                                                                                id="validationCustomPassword"
                                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                                required
                                                                                                        />
                                                                                                        <CFormFeedback invalid>Please choose a Password.</CFormFeedback>
                                                                                                </CCol>

                                                                                        </CRow>

                                                                                </div>

                                                                        </>
                                                                }


                                                                <div >
                                                                        <CRow>
                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Name</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlename}
                                                                                                defaultValue={params.id ? Customer_Data.full_name : Name}
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Name.</CFormFeedback>
                                                                                </CCol>

                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Care of Customer</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlecare_of_ref}
                                                                                                defaultValue={
                                                                                                        params.id && filter_name.length > 0 ? filter_name[0].full_name : Care_Of_Ref
                                                                                                }
                                                                                                list="customerSuggestions"
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                                className={`form-control ${customerNotFound ? 'is-invalid' : ''}`}
                                                                                                style={{ borderColor: customerNotFound ? 'red' : '' }}
                                                                                                autoComplete="off"
                                                                                        />
                                                                                        {customerNotFound && (
                                                                                                <CFormFeedback invalid>Please choose a valid Care of Customer.</CFormFeedback>
                                                                                        )}
                                                                                </CCol>

                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Care of name</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlecare_of_name}
                                                                                                defaultValue={params.id ? Customer_Data.care_of_name : Care_Of_Name}
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Care of name.</CFormFeedback>
                                                                                </CCol>
                                                                        </CRow>
                                                                </div>




                                                                <datalist id="customerSuggestions" >
                                                                        {filteredCustomers.map((customer) => (
                                                                                <option key={customer.id} value={customer.full_name} />
                                                                        ))}
                                                                </datalist>




                                                                <div >
                                                                        <CRow>


                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Phone 1</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlephone1}
                                                                                                defaultValue={params.id ? Customer_Data.phone_1 : Phone1}
                                                                                                type="number"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Phone 1.</CFormFeedback>
                                                                                </CCol>
                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Phone 2</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlephone2}
                                                                                                defaultValue={params.id ? Customer_Data.phone_2 : Phone2}
                                                                                                type="number"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Phone 2.</CFormFeedback>
                                                                                </CCol>

                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Phone 3</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlephone3}
                                                                                                defaultValue={params.id ? Customer_Data.phone_3 : Phone3}
                                                                                                type="number"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Phone 3.</CFormFeedback>
                                                                                </CCol>
                                                                        </CRow>

                                                                </div>

                                                                <div >
                                                                        <CRow>
                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Address</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handleaddress}
                                                                                                defaultValue={params.id ? Customer_Data.address : Address}
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Address.</CFormFeedback>
                                                                                </CCol>

                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Area</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handlearea}
                                                                                                defaultValue={params.id ? Customer_Data.area : Area}
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                // aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Area.</CFormFeedback>
                                                                                </CCol>

                                                                                <CCol sm={4} lg={4}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Pin Location</CFormLabel>
                                                                                        <CInputGroup>
                                                                                                <CFormInput
                                                                                                        onChange={handlepinlocation}
                                                                                                        defaultValue={params.id ? Customer_Data.pin_location : PinLocation}
                                                                                                        type="text"
                                                                                                        id="validationCustomUsername"
                                                                                                        aria-describedby="inputGroupPrepend"
                                                                                                        required
                                                                                                />

                                                                                                <CInputGroupText onClick={openMapModal} style={{ cursor: 'pointer' }}>
                                                                                                        <CIcon icon={cilMap} />
                                                                                                </CInputGroupText>
                                                                                        </CInputGroup>
                                                                                        <CFormFeedback invalid>Please choose a Pin Location.</CFormFeedback>
                                                                                </CCol>



                                                                                {params.id == undefined &&
                                                                                <Dialog header="Map" visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                                                                                        <div style={{ height: '100vh', width: '100%' }}>
                                                                                                <GoogleMapReact
                                                                                                        bootstrapURLKeys={{ key: "" }}
                                                                                                        defaultCenter={defaultProps.center}
                                                                                                        defaultZoom={defaultProps.zoom}
                                                                                                >
                                                                                                        <AnyReactComponent
                                                                                                                lat={59.955413}
                                                                                                                lng={30.337844}
                                                                                                                text="pakistan"
                                                                                                        />
                                                                                                </GoogleMapReact>
                                                                                        </div>
                                                                                </Dialog>
}
                                                                        </CRow>
                                                                </div>


                                                                <div >
                                                                        <CRow>




                                                                                <CCol sm={6} lg={6}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Distance</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handledistance}
                                                                                                defaultValue={params.id ? Customer_Data.distance : Distance}
                                                                                                onKeyPress={(e) => {
                                                                                                        const allowedKeys = /[0-9.]|\./;
                                                                                                        const key = e.key;

                                                                                                        if (!allowedKeys.test(key)) {
                                                                                                                e.preventDefault();
                                                                                                        }
                                                                                                }}
                                                                                                type="text"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Distance.</CFormFeedback>
                                                                                </CCol>

                                                                                <CCol sm={6} lg={6}>
                                                                                        <CFormLabel htmlFor="validationCustomUsername">Delivery Charges</CFormLabel>
                                                                                        <CFormInput
                                                                                                onChange={handledeliverycharges}
                                                                                                defaultValue={params.id ? Customer_Data.delivery_charges : DeliveryCharges}
                                                                                                type="number"
                                                                                                id="validationCustomUsername"
                                                                                                aria-describedby="inputGroupPrepend"
                                                                                                required
                                                                                        />
                                                                                        <CFormFeedback invalid>Please choose a Delivery Charges.</CFormFeedback>
                                                                                </CCol>
                                                                        </CRow>
                                                                </div>


                                                                <CCol >
                                                                        <CButton style={{ float: 'right' }} color="primary" type="submit">
                                                                                <CIcon icon={cilCheck} className="mr-1" /> Submit
                                                                        </CButton>
                                                                </CCol>
                                                        </CForm>
                                                        <br />
                                                        {params.id &&

                                                                <DataTable
                                                                        className="responsive-table"
                                                                        value={TableData}
                                                                        header={header}
                                                                        showGridlines
                                                                        responsiveLayout="scroll"
                                                                        size="small" paginator
                                                                        rowHover
                                                                        rows={10}
                                                                        rowsPerPageOptions={[10, 20, 50]}>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="customer" header="Customer" body={CustomerService.Customername} ></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_date" header="Order Date" body={(dateStr) => formatDate(dateStr, 'order_date')} sortable></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="delivery_deadline" header="Delivery Deadline" body={(dateStr) => formatDate(dateStr, 'delivery_deadline')} sortable></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_status" header="Order Status" body={OrderStatusService.orderStatusname}></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="delivery_charges" header="Delivery Charges" ></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="urgent_delivery_charges" header="Urgent Delivery Charges" ></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_total" header="Order Total" ></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_status" header="Payment Status" body={PaymentstatusService.paymentStatusname} ></Column>
                                                                        <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_mode" header="Payment Mode" body={PaymentmodeService.paymentmodename} ></Column>
                                                                </DataTable>
                                                        }
                                                </CCardBody>
                                        </CCard>
                                </CCol>
                        </CRow>
                </>

        )
}