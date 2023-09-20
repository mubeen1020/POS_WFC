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
import OrdersService from "src/services/order_services";
import { orderAtom } from "src/_state/orderAtom";
import PaymentmodeService from "src/services/paymentmode_services";
import PaymentstatusService from "src/services/paymentstatus_services";
import OrderStatusService from "src/services/orderstatus_services";

function Order_List() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const setGlobatEvent = useSetRecoilState(globalEventAtom);
    const order = useRecoilValue(orderAtom)

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Orders</strong><span className="" style={{ float: "right" }}>
                        <>
                            <Link to="/Order/OrderList/Order">
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
        navigate(`/Order/OrderList/Order/Orderupdate/${clickedRowId}/`);
    }


    let delete_record = () => {
        let _data = selectedRows.map(i => i.id);
        let api = new OrdersService();
        _data.forEach((id) => {

            api.deleteorders(id)
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
        setGlobatEvent({ eventName: 'refreshorder', search })
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr.order_date || dateStr.delivery_deadline );
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


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
                            value={order}
                            header={header}
                            showGridlines
                            responsiveLayout="scroll"
                            size="small" paginator
                            rowHover
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}>
                            <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="customer" header="Customer" body={CustomerService.Customername} ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_date" header="Order Date" body={formatDate} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="delivery_deadline" header="Delivery Deadline" body={formatDate} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_status" header="Order Status" body={OrderStatusService.orderStatusname}></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="delivery_charges" header="Delivery Charges" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="urgent_delivery_charges" header="Urgent Delivery Charges" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="order_total" header="Order Total" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_status" header="Payment Status" body={PaymentstatusService.paymentStatusname} ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_mode" header="Payment Mode" body={PaymentmodeService.paymentmodename} ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default Order_List;