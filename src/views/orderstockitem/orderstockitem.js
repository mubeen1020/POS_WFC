import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import OrderitemsService from "src/services/orderstockitem_services";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { orderAtom } from "src/_state/orderAtom";
import { customerAtom } from "src/_state/customerAtom";
import { fishAtom } from "src/_state/fishAtom";
import { fishpackAtom } from "src/_state/fishpackAtom";
import { fishcutAtom } from "src/_state/fishcutAtom";
import { globalEventAtom } from "src/_state/globalEventAtom";


export default function OrderStockItem(props) {
   
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Order_id, setOrder_id] = useState('')
    const [Fish_pack_ref, setFish_pack_ref] = useState('')
    const [Total_packs_ordered, setTotal_packs_ordered] = useState('')
    const [Fish_weight, setFish_weight] = useState('')
    const [Meat_weight, setMeat_weight] = useState('')
    const [Fish_rate, setFish_rate] = useState('')
    const [Meat_rate, setMeat_rate] = useState('')
    const [Skin, setSkin] = useState('')
    const [Kante, setKante] = useState('')
    const [Pack_price, setPack_price] = useState('')
    const [Item_discount_absolute, setItem_discount_absolute] = useState('')
    const [Item_discount_percent, setItem_discount_percent] = useState('')
    const [Order_id_data, setOrder_id_data] = useState('')
    const [Fishname, setFishname] = useState('')
    const [Fish_cut, setFish_cut] = useState('')
    const [Packingdate, setPackingdate] = useState('')
    const [Avaiablepack, setAvaiablepack] = useState('')


    const [fishpack_id_data, setfishpack_id_data] = useState([])
    const [Order_Stock_Item_Data, setOrder_Stock_Item_Data] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [Fishpackfilterdata, setFishpackfilterdata] = useState([])

    const [customerNotFound, setCustomerNotFound] = useState(false)
    const [error, setError] = useState(false);

    const orderData = useRecoilValue(orderAtom)
    const customerData = useRecoilValue(customerAtom)
    const fishData = useRecoilValue(fishAtom)
    const fishpackData = useRecoilValue(fishpackAtom)
    const fishcutData = useRecoilValue(fishcutAtom)
    const setGlobatEvent = useSetRecoilState(globalEventAtom)


    const handleorderid = (e) => {
        const value = e.target.value;
        setOrder_id(value);
        const selectedCustomer = customerData.find((customer) =>
            customer.full_name.toLowerCase() === value.toLowerCase()
        );
        if (selectedCustomer) {
            const selectOrder = orderData.filter((order) => order.customer === selectedCustomer.id);
            const orderIds = selectOrder.map((order) => order.id);
            console.log(orderIds)
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
    };
    const handlefishpackref = (e) => {
        const value = e.target.value;
        setFish_pack_ref(value)
        const fishpackArray = [];
        const selectedfish = fishData.filter((fish) => {
            return fishpackData.some((fishpack) => {
                if (Number(fishpack.fish_ref) === Number(fish.id)) {
                    return fishcutData.some((fishcut) => {
                        if (Number(fishpack.fish_cut) === Number(fishcut.id)) {
                            const searchString = (fish.local_name + ' / ' + fishcut.fish_cut).toLowerCase();
                            const result = searchString.includes(value.toLowerCase());
                            if (result) {
                                fishpackArray.push(searchString);
                                fishpackArray.push(fishpack.id)
                                setfishpack_id_data(fishpack.id)
                                setFish_weight(fishpack.whole_fish_pack_weight)
                                setMeat_weight(fishpack.net_meat_weight_per_kg)
                                setFish_rate(fishpack.whole_fish_sale_rate)
                                setMeat_rate(fishpack.net_meat_sale_rate)
                                setSkin(fishpack.skin_removed)
                                setKante(fishpack.kante)
                                setPack_price(fishpack.fish_packs)
                                setFishname(fish.local_name)
                                setFish_cut(fishcut.fish_cut)
                                setTotal_packs_ordered(fishpack.available_packs)
                                setAvaiablepack(fishpack.available_packs)
                                const isoDate = fishpack.packing_date;

                                if (isoDate) {
                                    const parsedDate = new Date(isoDate);
                                    parsedDate.setHours(parsedDate.getHours() + 5);
                                    const formattedDate = parsedDate.toISOString().split('T')[0];
                                    setPackingdate(formattedDate);
                                } else {
                                }

                            }
                            return result;
                        }
                        return false;
                    });
                }
                return false;
            });
        });

        const searchStringArray = [];
        fishData.filter((fish) => {
            return fishpackData.some((fishpack) => {
                if (Number(fishpack.fish_ref) === Number(fish.id)) {
                    return fishcutData.some((fishcut) => {
                        if (Number(fishpack.fish_cut) === Number(fishcut.id)) {
                            const searchString = (fish.local_name + ' / ' + fishcut.fish_cut).toLowerCase();
                            const result = searchString.includes(value.toLowerCase());
                            if (result) {
                                searchStringArray.push(searchString);
                            }
                            return result;
                        }
                        return false;
                    });
                }
                return false;
            });
        });
        setFishpackfilterdata(searchStringArray)

    }
    const handletotalpackorder = (e) => {
        const value = e.target.value;

        if (value >= Avaiablepack) {
            setError(true);
            setTotal_packs_ordered('');
        } else {
            setError(false);
            setTotal_packs_ordered(value);
        }
    }
    const handlefishweight = (e) => { setFish_weight(e.target.value) }
    const handlemeatweight = (e) => { setMeat_weight(e.target.value) }
    const handlefishrate = (e) => { setFish_rate(e.target.value) }
    const handlemeatrate = (e) => { setMeat_rate(e.target.value) }
    const handleskin = (e) => { setSkin(e.target.value); }
    const handlekante = (e) => { setKante(e.target.value) }
    const handlepackprice = (e) => { setPack_price(e.target.value) }
    const handleitemdiscountabsolute = (e) => { setItem_discount_absolute(e.target.value) }
    const handleitemdiscountpercent = (e) => { setItem_discount_percent(e.target.value) }

    let get_order_stock_item_data = () => {
        let api = new OrderitemsService;
        api.getorderitemsbyId(params.id).then((res) => {
            setOrder_Stock_Item_Data(res.data.orderItem);
        }).catch((err) => { });


    }
console.log(props.propName,'propName')
    const orderstockitemDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            order_id: props.propName,
            fish_pack_ref: fishpack_id_data,
            total_packs_ordered: Total_packs_ordered,
            fish_weight: Fish_weight,
            meat_weight: Meat_weight,
            fish_rate: Fish_rate,
            meat_rate: Meat_rate,
            skin: Skin,
            kante: Kante,
            pack_price: Pack_price,
            item_discount_absolute: Item_discount_absolute,
            item_discount_percent: Item_discount_percent
        };

        const api = new OrderitemsService();
        api
            .createorderitems(formData)
            .then((res) => {

              
                if(!props.ispopup){

                  }else{
                    toast.current.show({
                        severity: 'success',
                        summary: 'Data Submitted',
                        detail: 'Your Order Stock Item information has been successfully submitted and recorded.',
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
                console.log('error: ', error);
            });
    }

    const orderstockitemDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            order_id: Order_id_data || Order_Stock_Item_Data.order_id,
            fish_pack_ref: fishpack_id_data || Order_Stock_Item_Data.fish_pack_ref,
            total_packs_ordered: Total_packs_ordered || Order_Stock_Item_Data.total_packs_ordered,
            fish_weight: Fish_weight || Order_Stock_Item_Data.fish_weight,
            meat_weight: Meat_weight || Order_Stock_Item_Data.meat_weight,
            fish_rate: Fish_rate || Order_Stock_Item_Data.fish_rate,
            meat_rate: Meat_rate || Order_Stock_Item_Data.meat_rate,
            skin: Skin || Order_Stock_Item_Data.skin,
            kante: Kante || Order_Stock_Item_Data.kante,
            pack_price: Pack_price || Order_Stock_Item_Data.Pack_price,
            item_discount_absolute: Item_discount_absolute || Order_Stock_Item_Data.item_discount_absolute,
            item_discount_percent: Item_discount_percent || Order_Stock_Item_Data.item_discount_percent
        };

        const api = new OrderitemsService();
        api
            .updateorderitems(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your Order Stock Item information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Order/OrderStockItemsList');
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

    const filter_name = customerData.filter((customer) => {
        return orderData.some((order) => {
            if (Number(customer.id) === Number(order.customer)) {
                return order.id === Order_Stock_Item_Data.order_id;
            }
            return false;
        });
    });



    const fishpackrefStringArray = [];
    fishData.filter((fish) => {
        return fishpackData.some((fishpack) => {
            if (Number(fishpack.fish_ref) === Number(fish.id)) {
                if (Order_Stock_Item_Data.fish_pack_ref === fishpack.id) {
                    return fishcutData.some((fishcut) => {
                        if (Number(fishpack.fish_cut) === Number(fishcut.id)) {
                            const searchString = (fish.local_name + ' / ' + fishcut.fish_cut).toLowerCase();
                            fishpackrefStringArray.push(searchString);
                        }
                        return false;
                    });
                }
                return false;
            }
        });
    });

    const paramData = () => {
        fishData.find((fish) => {
            return fishpackData.some((fishpack) => {
                if (fishpack.id === Order_Stock_Item_Data.id) {
                    if (Number(fishpack.fish_ref) === Number(fish.id)) {
                        const foundFishCut = fishcutData.find((fishcut) => {
                            return Number(fishpack.fish_cut) === Number(fishcut.id);
                        });

                        if (foundFishCut) {
                            setFishname(fish.local_name);
                            setFish_cut(foundFishCut.fish_cut);
                            const isoDate = fishpack.packing_date;
                            if (isoDate) {
                                const parsedDate = new Date(isoDate);
                                parsedDate.setHours(parsedDate.getHours() + 5);
                                const formattedDate = parsedDate.toISOString().split('T')[0];
                                setPackingdate(formattedDate);
                            }
                        }
                    }
                }
                return false;
            });
        });
    }


    useEffect(() => {
        setGlobatEvent({ eventName: 'refreshCustomer' });
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
       
    }, []);

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => {
                                     orderstockitemDataSubmit(event);
                                }}
                            >

                                <div>
                                    <CRow>
                                        {/* <CCol>
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
                                        <datalist id="orderSuggestions" >
                                            {filteredCustomers.map((customer) => (
                                                <option key={customer.id} value={customer.full_name} />
                                            ))}
                                        </datalist> */}

                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Pack Refrence</CFormLabel>
                                            <CFormInput
                                                name="order_date"
                                                type="text"
                                                list="fishpackSuggestions"
                                                defaultValue={params.id ? fishpackrefStringArray : Fish_pack_ref}
                                                onChange={handlefishpackref}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose an Fish Pack Refrence.</CFormFeedback>
                                        </CCol>

                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Total Pack Ordered </CFormLabel>
                                            <CFormInput
                                                name="delivery_deadline"
                                                type="number"
                                                defaultValue={Total_packs_ordered}
                                                onChange={handletotalpackorder}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={Fish_pack_ref === ''}
                                            />
                                            <CFormFeedback invalid>Please choose an Total Pack Ordered.</CFormFeedback>

                                            {error && <><br /><div style={{ color: 'red' }}>There are {Avaiablepack} packs remaining </div></>}
                                        </CCol>
                                        <datalist id="fishpackSuggestions" >
                                            {Fishpackfilterdata.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </CRow>

                                </div>


                                <div>
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                defaultValue={Fishname}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />

                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername"> Fish Cut</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                defaultValue={ Fish_cut}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose an  Fish Cut.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername"> Packing Date</CFormLabel>
                                            <CFormInput
                                                type="date"
                                                defaultValue={ Packingdate}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose an  Packing Date.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>


                                <div>
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Weight</CFormLabel>
                                            <CFormInput
                                                name="delivery_charges"
                                                type="number"
                                                onChange={handlefishweight}
                                                defaultValue={ Fish_weight}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose an Fish Weight.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Meat Weight</CFormLabel>
                                            <CFormInput
                                                name="delivery_charges"
                                                type="number"
                                                onChange={handlemeatweight}
                                                defaultValue={ Meat_weight}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please enter Meat Weight.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Rate</CFormLabel>
                                            <CFormInput
                                                name="urgent_delivery_charges"
                                                type="number"
                                                onChange={handlefishrate}
                                                defaultValue={Fish_rate}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please enter Fish Rate.</CFormFeedback>
                                        </CCol>
                                    </CRow>

                                </div>

                                <div>
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Meat Rate</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="number"
                                                onChange={handlemeatrate}
                                                defaultValue={ Meat_rate}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please enter Meat Rate.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Skin</CFormLabel>
                                            <CFormSelect
                                                name="payment_status"
                                                onChange={handleskin}
                                                value={Skin}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            >
                                                <option>Select</option>
                                                <option value='1'>Yes</option>
                                                <option value='0'>No</option>
                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Skin.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Kante</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="text"
                                                onChange={handlekante}
                                                defaultValue={ Kante}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please enter Kante.</CFormFeedback>
                                        </CCol>
                                    </CRow>

                                </div>



                                <div>
                                    <CRow>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Pack Price</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="number"
                                                onChange={handlepackprice}
                                                defaultValue={Pack_price}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please enter Pack Price.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Item Discount Absolute</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="number"
                                                onChange={handleitemdiscountabsolute}
                                                defaultValue={ Item_discount_absolute}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please enter Item Discount Absolute.</CFormFeedback>
                                        </CCol>
                                        <CCol>
                                            <CFormLabel htmlFor="validationCustomUsername">Item Discount Percent</CFormLabel>
                                            <CFormInput
                                                name="order_total"
                                                type="number"
                                                onChange={handleitemdiscountpercent}
                                                defaultValue={ Item_discount_percent}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please enter Item Discount Percent.</CFormFeedback>
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