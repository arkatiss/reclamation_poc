import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import DialogBox from '../../Dialog-Box/DialogBox';
import DynamicForm from '../../Forms/CustomerSetup/DynamicForm';
import { bulkCreate, bulkEdit, clearBulkCreateRecords, clearBulkEditRecords } from '../../../../slices/columnSelection';
import { useDispatch } from 'react-redux';
import { height } from '@mui/system';
import { Toast } from 'primereact/toast';
export const BulkCreate = (props) => {

  const navObj = useSelector((state) => state.navigation);
  const getEditRecords = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [editRecords,setEditRecords] = useState([])
  const [formValues,setFormValues]= useState([])
  const [btnClicked,setClicked]= useState(false)
  const toast = useRef(null);

  useEffect(()=>{
    if (getEditRecords.length > 0) {
    
      setEditRecords(getEditRecords)
    }else{
      setEditRecords([])
    }
  },[getEditRecords])

  const checkAllValuesTrue = (multiRecord) => {
    return multiRecord.every(record =>
      Object.values(record).every(value => value === true)
    );
  };
  const dispatch = useDispatch()
  const getRecords = (data)=>{

    setFormValues(data)
    //dispatch(clearBulkCreateRecords())
     dispatch(bulkCreate(data))
  }
       
  /*** This function is used to update  and edit records */
  const getUpdatedRecords = (data)=>{
    dispatch(clearBulkEditRecords())

    dispatch(bulkEdit(data))
  }
  
  /*** This function is used to open dynamic form */

  const openForm = ()=>{
    return(
      <>
      {
         
      <DynamicForm insertFields={props?.insertFields} productColumns={props?.productColumns} getRecords={getRecords} editRecords={editRecords} getUpdatedRecords={getUpdatedRecords} copiedRecords = {props?.copiedRecords} clicked = {setClicked}/>
      }
      </>
  
  )
  }
  /*** This function is used to handle bulk create */

  const handleSave = ()=>{
    if (formValues?.length >0) {
      props?.createBulkRecord()
      setClicked(!btnClicked)
    }
    else{

     toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: 'Please insert records',
  });
  }
}

  /*** This function is used to render custom header*/

  const customHeader = ()=>{
    return (
      <div className='d-flex justify-content-between'>
        <div>
        <p>{navObj?.CHILD_MODULE === 'Value Maps' ? sessionStorage?.getItem('valueMap'): navObj?.CHILD_MODULE.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>

        </div>
        <div className='d-flex gap-3 me-3'>
          <button className={btnClicked === true  ? 'primary-button' : 'primary-button disableBtn'} style={{ height: '35px'}}  onClick={handleSave} disabled = {!btnClicked}
            >Submit</button>
        </div>
      </div>
    )
  }
  return (
    <div>
        <Toast ref={toast}></Toast>
      {props?.openForm !=="" && props?.openForm !== "none" &&
        <DialogBox header={customHeader()} style={{ width: "67vw" }} content={openForm()} onHide={props?.closeMultiCreate}
        
        />
        }
    </div>
  )
}
