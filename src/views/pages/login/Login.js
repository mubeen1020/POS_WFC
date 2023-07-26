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





const Login = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleemail = (e) => {
    setEmail(e.target.value);
  };

  const handlepassword = (e) => {
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
          setTimeout(()=>{
            navigate('/home'); 
          },[2000])
        
        }
      })
      .catch((error) => {
        toast.current.show({
          severity: 'info',
          summary: 'Error',
          detail: `${error}`,
          life: 3000,
        });
        console.log('error: ', error);
      });
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Toast ref={toast} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={(event) => postData(event)}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput onChange={handleemail} placeholder="email" autoComplete="email" required/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={handlepassword}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
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
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
