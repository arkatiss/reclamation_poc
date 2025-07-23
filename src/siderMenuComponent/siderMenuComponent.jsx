import React, { useEffect, useState } from 'react'
import './siderMenuComponent.scss';
import { useSelector } from 'react-redux';
import { configPromise } from '../services/config';

const config = await configPromise;

const SiderMenuComponent = (props) => {
  const userObject = useSelector(state => state?.user?.userData);
      const division = useSelector((state) => state.division);
     const [isAdmin, setIsAdmin] = useState(true);

     const [filteredMenuList,setFilteredMenuList]= useState([])

      useEffect(() => {
        setFilteredMenuList(props?.menus)
  if (division && userObject) {
    
     const divisionData = userObject[0]?.divisionData?.find(
      (item) => String(item?.DIVISION_ID) === String(division?.id)
    );
    if(userObject[0]?.divisionData && userObject[0]?.divisionData[0]?.ROLE?.length > 0){
      setIsAdmin(true);

    }else {
      setIsAdmin(false);
    }

    if (divisionData) {
      const role = divisionData?.ROLE?.join(", ");
      
      if (role === 'IS Admin' || role === 'Admin') {
     //   setIsAdmin(true);
        setFilteredMenuList(props?.menus);
      } else {
     //   setIsAdmin(false);
        setFilteredMenuList(
          props?.menus?.filter((item) => item.label !== 'Settings' && item.label !== 'Dashboard')
        );
      }
    }
  } 
}, [division, userObject,props?.menus]);
const changeMenu = (item) =>{
  
 sessionStorage.removeItem('storeFilter');
  if(item.label === 'Dashboard'){
    
 const dashboardUrl =  process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_DASHBOARD_URL : config.DASHBOARD_URL;
 window.open(dashboardUrl, "_blank");
  }else if (item.label === 'OBI Reports'){
    
    const reportsUrl =  process.env.NODE_ENV === 'development' ? process.env.REACT_APP_REPORTS_URL : config.REPORTS_URL;
    window.open(reportsUrl, "_blank");
  }
  //http://optmslmsoft01:7072/login
  props.changeMenu(item);
  // if(item){

  // }
}
// const isAdmin = userObject?.[0]?.divisionData?.[0]?.ROLE?.join("") === 'IS Admin' || 
//                 userObject?.[0]?.divisionData?.[0]?.ROLE?.join("") === 'Admin';

// const filteredMenuList = isAdmin
//   ? props?.menus 
//   :props?.menus?.filter(item => item.label !== 'Settings')
  return (<>
    <div className='row m-0 mt-3'>
    <ul  className={isAdmin ? 'sideMenu pe-2 ps-2' : 'sideMenu pe-2 ps-2 disable'}>
    {filteredMenuList?.map((item, index) => (
      <div key={index}>

        <li key={index} onClick={() => isAdmin ?  changeMenu(item):null} className={props?.activeMenu === item ? 'active-menu':'inactive'}>{props?.activeMenu === item ? item?.activeIcon : item?.icon}{item.label}</li>
      </div>
     
    ))}
  </ul>
    </div>
  </>)
}

export default SiderMenuComponent