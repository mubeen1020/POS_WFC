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

        const [Customer_ref, setCustomer_ref] = useState([])
        const [filteredCustomers, setFilteredCustomers] = useState([])
        const [Customer_Data, setCustomer_Data] = useState([])

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

        let get_customer_data = () => {
                let api = new CustomerService;
                api.getCustomerbyId(params.id).then((res) => {
                        setCustomer_Data(res.data.customer);

                }).catch((err) => { });
        }

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
                                                                                        <CCol >
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
                                                                                </div>

                                                                                <div >
                                                                                        <CCol >
                                                                                                <CFormLabel htmlFor="validationCustomUsername">Password</CFormLabel>
                                                                                                <CFormInput
                                                                                                        onChange={handlepassword}
                                                                                                        defaultValue={params.id ? Customer_Data.password : Password}
                                                                                                        type="text"
                                                                                                        id="validationCustomUsername"
                                                                                                        aria-describedby="inputGroupPrepend"
                                                                                                        required
                                                                                                />
                                                                                                <CFormFeedback invalid>Please choose a Password.</CFormFeedback>
                                                                                        </CCol>
                                                                                </div>
                                                                        </>
                                                                }
                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div>
                                                                        <CCol>
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



                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div >
                                                                        <CCol >
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
                                                                </div>

                                                                <div >
                                                                        <CCol >
                                                                                <CFormLabel htmlFor="validationCustomUsername">Area</CFormLabel>
                                                                                <CFormInput
                                                                                        onChange={handlearea}
                                                                                        defaultValue={params.id ? Customer_Data.area : Area}
                                                                                        type="text"
                                                                                        id="validationCustomUsername"
                                                                                        aria-describedby="inputGroupPrepend"
                                                                                        required
                                                                                />
                                                                                <CFormFeedback invalid>Please choose a Area.</CFormFeedback>
                                                                        </CCol>
                                                                </div>

                                                                <div >
                                                                        <CCol >
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
                                                                </div>


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

                                                                <div>
                                                                        <CCol>
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
                                                                </div>


                                                                <div >
                                                                        <CCol >
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