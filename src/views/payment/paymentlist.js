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
import PaymentsService from "src/services/payment_services";
import CustomerService from "src/services/customer_services";
import PaymentmethodService from "src/services/paymentmethod_services";

function Payments_List() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [TableData,setTableData] = useState([])

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="mb-3">
                    <h4><strong>Payment</strong><span className="d-grid gap-2 d-md-block" style={{ float: "right" }}>
                        <>
                            <Link to="/Payment/PaymentList/Payment">
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
        navigate(`/Payment/PaymentList/Payment/Paymentupdate/${clickedRowId}/`);
    }


    let delete_record = () => {
        let _data = selectedRows.map(i => i.id);
        let api = new PaymentsService();
        _data.forEach((id) => {

            api.deletepayments(id)
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


    const get_data = (search='') => {
        const api = new PaymentsService;
    api.getpayments(search).then((res) => {
      if (Array.isArray(res.data)) {
        setTableData(res.data);
      } else {
        if (res.data && res.data.message === "payment not found.") {
          setTableData([]);
        } else {
          setTableData(res.data.payments);
        }
      }

    }).catch((err) => { });
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr.payment_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="customer" header="Customer" body={CustomerService.Customername} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_date" header="Payment Date" body={formatDate} sortable></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_amount" header="Payment Amount" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_method" body={PaymentmethodService.paymentmethodsname} header="Payment Method" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="recieving_staff" header="Recieving Staff" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="recieving_account" header="Recieving Account" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_balance" header="Payment Balance" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="payment_tip" header="Payment Tip" ></Column>
                            <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="tip_for_rider" header="Tip For Rider" ></Column>
                        </DataTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </>
    )
}
export default Payments_List;