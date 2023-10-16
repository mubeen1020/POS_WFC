import { React, useEffect, useState, useRef } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
} from '@coreui/react'
import {
    BrowserRouter as Router,
    Link,
    useNavigate

} from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import '../../scss/style.scss';
import { cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Toast } from 'primereact/toast';
import FishService from "src/services/fish_services";
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useSetRecoilState } from "recoil";

function Fish_List() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [TableData, setTableData] = useState([])
    const setGlobatEvent = useSetRecoilState(globalEventAtom)

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Fish</strong><span className="d-grid gap-2 d-md-block" style={{ float: "right" }}>
                        <>
                            <Link to="/Fish/FishList/Fish">
                                <CButton style={{ float: 'right', width: 100, padding: 10, marginRight: 5 }} color="primary" type="submit">
                                    <CIcon icon={cilPlus} className="mr-1" />  Add
                                </CButton>
                            </Link>
                            <CButton onClick={handleDelete} style={{ width: 100, padding: 10, marginRight: 5 }}>
                                <CIcon icon={cilTrash} className="mr-2" />Delete
                            </CButton>

                        </>
                    </span></h4>
                </span>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText onChange={onGlobalFilterChange} value={globalFilterValue} style={{ width: 170, marginTop: 10 }} placeholder="Keyword Search" />
                </span>

            </div>
        )
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        get_data(value);
    }

    const handleClick = (event) => {
        const clickedRowData = event.data;
        const clickedRowId = clickedRowData.id;
        navigate(`/Fish/FishList/Fish/fishupdate/${clickedRowId}/`);
    }


    let delete_record = () => {
        let _data = selectedRows.map(i => i.id);
        let api = new FishService();
        _data.forEach((id) => {

            api.deletefish(id)
                .then((res) => {
                    get_data();
                    toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Deleted Successfully' });
                })
                .catch((err) => { })
        });
    };

    const handleDelete = () => {
        if (selectedRows.length > 0) {
            confirmDialog({
                message: 'Are you sure you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: delete_record,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select the row that says to Delete' });
        }
    };

    const header = renderHeader();


    const get_data = (search = '') => {
        setGlobatEvent({ eventName: 'refreshfish' });
        const api = new FishService();
        api.getfishsettings(search)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setTableData(res.data);
                } else {
                    if (res.data && res.data.message === "fish item not found.") {
                        setTableData([]);
                    } else {
                        setTableData(res.data.list);
                    }
                }
            })
            .catch((err) => { });

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
        get_data();
    }, [])

    return (
        <>
            <CCol xs={12} className="mb-4">
                <ConfirmDialog />
                <Toast ref={toast} />
                <CCard className="mb-4">
                    <CCardBody>
                        <DataTable
                            className="responsive-table"
                            selectionMode={'checkbox'}
                            selection={selectedRows}
                            onSelectionChange={(e) => { setSelectedRows(e.value); }}
                            onRowDoubleClick={(e) => { handleClick(e) }}
                            value={TableData}
                            header={header}
                            showGridlines
                            responsiveLayout="scroll"
                            size="small" paginator
                            rowHover
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}>
                            <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_no" header="Fish No" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="local_name" header="Local Name" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="english_name" header="English Name" sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="min_purchase_rate" header="Min Purchase Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="max_purchase_rate" header="Max Purchase Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="average_purchase_rate" header="Avg Whole Fish Sale Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="half_service_charges" header="Half Service Charges" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="full_service_charges" header="Full Service Charges" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="miniumum_order_weight" header="Miniumum Order Weight" ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default Fish_List;