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
import { useRecoilValue } from "recoil";
import { fishpackAtom } from "src/_state/fishpackAtom";
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { InputSwitch } from "primereact/inputswitch";



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
    const [Whole_fish_pack_price, setWhole_fish_pack_price] = useState('')
    const [Bones_pack_price, setBones_pack_price] = useState('')
    const [Available_meat_packs, setAvailable_meat_packs] = useState('')
    const [Available_bones_packs, setAvailable_bones_packs] = useState('')
    const [Fish_pack_no, setFish_pack_no] = useState()

    const [Fish_Pack_Data, setFish_Pack_Data] = useState([])
    const [filteredFishes, setFilteredFishes] = useState([])
    const [Fishname, setFishname] = useState([])
    const [Fishcut, setFishcut] = useState([])

    const [FishNotFound, setFishNotFound] = useState(false)

    const fishpackData = useRecoilValue(fishpackAtom)

    let get_fish_pack_data = () => {
        let api = new FishpackService();
        api.getfishpackbyId(params.id).then((res) => {
            setFish_Pack_Data(res.data.fishPack);
            setHead_removed(res.data.fishPack.head_removed != 0 ? true : false)
            setSkin_removed(res.data.fishPack.skin_removed != 0 ? true : false)
            setFish_cut(res.data.fishPack.fish_cut)
            setWhole_fish_total_weight(res.data.fishPack.whole_fish_total_weight)
            setWhole_fish_payment(Math.round(res.data.fishPack.whole_fish_payment))
            setWhole_fish_pack_weight(res.data.fishPack.whole_fish_pack_weight)
            setWhole_fish_pack_price(Math.round(res.data.fishPack.whole_fish_pack_price))
            setWhole_fish_purchase_rate(Math.round(res.data.fishPack.whole_fish_purchase_rate))
            setWhole_fish_sale_rate(Math.round(res.data.fishPack.whole_fish_sale_rate))
            setNet_meat_pack_weight(res.data.fishPack.net_meat_pack_weight)
            setNet_meat_weight_per_kg(res.data.fishPack.net_meat_weight_per_kg)
            setNet_meat_sale_rate(Math.round(res.data.fishPack.net_meat_sale_rate))
            setBones_pack_weight(res.data.fishPack.bones_pack_weight)
            setBones_pack_rate(Math.round(res.data.fishPack.bones_pack_rate))
            setBones_pack_price(Math.round(res.data.fishPack.bones_pack_price))
            setKante(res.data.fishPack.kante)
            setfish_packs(res.data.fishPack.fish_packs)
            setFish_pack_no(res.data.fishPack.fish_pack_no)
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

    const handlefish = (e) => {
        const fishvalue = e.target.value;
        setFish(fishvalue)
        const selectedfish = Fishname.find((fish) =>{
        const searchString = ( fish.local_name+' / '+fish.fish_no).toLowerCase();
        const result = searchString.includes(fishvalue.toLowerCase());
        return result
        }
        );

        if (selectedfish) {
            setFish_id(selectedfish.id);
            setFishNotFound(false);
        } else {
            setFish_id(null);
            setFishNotFound(true);
        }
       
        const filtered = Fishname.filter((fish) =>{
            const search = ( fish.local_name+' / '+fish.fish_no).toLowerCase();
            const value = search.includes(fishvalue.toLowerCase());
            return value;
        }
        );
        
        setFilteredFishes(filtered);
     

    }

    const handlewholefishpayment = (e) => {
        const purchaseValue = parseFloat(e.target.value);
        setWhole_fish_payment(purchaseValue);
        const purchaseRate = purchaseValue / parseFloat(Whole_fish_total_weight);
        setWhole_fish_purchase_rate(isNaN(purchaseRate.toFixed(2)) ? 0 : purchaseRate.toFixed(2));
        const packweight = parseFloat(Whole_fish_pack_weight)
        const meatweightkg = parseFloat(Net_meat_weight_per_kg)
        const bonepackweight = parseFloat(Bones_pack_weight)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight);
    }

    const handlewholefishtotalweight = (e) => {
        const totalWeight = parseFloat(e.target.value);
        setfish_packs(Math.round(totalWeight) )
        setWhole_fish_total_weight(totalWeight);
        const purchaseRate = parseFloat(Whole_fish_payment) / totalWeight || Whole_fish_total_weight;
        setWhole_fish_purchase_rate(purchaseRate);
        const packweight = parseFloat(totalWeight) || Whole_fish_total_weight / Fish_packs;
        setWhole_fish_pack_weight(isNaN(packweight.toFixed(2)) || packweight === Infinity ? 0 : packweight.toFixed(2));
        const meatweightkg = parseFloat((Net_meat_total_weight) / totalWeight || Whole_fish_total_weight) * 1000;
        setNet_meat_weight_per_kg(isNaN(meatweightkg.toFixed(2)) ? 0 : meatweightkg.toFixed(2))
        const bonepackweight = parseFloat(Bones_pack_weight)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight);
    }

    const handlefishpack = (e) => {
        setfish_packs(e.target.value )
        setAvailable_meat_packs(e.target.value)
        const packweight = parseFloat(Whole_fish_total_weight) / e.target.value;
        setWhole_fish_pack_weight(isNaN(packweight.toFixed(2)) || packweight.toFixed(2) === 'Infinity' ? 0 : packweight.toFixed(2));
        const meatpackweight = parseFloat((Net_meat_total_weight) / e.target.value);
        setNet_meat_pack_weight(meatpackweight.toFixed(2)) ? 0 : meatpackweight.toFixed(2)
        const purchaseRate = parseFloat(Whole_fish_purchase_rate)
        const meatweightkg = parseFloat(Net_meat_weight_per_kg)
        const bonepackweight = parseFloat(Bones_pack_weight)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight)
    }
    const handlenetmeattotalweight = (e) => {
        setNet_meat_total_weight(e.target.value)
        const meatweightkg = parseFloat((e.target.value) / Whole_fish_total_weight) * 1000;
        setNet_meat_weight_per_kg(isNaN(meatweightkg.toFixed(2)) ? 0 : meatweightkg.toFixed(2))
        const meatpackweight = parseFloat((e.target.value) / Fish_packs);
        setNet_meat_pack_weight(meatpackweight.toFixed(2)) ? 0 : meatpackweight.toFixed(2)
        const purchaseRate = parseFloat(Whole_fish_purchase_rate)
        const packweight = parseFloat(Whole_fish_pack_weight)
        const bonepackweight = parseFloat(Bones_pack_weight)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight)
    }
    const handlebonetotalweight = (e) => {
        setBones_total_weight(e.target.value)
        const bonepackweight = e.target.value / parseFloat(Bones_packs);
        setBones_pack_weight(isNaN(bonepackweight.toFixed(2)) ? 0 : bonepackweight.toFixed(2))
        const purchaseRate = parseFloat(Whole_fish_purchase_rate)
        const packweight = parseFloat(Whole_fish_pack_weight)
        const meatweightkg = parseFloat(Net_meat_weight_per_kg)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight)
    }
    const handlebonepacks = (e) => {
        setBones_packs(e.target.value)
        setAvailable_bones_packs(e.target.value)
        const bonepackweight = parseFloat(Bones_total_weight) / e.target.value;
        setBones_pack_weight(isNaN(bonepackweight.toFixed(2)) ? 0 : bonepackweight.toFixed(2))
        const purchaseRate = parseFloat(Whole_fish_purchase_rate)
        const packweight = parseFloat(Whole_fish_pack_weight)
        const meatweightkg = parseFloat(Net_meat_weight_per_kg)
        settingsData(purchaseRate, packweight, meatweightkg, bonepackweight)
    }
    const handlefishcut = (e) => { setFish_cut(e.target.value) }
    const handleaveragefishpiecesize = (e) => { setAverage_fish_piece_size(e.target.value) }
    const handleheadremoved = () => { setHead_removed(!Head_removed) }
    const handleskinremoved = () => { setSkin_removed(!Skin_removed) }
    const handlefishpackno = (e) => { setFish_pack_no(e.target.value) }

    const settingsgetData = () => {
        let api = new SettingsService();
        api.getSettingsbyId(1).then((res) => {
            setFish_pack_no(res.data.settings.fish_pack_id + 1)
        }).catch((err) => { });
    }

    const fishpackDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        console.log(Head_removed, 'Head_removed')
        console.log(Skin_removed, 'Skin_removed')
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
            head_removed: Head_removed == false ? 0 : 1 || 0,
            skin_removed: Skin_removed == false ? 0 : 1 || 0,
            fish_pack_no: Fish_pack_no,
        };

        const api = new FishpackService();
        api
            .createfishpack(formData)
            .then((res) => {
                const fishpackno = {
                    fish_pack_id: res.data.newFishPack.id
                }
                let settingapi = new SettingsService();
                settingapi.updateSettings(1, fishpackno).then((res) => {
                }).catch((err) => { });
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
            head_removed: Head_removed == false ? 0 : 1 || Fish_Pack_Data.head_removed,
            skin_removed: Skin_removed == false ? 0 : 1 || Fish_Pack_Data.skin_removed,
            fish_pack_no: Fish_pack_no || Fish_Pack_Data.fish_pack_no,
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
        params.id === undefined ? settingsgetData() : ''
        const currentDate = new Date().toISOString().split('T')[0];
        params.id ? get_fish_pack_data() : setPacking_date(currentDate)
    }, [])

    const settingsData = (purchaseRate, packweight, meatweightkg, bonepackweight) => {
        let api = new SettingsService();
        api.getSettings().then((res) => {
            const settings = res.data.settings[0];
            const saleRate = ((purchaseRate * settings.variable_profit_percent_per_kg) / 100) + purchaseRate + settings.fixed_profit_per_kg + settings.expense_per_kg;
            const newsalerate = isNaN(saleRate) ? 0 : saleRate.toFixed(2);
            setWhole_fish_sale_rate(Math.round(newsalerate));
            const packprice = parseFloat(packweight.toFixed(2)) * saleRate.toFixed(2)
            setWhole_fish_pack_price(Math.round(packprice))
            const netmeatsale = ((saleRate.toFixed(2) / parseFloat(meatweightkg.toFixed(2))) * 1000)
            setNet_meat_sale_rate(Math.round(netmeatsale))
            const bonesrate = Math.round((saleRate * bonepackweight) / 3 * 100) / 100;
            setBones_pack_rate(Math.round(bonesrate));
            const bonespackprice = (bonepackweight * bonesrate);
            setBones_pack_price(Math.round(bonespackprice));
        }).catch((err) => { });
    }





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

                                <Splitter layout="vertical">
                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <br />
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <CFormLabel htmlFor="validationCustomUsername">Fish </CFormLabel>
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
                                                        autoComplete="off"
                                                    />
                                                    {FishNotFound && (
                                                        <CFormFeedback invalid>Please choose a Fish.</CFormFeedback>
                                                    )}
                                                    <datalist id="fishSuggestions" >
                                                        {filteredFishes.map((fish) => (
                                                            <option key={fish.id} value={fish.local_name +' / '+fish.fish_no} />
                                                        ))}
                                                    </datalist>
                                                </CCol>
                                                <CCol sm={3} lg={3}>
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
                                                <CCol sm={3} lg={3}>
                                                    <CFormLabel htmlFor="validationCustomUsername">Fish Pack No</CFormLabel>
                                                    <CFormInput
                                                        onChange={handlefishpackno}
                                                        value={Fish_pack_no}
                                                        type="number"
                                                        id="validationCustomUsername"
                                                        aria-describedby="inputGroupPrepend"
                                                        required
                                                        disabled
                                                    />
                                                    <CFormFeedback invalid>Please choose a Fish Pack No.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={3} lg={3}>
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


                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>
                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Whole Fish Payment (Rs)</CFormLabel>
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


                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Whole Fish Total Weight (Kg)</CFormLabel>
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

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Whole Fish Purchase Rate (Rs / Kg)</CFormLabel>
                                                    <CTooltip content="Rs/Kg" placement="left">
                                                        <CFormInput
                                                            value={Whole_fish_purchase_rate}
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
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Whole Fish Purchase Rate</CFormFeedback>
                                                </CCol>


                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Whole Fish Sale Rate (Rs / Kg)</CFormLabel>
                                                    <CTooltip content="Rs/Kg" placement="left">
                                                        <CFormInput
                                                            value={Whole_fish_sale_rate === NaN ? 0 : Whole_fish_sale_rate}
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
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Whole Fish Sale Rate.</CFormFeedback>
                                                </CCol>


                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={4} lg={4}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Fish Packs (1,2,3...)</CFormLabel>
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

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Whole Fish Pack Weight (Kg)</CFormLabel>
                                                    <CTooltip content="Kg" placement="left">
                                                        <CFormInput
                                                            value={Whole_fish_pack_weight}
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
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Whole Fish Pack Weight.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername"> Whole Fish Pack Price (Rs)</CFormLabel>
                                                    <CTooltip content="Rs" placement="left">
                                                        <CFormInput
                                                            value={Whole_fish_pack_price}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a  Whole Fish Pack Price</CFormFeedback>
                                                </CCol>
                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <br />

                                                    <CFormLabel htmlFor="validationCustomUsername">Net Meat Total Weight (Kg)</CFormLabel>
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

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Net Meat Weight Per Kg (Grams)</CFormLabel>
                                                    <CTooltip content="Gram" placement="left">
                                                        <CFormInput
                                                            value={Net_meat_weight_per_kg}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Net Meat Weight Per Kg.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Net Meat Sale Rate (Rs / Kg)</CFormLabel>
                                                    <CTooltip content="Rs/Kg" placement="left">
                                                        <CFormInput
                                                            value={Net_meat_sale_rate}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Net Meat Sale Rate.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Net Meat Pack Weight (Kg)</CFormLabel>
                                                    <CTooltip content="Kg" placement="left">
                                                        <CFormInput
                                                            value={Net_meat_Pack_weight}
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
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Net Meat Pack Weight.</CFormFeedback>
                                                </CCol>
                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <br />

                                                    <CFormLabel htmlFor="validationCustomUsername">Bones Total Weight (Kg)</CFormLabel>
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

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Bones Packs (1,2,3...)</CFormLabel>
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

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Bones Pack Weight (Kg)</CFormLabel>
                                                    <CTooltip content="Kg" placement="left">
                                                        <CFormInput
                                                            value={Bones_pack_weight}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Bones Pack Weight.</CFormFeedback>
                                                </CCol>




                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Bones Pack Rate (Rs / Kg)</CFormLabel>
                                                    <CTooltip content="Rs/Kg" placement="left">
                                                        <CFormInput
                                                            value={Bones_pack_rate}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Bone Pack Rate.</CFormFeedback>
                                                </CCol>


                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Bones Pack Price (Rs)</CFormLabel>
                                                    <CTooltip content="Rs" placement="left">
                                                        <CFormInput
                                                            value={Bones_pack_price}
                                                            type="number"
                                                            id="validationCustomUsername"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                            disabled
                                                        />
                                                    </CTooltip>
                                                    <CFormFeedback invalid>Please choose a Bones Pack Price.</CFormFeedback>
                                                </CCol>
                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Average Fish Piece Size (Grams)</CFormLabel>
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
                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Head Removed</CFormLabel>
                                                    <br />
                                                    <InputSwitch checked={Head_removed} onChange={handleheadremoved} />
                                                    <CFormFeedback invalid>Please choose a Head Removed.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={3} lg={3}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Skin Removed</CFormLabel>
                                                    <br />
                                                    <InputSwitch checked={Skin_removed} onChange={handleskinremoved} />
                                                    <CFormFeedback invalid>Please choose a Skin Removed.</CFormFeedback>
                                                </CCol>
                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>

                                    <SplitterPanel className="flex align-items-center justify-content-center">
                                        <div>
                                            <CRow>
                                                <CCol sm={6} lg={6}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername">Available Meat Packs</CFormLabel>
                                                    <CFormInput
                                                        defaultValue={params.id ? Fish_Pack_Data.available_meat_packs : Available_meat_packs}
                                                        type="number"
                                                        id="validationCustomUsername"
                                                        aria-describedby="inputGroupPrepend"
                                                        required
                                                        disabled
                                                    />
                                                    <CFormFeedback invalid>Please choose a Available Meat Packs.</CFormFeedback>
                                                </CCol>

                                                <CCol sm={6} lg={6}>
                                                    <br />
                                                    <CFormLabel htmlFor="validationCustomUsername"> Available Bone Packs</CFormLabel>
                                                    <CFormInput
                                                        defaultValue={params.id ? Fish_Pack_Data.available_bones_packs : Available_bones_packs}
                                                        type="number"
                                                        id="validationCustomUsername"
                                                        aria-describedby="inputGroupPrepend"
                                                        required
                                                        disabled
                                                    />
                                                    <CFormFeedback invalid>Please choose a  Available Bone Packs.</CFormFeedback>
                                                </CCol>
                                            </CRow>
                                        </div>
                                        <br />
                                    </SplitterPanel>
                                </Splitter>
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