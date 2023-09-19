import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton } from "@coreui/react";
import { Toast } from 'primereact/toast';
import CustomerService from "src/services/customer_services";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import FishService from "src/services/fish_services";


export default function Fish() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate();
    const params = useParams()
    const [Local_name, setLocal_name] = useState('')
    const [English_name, setEnglish_name] = useState('')
    const [Minimum_size, setMinimum_size] = useState('')
    const [Maximum_size, setMaximum_size] = useState('')
    const [Net_steaks, setNet_steaks] = useState('')
    const [Net_boneless, setNet_boneless] = useState('')
    const [Bones, setBones] = useState('')
    const [Min_rate, setMin_rate] = useState('')
    const [Max_rate, setMax_rate] = useState('')
    const [Average_rate, setAverage_rate] = useState('')
    const [Overall_purchace_quantity, setOverall_purchace_quantity] = useState('')

    const [Fish_Data, setFish_Data] = useState([])


    const handlelocalname = (e) => { setLocal_name(e.target.value) }
    const handleenglishname = (e) => { setEnglish_name(e.target.value) }
    const handleminimumsize = (e) => { setMinimum_size(e.target.value) }
    const handlemaximumsize = (e) => { setMaximum_size(e.target.value) }
    const handlenetsteak = (e) => { setNet_steaks(e.target.value) }
    const handlenetboneless = (e) => { setNet_boneless(e.target.value) }
    const handleBones = (e) => { setBones(e.target.value) }
    const handleminrate = (e) => { setMin_rate(e.target.value) }
    const handlemaxrate = (e) => { setMax_rate(e.target.value) }
    const handleaveragerate = (e) => { setAverage_rate(e.target.value) }
    const handleoverallpurchacequantity = (e) => { setOverall_purchace_quantity(e.target.value) }

    let get_fish_data = () => {
        let api = new FishService;
        api.getfishbyId(params.id).then((res) => {
            setFish_Data(res.data.fish[0]);

        }).catch((err) => { });
    }

    const fishDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            local_name: Local_name,
            english_name: English_name,
            minimum_size: Minimum_size,
            maximum_size: Maximum_size,
            net_steaks: Net_steaks,
            net_boneless: Net_boneless,
            bones: Bones,
            min_rate: Min_rate,
            max_rate: Max_rate,
            average_rate: Average_rate,
            overall_purchase_quantity: Overall_purchace_quantity
        };

        const api = new FishService();
        api
            .createfish(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your fish information has been successfully submitted and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishList');
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

    const fishDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            local_name: Local_name || Fish_Data.local_name,
            english_name: English_name || Fish_Data.english_name,
            minimum_size: Minimum_size || Fish_Data.minimum_size,
            maximum_size: Maximum_size || Fish_Data.maximum_size,
            net_steaks: Net_steaks || Fish_Data.net_steaks,
            net_boneless: Net_boneless || Fish_Data.net_boneless,
            bones: Bones || Fish_Data.bones,
            min_rate: Min_rate || Fish_Data.min_rate,
            max_rate: Max_rate || Fish_Data.max_rate,
            average_rate: Average_rate || Fish_Data.average_rate,
            overall_purchase_quantity: Overall_purchace_quantity || Fish_Data.overall_purchase_quantity
        };

        const api = new FishService();
        api
            .updatefish(params.id, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your fish information has been successfully update and recorded.',
                    life: 3000,
                });
                setTimeout(() => {
                    navigate('/Fish/FishList');
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



    useEffect(() => {
        params.id ? get_fish_data() : ''
    }, [])

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><Link to="/Fish/FishList"><i className="pi pi-arrow-left mx-2" style={{ fontSize: '1rem', color: 'black' }}></i></Link><strong style={{ fontWeight: 550 }}>Fish</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => { params.id ? fishDataupdateSubmit(event) : fishDataSubmit(event) }}
                            >

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Local Name</CFormLabel>
                                        <CFormInput
                                            onChange={handlelocalname}
                                            defaultValue={params.id ? Fish_Data.local_name : Local_name}
                                            type="text"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required

                                        />
                                        <CFormFeedback invalid>Please choose a Local Name.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">English Name</CFormLabel>
                                        <CFormInput
                                            onChange={handleenglishname}
                                            defaultValue={params.id ? Fish_Data.english_name : English_name}
                                            type="text"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required

                                        />
                                        <CFormFeedback invalid>Please choose a English Name.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Minimum Size</CFormLabel>
                                        <CFormInput
                                            onChange={handleminimumsize}
                                            defaultValue={params.id ? Fish_Data.minimum_size : Minimum_size}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Minimum Size.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div>
                                    <CCol>
                                        <CFormLabel htmlFor="validationCustomUsername">Maximum Size</CFormLabel>
                                        <CFormInput
                                            onChange={handlemaximumsize}
                                            defaultValue={params.id ? Fish_Data.maximum_size : Maximum_size}
                                            list="customerSuggestions"
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required

                                        />

                                        <CFormFeedback invalid>Please choose a valid Maximum Size.</CFormFeedback>

                                    </CCol>
                                </div>






                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Steaks</CFormLabel>
                                        <CFormInput
                                            onChange={handlenetsteak}
                                            defaultValue={params.id ? Fish_Data.net_steaks : Net_steaks}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Net Steaks.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Net Boneless</CFormLabel>
                                        <CFormInput
                                            onChange={handlenetboneless}
                                            defaultValue={params.id ? Fish_Data.net_boneless : Net_boneless}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Net Boneless.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Bones</CFormLabel>
                                        <CFormInput
                                            onChange={handleBones}
                                            defaultValue={params.id ? Fish_Data.bones : Bones}
                                            type="text"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <CFormFeedback invalid>Please choose a Bones.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Min Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handleminrate}
                                            defaultValue={params.id ? Fish_Data.min_rate : Min_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Min Rate.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Max Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handlemaxrate}
                                            defaultValue={params.id ? Fish_Data.max_rate : Max_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Max Rate.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Average Rate</CFormLabel>
                                        <CFormInput
                                            onChange={handleaveragerate}
                                            defaultValue={params.id ? Fish_Data.average_rate : Average_rate}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Average Rate.</CFormFeedback>
                                    </CCol>
                                </div>

                                <div >
                                    <CCol >
                                        <CFormLabel htmlFor="validationCustomUsername">Overall Purchase Quantity</CFormLabel>
                                        <CFormInput
                                            onChange={handleoverallpurchacequantity}
                                            defaultValue={params.id ? Fish_Data.overall_purchase_quantity : Overall_purchace_quantity}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled={params.id ? params.id : ''}
                                        />
                                        <CFormFeedback invalid>Please choose a Overall Purchase Quantity.</CFormFeedback>
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