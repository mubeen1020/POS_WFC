import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect, CFormTextarea } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import OrderpurchaseitemService from "src/services/orderpurchaseitem_services";
import { orderAtom } from "src/_state/orderAtom";
import { useRecoilValue } from "recoil";
import { customerAtom } from "src/_state/customerAtom";
import { fishAtom } from "src/_state/fishAtom";
import { fishcutAtom } from "src/_state/fishcutAtom";


export default function Order_Purchase_Item(props) {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Order_id, setOrder_id] = useState('')
    const [Fish_ref, setFish_ref] = useState('')
    const [Fish_cut, setFish_cut] = useState('')
    const [Fish_weight, setFish_weight] = useState('')
    const [Meat_weight, setMeat_weight] = useState('')
    const [Preferred_fish_size, setPreferred_fish_size] = useState('')
    const [Other_instructions, setOther_instructions] = useState('')
    const [Order_id_data, setOrder_id_data] = useState('')
    const [Fish_id, setFish_id] = useState('')

    const [Order_Purchase_Item_Data, setOrder_Purchase_Item_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [filteredFishes, setFilteredFishes] = useState([])
    const [Status, setStatus] = useState([])

    const orderData = useRecoilValue(orderAtom)
    const customerData = useRecoilValue(customerAtom)
    const Fishname = useRecoilValue(fishAtom)
    const Fishcut = useRecoilValue(fishcutAtom)

    const [customerNotFound, setCustomerNotFound] = useState(false)
    const [FishNotFound, setFishNotFound] = useState(false)

    const handleorderid = (e) => {
        const value = e.target.value;
        setOrder_id(value);
        const selectedCustomer = customerData.find((customer) =>
            customer.full_name.toLowerCase() === value.toLowerCase()
        );
        if (selectedCustomer) {
            const selectOrder = orderData.filter((order) => order.customer === selectedCustomer.id);
            const orderIds = selectOrder.map((order) => order.id);
            setOrder_id_data(orderIds);
            customerData.filter((customer) =>
                orderData.some((order) =>
                    order.customer === customer.id &&
                    setCustomerNotFound(false)
                )
            );

        } else {
            setOrder_id_data([]);
            setCustomerNotFound(true);
        }
        const filteredCustomers = customerData.filter((customer) =>
            orderData.some((order) =>
                order.customer === customer.id &&
                customer.full_name.toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredCustomers(filteredCustomers);
    }
    const handlefishref = (e) => {
        const fishvalue = e.target.value;
        setFish_ref(fishvalue)
        const selectedfish = Fishname.find((fish) =>
            fish.local_name.toLowerCase() === fishvalue.toLowerCase()
        );
        if (selectedfish) {
            setFish_id(selectedfish.id);
            setFishNotFound(false);
        } else {
            setFish_id(null);
            setFishNotFound(true);
        }
        const filtered = Fishname.filter((fish) =>
            fish.local_name.toLowerCase().includes(fishvalue.toLowerCase())
        );
        setFilteredFishes(filtered);

    }
    const handlefishcut = (e) => { setFish_cut(e.target.value) }
    const handlefishweight = (e) => { setFish_weight(e.target.value) }
    const handlemeatweight = (e) => { setMeat_weight(e.target.value) }
    const handlepreferredfishsize = (e) => { setPreferred_fish_size(e.target.value) }
    const handleotherinstructions = (e) => { setOther_instructions(e.target.value) }

    let get_Order_Purchase_Item_data = () => {
        let api = new OrderpurchaseitemService;
        api.getorderpurchaseitembyId(props.purchase_id).then((res) => {
            setOrder_Purchase_Item_Data(res.data);
            setFish_cut(res.data.fish_cut)
            setPreferred_fish_size(res.data.preferred_fish_size)
            setStatus(res.data.status)
        }).catch((err) => { });
    }

    const orderpurchaseitemDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            order_id: props.propName,
            fish_ref: Fish_id,
            fish_cut: Fish_cut,
            fish_weight: Fish_weight || 0,
            meat_weight: Meat_weight || 0,
            preferred_fish_size: Preferred_fish_size,
            other_instructions: Other_instructions || 'N/A',
            is_active: 0
        };

        const api = new OrderpurchaseitemService();
        api
            .createorderpurchaseitem(formData)
            .then((res) => {

                if (!props.ispopup) {

                } else {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Data Submitted',
                        detail: 'Your order purchase item information has been successfully submitted and recorded.',
                        life: 3000,
                    });
                    setTimeout(() => {
                        props.setVisible(false)
                    }, [2000])
                }

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

    const orderpurchaseitemDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            order_id: props.propName || Order_Purchase_Item_Data.order_id,
            fish_ref: Fish_id || Order_Purchase_Item_Data.fish_ref,
            fish_cut: Fish_cut || Order_Purchase_Item_Data.fish_cut,
            fish_weight: Fish_weight || Order_Purchase_Item_Data.fish_weight,
            meat_weight: Meat_weight || Order_Purchase_Item_Data.meat_weight,
            preferred_fish_size: Preferred_fish_size || Order_Purchase_Item_Data.preferred_fish_size,
            other_instructions: Other_instructions || Order_Purchase_Item_Data.other_instructions,
            is_active: 0
        };

        const api = new OrderpurchaseitemService();
        api
            .updateorderpurchaseitem(props.purchase_id, formData)
            .then((res) => {

                if (!props.ispopup) {

                } else {

                    toast.current.show({
                        severity: 'success',
                        summary: 'Data Submitted',
                        detail: 'Your order purchase item information has been successfully update and recorded.',
                        life: 3000,
                    });
                    setTimeout(() => {
                        props.setVisible(false)
                    }, [2000])
                }

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
                return order.id === Order_Purchase_Item_Data.order_id;
            }
            return false;
        });
    });

    const filter_fish_name = Fishname.filter((fish) => {
        return fish.id === Order_Purchase_Item_Data.fish_ref;

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
        params.id ? get_Order_Purchase_Item_data() : ''
    }, [])

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>

                    <CCard className="mb-4">
                        <div>
                            <span style={{ float: 'right', marginRight: 10, marginTop: 10 }}>
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
                                    {Status === 'purchased_approve' && 'Purchased Approve' ||
                                        Status === 'to_be_purchased' && 'To be purchased' ||
                                        Status === 'closed' && 'Closed'
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
                        </div>


                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => { props.purchase_id? orderpurchaseitemDataupdateSubmit(event) : orderpurchaseitemDataSubmit(event) }}
                            >

                                {/* <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Customer</CFormLabel>
                                        <CFormInput
                                            onChange={handleorderid}
                                            defaultValue={params.id && filter_name.length > 0 && filter_name[0].full_name ? filter_name[0].full_name : Order_id}
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
                                </div>
                                <datalist id="orderSuggestions" >
                                    {filteredCustomers.map((customer) => (
                                        <option key={customer.id} value={customer.full_name} />
                                    ))}
                                </datalist> */}


                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Refrence</CFormLabel>
                                            <CFormInput
                                                onChange={handlefishref}
                                                defaultValue={
                                                    params.id && filter_fish_name.length > 0 ? filter_fish_name[0].local_name : Fish_ref
                                                }
                                                type="text"
                                                list="fishSuggestions"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                className={`form-control ${FishNotFound ? 'is-invalid' : ''}`}
                                                style={{ borderColor: FishNotFound ? 'red' : '' }}

                                            />
                                            {FishNotFound && (
                                                <CFormFeedback invalid>Please choose a Fish Refrence.</CFormFeedback>
                                            )}
                                            <datalist id="fishSuggestions" >
                                                {filteredFishes.map((fish) => (
                                                    <option key={fish.id} value={fish.local_name} />
                                                ))}
                                            </datalist>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Cut</CFormLabel>
                                            <CFormSelect
                                                onChange={handlefishcut}
                                                value={Fish_cut}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            >
                                                <option>Select</option>
                                                {
                                                    Fishcut.map((i) => {
                                                        return (
                                                            <option key={i.id} value={i.id}>{i.fish_cut}</option>
                                                        )
                                                    })
                                                }

                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Fish Cut.</CFormFeedback>
                                        </CCol>
                                    </CRow>

                                </div>

                                <div >
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Weight</CFormLabel>
                                            <CFormInput
                                                onChange={handlefishweight}
                                                defaultValue={params.id ? Order_Purchase_Item_Data.fish_weight : Fish_weight}
                                                list="customerSuggestions"
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required

                                            />

                                            <CFormFeedback invalid>Please choose a valid Fish Weight.</CFormFeedback>

                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Meat Weight</CFormLabel>
                                            <CFormInput
                                                onChange={handlemeatweight}
                                                defaultValue={params.id ? Order_Purchase_Item_Data.meat_weight : Meat_weight}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Meat Weight.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div>
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Preferred Fish Size</CFormLabel>
                                            <CFormSelect
                                                onChange={handlepreferredfishsize}
                                                value={Preferred_fish_size}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            >
                                                <option>Select</option>
                                                <option value="Small">Small</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Large">Large</option>
                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Preferred Fish Size.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Other Instruction</CFormLabel>
                                            <CFormTextarea
                                                onChange={handleotherinstructions}
                                                defaultValue={params.id ? Order_Purchase_Item_Data.other_instructions : Other_instructions}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                rows='4'
                                            />
                                            <CFormFeedback invalid>Please choose a Other Instruction.</CFormFeedback>
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