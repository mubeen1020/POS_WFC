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
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import FishService from "src/services/fish_services";
import { orderpurchaseitemAtom } from "src/_state/orderpurchaseitemAtom";
import OrderpurchaseitemService from "src/services/orderpurchaseitem_services";
import FishCutsService from "src/services/fishcut_services";

function PurchaseRequirement() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [Datatable, setDatatable] = useState([]);

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Purchase Requirement</strong><span className="" style={{ float: "right" }}>
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


    const header = renderHeader();


    const get_data = (search = '') => {
        const api = new OrderpurchaseitemService();
        api.getfishrefandfishcut(search)
            .then((res) => {
                const filteredData = res.data.filter((item) =>  item.is_active === 0);
                if (Array.isArray(filteredData)) {
                    setDatatable(filteredData);
                } else {
                    if (filteredData && filteredData.message === "order purchase item not found.") {
                        setDatatable([]);
                    } else {
                        setDatatable(filteredData);
                    }
                }
            })
            .catch((err) => { });
    };

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
                            value={Datatable}
                            header={header}
                            showGridlines
                            responsiveLayout="scroll"
                            size="small" paginator
                            rowHover
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_ref" header="Fish Refrence" body={FishService.Fishname} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_cut" header="Fish Cut" body={FishCutsService.Fishcutname} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_weight" header="Fish Weight (Kg)" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="meat_weight" header="Meat Weight (Kg)" ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default PurchaseRequirement;