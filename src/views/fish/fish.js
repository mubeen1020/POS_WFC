import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CFormInput, CFormFeedback, CButton, CFormSelect } from "@coreui/react";
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from "react-router-dom";
import 'primeicons/primeicons.css';
import '../../scss/style.scss';
import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import FishService from "src/services/fish_services";
import FishpackService from "src/services/fishpack_services";
import { InputSwitch } from "primereact/inputswitch";
import SettingsService from "src/services/settings_services";


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
    const [Profit, setProfit] = useState(0)
    const [Average_sale_retail, setAverage_sale_retail] = useState(0)
    const [Max_discount_percent, setMax_discount_percent] = useState(0)
    const [Average_net_boneless, setAverage_net_boneless] = useState(0)
    const [Average_net_steaks, setAverage_net_steaks] = useState(0)
    const [Avg_Size,setAvg_Size] = useState('')
    const [Avg_head_bones,setAvg_head_bones] = useState(0)
    const [Net_head_bones,setNet_head_bones] = useState('')

    const [Fish_Data, setFish_Data] = useState([])

    const [checked, setChecked] = useState(false);
    const handlelocalname = (e) => { setLocal_name(e.target.value) }
    const handleenglishname = (e) => { setEnglish_name(e.target.value) }
    const handleminimumsize = (e) => { setMinimum_size(e.target.value) }
    const handlemaximumsize = (e) => { setMaximum_size(e.target.value) }
    const handlenetsteak = (e) => {
        const netsteak = e.target.value
        setNet_steaks(netsteak)
        const average = Average_rate;
        const boneless = Net_boneless
        settingsData(average, boneless, netsteak)

    }
    const handlenetboneless = (e) => {
        const boneless = e.target.value
        setNet_boneless(boneless)
        const average = Average_rate;
        const netsteak = Net_steaks
        settingsData(average, boneless, netsteak)
    }
    const handleBones = (e) => { setBones(e.target.value) }
    const handleminrate = (e) => { setMin_rate(e.target.value) }
    const handlemaxrate = (e) => { setMax_rate(e.target.value) }
    const handleaveragerate = (e) => {
        let average = e.target.value
        setAverage_rate(average)
        const netsteak = Net_steaks
        const boneless = Net_boneless
        settingsData(average, boneless, netsteak)
    }
    const handleoverallpurchacequantity = (e) => { setOverall_purchace_quantity(e.target.value) }
    const handleavgsize = (e) => {setAvg_Size(e.target.value)}
    const handleavgheadbones = (e) => {setAvg_head_bones(e.target.value)}
    const handlenetheadbones=(e) => {setNet_head_bones(e.target.value)}

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
            min_purchase_rate: Min_rate || 0,
            max_purchase_rate: Max_rate || 0,
            average_purchase_rate: Average_rate || 0,
            overall_purchase_quantity: Overall_purchace_quantity,
            settings_id: 1,
            ischeck: checked == false ? 0 : 1,
            profit: Profit,
            average_sale_retail: Average_sale_retail,
            max_discount_percent: Max_discount_percent,
            average_net_steaks_rate: Average_net_steaks,
            average_net_boneless_rate: Average_net_boneless,
            net_head_bones: Net_head_bones,
            avg_head_bones: Avg_head_bones,
            avg_size: Avg_Size
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
            min_purchase_rate: Min_rate || 0,
            max_purchase_rate: Max_rate || 0,
            average_purchase_rate: Average_rate || 0,
            overall_purchase_quantity: Overall_purchace_quantity || Fish_Data.overall_purchase_quantity,
            settings_id: 1,
            ischeck: checked == false ? 0 : 1,
            profit: Profit || Fish_Data.profit,
            average_sale_retail: Average_sale_retail || Fish_Data.average_sale_retail,
            max_discount_percent: Max_discount_percent || Fish_Data.max_discount_percent,
            average_net_steaks_rate: Average_net_steaks || Fish_Data.average_net_steaks_rate,
            average_net_boneless_rate: Average_net_boneless || Fish_Data.average_net_boneless_rate,
            net_head_bones: Net_head_bones  || Fish_Data.net_head_bones,
            avg_head_bones: Avg_head_bones  || Fish_Data.avg_head_bones,
            avg_size: Avg_Size  || Fish_Data.avg_size
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

    let check;
    let bonelessData;
    let netsteakData;

    let get_fish_data = () => {
        let api = new FishService;
        api.getfishbyId(params.id).then((res) => {
            setFish_Data(res.data.fish[0]);
            const isChecked = res.data.fish[0].ischeck != 0 ? true : false;
            check = res.data.fish[0].ischeck
            setChecked(isChecked);
            setBones(res.data.fish[0].bones);
            setMin_rate(res.data.fish[0].min_purchase_rate || 0);
            setMax_rate(res.data.fish[0].max_purchase_rate || 0);
            setAverage_rate(res.data.fish[0].average_purchase_rate || 0);
            setNet_boneless(res.data.fish[0].net_boneless)
            setNet_steaks(res.data.fish[0].net_steaks)
            setProfit(res.data.fish[0].profit)
            setAverage_sale_retail(res.data.fish[0].average_sale_retail)
            setMax_discount_percent(res.data.fish[0].max_discount_percent)
            setAverage_net_steaks(res.data.fish[0].average_net_steaks_rate)
            setAverage_net_boneless(res.data.fish[0].average_net_boneless_rate)
            setAvg_Size(res.data.fish[0].avg_Size)
            setAvg_head_bones(res.data.fish[0].avg_head_bones)
            setNet_head_bones(res.data.fish[0].net_head_bones)
            get_min_max_rate();
            const average = Average_rate;
            bonelessData = res.data.fish[0].net_boneless
            netsteakData = res.data.fish[0].net_steaks
            settingsData(average, bonelessData, netsteakData)
        }).catch((err) => { });
    }

    let get_min_max_rate = () => {
        if (checked !== false || check === 0) {
            let api = new FishpackService;
            api.getfishmin_max_rate().then((res) => {
                const filterbyid = res.data.fishPacks.filter((item) => item.fish_ref === Number(params.id));
                setMin_rate(filterbyid[0].smallest_rate || 0);
                setMax_rate(filterbyid[0].greatest_rate || 0);
                const average = (filterbyid[0].average_rate).toFixed(2) || 0
                const boneless = Net_boneless || bonelessData
                const netsteak = Net_steaks || netsteakData
                setAverage_rate(average);
                settingsData(average, boneless, netsteak)

            }).catch((err) => { });
        }
    }

    const settingsData = (average, boneless, netsteaks) => {
        if (checked !== false || check === 0) {
            let api = new SettingsService();
            api.getSettings().then((res) => {
                const settings = res.data.settings[0];
                const profit = ((average * settings.variable_profit_percent_per_kg) / 100) + settings.fixed_profit_per_kg
                setProfit(profit)
                const averagesaleretail = Number(average) + Number(profit) + Number(settings.expense_per_kg)
                setAverage_sale_retail(averagesaleretail)
                const max_discount = profit / averagesaleretail * 100
                setMax_discount_percent(Math.round(max_discount) )
                const averagebonless = Number(averagesaleretail) / Number(boneless) 
                setAverage_net_boneless(averagebonless.toFixed(2))
                const averagenetsteak = Number(averagesaleretail) / Number(netsteaks) 
                setAverage_net_steaks(averagenetsteak.toFixed(2))


            }).catch((err) => { });
        }
    }





    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const handleChange = () => {
        get_min_max_rate()
        setChecked(!checked);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
        } else {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const tokenExpirationTimestamp = tokenData.exp * 1000;
            if (Date.now() >= tokenExpirationTimestamp) {
                localStorage.removeItem('token');
                navigate("/");
            } else {
                if (params.id) {
                    get_fish_data();
                    get_min_max_rate()
                }


            }
        }
    }, [params.id]);




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

                                    <CRow>
                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Local Name(s)</CFormLabel>
                                            <CFormInput
                                                onChange={handlelocalname}
                                                defaultValue={params.id ? Fish_Data.local_name : Local_name}
                                                type="text"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required

                                            />
                                            <CFormFeedback invalid>Please choose a Local Name(s).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">English Name(s)</CFormLabel>
                                            <CFormInput
                                                onChange={handleenglishname}
                                                defaultValue={params.id ? Fish_Data.english_name : English_name}
                                                type="text"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required

                                            />
                                            <CFormFeedback invalid>Please choose a English Name(s).</CFormFeedback>
                                        </CCol>
                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Bones</CFormLabel>
                                            <CFormSelect
                                                onChange={handleBones}
                                                value={Bones}
                                                type="text"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            >
                                                <option>Select</option>
                                                <option value='middle bone only'>Middle bone only</option>
                                                <option value='few bones'>Few bones</option>
                                                <option value='many bones'>Many bones</option>
                                            </CFormSelect>
                                            <CFormFeedback invalid>Please choose a Bones.</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div>
                                    <CRow>
                                    <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Steaks Per Kg (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handlenetsteak}
                                                defaultValue={params.id ? Fish_Data.net_steaks : Net_steaks}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Net Steaks Per Kg (Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Boneless Per Kg (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handlenetboneless}
                                                defaultValue={params.id ? Fish_Data.net_boneless : Net_boneless}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Net Boneless Per Kg (Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Net Head And Bones Per Kg (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handlenetheadbones}
                                                defaultValue={params.id ? Fish_Data.net_head_bones : Net_head_bones}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                            <CFormFeedback invalid>Please choose a Net Head And Bones Per Kg (Kg).</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div>
                                    <CRow>
                                        <CCol xs={12}>
                                            <InputSwitch checked={checked} onChange={handleChange} />
                                        </CCol>
                                        <CCol sm={4} lg={4}>


                                            <CFormLabel htmlFor="validationCustomUsername">Min Purchase Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handleminrate}
                                                value={Min_rate}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={checked != true}
                                            />
                                            <CFormFeedback invalid>Please choose a Min Purchase Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>
                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Max Purchase Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handlemaxrate}
                                                value={Max_rate}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={checked != true}
                                            />
                                            <CFormFeedback invalid>Please choose a Max Purchase Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Average Purchase Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handleaveragerate}
                                                value={Average_rate}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={checked != true}
                                            />
                                            <CFormFeedback invalid>Please choose a Average Purchase Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>
                                    </CRow>
                                </div>

                                <div>
                                    <CRow>
                                    <CCol sm={3} lg={3}>
                                            <CFormLabel htmlFor="validationCustomUsername">Avg Whole Fish Sale Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                value={Average_sale_retail}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose a Avg Whole Fish Sale Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>


                                    <CCol sm={3} lg={3}>
                                        
                                        <CFormLabel htmlFor="validationCustomUsername">Avg Profit (Rs / Kg)</CFormLabel>
                                        <CFormInput
                                            value={Profit}
                                            type="number"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            disabled
                                        />
                                        <CFormFeedback invalid>Please choose a Avg Profit (Rs / Kg).</CFormFeedback>
                                    </CCol>

                                        <CCol sm={3} lg={3}>
                                            <CFormLabel htmlFor="validationCustomUsername">Max Discount Percent (%)</CFormLabel>
                                            <CFormInput
                                                value={Max_discount_percent}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose a Max Discount Percent (%).</CFormFeedback>
                                        </CCol>



                                        <CCol sm={3} lg={3}>
                                            <CFormLabel htmlFor="validationCustomUsername">Overall Purchase Quantity (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handleoverallpurchacequantity}
                                                defaultValue={params.id ? Fish_Data.overall_purchase_quantity : Overall_purchace_quantity}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled={params.id ? params.id : ''}
                                            />
                                            <CFormFeedback invalid>Please choose a Overall Purchase Quantity (Kg).</CFormFeedback>
                                        </CCol>

                                    </CRow>
                                </div>
                                <div>
                                    <CRow>
                                    <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Avg Net Steaks Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                value={Average_net_steaks}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose a Avg Net Steaks Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Avg Net Boneless Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                value={Average_net_boneless}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose a Avg Net Boneless Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Avg Net Head And Bones Rate (Rs / Kg)</CFormLabel>
                                            <CFormInput
                                                value={Avg_head_bones}
                                                type="number"
                                                id="validationCustomUsername"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                disabled
                                            />
                                            <CFormFeedback invalid>Please choose a Average Net Avg Net Head And Bones Rate (Rs / Kg).</CFormFeedback>
                                        </CCol>
                                        
                                    </CRow>
                                </div>

                                <div >

                                    <CRow>
                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Minimum Size (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handleminimumsize}
                                                defaultValue={params.id ? Fish_Data.minimum_size : Minimum_size}
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
                                            <CFormFeedback invalid>Please choose a Minimum Size (Kg).</CFormFeedback>
                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Maximum Size (Kg)</CFormLabel>
                                            <CFormInput
                                                onChange={handlemaximumsize}
                                                defaultValue={params.id ? Fish_Data.maximum_size : Maximum_size}
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

                                            <CFormFeedback invalid>Please choose a valid Maximum Size (Kg).</CFormFeedback>

                                        </CCol>

                                        <CCol sm={4} lg={4}>
                                            <CFormLabel htmlFor="validationCustomUsername">Avg Size</CFormLabel>
                                            <CFormInput
                                                onChange={handleavgsize}
                                                defaultValue={params.id ? Fish_Data.avg_size : Avg_Size}
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

                                            <CFormFeedback invalid>Please choose a valid Maximum Size.</CFormFeedback>

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