import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import _nav from 'src/_nav';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CContainer, CButton, CCardTitle, CCardText
} from '@coreui/react'
import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";
import '../../scss/style.scss'
import CIcon from '@coreui/icons-react';
import { cilAsteriskCircle, cilBug, cilCart, cilColumns, cilCreditCard, cilHome, cilSettings, cilStorage, cilTask, cilUser } from '@coreui/icons';


const CommonHome = () => {
    const navigate = useNavigate();

    return (
        <>
            {/*     
    <CContainer style={{ "marginLeft": '0px'}} xxl>
      <CRow  >
          <CCol sm={12} lg={12} style={{textAlign:'center'}}>
            <CCard>
            <br/>
                <h1 > POINT OF SALE </h1>
                <br/>
                </CCard>
          </CCol>
        
      </CRow>
    </CContainer> */}

            <CContainer style={{ "min-height": "50vh", "marginLeft": '0px' }}>

                <CRow >
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'red', 'min-height': '30vh' }} color="success">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody >

                                            <CCardTitle style={{ width: 300 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilHome} customClassName="nav-icon" />
                                                &nbsp; Home
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}> View Home</CCardText>
                                            <Link to="/home">
                                                <CButton style={{ 'float': 'right' }} color="success" variant="outline"> Home <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'green', 'min-height': '30vh' }} color="danger">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 275 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilAsteriskCircle} customClassName="nav-icon" />
                                                &nbsp;
                                                Fish
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Fish</CCardText>
                                            <Link to="/Fish/FishList">
                                                <CButton style={{ 'float': 'right' }} color="danger" variant="outline"> Fish <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'min-height': '30vh' }} color="primary">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 316 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilColumns} customClassName="nav-icon" />
                                                &nbsp;
                                                Fish Pack
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Fish Pack  </CCardText>
                                            <Link to="/Fish/FishPackList">
                                                <CButton style={{ 'float': 'right' }} color="primary" variant="outline"> Fish Pack <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>



                </CRow>

                <CRow >
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'yellow', 'min-height': '30vh' }} color="warning">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody >

                                            <CCardTitle style={{ width: 300 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilUser} customClassName="nav-icon" />
                                                &nbsp; Customer
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}> View Customer</CCardText>
                                            <Link to="/Customer/customerList">
                                                <CButton style={{ 'float': 'right' }} color="warning" variant="outline"> Customer <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'pink', 'min-height': '30vh' }} color="info">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 275 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilTask} customClassName="nav-icon" />
                                                &nbsp;
                                                Order
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Order</CCardText>
                                            <Link to="/Order/OrderList">
                                                <CButton style={{ 'float': 'right' }} color="info" variant="outline"> Order <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'min-height': '30vh' }} color="dark">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 316 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilStorage} customClassName="nav-icon" />
                                                &nbsp;
                                                Order Stock Item
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Order Stock Item  </CCardText>
                                            <Link to="/Order/OrderStockItemsList">
                                                <CButton style={{ 'float': 'right' }} color="dark" variant="outline"> Order Stock Item <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>



                </CRow>

                <CRow >
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'yellow', 'min-height': '30vh' }} color="success">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody >

                                            <CCardTitle style={{ width: 300 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilCart} customClassName="nav-icon" />
                                                &nbsp; Order Purchase Item
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}> View Order Purchase Item</CCardText>
                                            <Link to="/Order/OrderPurchaseItemsList">
                                                <CButton style={{ 'float': 'right' }} color="success" variant="outline"> Order Purchase Item <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'background': 'pink', 'min-height': '30vh' }} color="danger">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 275 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilCreditCard} customClassName="nav-icon" />
                                                &nbsp;
                                                Payment
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Payment</CCardText>
                                            <Link to="/Payment/PaymentList">
                                                <CButton style={{ 'float': 'right' }} color="danger" variant="outline"> Payment <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'min-height': '30vh' }} color="primary">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 316 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilBug} customClassName="nav-icon" />
                                                &nbsp;
                                                Purchase Requirement
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Purchase Requirement  </CCardText>
                                            <Link to="/policydashboard">
                                                <CButton style={{ 'float': 'right' }} color="primary" variant="outline"> Purchase Requirement <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>



                </CRow>

                <CRow>
                    <CCol style={{ 'padding': '10px' }} sm={4} lg={4}>
                        <CCard style={{ 'min-height': '30vh' }} color="dark">
                            <span className='divcorner' style={{ 'min-height': '30vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 316 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilSettings} customClassName="nav-icon" />
                                                &nbsp;
                                                Settings
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' }}>View Settings  </CCardText>
                                            <Link to="/Settings">
                                                <CButton style={{ 'float': 'right' }} color="dark" variant="outline"> Settings <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>
                </CRow>

            </CContainer>

            <CContainer style={{ "min-height": "50vh" }} xxl>
            </CContainer>

        </>
    )
}

export default CommonHome
