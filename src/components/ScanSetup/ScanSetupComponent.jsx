import React, { useEffect, useRef, useState, } from 'react'
import { download, status, template, backIcon, upload } from '../../assests/icons';
import { SelectButton } from 'primereact/selectbutton';
import ScanErrorProcessComponent from './scanerrorprocess/scanerrorprocessComponent';
import ScanProcessComponent from './scanprocess/scanprocessComponent';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import {DivisionComponent} from '../Shared/Division';
import BrowseComponent from '../Shared/Browse/browse';
import { useDispatch, useSelector } from 'react-redux';
import { changeSubModule } from '../../slices/navigation';
import { resetIsFilter } from '../../slices/columnSelection';
import DownloadComponent from '../Shared/Download/download';
import { Toast } from 'primereact/toast';
import TemplateComponent from '../Shared/Template/template';

const ScanSetupComponent=(props)=> {
  const [latestRowData, setLatestRowData] = useState([]);
  const options = ['Scan Process', 'Scan Error Process'];
  const [value, setValue] = useState(options[0]);
  const [statusPopup, setStatusPopup] = useState(false);
  const [visibleBackButton, setVisibleBackButton] = useState(false);
  const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
  const[tableData,setTableData] = useState([]);
  const [tablecolumns,setTableColumns] = useState([])
  const [downloadbtn, setDownloadBtn]  = useState(false);
  const [loader,setLoader] = useState(false);
  const tableDataResult = useSelector((state) => state?.upload?.tableData);
  const tableDataColumns = useSelector((state)=>state?.upload?.tableCols)
  const division = useSelector((state) => state.division);
  const toast = useRef(null);
  const [templateView, setTemplateView]  = useState(false);
  const [templateLoader,setTemplateLoader] = useState(false); 
  const [permissionsObj,setPermissionsObj] = useState({}); 
  const [browseKey,setBrowseKey] = useState(''); 
  const navObj = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
/** @remarks Useeffect to store data */
  useEffect(()=>{
    if (tableDataResult.length > 0 && tableDataColumns.length > 0) {
      setTableData(tableDataResult)
      setTableColumns(tableDataColumns)
      setVisibleUploadPopup(false);
    }
  },[tableDataResult,tableDataColumns])
  const childRef = useRef(null);
  /** @remarks Function to open status popup */
    const openStatusPopup = () => {
      setStatusPopup(!statusPopup)
    };
      /** @remarks Function to close popup */
    const closeDialog = () => {
      setStatusPopup(!statusPopup);
  };
    /** @remarks Function to back to main grid */
 const changeVIew = () => {
  if (childRef.current) { 
    childRef.current.changeVIewOne();
    setVisibleBackButton(!visibleBackButton)
  }
 }
 /**
    @remarks
    Function to to upload eXcel data
    @author Sai Anil
    */ 
const handleVisibleUpload= () =>{
  setVisibleUploadPopup(true);
 }

  /** @remarks Function to open upload popup */
 const closeDialogUpload = (key)=>{
  setVisibleUploadPopup(!visibleUploadPopup);
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
  /** @remarks Function to open upload popup */
const uploadDetails = () => {
  return (
      <BrowseComponent closeDialog={closeDialogUpload} name={value}/>
  );
};
  /** @remarks Function to change tab menu */
const changeMenu = (e) =>{
  dispatch(resetIsFilter());
    setValue(e)
     setLatestRowData([]);
    dispatch(changeSubModule({subModule:e}));
  }
/** @remarks Useeffect to show first tab name */
  useEffect(() => {
    changeMenu('Scan Process');
  }, []);
  /** @remarks Function to click download button */
  const downloadFile = async () => {
    setDownloadBtn(true)
  }
  /** @remarks  Function to show download message */
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
    /** @remarks  Function to show status message */
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
    /** @remarks  Function to click on template */
   const downloadTemplate = () =>{
    setTemplateView(true);
  }
  const handleRowDataChange = (data) => {
    if(data) {
  setLatestRowData(data);
    } else {
      setLatestRowData([]);
    }
};
    /** @remarks  Useeffect to store permissions */
   useEffect(() => {
      if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division){     
        let permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE)
        if(permissions){
          setPermissionsObj(permissions);
        }
      }
      }, [navObj.PARENT_MODULE && navObj.CHILD_MODULE]);
  return (
    <div>
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e?.value)} options={options} />
        {!visibleBackButton &&
      <div className='d-flex gap-2'>
        <div className='d-flex gap-2 align-items-center'>
          <span className='divison'>Division</span>
          <DivisionComponent />
          </div>
          {permissionsObj?.template &&  <button className='secondary-button' disabled={templateLoader} onClick={downloadTemplate}><img src={template} alt="template"  width={16} className='me-1'  />Template{templateLoader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>} 
      {permissionsObj?.excelUpload && <button className='secondary-button'onClick={handleVisibleUpload}><img src={upload} alt="upload"  width={15} className='me-1'/>Upload</button>} 
         <>
                  {permissionsObj?.excelDownload &&          
        <button disabled={latestRowData.length === 0 || loader} className='secondary-button'onClick={downloadFile}  ><img src={download} alt="download"   width={20} className='me-1' />Download{loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>}
          </>
          {permissionsObj?.divisionStatus && 
        <button className='primary-button' onClick={openStatusPopup}><img src={status} alt="Status"  width={20} className='me-1'/>Status</button>}         
      </div>
        }
        {visibleBackButton &&
          <div className='d-flex gap-2'><span className='pointer title-tag' onClick={changeVIew}><img src={backIcon} alt="Status"  width={20} className='me-1'/>Back to Item Summary</span></div>
        }
      </div>
      <div className="my-3">
        {value === 'Scan Process' ? (
          <ScanProcessComponent onRowDataChange={handleRowDataChange}  changeVIew={changeVIew} ref={childRef} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}/>
        ) : (
          <ScanErrorProcessComponent onRowDataChange={handleRowDataChange} browseKey={browseKey} setKey={setBrowseKey} changeVIew={changeVIew} ref={childRef} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}
          tableData={tableData} columns={tablecolumns}/>
        )}
      </div>
      <div className="uploadCls">
      {visibleUploadPopup &&   
    <DialogBox header='Data Upload' content={uploadDetails()} style={{width:'30vw'}} onHide={closeDialogUpload}/>
      }
        {downloadbtn && <DownloadComponent loader = {setLoader} dowloadAction ={setDownloadBtn} statusDownload = {actionStatusDownload}/> }
        {templateView && <TemplateComponent templateLoader = {setTemplateLoader} templateAction = {setTemplateView} statusTemplate = {actionStatusTemaplte}/> }
      </div>
    </div>
  )
}

export default ScanSetupComponent