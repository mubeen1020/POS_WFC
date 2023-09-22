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
import { customerAtom } from "src/_state/customerAtom";

function Customer_List() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [DataTableList, setDataTableList] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const setGlobatEvent = useSetRecoilState(globalEventAtom);
  const customer = useRecoilValue(customerAtom)

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="mb-3">
          <h4><strong>Customer</strong><span className="" style={{ float: "right" }}>
            <>
              <Link to="/Customer/customerList/customer">
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
    navigate(`/Customer/customerList/customerupdate/${clickedRowId}/`);
  }


  let delete_record = () => {
    let _data = selectedRows.map(i => i.id);
    let api = new CustomerService();
    _data.forEach((id) => {

      api.deleteCustomer(id)
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
    setGlobatEvent({ eventName: 'refreshCustomer', search })
  }

  const getcutomer = (customerIds) => {
    const filteredCustomers = DataTableList.filter(item => customerIds.care_of_ref == item.id);
    const customerNames = filteredCustomers.map(item => item.full_name);
    return customerNames;
  }

  const customer_all_data = (search = "") => {
    let api = new CustomerService;
    api.getCustomer(search).then((res) => {
      setDataTableList(res.data.customers);

    }).catch((err) => { });
  }

  useEffect(() => { get_data(); customer_all_data() }, [])

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
              value={customer}
              header={header}
              showGridlines
              responsiveLayout="scroll"
              size="small" paginator
              rowHover
              rows={10}
              rowsPerPageOptions={[10, 20, 50]}>
              <Column alignHeader={'center'} align="center" selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="full_name" header="Full Name" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="care_of_ref" header="Care of Refrence" body={getcutomer} sortable></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="care_of_name" header="Care of Name" sortable></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="phone_1" header="Phone 1" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="phone_2" header="Phone 2" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="phone_3" header="Phone 3" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="address" header="Address" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="area" header="Area" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="pin_location" header="Pin Location" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="distance" header="Distance" ></Column>
              <Column alignHeader={'center'} style={{ cursor: 'pointer' }} field="delivery_charges" header="Delivery Charges" ></Column>
            </DataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}
export default Customer_List;