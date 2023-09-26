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
    useEffect(()=>{
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
    },[])

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

            <CContainer style={{ minHeight: "50vh", "marginLeft": '0px' }}>

                <CRow >
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'red', minHeight: '25vh' }} color="success">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="success" variant="outline"> Home <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'green', minHeight: '25vh' }} color="danger">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="danger" variant="outline"> Fish <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ minHeight: '25vh' }} color="primary">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="primary" variant="outline"> Fish Pack <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'yellow', minHeight: '25vh' }} color="warning">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="warning" variant="outline"> Customer <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                </CRow>

                <CRow >
                   
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'pink', minHeight: '25vh' }} color="info">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="info" variant="outline"> Order <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>


                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ minHeight: '25vh' }} color="dark">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 316 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilStorage} customClassName="nav-icon" />
                                                &nbsp;
                                                Order Stock Item
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px' ,width:'200px' }}>View Order Stock Item  </CCardText>
                                            <Link to="/Order/OrderStockItemsList">
                                                <CButton style={{ 'float': 'left'  ,width:'170px'}} color="dark" variant="outline"> Order Stock Item <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>

                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'yellow', minHeight: '25vh' }} color="success">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody >

                                            <CCardTitle style={{ width: 300 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilCart} customClassName="nav-icon" />
                                                &nbsp; Order Purchase Item
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px',width:'200px' }}> View Order Purchase Item</CCardText>
                                            <Link to="/Order/OrderPurchaseItemsList">
                                                <CButton style={{ 'float': 'left' ,width:'200px'}} color="success" variant="outline"> Order Purchase Item <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ 'background': 'pink', minHeight: '25vh' }} color="danger">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="danger" variant="outline"> Payment <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>
                    </CCol>

                </CRow>

                <CRow >
                   


                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ minHeight: '25vh' }} color="primary">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
                                <CRow className="g-0">

                                    <CCol md={8}>
                                        <CCardBody>
                                            <CCardTitle style={{ width: 250 }}>
                                                <CIcon style={{ height: '30px', width: '30px' }} icon={cilBug} customClassName="nav-icon" />
                                                &nbsp;
                                                Purchase Requirement
                                            </CCardTitle>
                                            <hr></hr>
                                            <CCardText style={{ 'minHeight': '20px',width:'250px' }}>View Purchase Requirement  </CCardText>
                                            <Link to="/Purchaserequirement">
                                                <CButton style={{ 'float': 'left',width:'220px' }} color="primary" variant="outline"> Purchase Requirement <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>
                    <CCol style={{ 'padding': '10px' }} sm={3} lg={3}>
                        <CCard style={{ minHeight: '25vh' }} color="dark">
                            <span className='divcorner' style={{ minHeight: '25vh', 'margin': '-2px' }}>
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
                                                <CButton style={{ 'float': 'left' }} color="dark" variant="outline"> Settings <i className="pi pi-angle-right" style={{ fontSize: '1rem' }}></i></CButton>
                                            </Link>
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </span>
                        </CCard>

                    </CCol>


                </CRow>

               

            </CContainer>

            <CContainer style={{ minHeight: "50vh" }} xxl>
            </CContainer>

        </>
    )
}

export default CommonHome
