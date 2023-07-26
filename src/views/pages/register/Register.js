import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
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
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/primereact.min.css'; 
import 'primereact/resources/themes/saga-blue/theme.css'; 
import { Toast } from 'primereact/toast';

const Register = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };



  const postData = () => {
    let formData = {
      username: username,
      email: email,
      password: password,
    };

    const api = new UsersService();
    api.createUser(formData)
      .then((res) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'You have successfully signed up', life: 3000 });
        setTimeout(()=>{
          navigate('/');
        },[2000])
        
      })
      .catch((error) => {
        toast.current.show({ severity: 'info', summary: 'Error', detail: 'Invalid user', life: 3000 });
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
      <Toast ref={toast} />
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={postData}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput onChange={handleUsername} placeholder="Username" autoComplete="username" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput onChange={handleEmail} placeholder="Email" autoComplete="email" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      onChange={handlePassword}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      required
                    />
                  </CInputGroup>
                  {/* <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup> */}
                  <div className="d-grid">
                    <CButton type='button' color="success" onClick={postData}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register;
