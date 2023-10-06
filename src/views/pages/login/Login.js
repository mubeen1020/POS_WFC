import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import UsersService from 'src/services/user_services';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { Toast } from 'primereact/toast';
import '../../../scss/style.scss';

const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const postData = (event) => {
    event.preventDefault(); // Prevent form submission

    let formData = {
      email: email,
      password: password,
    };

    const api = new UsersService();
    api
      .loginUser(formData)
      .then((res) => {
        const token = res.data.token;
        if (token) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully logged in',
            life: 3000,
          });
          localStorage.setItem('token', token);
          setTimeout(() => {
            navigate('/home');
          }, [2000]);
        }
      })
      .catch((error) => {
        toast.current.show({
          severity: 'info',
          summary: 'Error',
          detail: `${error}`,
          life: 3000,
        });
       
      });
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Toast ref={toast} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard
                className="text-white bg-primary py-5 imagebg"
                style={{ width: '100%' }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h1>POINT OF SALE</h1>
                    <p>
                      Streamline your business operations with our cutting-edge
                      Point of Sale software. Boost efficiency, enhance customer
                      experiences, and drive growth – all with a simple and
                      intuitive solution
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3  "
                        active
                        tabIndex={-1}
                      >
                        <p className='button-86'>Register Now!</p>
                        
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={(event) => postData(event)}>
                    <h1 className='mt-5'>Login</h1>
                    <p className="text-medium-emphasis mb-5">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={handleEmail}
                        placeholder="Email"
                        autoComplete="email"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={handlePassword}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4 py-2">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
