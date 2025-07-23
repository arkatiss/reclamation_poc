import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { height } from '@mui/system';
import { useSelector } from 'react-redux';

const DialogBox = (props) => {
  console.log(props)
  const [visible,setVisible] = useState(true);
  const navObj = useSelector((state) => state.navigation);
  return (
    <div>
    <Dialog header={props?.header} className={navObj.CHILD_MODULE === 'Customer Master' || navObj.CHILD_MODULE === 'Customer Groups' || navObj.CHILD_MODULE === 'Customer Profile' || navObj.CHILD_MODULE === 'Vendor Master' || navObj.CHILD_MODULE === 'Vendor Profile' || navObj.CHILD_MODULE === 'Item Summary' ||  navObj.CHILD_MODULE === 'Hazardous' || navObj.CHILD_MODULE === 'Rules Definition' || navObj.CHILD_MODULE === 'Vendor Costing' || navObj.CHILD_MODULE === 'Scanomatic' || navObj.CHILD_MODULE === 'Scan Error Process' || navObj.CHILD_MODULE === 'Scan Process'  || navObj.CHILD_MODULE === 'Screen Features' || props.style.height ? '' : 'dialogHeight'} footer={props?.footer}  style={props.style ? props.style : {width: '50vw',...(props.style?.height
      ? { height: `calc(${props.style.height})` }
      : {}),
    ...props.style}} visible={visible} onHide={() => {setVisible(false);props.onHide()}}>
    {props?.content}             
    </Dialog>
    </div>
  )
}

export default DialogBox