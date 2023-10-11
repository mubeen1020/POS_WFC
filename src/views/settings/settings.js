import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CTooltip } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import SettingsService from "src/services/settings_services";


export default function Settings() {
    const [validated, setValidated] = useState(false)
    const toast = useRef(null);
    const navigate = useNavigate()
    const params = 1;
    const [Variable_profit_percent_per_kg, setVariable_profit_percent_per_kg] = useState('')
    const [Fixed_profit_per_kg, setFixed_profit_per_kg] = useState('')
    const [Expense_per_kg, setExpense_per_kg] = useState('')
    const [Fuel_rate, setFuel_rate] = useState('')
    const [Bike_fuel_average, setBike_fuel_average] = useState('')
    const [Fixed_delivery_charges, setFixed_delivery_charges] = useState('')
    const [Half_service_charges, setHalf_service_charges] = useState('')
    const [Full_service_charges, setFull_service_charges] = useState('')
    const [Miniumum_order_weight, setMiniumum_order_weight] = useState('')

    const [Settings, setSettings] = useState([])

    const [Data, setData] = useState(false)


    const handlevariableprofitpercentperkg = (e) => { setVariable_profit_percent_per_kg(e.target.value) }
    const handlefixedprofitperkg = (e) => { setFixed_profit_per_kg(e.target.value) }
    const handleexpenseperkg = (e) => { setExpense_per_kg(e.target.value) }
    const handlefuelrate = (e) => { setFuel_rate(e.target.value) }
    const handlebikefuelaverage = (e) => { setBike_fuel_average(e.target.value) }
    const handlenetfixeddeliverycharges = (e) => { setFixed_delivery_charges(e.target.value) }
    const handlehalfservicecharges = (e) => { setHalf_service_charges(e.target.value) }
    const handlefullservicecharges = (e) => { setFull_service_charges(e.target.value) }
    const handleminiumumorderweight = (e) => { setMiniumum_order_weight(e.target.value) }


    let get_Settings = () => {
        let api = new SettingsService;
        api.getSettingsbyId(params).then((res) => {
            setData(false)
            setSettings(res.data.settings);
        }).catch((err) => { setData(true) });
    }

    const fishDataSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            id: 1,
            variable_profit_percent_per_kg: Variable_profit_percent_per_kg,
            fixed_profit_per_kg: Fixed_profit_per_kg,
            expense_per_kg: Expense_per_kg,
            fuel_rate: Fuel_rate,
            bike_fuel_average: Bike_fuel_average,
            fixed_delivery_charges: Fixed_delivery_charges,
            half_service_charges: Half_service_charges,
            full_service_charges: Full_service_charges,
            miniumum_order_weight: Miniumum_order_weight,
        };

        const api = new SettingsService();
        api
            .createSettings(formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your settings information has been successfully submitted and recorded.',
                    life: 3000,
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
    }

    const fishDataupdateSubmit = (event) => {
        handleSubmit(event)
        event.preventDefault();
        let formData = {
            id: 1,
            variable_profit_percent_per_kg: Variable_profit_percent_per_kg || Settings.variable_profit_percent_per_kg,
            fixed_profit_per_kg: Fixed_profit_per_kg || Settings.fixed_profit_per_kg,
            expense_per_kg: Expense_per_kg || Settings.expense_per_kg,
            fuel_rate: Fuel_rate || Settings.fuel_rate,
            bike_fuel_average: Bike_fuel_average || Settings.bike_fuel_average,
            fixed_delivery_charges: Fixed_delivery_charges || Settings.fixed_delivery_charges,
            half_service_charges: Half_service_charges || Settings.half_service_charges,
            full_service_charges: Full_service_charges || Settings.full_service_charges,
            miniumum_order_weight: Miniumum_order_weight || Settings.miniumum_order_weight,
        };

        const api = new SettingsService();
        api
            .updateSettings(params, formData)
            .then((res) => {

                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your settings information has been successfully update and recorded.',
                    life: 3000,
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
        get_Settings()
    }, [])

    return (
        <>

            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <h4><strong style={{ fontWeight: 550 }}>Settings</strong></h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                className="row g-3 needs-validation"
                                noValidate
                                validated={validated}
                                onSubmit={(event) => { Data === false ? fishDataupdateSubmit(event) : fishDataSubmit(event) }}
                            >
                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Variable Profit Percent Per Kg (%)</CFormLabel>
                                            <CTooltip content="%" placement="left">
                                                <CFormInput
                                                    onChange={handlevariableprofitpercentperkg}
                                                    defaultValue={Settings.variable_profit_percent_per_kg || Variable_profit_percent_per_kg}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required


                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Variable Profit Percent Per Kg.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fixed Profit Per Kg (Rs)</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handlefixedprofitperkg}
                                                    defaultValue={Settings.fixed_profit_per_kg || Fixed_profit_per_kg}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required

                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Fixed Profit Per Kg.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Expense Per Kg (Rs)</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handleexpenseperkg}
                                                    defaultValue={Settings.expense_per_kg || Expense_per_kg}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Expense Per Kg.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fuel Rate (Rs/Ltr)</CFormLabel>
                                            <CTooltip content="Rs / Ltr" placement="left">
                                                <CFormInput
                                                    onChange={handlefuelrate}
                                                    defaultValue={Settings.fuel_rate || Fuel_rate} list="customerSuggestions"
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required

                                                />
                                            </CTooltip>

                                            <CFormFeedback invalid>Please choose a valid Fuel Rate.</CFormFeedback>

                                        </CCol>
                                    </CRow>
                                </div>

                                <div >90
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bike Fuel Average (Km/Ltr)</CFormLabel>
                                            <CTooltip content="Km / Ltr" placement="left">
                                                <CFormInput
                                                    onChange={handlebikefuelaverage}
                                                    defaultValue={Settings.bike_fuel_average || Bike_fuel_average}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Bike Fuel Average.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Fixed Delivery Charges (Rs)</CFormLabel>
                                            <CTooltip content="Rs" placement="left">
                                                <CFormInput
                                                    onChange={handlenetfixeddeliverycharges}
                                                    defaultValue={Settings.fixed_delivery_charges || Fixed_delivery_charges}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Fixed Delivery Charges.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Half Service Charges (Rs/Kg)</CFormLabel>
                                            <CTooltip content="Rs / Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlehalfservicecharges}
                                                    defaultValue={Settings.half_service_charges || Half_service_charges}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Half Service Charges.</CFormFeedback>
                                        </CCol>

                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Full Service Charges (Rs/Kg)</CFormLabel>
                                            <CTooltip content="Rs / Kg" placement="left">
                                                <CFormInput
                                                    onChange={handlefullservicecharges}
                                                    defaultValue={Settings.full_service_charges || Full_service_charges}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Full Service Charges.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div >
                                    <CRow>
                                        <CCol sm={6} lg={6}>
                                            <CFormLabel htmlFor="validationCustomUsername">Miniumum Order Weight (Kg)</CFormLabel>
                                            <CTooltip content="Kg" placement="left">
                                                <CFormInput
                                                    onChange={handleminiumumorderweight}
                                                    defaultValue={Settings.miniumum_order_weight || Miniumum_order_weight}
                                                    type="number"
                                                    id="validationCustomUsername"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                />
                                            </CTooltip>
                                            <CFormFeedback invalid>Please choose a Miniumum Order Weight.</CFormFeedback>
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