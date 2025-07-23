import React, { useEffect, useRef, useState } from 'react'
import VendorMaster from './VendorMaster/VendorMaster';
import VendorProfile from './VendorProfile/VendorProfile';
import { download, status, template, upload } from '../../assests/icons';
import { SelectButton } from 'primereact/selectbutton';
import {DivisionComponent} from '../Shared/Division';
import { useDispatch, useSelector } from 'react-redux';
import {  changeSubModule } from '../../slices/navigation';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import BrowseComponent from '../Shared/Browse/browse';
import { changeIsFilter } from '../../slices/columnSelection';
import { Toast } from 'primereact/toast';
import SystemDefaults from './SystemDefaults/SystemDefaults';
import DownloadComponent from '../Shared/Download/download';
import TemplateComponent from '../Shared/Template/template';


const VendorComponent=(props)=> {
    const [latestRowData, setLatestRowData] = useState([]);
    const options = ['Vendor Master','Vendor Profile', 'System Defaults'];
    const toast = useRef(null);
    const [value, setValue] = useState('');
    const [menu, setMenu] = useState('');
    const [statusPopup, setStatusPopup] = useState(false);
    const [profilePageAction, setProfilePageAction] = useState(false);
    const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
    const[tableData,setTableData] = useState([]);
    const [columns,setColumns] = useState([])
    const tableDataResult = useSelector((state) => state?.upload?.tableData);
    const tableDataColumns = useSelector((state)=>state?.upload?.tableCols)
    const [permissionsObj,setPermissionsObj] = useState({});
    const [downloadPayload,setDownloadPayload] = useState({});
    const [downloadbtn, setDownloadBtn]  = useState(false);
    const [templateView, setTemplateView]  = useState(false);
    const [templateLoader,setTemplateLoader] = useState(false); 
    const [loader,setLoader] = useState(false);
    const [browseKey,setBrowseKey] = useState(''); 
    const division = useSelector((state) => state.division);
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
    const childRef = useRef(null);
    const dispatch = useDispatch()
    const navObj = useSelector((state) => state.navigation);
  /** @remarks Useeffect to get data */
  useEffect(()=>{
    if (tableDataResult.length > 0 && tableDataColumns.length > 0) {
      setTableData(tableDataResult)
      setColumns(tableDataColumns)
      setVisibleUploadPopup(false);
    }
  },[tableDataResult,tableDataColumns])
   /** @remarks Useeffect to get permissions data */
    useEffect(() => {
      if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division){     
        let permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE)
        if(permissions){
          setPermissionsObj(permissions);
        }
      }
      }, [navObj.PARENT_MODULE && navObj.CHILD_MODULE]);
      /** @remarks Function to change tabs */    
  const changeMenu = (e) => {
  setValue(e.value)
   setLatestRowData([]);
  setMenu(e.value === 'Vendor Master' ? 'Vendor Master' : e.value === 'Vendor Profile' ? 'vendorProfile' : e.value === 'System Defaults' ? 'System Defaults' : '');
  dispatch(changeSubModule({subModule:e.value}));
  dispatch(changeIsFilter({filterState:null,queryString:null,jsonData:null}))
}
 /** @remarks Useeffect to show first tab name */
useEffect(() => {
  changeMenu({value: 'Vendor Master'});
}, []);
/**
    @remarks
    Function to open Vendor Profile Page when we clicked on AP Vendor number
    @author Amar
    */  
const handleActionProfilePageNavigation = () =>{
  setProfilePageAction(!profilePageAction)
}
/**
    @remarks
    Function to open Vendor Profile Status popup
    @author Amar
    */  
const openStatusPopup = () => {
  setStatusPopup(!statusPopup);
};
/**
    @remarks
    Function to close Vendor Profile Status popup
    @author Amar
    */ 
const closeDialog = () =>{
  setStatusPopup(!statusPopup);
}
/**
    @remarks
    Function to to upload eXcel data
    @author Sai Anil
    */ 
const handleVisibleUpload= () =>{
  setVisibleUploadPopup(true);
 }

 const closeDialogUpload = (key)=>{
  setVisibleUploadPopup(!visibleUploadPopup)
  if(key === 'Success'){
    setBrowseKey(key)
    // toast.current.show({
    //   severity: 'info',
    //   summary: 'Succes',
    //   detail: 'Upload Success',
    // });
  }
  if(key === 'Failed'){
    // toast.current.show({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Upload failed',
    // });
  }
 }
 const SelectionDetails = () => {
  return (   
      <BrowseComponent closeDialog={(e) => closeDialogUpload(e)} name={value}/>      
  );
};
const downlaodPayLoad  = {
  requestMethod: "getRCGroup",
  request_type:"Download",
  searchParams: {
    sortBy:"",
    sortorder:"",
    filterData:""
    }
}
 /** @remarks Useeffect to get filtered data */
useEffect(() => {
  if (isFilter?.filterState === true || isFilter?.filterState === false) {
    const filterString = generateFilterString()
    const updateDownloadPayload = {
      ...downlaodPayLoad,
      searchParams: {
        ...downlaodPayLoad.searchParams,
        filterData: filterString
      },
       pagination:{
          pageNumber:0,
          pageSize:15
          }
    };
    setDownloadPayload(updateDownloadPayload);
  }
}, [isFilter]);
 /** @remarks Funtion to retrieve Filter object */
  const generateFilterString =() => {
    return Array.isArray(isFilter?.filterString) ? isFilter.filterString.map((filter) => {
      const values = filter.filterValues
        ? `['${filter.filterValues.join("','")}']`
        : `'${filter.userInputValue}'`;
      return `${filter.field} ${filter.type} ${values}`;
    })
    .join(` ${isFilter.filterString[0]?.logicalCondition || 'AND'} `)
: isFilter?.filterString || "";
  }
   /** @remarks Function click on download button */
const downloadFile =  () => {
  setDownloadBtn(true);
};
 /** @remarks Function to get download status */
const actionStatusDownload = (key, msg) =>{
  if(key === 'Success'){
    toast.current.show({ severity: 'info',summary: 'Download', detail: msg });
  }
 else{
  // toast.current.show({
  //   severity: 'error',
  //   summary: 'Error',
  //   detail: msg,
  // });
 }
}
/** @remarks Function to get status message*/
const actionStatusTemaplte = (key, msg) =>{
  if(key === 'Success'){
    toast.current.show({ severity: 'info',summary: 'Download', detail: msg });
  }
 else{
  toast.current.show({
    severity: 'error',
    summary: 'Template',
    detail: msg,
  });
 }
} 
/** @remarks Function to click on template */
 const downloadTemplate = () =>{
  setTemplateView(true);
}
const handleRowDataChange = (data) => {
  setLatestRowData(data);
};
  return (
    <div>
      <Toast ref={toast} />
      {!profilePageAction ? 
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e)} options={options} />
        <div className='d-flex gap-2'>
        <div className='d-flex gap-2 align-items-center'>
          <span className='divison'>Division</span>
          <DivisionComponent />
          </div>         
          { 
         permissionsObj?.template &&
            <button className='secondary-button' disabled={templateLoader} onClick={downloadTemplate}><img src={template} alt="template"  width={16} className='me-1'  />Template{templateLoader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }         
        {permissionsObj?.excelUpload && <button className='secondary-button' onClick={handleVisibleUpload}><img src={upload} alt="upload"  width={15} className='me-1'/>Upload</button>} 
           <>        
          {
            permissionsObj?.excelDownload &&
        <button disabled={latestRowData.length === 0 || loader} className='secondary-button'onClick={downloadFile}  ><img src={download} alt="download"   width={20} className='me-1' />Download{loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }
          </>
          {
            permissionsObj?.divisionStatus &&
            <button className='primary-button' onClick={(e) => openStatusPopup()}><img src={status}  alt="Status"  width={20} className='me-1'/>Status</button>   
          }               
        </div>
      </div>
:''}
      <div className="my-3">
        {value === 'Vendor Master' ? (
          <VendorMaster onRowDataChange={handleRowDataChange} menu={menu}  value={value} ref={childRef}  handleActionProfilePageNavigation={handleActionProfilePageNavigation} 
          profilePageAction = {profilePageAction} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}/>
        ) : value === 'Vendor Profile' ? (
          <VendorProfile onRowDataChange={handleRowDataChange} browseKey={browseKey} setKey={setBrowseKey} menu={menu}  value={value} ref={childRef} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}
          tableData={tableData} columns={columns}/>          
        ) : value === 'System Defaults' ? (
          <SystemDefaults />
        ) : ''}
      </div>
       <div className="uploadCls">
      {visibleUploadPopup &&   
    <DialogBox header='Data Upload' content={SelectionDetails()} style={{width:'30vw'}} onHide={closeDialogUpload}/>
      }
        {downloadbtn && <DownloadComponent loader = {setLoader} dowloadAction ={setDownloadBtn} statusDownload = {actionStatusDownload}/> }
        {templateView && <TemplateComponent templateLoader = {setTemplateLoader} templateAction = {setTemplateView} statusTemplate = {actionStatusTemaplte}/> }
      </div>
    </div>
  )
}

export default VendorComponent