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
import CustomerService from "src/services/customer_services";
import '../../scss/style.scss';
import { cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Toast } from 'primereact/toast';
import { globalEventAtom } from "src/_state/globalEventAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fishAtom } from "src/_state/fishAtom";
import FishService from "src/services/fish_services";

function Fish_List() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const setGlobatEvent = useSetRecoilState(globalEventAtom);
    const fish = useRecoilValue(fishAtom)

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Fish</strong><span className="" style={{ float: "right" }}>
                        <>
                            <Link to="/Fish/FishList/Fish">
                                <CButton style={{ float: 'right', width: 100, padding: 10 }} color="primary" type="submit">
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
                    <InputText onChange={onGlobalFilterChange} value={globalFilterValue} placeholder="Keyword Search" />
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


    const get_data = (search) => {
        setGlobatEvent({ eventName: 'refreshfish', search })
    }




    useEffect(() => { get_data(); }, [])

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
                            value={fish}
                            header={header}
                            showGridlines
                            responsiveLayout="scroll"
                            size="small" paginator
                            rowHover
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}>
                            <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="local_name" header="Local Name" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="english_name" header="English Name" sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="minimum_size" header="Minimum Size" sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="maximum_size" header="Maximum Size" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="net_steaks" header="Net Steaks" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="net_boneless" header="Net Boneless" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="bones" header="Bones" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="min_rate" header="Min Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="max_rate" header="Max Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="average_rate" header="Average Rate" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="overall_purchase_quantity" header="Overall Purchase Quantity" ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default Fish_List;