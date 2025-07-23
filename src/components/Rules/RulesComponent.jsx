import React, { useEffect, useRef, useState } from 'react'
import { download, status, template, upload } from '../../assests/icons';
import { SelectButton } from 'primereact/selectbutton';
import RulesDefinitionComponent from './RulesDefinition/rulesDefinitionComponent';
import ExplodedRulesComponent from './ExplodedRules/explodedRulesComponent';
import VendorCostingComponent from './VendorCosting/vendorCostingComponent';
import ScanomaticComponent from './Scanomatic/scanomaticComponent';
import {DivisionComponent} from '../Shared/Division';
import BrowseComponent from '../Shared/Browse/browse';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import {  useDispatch, useSelector } from 'react-redux';
import { changeSubModule } from '../../slices/navigation';
import { useExcelDownloadMutation, useFileDownloadExistingURLMutation } from '../../services/customersSetup';
import { Toast } from 'primereact/toast';
import { Button } from 'antd';
import { resetIsFilter } from '../../slices/columnSelection';
import { generateFilterString } from '../Shared/lookupPayload';
import DownloadComponent from '../Shared/Download/download';
import TemplateComponent from '../Shared/Template/template';
const RulesComponent=()=> {
    const [latestRowData, setLatestRowData] = useState([]);
  const options = ['Rules Definition', 'Exploded Rules', 'Vendor Costing', 'Scanomatic'];
  const [value, setValue] = useState('');
  const [statusPopup, setStatusPopup] = useState(false);
    const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
    const [fromExploded,setFromExploded]= useState(false);
    const [fromExplodedKey,setFromExplodedKey]= useState({});
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
    const[tableData,setTableData] = useState([]);
  const [tablecolumns,setTableColumns] = useState([])
      const tableDataResult = useSelector((state) => state?.upload?.tableData);
const tableDataColumns = useSelector((state)=>state?.upload?.tableCols)
const [permissionsObj,setPermissionsObj] = useState({}); 
const [browseKey,setBrowseKey] = useState(''); 
const navObj = useSelector((state) => state.navigation);
  const [statusType,setStatusType]= useState("UPLOAD");
  const [downloadbtn, setDownloadBtn]  = useState(false);
  const [loader,setLoader] = useState(false);
  const [templateView, setTemplateView]  = useState(false);
const [templateLoader,setTemplateLoader] = useState(false); 
const [visibleButtons,setVisibleButtons] = useState(true); 
  const division = useSelector((state) => state.division);
  const checkStatus = (data)=>{
    setStatusType(data)
    if (navObj?.PARENT_MODULE === 'rulesSetup' && navObj?.CHILD_MODULE === 'Exploded Rules') {
      setStatusType("DOWNLOAD")
    }
  }
  useEffect(()=>{
    if (navObj?.PARENT_MODULE === 'rulesSetup' && navObj?.CHILD_MODULE === 'Exploded Rules') {
        setStatusType("DOWNLOAD")
    }
  },[navObj])
const toast = useRef(null);
const dispatch = useDispatch();

  useEffect(()=>{
    if (tableDataResult.length > 0 && tableDataColumns.length > 0) {
      setTableData(tableDataResult)
      setTableColumns(tableDataColumns)
      setVisibleUploadPopup(false);
    }
  },[tableDataResult,tableDataColumns])

  useEffect(() => {
    if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division){     
      let permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE)
      if(permissions){
        setPermissionsObj(permissions);
      }
    }
    }, [navObj.PARENT_MODULE && navObj.CHILD_MODULE]);
    useEffect(()=>{
      changeMenu('Rules Definition')
    },[])

  const childRef = useRef(null);
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
  setStatusType("UPLOAD")
}

 /**
  @remarks
  This function open browse excel file
  @author Sai Anil
  */
const handleVisibleUpload = ()=>{
  setVisibleUploadPopup(true);

}
/**
  @remarks
  This function to close excel file popup
  @author Sai Anil
  */
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
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Upload failed',
    });
  }
}
 const uploadDetails = () => {
  return (
      <BrowseComponent closeDialog={(e) =>closeDialogUpload(e)} name={value}/>
  );
};
  const changeMenu = (e) =>{
    setValue(e)
    dispatch(resetIsFilter());
    dispatch(changeSubModule({subModule:e}));
    setVisibleButtons(true);
     setLatestRowData([]);
  }
  const [downloadPayload,setDownloadPayload] = useState({  "requestMethod": "downloadFile",
    "lastUpdatedBy": "rec_test@gmail.com",
    "actionObject": {
        "jobName": navObj?.CHILD_MODULE === 'Vendor Costing' ? 'VENDOR_COSTING_RULE_DWL' :'',
        "templateYN": "N",
        "fileName": navObj?.CHILD_MODULE === 'Vendor Costing' ? 'VendorCostingRule' : '',
        "fileType": "csv",
        "searchParams": {
          "sortBy": "",
          "sortorder": "",
          "filterData": ""
          }
    }});
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
      }
    }, [isFilter]);
  const downloadFile = async () => {
    setDownloadBtn(true);
  };
  const downloadTemplate = () =>{
    setTemplateView(true);
}
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
  const changeVIew = (rowData) => {
    if (childRef.current?.changeTabOne) { 
       changeMenu(options[0]);
       setFromExploded(true);
       setFromExplodedKey(rowData);
    }
   }
   const excludeFromVendorCosting = () => {
    setVisibleButtons(!visibleButtons)
   }
   const handleRowDataChange = (data) => {
  setLatestRowData(data);
};
  return (
    <div>
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e.value)} options={options} />
        <div className='d-flex gap-2 align-items-center'>
          <span className='divison'>Division</span>
          <DivisionComponent />
          {
            permissionsObj?.template && visibleButtons &&
          <button className='secondary-button' disabled={templateLoader} onClick={downloadTemplate}><img src={template} alt="template"  width={16} className='me-1' />Template{templateLoader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }
          {permissionsObj?.excelUpload && visibleButtons &&<button className='secondary-button' onClick={handleVisibleUpload}>
            <img src={upload} alt="upload"  width={15} className='me-1'/>Upload</button>
            } 
          {
            permissionsObj?.excelDownload && visibleButtons &&
            <button disabled={latestRowData.length === 0 || loader} className='secondary-button' onClick={downloadFile}><img src={download} alt="download"   width={20} className='me-1'/>Download{loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }
          {
            permissionsObj?.divisionStatus && visibleButtons &&
            <button className='primary-button' onClick={(e) => openStatusPopup()}><img src={status} alt="Status"  width={20} className='me-1'/>Status</button>
          }
       
              
        </div>
      </div>
      <div className="my-3">
        {value === 'Rules Definition' ? (
          <RulesDefinitionComponent onRowDataChange={handleRowDataChange}
             ref={childRef} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}
            tableData={tableData} columns={tablecolumns} statusType={statusType}  browseKey={browseKey} setKey={setBrowseKey} fromExploded={fromExploded} fromExplodedKey= {fromExplodedKey}/>
        ) : value === 'Exploded Rules' ? (
          <ExplodedRulesComponent onRowDataChange={handleRowDataChange}
                statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}
          statusType={statusType} changeVIew={changeVIew} ref={childRef} />
        ) : value === 'Vendor Costing' ? (
          <VendorCostingComponent onRowDataChange={handleRowDataChange}
           statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}  ref={childRef}
            tableData={tableData} columns={tablecolumns} statusType={statusType} browseKey={browseKey} setKey={setBrowseKey} excludeFromVendorCosting={excludeFromVendorCosting}/>
        ) : (
          <ScanomaticComponent onRowDataChange={handleRowDataChange}
            statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}  ref={childRef}
            tableData={tableData} columns={tablecolumns} statusType={statusType} browseKey={browseKey} setKey={setBrowseKey}/>
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

export default RulesComponent