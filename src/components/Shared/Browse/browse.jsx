import { FileUpload } from 'primereact/fileupload';
import React, { useState,useRef, useEffect  } from 'react'
import { browse, removeIcon, excel } from '../../../assests/icons';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import { useUploadExcelFileMutation } from '../../../services/common';

const  BrowseComponent=(props)=> {
    const [file,setFile] = useState(null);
    const [remove,setRemove] = useState('X');
    const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
const tableDataResult = useSelector((state) => state?.upload?.tableData);
const tableDataColumns = useSelector((state)=>state?.upload?.tableCols);
const navObj = useSelector((state) => state.navigation);
const userObject = useSelector(state => state?.user?.userData);
const [loader,setLoader] = useState(false); 
const [uploadFile,{}] = useUploadExcelFileMutation();
useEffect(()=>{
    if(tableDataResult.length && tableDataColumns.length){
      setVisibleUploadPopup(!visibleUploadPopup)
    }
},[tableDataResult,tableDataColumns])
    const toast = useRef(null);
const onFileSelect = (e) => {
      let fileExtension = e?.files[0].name.split('.')[1];
       if(fileExtension !== 'xlsx' && fileExtension !== 'xls'){
       toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please upload only Excel files' });
     }
     else if(e?.files[0].size < 2000000) {
         setFile(e.files[0]);
         setRemove('X');
       }
       else{
         toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please upload file less than 2MB' });
       }     
};
const getControlName =() =>{
  let controlName = '';
  let uploadModule = navObj.CHILD_MODULE;
  if(uploadModule === 'Customer Groups'){
     controlName = 'CUSTOMER_GROUP_UPL_TABLE';
  }else if(uploadModule === 'Vendor Profile'){
    controlName = 'VENDOR_PROFILE_UPL_TABLE';
  }else if(uploadModule === 'Item Summary'){
    controlName = 'ITEM_UPL_TABLE';
  }else if(uploadModule === 'Scanomatic'){
    controlName = 'SCANOMATIC_UPL_TABLE';
  }else if(uploadModule === 'Scan Error Process'){
    controlName = 'SCAN_UPL_TABLE';
  }else if(uploadModule === 'Rules Definition'){
    controlName = 'RULES_UPL_TABLE';
  }else if(uploadModule === 'Vendor Costing'){
    controlName = 'VENDOR_COSTING_UPL_TABLE';
  }else if(uploadModule === 'Hazardous'){
    controlName = 'HAZ_UPL_TABLE';
  }
  return controlName;
}
const uploadDataToTable = async()=>{
  setLoader(true);
      if (file) {
        const formData = new FormData();
        formData.append('excelUpload', file);
        formData.append('control_name', getControlName());
        formData.append('requested_by', userObject[0]?.email);
        formData.append('created_by', userObject[0]?.email);
        formData.append('request_type', 'UPLOAD');
      try{
        let res = await uploadFile(formData).unwrap();
         if(res?.res_status){
          setLoader(false);
          setFile(null);
          setRemove('');
          // toast.current.show({
          //   severity: 'info',
          //   summary: 'Succes',
          //   detail: 'Upload Success',
          // });
          props?.closeDialog('Success');
         }
      else{
        setLoader(false);
        // toast.current.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Upload Error',
        // });
        props?.closeDialog('Failed');
      }
      }catch (e) {
        setLoader(false);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Uplaod Error',
        });
        props?.closeDialog('Failed');
      }
      }
      else{
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please browse file' });
       }
  }
       /**
          @remarks
          This function to remove seleted file
          @author Amar
         */
      const handleClearSelectedFile = (e)=>{
      setFile(null);
      setRemove('');    
      }

    return (
      <div className="fileUpload p-0 m-0">
      {/* <h6>Add your files here, and you can upload up to 5 files max</h6> */}
      <h6>Only supports Excel Files</h6>
      <div className="d-flex justify-content-center">
      <div className="file-upload-container">
      <div className="d-flex align-items-center flex-column">
    <img src={browse} alt="browse"  width={36} className='me-1'  />
    <label htmlFor="fileUploadInput" className="file-upload-label">
    
    Drag your file(s) to start uploading
    <br />
    ---------- or ------------
    <br />
    <Toast ref={toast}></Toast>
    {/* {loading && <p>Loading...</p>} */}
    <FileUpload
      mode="basic"
      className="btnBrowse"
      accept=".csv,.xlsx" 
      // customUpload={true}
      onSelect={onFileSelect}   
      // onSelect={handleFileUpload}   
      auto 
      chooseLabel="Browse"/>
  </label>
    </div>
         
      </div>
      
  </div>
  <div className='pt-1 mt-1'>
  {/* <h6>Only support Excel Files</h6> */}
  </div>
  <div>
   <div className='row'>
    {file ?
    <>
    <div className='col-1'>
    {remove === 'X' ?
    <span><img src={excel} alt="browse"  width={26} className='me-1'/></span>: ''}
    </div>
    <div className='col-10'>
    <span>{file?.name}</span>
    </div>
    <div className='col-1'>
      {remove === 'X' ?
    <span onClick={(e) => handleClearSelectedFile(file)}><img src={removeIcon} alt="browse"  width={26} className='me-1'/></span>: ''}
    </div>
    </>
  :''}
   </div>
      
   
  </div>
  <div className='pt-1 mt-1 d-flex justify-content-center'>
  <button className='secondary-button' onClick={props?.closeDialog}>Cancel</button> &nbsp;&nbsp;
  <button className='primary-button' onClick={uploadDataToTable}>Submit {loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>  
  {/* <button className='primary-button' onClick={handleProcessChunks}>Submit</button>   */}
  </div>
 
  </div>
    )
}
export default BrowseComponent;