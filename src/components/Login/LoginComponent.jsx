import React, { useEffect, useRef, useState } from 'react';
import { Logo } from '../../assests/images';
import { useGetLoginDataMutation, useGetUserDivisionsMutation,useCheckLoginMutation,useGetAuthorizedLoginMutation } from '../../services/login'
import { Form, Input,Spin  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginBg } from '../../assests/icons';
import { setUserData } from '../../slices/user';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import * as CryptoJS from 'crypto-js';

const LoginComponent = (props) => {
  const [getLoginDetails, { data, isSuccess, isLoading, isFetching, error }] = useGetLoginDataMutation();
 
    const [checkLogin, {}] =useCheckLoginMutation();
    const [getAuthorizedLogin, {}] = useGetAuthorizedLoginMutation();
 const [getDivsionData,{}]= useGetUserDivisionsMutation()
  const [loginForm] = Form.useForm();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const toast = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleLoginClick = async (values) => {
    const formData = new FormData();
    formData.append('channel', 'Desktop');
    formData.append('application', 'reclamation');
    formData.append('userid', values?.username);
    formData.append('password', values?.password);
    setLoading(true);
    try {
      const result = await getLoginDetails(formData).unwrap();
    } catch (e) {
      setLoginError('Login failed. Please try again.');
    }
  };
  /** @remarks  Function to enter value in input */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginForm
        .validateFields(['username'])
        .then((values) => {
          setShowPassword(true)
        })
        .catch((errorInfo) => {});
    } else {
      loginForm
        .validateFields(['username'])
        .then((values) => {
          setShowPassword(true)
        })
        .catch((errorInfo) => {});
    }
  };


  useEffect(() => {
    // const sessionValue = sessionStorage.getItem('isValidate')
    // if(sessionValue === null) {
    //   if (window.location.href.includes('code')) {
    //     const urlObj = new URL(window.location.href);
    //     const code = urlObj.searchParams.get("code");
    //     const params = {
    //       code_verifier: sessionStorage.getItem('codeVerifier'),
    //       authorization_code: code
    //     }
    //     sessionStorage.setItem('isValidate', 'validate')
    //     getSessionData(params, 'verified')
        
    //   } else {
    //     const params = {
    //       code_challenge: generateCodeVerifier(128),
    //       reset: true,
    //     }
    //     getSessionData(params, 'firstCall');
    //   }
    // }
    

    if (isSuccess && data) {
      if (data[0]?.Status === "Failed") {
        sessionStorage.clear();
        setLoading(false); 
        setLoginError(data.message || 'An unknown error occurred');
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: data[0]?.Message,
        });
      } else {
        
        getUserDivisions(data);
      }
    }
  }, [isSuccess, data]);

  const handleLogin = async (values) => {
    setLoading(true);
    const payload = {
      username: values?.username + "@carbon.super",
      password: values?.password,
    };
  


    try {
      const result = await checkLogin(payload).unwrap();
      
      if(result){
        AuthorizedLogin(result.token,values);
      }

    } catch (e) {

      setLoading(false);
      sessionStorage.clear();
      console.error("Error during login:", e);
      if (e?.status === 400 || e?.data?.res_status === false) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: e?.data?.description || `Please check User Name and Password`,
        });
      }
   //   setLoginError("Login failed. Please try again.");
    }
  };

  const AuthorizedLogin = async (token,userObj) => {


    let payLoad = new URLSearchParams();
    payLoad.append("grant_type", "client_credentials"); //


    try {
      const result = await getAuthorizedLogin(payLoad).unwrap();
      
      if(result){
      
        let loginData = {loginTime: new Date().toLocaleString(),email:userObj?.username,userName:userObj?.username?.split('@')[0],...result,appName:"RECLAMATION",roleList:["RECLAMATION_ADMIN"]};
        sessionStorage.setItem("userData", JSON.stringify([loginData]));
        dispatch(setUserData([loginData]));
        
        getUserDivisions([loginData])
        
      }
    
      // let userData = sessionStorage.getItem("userData");
      // userData = JSON.parse(userData);
    
      // userData = { ...userData[0], accessToken: result };
      // //dispatch(getAccessToken(userData))
      // dispatch(setUserData(userData));
      // sessionStorage.setItem("userData", JSON.stringify(userData));
      // setTimeout(()=>{
      //   handleCheckAndInsertUsers(userDetails);
      // },1000
      // )
     
      // handleCheckFetchEmail(userDetails)
    
     
    } catch (e) {
      setLoading(false);
      
      sessionStorage.clear();
      console.error("Error during login:", e);
    //  setLoginError("Login failed. Please try again.");
     // setLoading(false);
    }
  };
  const decodeToken = (token) => {
    if (!token) return null; // Return null or handle error

    const _decodeToken = (tokenPart) => {
      try {
        return JSON.parse(atob(tokenPart));
      } catch {
        return null;
      }
    };

    return token
      .split(".")
      .map(_decodeToken)
      .reduce((acc, curr) => {
        if (curr) acc = { ...acc, ...curr };
        return acc;
      }, {});
  };
  const getUserDivisions = async (body) => {
    
    try {   
      let res = await getDivsionData({email:body[0]?.email, DIVISION: 1}).unwrap();
      
      if (res?.res_status && res.status_code === 200) {
        setLoading(false); 
        const userData = [{...body[0],divisionData:res?.result_set}];
        sessionStorage.setItem('userData', JSON.stringify(userData));
        dispatch(setUserData(userData));
        navigate('/home');
        setLoginError(null);  
      }else if(res.status_code === 201 && res?.res_status === false) {
        setLoading(false); 
        sessionStorage.clear();
        setLoginError('User Status is Inactive.');
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: res?.msg
        });
        // if(res?.hasOwnProperty('user_div_data')){
        // const userData = [{...body[0],divisionData:[{ROLE:['User'],SCREEN_MENU:[],DIVISION_ID:1,DIVISION_NAME: "C&S"}]}];
        // sessionStorage.setItem('userData', JSON.stringify(userData));
        // dispatch(setUserData(userData));
        // navigate('/home');
        // setLoginError(null);  
        // }else{
        // setLoading(false); 
        // sessionStorage.clear();
        // setLoginError('Application Role not assigned.');
        // toast.current.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Application Role not assigned.',
        // });
        // }
       

      } 
      
      else {
        
        //navigate('/home');
        sessionStorage.clear();
        setLoading(false); 
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: res?.msg,
        });
      }
    } catch (error) {
       sessionStorage.clear();
        setLoading(false); 
      //navigate('/home');
      //sessionStorage.clear();
      //setLoading(false); 
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.msg || 'User is inactive. Please contact the administrator.',
      });
    }
  };
  
  const backgroundImageStyle = {
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh'
  };

   const handlePaste = (e) => {
    e.preventDefault(); // Prevent pasting
    loginForm.setFields([
      {
        name: "password",
        errors: ["Pasting is not allowed in the password field."],
      },
    ]);
  };
  return (
    <><section className="h-100 gradient-form" >
      <Toast ref={toast}></Toast>
      <div className="container-fluid" style={backgroundImageStyle}>
        <div className="row d-flex justify-content-center align-items-center h-100">
         <div className="card login-card p-5 pt-4 pb-4" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
            <div className="text-center">
              <img src={Logo}
                style={{ width: '30%' }} alt="logo" />
              <h6 className="h4 mt-2 font-weight-normal text-white">Sign in to Reclamation</h6>
            </div>
            <Form onFinish={handleLogin} form={loginForm} className='mt-4' layout="vertical" requiredMark={false}>
              <div data-mdb-input-init className="form-outline mb-4 ">
                <Form.Item
                  name="username"
                  label={<span className='text-white'>Username <span style={{ color: 'red' }}>*</span></span>}
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input
                    onKeyPress={handleKeyPress}
                    prefix={<i className='pi pi-user'></i>}
                    suffix={
                      <i className='pi pi-arrow-right right-arrow-icon pointer' onClick={handleKeyPress}></i>
                    }
                    placeholder=" Enter username"
                  />
                </Form.Item>
              </div>

              <div data-mdb-input-init className={`form-outline mb-4 password-field ${showPassword ? 'animate-show' : ''}`}>
                <Form.Item
                  label={<span className='text-white'>Password <span style={{ color: 'red' }}>*</span></span>}
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input type='password' prefix={<i className='pi pi-lock'></i>} placeholder=" Enter password" 
                  onPaste={handlePaste}/>
                </Form.Item>
              </div>
              {
                showPassword && (
                  <div className="d-flex justify-content-center">
                    <button className="primary-button" type='submit' disabled={loading}>
                    {loading ? <span className='d-flex gap-2'>
                      Login
                      <Spin size="Big" />
                    </span>   : 'Login'}
                      
                      
                      </button><br />
                    {/* <a className="text-muted" href="#!">Forgot password?</a> */}
                  </div>
                )
              }


              {/* <div className="d-flex align-items-center justify-content-center pb-4">
              <p className="mb-0 me-2">Don't have an account?</p>
              <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-danger">Create new</button>
            </div> */}

            </Form>

          </div>
        </div>
      </div>
    </section>
    </>
  )
}
export default LoginComponent;