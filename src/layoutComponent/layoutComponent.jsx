
import React, { useEffect, useRef, useState } from 'react';
import { Input, Layout } from 'antd';
import SiderMenuComponent from '../siderMenuComponent/siderMenuComponent';
import './layoutComponent.scss';
import { Outlet } from 'react-router-dom';
import { customerSetup, home, ItemSetUp, Reports, RulesSetup, ScanSetup, ValueMap, Vendor, userImage, csLogo ,dashboardInactive} from '../assests/images';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { activeCustomerSetup, activeItemSetup, activeRulesSetup, activeHome, activeVendor, activeScan, activeValue, activeObi, settingsIcon, activeSetting,activeDashboard } from '../assests/Active-Icons';
import { accountIcon, botIcon, helpIcon, logoutIcon, sender } from '../assests/icons';
import { changeNavigation,resetNavigation } from '../slices/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData } from '../slices/user';
import { Menu } from 'primereact/menu';
import {changeIsFilter} from '../slices/columnSelection';
import { Toast } from 'primereact/toast';
const { Content, Sider } = Layout;
const menuList = [
  {
    key: '1',
    icon: <img src={dashboardInactive} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeDashboard} alt="" className="img-icon-css" />,
    label: 'Dashboard',
    route: '/dashboard'
  },
  {
    key: '2',
    icon: <img src={home} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeHome} alt="" className="img-icon-css" />,
    label: 'Home',
    route: '/home'
  },
  {
    key: '3',
    icon: <img src={customerSetup} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeCustomerSetup} alt="" className="img-icon-css" />,
    label: 'Customer Setup',
    route: '/customerSetup'
  },
  {
    key: '4',
    icon: <img src={ItemSetUp} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeItemSetup} alt="" className="img-icon-css" />,
    label: 'Item Setup',
    route: '/itemSetup'
  },
  {
    key: '5',
    icon: <img src={Vendor} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeVendor} alt="" className="img-icon-css" />,
    label: 'Vendor Setup',
    route: '/vendorSetup'
  },
  {
    key: '6',
    icon: <img src={RulesSetup} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeRulesSetup} alt="" className="img-icon-css" />,
    label: 'Rules Setup',
    route: '/rulesSetup'
  },
  {
    key: '7',
    icon: <img src={ScanSetup} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeScan} alt="" className="img-icon-css" />,
    label: 'Scan Setup',
    route: '/scanSetup'
  },
  {
    key: '8',
    icon: <img src={ValueMap} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeValue} alt="" className="img-icon-css" />,
    label: 'Value Map',
    route: '/valueMap'
  },
  {
    key: '9',
    icon: <img src={Reports} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeObi} alt="" className="img-icon-css" />,
    label: 'OBI Reports',
     route: '/reports'
  },
  {
    key: '10',
    icon: <img src={settingsIcon} alt="" className="img-icon-css" />,
    activeIcon: <img src={activeSetting} alt="" className="img-icon-css" />,
    label: 'Settings',
    route: '/settings'
  },
  // {
  //   key: '10',
  //   icon: <img src={settingsIcon} alt="" style={{ height: '20px' }} />,
  //   activeIcon: <img src={activeDivision} alt="" style={{ height: '20px' }} />,
  //   label: 'Division',
  //   route: '/division'
  // },

];
const LayoutComponent = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const location = useLocation();
  const routeObj = menuList.find(item => item?.route === location.pathname);
  const userObject = useSelector(state => state?.user?.userData)
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const navObj = useSelector((state) => state.navigation);
  useEffect(() => {
    dispatch(changeNavigation({ navigation: routeObj?.route }));
  }, [routeObj]);
    const toast = useRef(null);
    const [activeMenu, setActiveMenu] = useState(routeObj);
  useEffect(() => {
    const handleInterceptorEvent = (event) => {
        const  detail  = event?.detail?.statusCode; 
        const msg = event?.detail?.statusMessage
        const responseStatus= event?.detail?.responseFlag
        const errorMessages = {
            TIMEOUT: "Request timed out. Please check your connection.",
            NETWORK_ERROR: "A network error occurred. Please try again later.",
            FETCH_ERROR: "A network error occurred. Please try again later or please connect VPN", 
            SOCKET_CONNECTION_ERROR: "Failed to connect to the server. Please check your network or server status.",
            SOCKET_DISCONNECT: "The connection to the server was lost. Reconnecting...",
            SOCKET_TIMEOUT: "Socket request timed out. Please try again.",
            SOCKET_ERROR: "A socket error occurred. Please try again later.",
            400: "Bad request. Please check your input and try again.",
            401: "Unauthorized access. Please log in again.",
            403: "You don't have permission to perform this action.",
            404: "The requested resource was not found.",
            500: "Internal server error. Please try again later.",
            502: "Bad gateway. The server is temporarily unavailable.",
            503: "Service unavailable. Please try again later.",
            504: "Gateway timeout. Please try again later.",
        };
        if (detail === "FETCH_ERROR") {
            toast.current.show({
                severity: "error", 
                summary: "ERROR",
                detail: errorMessages[detail],
            });
            return; 
        }else if(detail === "TIMEOUT"){
          toast.current.show({
              severity: "error",
              summary: "ERROR",
              detail: errorMessages[detail],
          });
        }
        // Check for other errors or success statuses
        if (msg && detail) {  
            toast.current.show({
                severity: responseStatus !== false ? "info" : "error", 
                summary: responseStatus !== false ? "Success" : "Error",
                detail: msg,
            });
        }
    };
    // Attach event listener
    window.addEventListener('interceptorEvent', handleInterceptorEvent);
    // Clean up listener on component unmount
    return () => {
        window.removeEventListener('interceptorEvent', handleInterceptorEvent);
    };
}, []);
//  useEffect(() => {
//         const handleInterceptorEvent = (event) => {
          
//             if (event.detail === "PARSING_ERROR" || event.detail === "FETCH_ERROR") {
//                 toast.current.show({
//                     severity: 'error',
//                     summary: 'Error',
//                     detail: "Request Timed Out",
//                 });
//             }
//             if (event.detail === "NETWORK_ERROR") {
//                 toast.current.show({
//                     severity: 'error',
//                     summary: 'Error',
//                     detail: "Network error occured",
//                 });
//             }
//         };

//         window.addEventListener('interceptorEvent', handleInterceptorEvent);

//         return () => {
//         window.removeEventListener('interceptorEvent', handleInterceptorEvent);
//         };
//     }, [routeObj,activeMenu]);

  const navigate = useNavigate();
  const changeMenu = (item) => {
        dispatch(resetNavigation());
    setActiveMenu(item);
    navigate(item.route);
    dispatch(changeNavigation({ navigation: item.route }));
     if (item?.label !== navObj?.PARENT_MODULE?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (char) => char.toUpperCase())) {
       dispatch(changeIsFilter({filterState:null,queryString:null,jsonData:null}))
     }
  }
  useEffect(() =>{
    const routeObj = menuList.find(item => item?.route === location.pathname);
    dispatch(changeNavigation({ navigation: routeObj.route }));
    setActiveMenu(routeObj);
  },[location])
  const showChat = () => {
    setIsChatVisible(!isChatVisible); 
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  /**
      @remarks Function to handle user chat section
      @author Raja
      */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (inputValue.trim() !== '') {
        setMessages([...messages, inputValue]);
        setInputValue('');
      }
    }
  };
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(clearUserData())
    navigate('/login')
  };
  const menu = useRef(null);
  const items = [
    {
      label: 'Kevin Williams',
      template: () => (
        <div className="d-flex p-2 gap-2">
          <img src={userImage} alt='user' width={50} height={50} />
          <div>
            <div className='list-menu'>{userObject[0]?.userName}</div>
            <small className='list-menu' style={{ fontSize: '12px', color: '#909090' }}>Admin</small>
          </div>
        </div>
      ),
    },
    { separator: true },
    {
      label: 'Account',
      template: () => (
        <div className="p-d-flex p-ai-center ps-3 p-2">
          <img
            src={accountIcon}
            alt="Account"
            className="me-2"
          />
          <span className='list-menu'>Account</span>
        </div>
      )
    },
    {
      label: 'Help',
      template: () => (
        <div className="p-d-flex p-ai-center ps-3 p-2">
          <img
            src={helpIcon}
            alt="help"
            className="me-2"

          />
          <span className='list-menu'>Help</span>
        </div>
      )
    },
    { separator: true },
    {
      label: 'Log out',
      template: () => (
        <div className="p-d-flex p-ai-center ps-3 p-2">
          <img
            src={logoutIcon}
            alt="logout"
            className="me-2"
            onClick={handleLogout}
          />
          <span className='list-menu' style={{ color: '#D31510' }} onClick={handleLogout}>Logout</span>
        </div>
      )
    }
  ];
  return (
    <Layout hasSider style={{ height: '100vh' }}>
             <Toast ref={toast} />
      
      <Sider className='layoutSider'>
        <div className='p-2 pt-3' style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center'
        }}><img src={csLogo} className='sideMenuLogo' alt="ArkatissLogo" />
          <p className='logoText pt-2'>Reclamation</p>
        </div>
        <div className="demo-logo-vertical" />
        <SiderMenuComponent menus={menuList} activeMenu={activeMenu} changeMenu={changeMenu} />
        <div className="d-flex gap-1  flex-column user-profile mt-3 pointer"  onClick={handleLogout}>     
          {/* <img src={userImage} className='pointer' alt="User-Image.png" onClick={(e) => menu.current.toggle(e)} />
          <Menu model={items} popup ref={menu} /> */}
            <i className="pi pi-sign-out" style={{'color': 'white'}}></i>
          <span
            className="list-menu"
            style={{ color: "white" }}
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
      </Sider>
      <Layout>
        <Content className='content pt-4 pb-1 ps-5 pe-5'
        >
          <div>
            <Outlet />
          </div>
          {/* {activeMenu?.label !== 'Home' &&
            <div>
              {!isChatVisible && (
                <span className='chat-bot-icon pointer' onClick={showChat}><img src={botIcon} alt="chat-bot" width={38} height={38} /></span>
              )}
            </div>
          } */}
          {isChatVisible && (
            <div className="chat-section">
              <div className='mini-chat-card'>
                <div className='mini-chat-header'>
                  <span>Reclamation Bot</span>
                  <i className='pi pi-times pointer' onClick={showChat}></i>
                </div>
                <div className='mini-chat-content'>
                  <span className='system-chat d-flex justify-content-start align-items-end'>
                    <span className='bot-img-icon me-2'>
                      <img src={botIcon} alt='bot' width={24} height={24} />
                    </span>
                    <span className='system-chat-section'>Hi I’m Reclamation virtual assistance, how can i help you today !</span>
                  </span>
                  {messages.map((msg, index) => (
                    <>
                      <span className='user-chat d-flex justify-content-end align-items-end'>
                        <span key={index} className='user-chat-section'>{msg}</span><img src={userImage} alt='bot' className='ms-2' width={32} height={32} />
                      </span>
                    </>
                  ))}
                </div>
                <div className='mini-chat-footer'>
                  <span className='mini-chat-input'>
                    <Input placeholder='Ask me anything' className='inputField' onChange={handleInputChange} value={inputValue} onKeyPress={handleKeyPress} />
                    <span className='bot-img-icon ms-2'>
                      <img src={sender} alt='sender' width={20} height={16} className='pointer' onClick={handleKeyPress} />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutComponent;