import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect, CTooltip } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import FishpackService from "src/services/fishpack_services";
import FishService from "src/services/fish_services";
import FishCutsService from "src/services/fishcut_services";
import SettingsService from "src/services/settings_services";


export default function FishPack() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Packing_date, setPacking_date] = useState('')
    const [Fish, setFish] = useState('')
    const [Fish_id, setFish_id] = useState('')
    const [Whole_fish_payment, setWhole_fish_payment] = useState('')
    const [Whole_fish_total_weight, setWhole_fish_total_weight] = useState('')
    const [Fish_packs, setfish_packs] = useState('')
    const [Whole_fish_pack_weight, setWhole_fish_pack_weight] = useState('')
    const [Whole_fish_purchase_rate, setWhole_fish_purchase_rate] = useState('')
    const [Whole_fish_sale_rate, setWhole_fish_sale_rate] = useState('')
    const [Net_meat_total_weight, setNet_meat_total_weight] = useState('')
    const [Net_meat_Pack_weight, setNet_meat_pack_weight] = useState('')
    const [Net_meat_weight_per_kg, setNet_meat_weight_per_kg] = useState('')
    const [Net_meat_sale_rate, setNet_meat_sale_rate] = useState('')
    const [Bones_total_weight, setBones_total_weight] = useState('')
    const [Bones_packs, setBones_packs] = useState('')
    const [Bones_pack_weight, setBones_pack_weight] = useState('')
    const [Bones_pack_rate, setBones_pack_rate] = useState('')
    const [Fish_cut, setFish_cut] = useState('')
    const [Average_fish_piece_size, setAverage_fish_piece_size] = useState('')
    const [Head_removed, setHead_removed] = useState('')
    const [Skin_removed, setSkin_removed] = useState('')
    const [Kante, setKante] = useState('')
    const [Available_packs, setAvailable_packs] = useState('')
    const [Whole_fish_pack_price, setWhole_fish_pack_price] = useState('')
    const [Bones_pack_price, setBones_pack_price] = useState('')
    const [Available_meat_packs, setAvailable_meat_packs] = useState('')
    const [Available_bones_packs, setAvailable_bones_packs] = useState('')

    const [Fish_Pack_Data, setFish_Pack_Data] = useState([])
    const [filteredFishes, setFilteredFishes] = useState([])
    const [Fishname, setFishname] = useState([])
    const [Fishcut, setFishcut] = useState([])

    const [FishNotFound, setFishNotFound] = useState(false)

    const handlefish = (e) => {
        const fishvalue = e.target.value;
        setFish(fishvalue)
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
   
    const handlewholefishpayment = (e) => {
        const purchaseValue = parseFloat(e.target.value);
        setWhole_fish_payment(purchaseValue);
        const purchaseRate = purchaseValue / parseFloat(Whole_fish_total_weight);
        setWhole_fish_purchase_rate(isNaN(purchaseRate.toFixed(2)) ? 0 : purchaseRate.toFixed(2));
        settingsData(purchaseRate);
      }
      
      const handlewholefishtotalweight = (e) => {
        const totalWeight = parseFloat(e.target.value);
        setWhole_fish_total_weight(totalWeight);
        const purchaseRate = parseFloat(Whole_fish_payment) / totalWeight;
        setWhole_fish_purchase_rate(isNaN(purchaseRate.toFixed(2)) ? 0 : purchaseRate.toFixed(2));
        settingsData(purchaseRate);
      }


    const handlefishpack = (e) => { setfish_packs(e.target.value) }
    const handlewholefishpackweight = (e) => { setWhole_fish_pack_weight(e.target.value) }
    const handlewholefishsalerate = (e) => { setWhole_fish_sale_rate(e.target.value) }
    const handlenetmeatpackweight = (e) => { setNet_meat_pack_weight(e.target.value) }
    const handlenetmeatweightperkg = (e) => { setNet_meat_weight_per_kg(e.target.value) }
    const handlenetmeatsalerate = (e) => { setNet_meat_sale_rate(e.target.value) }
    const handlenetmeattotalweight = (e) => { setNet_meat_total_weight(e.target.value) }
    const handlebonetotalweight = (e) => { setBones_total_weight(e.target.value) }
    const handlebonepacks = (e) => { setBones_packs(e.target.value) }
    const handlebonepackweight = (e) => { setBones_pack_weight(e.target.value) }
    const handlebonespackrate = (e) => { setBones_pack_rate(e.target.value) }
    const handlefishcut = (e) => { setFish_cut(e.target.value) }
    const handleaveragefishpiecesize = (e) => { setAverage_fish_piece_size(e.target.value) }
    const handleheadremoved = (e) => { setHead_removed(e.target.value) }
    const handleskinremoved = (e) => { setSkin_removed(e.target.value) }
    const handlekante = (e) => { setKante(e.target.value) }
    const handleavailablepacks = (e) => { setAvailable_packs(e.target.value) }
    const handlewholefishpackprice = (e) => { setWhole_fish_pack_price(e.target.value) }
    const handlebonespackprice = (e) => { setBones_pack_price(e.target.value) }
    const handleavailablemeatpacks = (e) => { setAvailable_meat_packs(e.target.value) }
    const handleavailablebonepacks = (e) => { setAvailable_bones_packs(e.target.value) }

    let get_fish_pack_data = () => {
        let api = new FishpackService();
        api.getfishpackbyId(params.id).then((res) => {
            setFish_Pack_Data(res.data.fishPack);
            setHead_removed(res.data.fishPack.head_removed)
            setSkin_removed(res.data.fishPack.skin_removed)
            setFish_cut(res.data.fishPack.fish_cut)
            const isoDate = res.data.fishPack.packing_date;

            if (isoDate) {
                const parsedDate = new Date(isoDate);
                parsedDate.setHours(parsedDate.getHours() + 5);
                const formattedDate = parsedDate.toISOString().split('T')[0];
                setPacking_date(formattedDate);
            } else {
            }

        }).catch((err) => { });
    }

   

    const fishpackDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            packing_date: Packing_date,
            fish_ref: Fish_id,
            whole_fish_payment: Whole_fish_payment,
            whole_fish_total_weight: Whole_fish_total_weight,
            fish_packs: Fish_packs,
            whole_fish_pack_weight: Whole_fish_pack_weight,
            whole_fish_pack_price: Whole_fish_pack_price,
            whole_fish_purchase_rate: Whole_fish_purchase_rate,
            whole_fish_sale_rate: Whole_fish_sale_rate,
            net_meat_pack_weight: Net_meat_Pack_weight,
            net_meat_total_weight: Net_meat_total_weight,
            net_meat_sale_rate: Net_meat_sale_rate,
            net_meat_weight_per_kg: Net_meat_weight_per_kg,
            bones_pack_weight: Bones_pack_weight,
            bones_packs: Bones_packs,
            bones_total_weight: Bones_total_weight,
            bones_pack_rate: Bones_pack_rate,
            bones_pack_price: Bones_pack_price,
            available_meat_packs: Available_meat_packs,
            available_bones_packs: Available_bones_packs,
            fish_cut: Fish_cut || 7,
            average_fish_piece_size: Average_fish_piece_size,
            head_removed: Head_removed || 0,
            skin_removed: Skin_removed || 0,
            kante: Kante,
            available_packs: Available_packs
        };

        const api = new FishpackService();
        api
            .createfishpack(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your fish pack information has been successfully submitted and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishPackList');
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

    const fishpackDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            packing_date: Packing_date || Fish_Pack_Data.packing_date,
            fish_ref: Fish_id || Fish_Pack_Data.fish_ref,
            whole_fish_payment: Whole_fish_payment || Fish_Pack_Data.whole_fish_payment,
            whole_fish_total_weight: Whole_fish_total_weight || Fish_Pack_Data.whole_fish_total_weight,
            fish_packs: Fish_packs || Fish_Pack_Data.fish_packs,
            whole_fish_pack_weight: Whole_fish_pack_weight || Fish_Pack_Data.whole_fish_pack_weight,
            whole_fish_pack_price: Whole_fish_pack_price || Fish_Pack_Data.whole_fish_pack_price,
            whole_fish_purchase_rate: Whole_fish_purchase_rate || Fish_Pack_Data.whole_fish_purchase_rate,
            whole_fish_sale_rate: Whole_fish_sale_rate || Fish_Pack_Data.whole_fish_sale_rate,
            net_meat_pack_weight: Net_meat_Pack_weight || Fish_Pack_Data.net_meat_pack_weight,
            net_meat_total_weight: Net_meat_total_weight || Fish_Pack_Data.net_meat_total_weight,
            net_meat_sale_rate: Net_meat_sale_rate || Fish_Pack_Data.net_meat_sale_rate,
            net_meat_weight_per_kg: Net_meat_weight_per_kg || Fish_Pack_Data.net_meat_weight_per_kg,
            bones_packs: Bones_packs || Fish_Pack_Data.bones_packs,
            bones_pack_weight: Bones_pack_weight || Fish_Pack_Data.bones_pack_weight,
            bones_total_weight: Bones_total_weight || Fish_Pack_Data.bones_total_weight,
            bones_pack_rate: Bones_pack_rate || Fish_Pack_Data.bones_pack_rate,
            bones_pack_price: Bones_pack_price || Fish_Pack_Data.bones_pack_price,
            available_meat_packs: Available_meat_packs || Fish_Pack_Data.available_meat_packs,
            available_bones_packs: Available_bones_packs || Fish_Pack_Data.available_bones_packs,
            fish_cut: Fish_cut || Fish_Pack_Data.fish_cut,
            average_fish_piece_size: Average_fish_piece_size || Fish_Pack_Data.average_fish_piece_size,
            head_removed: Head_removed || Fish_Pack_Data.head_removed,
            skin_removed: Skin_removed || Fish_Pack_Data.skin_removed,
            kante: Kante || Fish_Pack_Data.kante,
            available_packs: Available_packs || Fish_Pack_Data.available_packs
        };

        const api = new FishpackService();
        api
            .updatefishpack(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your fish pack information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishPackList');
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


    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const Fish_Data_Get = (search = "") => {
        let api = new FishService;
        api.getfish(search).then((res) => { setFishname(res.data.fishList); })
            .catch((err) => { });
    }

    const Fish_Cut_Data_Get = (search = "") => {
        let api = new FishCutsService;
        api.getfishCuts(search).then((res) => { setFishcut(res.data.fishCuts); })
            .catch((err) => { });
    }

    const filter_name = Fishname.filter((fish) => {
        return fish.id === Fish_Pack_Data.fish_ref;

    });
    const settingsData = (purchaseRate) => {
        let api = new SettingsService();
        api.getSettings().then((res) => {
          const settings = res.data.settings[0];
          const saleRate = ((purchaseRate * settings.variable_profit_percent_per_kg) / 100)+purchaseRate + settings.fixed_profit_per_kg + settings.expense_per_kg;
          setWhole_fish_sale_rate(purchaseRate!=0?saleRate.toFixed(2):0);
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
        Fish_Data_Get();
        Fish_Cut_Data_Get();
        settingsData()
        const currentDate = new Date().toISOString().split('T')[0];
        params.id ? get_fish_pack_data() : setPacking_date(currentDate)
    }, [])
 
  useEffect(() => {
        if (!Whole_fish_purchase_rate||!Whole_fish_total_weight||!Whole_fish_payment) {
            settingsData()
        }
    }, [Whole_fish_purchase_rate, Whole_fish_total_weight, Whole_fish_payment,Whole_fish_sale_rate])
   
    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Fish/FishPackList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Fish Pack</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => { params.id ? fishpackDataupdateSubmit(event) : fishpackDataSubmit(event) }}
                            >

                                <div>
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Packing Date</CFormLabel>
                                            <CFormInput
                                                onChange={(e) => { setPacking_date(e.target.value) }}
                                                value={Packing_date}
                                                type="date"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Packing Date.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Refrence</CFormLabel>
                                            <CFormInput
                                                onChange={handlefish}
                                                defaultValue={
                                                    params.id && filter_name.length > 0 ? filter_name[0].local_name : Fish
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
                                                <CFormFeedback invalid>Please choose a Fish.</CFormFeedback>
                                            )}
                                            <datalist id="fishSuggestions" >
                                                {filteredFishes.map((fish) => (
                                                    <option key={fish.id} value={fish.local_name} />
                                                ))}
                                            </datalist>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Whole Fish Payment</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handlewholefishpayment}
                                                    defaultValue={params.id ? Fish_Pack_Data.whole_fish_payment : Whole_fish_payment}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Whole Fish Payment.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Whole Fish Total Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlewholefishtotalweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.whole_fish_total_weight : Whole_fish_total_weight}
                                                    list="customerSuggestions"
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
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a valid Whole Fish Total Weight.</CFormFeedback>

                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fish Packs</CFormLabel>
                                            <CTooltip content="1,2,3..." placement="left">
                                                <CFormInput
                                                    onChange={handlefishpack}
                                                    defaultValue={params.id ? Fish_Pack_Data.fish_packs : Fish_packs}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Fish Packs.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Meat Total Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlenetmeattotalweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.net_meat_total_weight : Net_meat_total_weight}
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
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a  Net Meat Total Weight.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bones Total Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlebonetotalweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.bones_total_weight : Bones_total_weight}
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
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bones Total Weight.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bones Packs</CFormLabel>
                                            <CTooltip content="1,2,3..." placement="left">
                                                <CFormInput
                                                    onChange={handlebonepacks}
                                                    defaultValue={params.id ? Fish_Pack_Data.bones_packs : Bones_packs}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bone Packs.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Whole Fish Pack Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlewholefishpackweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.whole_fish_pack_weight : Whole_fish_pack_weight}
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
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Whole Fish Pack Weight.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername"> Whole Fish Pack Price</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handlewholefishpackprice}
                                                    defaultValue={params.id ? Fish_Pack_Data.whole_fish_pack_price : Whole_fish_pack_price}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a  Whole Fish Pack Price</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Whole Fish Purchase Rate</CFormLabel>
                                            <CTooltip content="Rs/Kg" placement="left">
                                                <CFormInput
                                                    value={ Whole_fish_purchase_rate}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled  
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Whole Fish Purchase Rate</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Whole Fish Sale Rate</CFormLabel>
                                            <CTooltip content="Rs/Kg" placement="left">
                                                <CFormInput
                                                    // onChange={handlewholefishsalerate}
                                                    defaultValue={params.id ? Fish_Pack_Data.whole_fish_sale_rate : Whole_fish_sale_rate}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Whole Fish Sale Rate.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>



                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Meat Pack Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlenetmeatpackweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.net_meat_pack_weight : Net_meat_Pack_weight}
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
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Net Meat Pack Weight.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Meat Weight Per Kg</CFormLabel>
                                            <CTooltip content="Gram" placement="left">
                                                <CFormInput
                                                    onChange={handlenetmeatweightperkg}
                                                    defaultValue={params.id ? Fish_Pack_Data.net_meat_weight_per_kg : Net_meat_weight_per_kg}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Net Meat Weight Per Kg.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Meat Sale Rate</CFormLabel>
                                            <CTooltip content="Rs/Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlenetmeatsalerate}
                                                    defaultValue={params.id ? Fish_Pack_Data.net_meat_sale_rate : Net_meat_sale_rate}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Net Meat Sale Rate.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bones Pack Weight</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlebonepackweight}
                                                    defaultValue={params.id ? Fish_Pack_Data.bones_pack_weight : Bones_pack_weight}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bones Pack Weight.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bone Pack Rate</CFormLabel>
                                            <CTooltip content="Rs/Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlebonespackrate}
                                                    defaultValue={params.id ? Fish_Pack_Data.bones_pack_rate : Bones_pack_rate}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bone Pack Rate.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bones Pack Price</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handlebonespackprice}
                                                    defaultValue={params.id ? Fish_Pack_Data.bones_pack_price : Bones_pack_price}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    disabled={params.id ? params.id : ''}
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bones Pack Price.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Available Meat Packs</CFormLabel>
                                            <CFormInput
                                                onChange={handleavailablemeatpacks}
                                                defaultValue={params.id ? Fish_Pack_Data.available_meat_packs : Available_meat_packs}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={params.id ? params.id : ''}
                                            />
                                            <CFormFeedback invalid>Please choose a Available Meat Packs.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername"> Available Bone Packs</CFormLabel>
                                            <CFormInput
                                                onChange={handleavailablebonepacks}
                                                defaultValue={params.id ? Fish_Pack_Data.available_bones_packs : Available_bones_packs}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={params.id ? params.id : ''}
                                            />
                                            <CFormFeedback invalid>Please choose a  Available Bone Packs.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
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

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Average Fish Piece Size</CFormLabel>
                                            <CFormInput
                                                onChange={handleaveragefishpiecesize}
                                                defaultValue={params.id ? Fish_Pack_Data.average_fish_piece_size : Average_fish_piece_size}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Average Fish Piece Size.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Head Removed</CFormLabel>
                                            <CFormSelect
                                                onChange={handleheadremoved}
                                                value={Head_removed}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            >
                                                <option >Select</option>
                                                <option key='1' value='1'>Yes</option>
                                                <option key='0' value='0'>No</option>
                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Head Removed.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Skin Removed</CFormLabel>
                                            <CFormSelect
                                                onChange={handleskinremoved}
                                                value={Skin_removed}
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            >
                                                <option >Select</option>
                                                <option key='1' value='1'>Yes</option>
                                                <option key='0' value='0'>No</option>
                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Skin Removed.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Kante</CFormLabel>
                                            <CFormInput
                                                onChange={handlekante}
                                                defaultValue={params.id ? Fish_Pack_Data.kante : Kante}
                                                type="text"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Kante.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Available Packs</CFormLabel>
                                            <CFormInput
                                                onChange={handleavailablepacks}
                                                defaultValue={params.id ? Fish_Pack_Data.available_packs : Available_packs}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={params.id ? params.id : ''}
                                            />
                                            <CFormFeedback invalid>Please choose a Available Packs.</CFormFeedback>
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