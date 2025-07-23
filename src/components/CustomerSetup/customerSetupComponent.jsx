import React, { useEffect, useState,useRef  } from 'react'
import { download, status, template, upload } from '../../assests/icons';
import { SelectButton } from 'primereact/selectbutton';
import CustomerMasterComponent from './CustomerMaster/customerMasterComponent';
import CustomerGroupsComponent from './CustomerGroups/customerGroupsComponent';
import CustomerProfileComponent from './CustomerProfile/customerProfileComponent';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import {DivisionComponent} from '../Shared/Division';
import { useDispatch, useSelector } from 'react-redux';
import BrowseComponent from '../Shared/Browse/browse';
import { changeSubModule } from '../../slices/navigation';
import { getTableColumns, getTableData } from '../../slices/upload';
import { resetIsFilter} from '../../slices/columnSelection'
import { Toast } from 'primereact/toast';
import { generateFilterString } from '../Shared/lookupPayload';
import DownloadComponent from '../Shared/Download/download';
import TemplateComponent from '../Shared/Template/template';
const CustomerSetupComponent = (props) => {
  const options = ['Customer Master', 'Customer Groups', 'Customer Profile'];
  const [menu, setMenu] = useState('');
  const [statusPopup, setStatusPopup] = useState(false);
  const [value, setValue] = useState('');
  const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
  const[tableData,setTableData] = useState([]);
  const [columns,setColumns] = useState([])
  const dispatch = useDispatch()
  const navObj = useSelector((state) => state.navigation);
  const toast = useRef(null);
  const [permissionsObj,setPermissionsObj] = useState({});
  const division = useSelector((state) => state.division);
  const [latestRowData, setLatestRowData] = useState([]);
  const [downloadPayload,setDownloadPayload] = useState({  "requestMethod": "downloadFile",
    "lastUpdatedBy": "rec_test@gmail.com",
    "actionObject": {
        "jobName": navObj?.CHILD_MODULE === 'Customer Master' ? 'CUSTOMER_MASTER_DWL' : navObj?.CHILD_MODULE === 'Customer Groups' ? 'CUSTOMER_GROUP_DWL' : 'CUSTOMER_PROFILE_DWL',
        "templateYN": "N",
        "fileName": navObj?.CHILD_MODULE === 'Customer Master' ? 'customerMaster' : navObj?.CHILD_MODULE === 'Customer Groups' ? 'CustomerGroup' : 'CustomerProfile',
        "fileType": "csv",
        "searchParams": {
          "sortBy": "",
          "sortorder": "",
          "filterData": ""
          }
    }});
const tableDataResult = useSelector((state) => state?.upload?.tableData);
const tableDataColumns = useSelector((state)=>state?.upload?.tableCols);
const [downloadbtn, setDownloadBtn]  = useState(false);
const [loader,setLoader] = useState(false); 
const [templateView, setTemplateView]  = useState(false);
const [templateLoader,setTemplateLoader] = useState(false); 
const [browseKey,setBrowseKey] = useState(''); 
const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
   /** @remarks Useeffect to get customer group data */
  useEffect(()=>{
    if (tableDataResult.length > 0 && tableDataColumns.length > 0) {
      setTableData(tableDataResult)
      setColumns(tableDataColumns)
      setVisibleUploadPopup(false);
    }
    else{
      setTableData([])
      setColumns([])
    }
  },[tableDataResult,tableDataColumns]);
     /** @remarks Function to open Upload popup */
 const handleVisibleUpload= () =>{
  setVisibleUploadPopup(true);
 }
  const childRef = useRef(null);
  /**
  @remarks
  This function to open Customer status page
  @author Amar
  */
  const openStatusPopup = (value) => {
    setStatusPopup(!statusPopup);
  };
    /**
  @remarks
  This function to close Customer status page
  @author Amar
  */
  const closeDialog = () => {
    setStatusPopup(!statusPopup);
};
   /** @remarks Function to close upload popup */
const closeDialogUpload = (key)=>{
  setVisibleUploadPopup(false)
  if(key === 'Success'){
    setBrowseKey(key)
    // toast.current.show({
    //   severity: 'info',
    //   summary: 'Succes',
    //   detail: 'Upload Success',
    // });
  }
  if(key === 'Failed'){
  //   toast.current.show({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Upload failed',
  //   });
   }
}
   /** @remarks Function to change menu(tabs) */
const changeMenu = (e) => {
  setValue(e.value);
  dispatch(resetIsFilter());
  dispatch(changeSubModule({subModule:e.value}));
  dispatch(getTableData([]))
  dispatch(getTableColumns([]))
   setLatestRowData([]);
  setMenu(e.value === 'Customer Master' ? 'reclaimCustomer' : e.value === 'Customer Groups' ? 'reclaimCustomerGroup' : e.value === 'Customer Profile' ? 'wAvgHorizonValidation' : '');
}
   /**
  @remarks
  This useEffect is to get permissions for a division
  @author Shankar Anupoju
  */
useEffect(() => {
if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division){     
  let permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE)
  if(permissions){
    setPermissionsObj(permissions);
  }
}
}, [navObj.PARENT_MODULE && navObj.CHILD_MODULE]);
/**
@remarks
Function to handle the template download and display the column headers
@author Shankar Anupoju
   */
  const downloadTemplate = () =>{
      setTemplateView(true);
  }
     /** @remarks Useeffect to store menu name */
useEffect(() => {
  changeMenu({value: 'Customer Master'});
}, []);
   /** @remarks Useeffect to get filtered data for download*/
useEffect(() => {
  if (isFilter?.filterState === true || isFilter?.filterState === false) {
    const filterString = generateFilterString(isFilter)
    const updatedActionObject = {
      ...downloadPayload.actionObject,
      searchParams: {
          ...downloadPayload.actionObject.searchParams,
          ...downloadPayload.searchParams,
          filterData: filterString
      }
  };
  setDownloadPayload(prevState => ({
      ...prevState,
      actionObject: updatedActionObject
  }));
  // const { searchParams, ...updatedRequestData } = downloadPayload; 
  // setDownloadPayload(updatedRequestData);
  }
}, [isFilter]);
     /** @remarks Function to download file */
const downloadFile = () => {
  setDownloadBtn(true)
};
const SelectionDetails = () => {
  return (
      <BrowseComponent closeDialog={(e) =>closeDialogUpload(e)} name={value}/>
  );
};
     /** @remarks Function to show message for download */
const actionStatusDownload = (key, msg) =>{
  if(key === 'Success'){
    toast.current.show({ severity: 'info',summary: 'Download', detail: msg });
  }
 else{
  //  
  // toast.current.show({
  //   severity: 'error',
  //   summary: 'Error',
  //   detail: msg,
  // });
 }
}
     /** @remarks Function to show message for status */
const actionStatusTemaplte = (key, msg) =>{
  if(key === 'Success'){
    toast.current.show({ severity: 'info',summary: 'Template', detail: msg });
  }
 else{
  toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: msg,
  });
 }
}
const handleRowDataChange = (data) => {
  setLatestRowData(data);
};
  return (
    <div>
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e)} options={options} />
        <div className='d-flex gap-2'>
        <div className='d-flex gap-2 align-items-center'>
          <span className='divison'>Division</span>
          <DivisionComponent />
          </div>        
          {
            permissionsObj?.template && 
            <button className='secondary-button' disabled={templateLoader} onClick={downloadTemplate}><img src={template} alt="template"  width={16} className='me-1'  />Template {templateLoader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }
        {permissionsObj?.excelUpload && 
          <button className='secondary-button' onClick={handleVisibleUpload}><img src={upload} alt="upload" className='me-1'  width={16}/>Upload</button>} 
        <>
        {permissionsObj?.excelDownload &&
           <button disabled={latestRowData.length === 0 || loader} className='secondary-button' onClick={() =>downloadFile()}><img src={download} alt="download"   width={20} className='me-1'/>Download {loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
        }
          </>
          {
            permissionsObj?.divisionStatus && <button className='primary-button' onClick={(e) => openStatusPopup(value)}><img src={status} alt="Status"  width={20} className='me-1'/>Status</button>   
          }     
        </div>
      </div>
      <div className="my-3">
        {value === 'Customer Master' ? (
          <CustomerMasterComponent onRowDataChange={handleRowDataChange} menu={menu} statusPopup={statusPopup} moduleName={navObj} showStatusTabs={false} onClose={closeDialog} value={value} ref={childRef}   />
        ) : value === 'Customer Groups' ? (
          <>
          <CustomerGroupsComponent  onRowDataChange={handleRowDataChange} browseKey={browseKey} setKey={setBrowseKey} menu={menu} statusPopup={statusPopup} showStatusTabs={false} moduleName={navObj} onClose={closeDialog} value={value} ref={childRef}  tableData={tableData} columns={columns}/>
          </>) : (
          <CustomerProfileComponent onRowDataChange={handleRowDataChange} menu={menu} statusPopup={statusPopup} showStatusTabs={false} moduleName={navObj} onClose={closeDialog} value={value} ref={childRef}  />
        )}
      </div>
      <div className="uploadCls">
      {visibleUploadPopup &&
    <DialogBox header='Data Upload' content={SelectionDetails()} style={{width:'30vw'}} onHide={closeDialogUpload}/>
      }
      {downloadbtn && <DownloadComponent loader = {setLoader} dowloadAction ={setDownloadBtn} statusDownload = {actionStatusDownload} /> }
      {templateView && <TemplateComponent templateLoader = {setTemplateLoader} templateAction = {setTemplateView} statusTemplate = {actionStatusTemaplte}/> }
      </div>
    </div>
  )
}
export default CustomerSetupComponent;
