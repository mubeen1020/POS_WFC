import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import FishpackService from "src/services/fishpack_services";
import FishService from "src/services/fish_services";
import { Value } from "sass";
import FishCutsService from "src/services/fishcut_services";


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

    const [Fish_Pack_Data, setFish_Pack_Data] = useState([])
    const [filteredFishes, setFilteredFishes] = useState([])
    const [Fishname, setFishname] = useState([])
    const [Fishcut,setFishcut] = useState([])

    const [FishNotFound, setFishNotFound] = useState(false)

    const handlepackingdate = (e) => { setPacking_date(e.target.value) }
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
    const handlewholefishpayment = (e) => { setWhole_fish_payment(e.target.value) }
    const handlewholefishtotalweight = (e) => { setWhole_fish_total_weight(e.target.value) }
    const handlefishpack = (e) => { setfish_packs(e.target.value) }
    const handlewholefishpackweight = (e) => { setWhole_fish_pack_weight(e.target.value) }
    const handlewholefishpurchaserate = (e) => { setWhole_fish_purchase_rate(e.target.value) }
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

    let get_fish_pack_data = () => {
        let api = new FishpackService;
        api.getfishpackbyId(params.id).then((res) => {
            setFish_Pack_Data(res.data.fishPack);
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

    const Fish_Data_Get = (search = "") => {
        let api = new FishService;
        api.getfish(search).then((res) => { setFishname(res.data.fishList); })
            .catch((err) => { });
    }

    const Fish_Cut_Data_Get = (search = "") => {
        let api = new FishCutsService;
        api.getfishCuts(search).then((res) => {setFishcut(res.data.fishCuts); })
            .catch((err) => { });
    }

    const filter_name = Fishname.filter((fish) => {
        return fish.id === Fish_Pack_Data.fish_ref;

    });

    function formatDateToLocal(isoDate) {
        const date = new Date(isoDate);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    }


    useEffect(() => {
        Fish_Data_Get();
        Fish_Cut_Data_Get();
        params.id ? get_fish_pack_data() : ''
    }, [])

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
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Packing Date</CFormLabel>
                                        <CFormInput
                                            onChange={handlepackingdate}
                                            defaultValue={
                                                params.id && Fish_Pack_Data && Fish_Pack_Data.packing_date
                                                    ? formatDateToLocal(Fish_Pack_Data.packing_date)
                                                    : formatDateToLocal(new Date() || Packing_date)
                                            }
                                            type="date"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Packing Date.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
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
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Whole Fish Payment</CFormLabel>
                                        <CFormInput
                                            onChange={handlewholefishpayment}
                                            defaultValue={params.id ? Fish_Pack_Data.whole_fish_payment : Whole_fish_payment}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Whole Fish Payment.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Whole Fish Total Weight</CFormLabel>
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

                                        <CFormFeedback invalid>Please choose a valid Whole Fish Total Weight.</CFormFeedback>

                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Fish Packs</CFormLabel>
                                        <CFormInput
                                            onChange={handlefishpack}
                                            defaultValue={params.id ? Fish_Pack_Data.fish_packs : Fish_packs}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Fish Packs.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Meat Total Weight</CFormLabel>
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
                                        <CFormFeedback invalid>Please choose a  Net Meat Total Weight.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Bones Total Weight</CFormLabel>
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
                                        <CFormFeedback invalid>Please choose a Bones Total Weight.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Bones Packs</CFormLabel>
                                        <CFormInput
                                            onChange={handlebonepacks}
                                            defaultValue={params.id ? Fish_Pack_Data.bones_packs : Bones_packs}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Bone Packs.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Whole Fish Pack Weight</CFormLabel>
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
                                        <CFormFeedback invalid>Please choose a Whole Fish Pack Weight.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Whole Fish Purchase Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handlewholefishpurchaserate}
                                            defaultValue={params.id ? Fish_Pack_Data.whole_fish_purchase_rate : Whole_fish_purchase_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Whole Fish Purchase Rate</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Whole Fish Sale Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handlewholefishsalerate}
                                            defaultValue={params.id ? Fish_Pack_Data.whole_fish_sale_rate : Whole_fish_sale_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Whole Fish Sale Rate.</CFormFeedback>
                                    </CCol>
                                </div>



                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Meat Pack Weight</CFormLabel>
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
                                        <CFormFeedback invalid>Please choose a Net Meat Pack Weight.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Meat Weight Per Kg</CFormLabel>
                                        <CFormInput
                                            onChange={handlenetmeatweightperkg}
                                            defaultValue={params.id ? Fish_Pack_Data.net_meat_weight_per_kg : Net_meat_weight_per_kg}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Net Meat Weight Per Kg.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Meat Sale Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handlenetmeatsalerate}
                                            defaultValue={params.id ? Fish_Pack_Data.net_meat_sale_rate : Net_meat_sale_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Net Meat Sale Rate.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Bones Pack Weight</CFormLabel>
                                        <CFormInput
                                            onChange={handlebonepackweight}
                                            defaultValue={params.id ? Fish_Pack_Data.bones_pack_weight : Bones_pack_weight}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Bones Pack Weight.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Bone Pack Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handlebonespackrate}
                                            defaultValue={params.id ? Fish_Pack_Data.bones_pack_rate : Bones_pack_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Bone Pack Rate.</CFormFeedback>
                                    </CCol>
                                </div>


                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Fish Cut</CFormLabel>
                                       <CFormSelect
                                        onChange={handlefishcut}
                                        defaultValue={params.id ? Fish_Pack_Data.fish_cut : Fish_cut}
                                        id="validationCustomUsername"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                       >
                                        <option>Select</option>
                                        {
                                            Fishcut.map((i)=>{
                                                return(
                                                    <option value={i.id}>{i.fish_cut}</option>
                                                )
                                            })
                                        }
                                       
                                       </CFormSelect>
                                        <CFormFeedback invalid>Please choose a Fish Cut.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
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
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Head Removed</CFormLabel>
                                        <CFormSelect
                                            onChange={handleheadremoved}
                                            defaultValue={params.id ? Fish_Pack_Data.head_removed : Head_removed}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        >
                                            <option >Select</option>
                                            <option value='1'>Yes</option>
                                            <option value='0'>No</option>
                                        </CFormSelect>
                                        <CFormFeedback invalid>Please choose a Head Removed.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Skin Removed</CFormLabel>
                                        <CFormSelect
                                            onChange={handleskinremoved}
                                            defaultValue={params.id ? Fish_Pack_Data.skin_removed : Skin_removed}
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        >
                                            <option >Select</option>
                                            <option value='1'>Yes</option>
                                            <option value='0'>No</option>
                                        </CFormSelect>
                                        <CFormFeedback invalid>Please choose a Skin Removed.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
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
                                </div>

                                <div >
                                    <CCol >
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