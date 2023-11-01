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
import { cilPlus, cilSend, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Toast } from 'primereact/toast';
import FishService from "src/services/fish_services";
import OrderpurchaseitemService from "src/services/orderpurchaseitem_services";
import FishCutsService from "src/services/fishcut_services";
import { useSetRecoilState } from "recoil";
import { globalEventAtom } from "src/_state/globalEventAtom";
import OrderitemsService from "src/services/orderstockitem_services";

function Order_purchase_item_List() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [TableData, setTableData] = useState([])
    const setGlobatEvent = useSetRecoilState(globalEventAtom)


    const orderstockitemDataSubmit = (event) => {
        const selectedData = selectedRows.map((item) => ({
            order_id: 0,
            fish_pack_ref: 0,
            total_packs_ordered: 0,
            fish_weight: item.fish_weight,
            meat_weight: item.meat_weight,
            fish_rate: 0,
            meat_rate: 0,
            skin: 0,
            kante: 0,
            pack_price: 0,
            item_discount_absolute: 0,
            item_discount_percent: 0,
        }));

        if (selectedData.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one row to convert.',
                life: 3000,
            });
            return;
        }

        const api = new OrderitemsService();
        api
            .createorderitems(selectedData)
            .then((res) => {
                const orderItem = res.data.orderItem;
                delete_record()
                toast.current.show({
                    severity: 'success',
                    summary: 'Data Submitted',
                    detail: 'Your Order Stock Item information has been successfully submitted and recorded.',
                    life: 3000,
                });


            })
            .catch((error) => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: `Validation failed. Please check your input.`,
                    life: 3000,
                });
            });
    };



    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Order Purchase Item</strong><span className="d-grid gap-2 d-md-block" style={{ float: "right" }}>
                        <>
                            <Link to="/Order/OrderPurchaseItemsList/OrderItems">
                                <CButton style={{ float: 'right', width: 100, padding: 10, marginRight: 5 }} color="primary" type="submit">
                                    <CIcon icon={cilPlus} className="mr-1" />  Add
                                </CButton>
                            </Link>
                            <CButton onClick={handleDelete} style={{ width: 100, padding: 10, marginRight: 5 }}>
                                <CIcon icon={cilTrash} className="mr-2" />Delete
                            </CButton>
                            <CButton onClick={orderstockitemDataSubmit} style={{ width: 100, padding: 10, marginRight: 5 }}>
                                <CIcon icon={cilSend} className="mr-2" />Convert
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
        navigate(`/Order/OrderPurchaseItemsList/OrderPurchaseItems/OrderPurchaseItemsupdate/${clickedRowId}/`);
    }


    let delete_record = () => {
        let _data = selectedRows.map(i => i.id);
        let api = new OrderpurchaseitemService();
        _data.forEach((id) => {

            api.deleteorderpurchaseitem(id)
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
        setGlobatEvent({ eventName: 'refreshorderpurchaseitem' });
        const api = new OrderpurchaseitemService;
        api.getorderpurchaseitem(search).then((res) => {
            if (Array.isArray(res.data)) {
                setTableData(res.data);
            } else {
                if (res.data && res.data.message === "order purchase item not found.") {
                    setTableData([]);
                } else {
                    setTableData(res.data);
                }
            }

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
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_ref" header="Fish Refrence" body={FishService.Fishname} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_cut" header="Fish Cut" body={FishCutsService.Fishcutname} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="fish_weight" header="Fish Weight" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="meat_weight" header="Meat Weight" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="preferred_fish_size" header="Preferred Fish Size" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="other_instructions" header="Other Instructions" ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default Order_purchase_item_List;