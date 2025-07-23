import React, { useEffect, useRef, useState, } from 'react'
import { download, status, template, upload } from '../../assests/icons';
import { SelectButton } from 'primereact/selectbutton';
import ItemSummaryComponent from './ItemSummary/itemSummaryComponent';
import {DivisionComponent} from '../Shared/Division';
import { Hazardous } from './hazardous/hazardous';
import { useDispatch, useSelector } from 'react-redux';
import { changeSubModule } from '../../slices/navigation';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import BrowseComponent from '../Shared/Browse/browse';
import { resetIsFilter } from '../../slices/columnSelection';
import DownloadComponent from '../Shared/Download/download';
import { Toast } from 'primereact/toast';
import TemplateComponent from '../Shared/Template/template';
const ItemComponent=(props)=> {
const [options, setOptions] = useState([
    { label: 'Item Summary', value: 'Item Summary' },
    { label: 'Item Details', value: 'Item Details', disabled: true },
    { label: 'Hazardous', value: 'Hazardous' },
    {label:'Dispositions',value:'Dispositions',disabled:true}
  ]);
  const [value, setValue] = useState(options[0]?.label);
  const [visibleBackButton, setVisibleBackButton] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  const childRef = useRef(null);
  const [itemDetailsPage,setItemDetailsPage] = useState(false)
  const dispatch = useDispatch()
  const navObj = useSelector((state) => state.navigation);
  const [permissionsObj,setPermissionsObj] = useState({});
  const [visibleUploadPopup,setVisibleUploadPopup]= useState(false);
  const[tableData,setTableData] = useState([]);
  const [tablecolumns,setTableColumns] = useState([])
      const tableDataResult = useSelector((state) => state?.upload?.tableData);
const tableDataColumns = useSelector((state)=>state?.upload?.tableCols)
    const division = useSelector((state) => state.division);
    const [browseKey,setBrowseKey] = useState(''); 
    const [downloadbtn, setDownloadBtn]  = useState(false);
    const [loader,setLoader] = useState(false);
    const [templateView, setTemplateView]  = useState(false);
    const [templateLoader,setTemplateLoader] = useState(false); 
      const [latestRowData, setLatestRowData] = useState([]);
    const toast = useRef(null);
    /** @remarks Useeffect to get data */
  useEffect(()=>{
    if (tableDataResult.length > 0 && tableDataColumns.length > 0) {
      setTableData(tableDataResult)
      setTableColumns(tableDataColumns)
      setVisibleUploadPopup(false);
    }
  },[tableDataResult,tableDataColumns]);
  /** @remarks Useeffect to show first tab name */
  useEffect(() => {
    
    handleTabChange('Item Summary')
}, []);

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
    /** @remarks Function to change view(Item summary to Item details tab) */
 const changeVIew = () => {
  if (childRef.current) { 
    
    childRef.current.changeVIewOne();
    setVisibleBackButton(!visibleBackButton)
    setItemDetailsPage(false)
    handleTabChange(options[0]?.label);
     setLatestRowData([]);
  }
 }
/** @remarks Function to show Item details tab*/
 const handleItemDetailsPage = ()=>{
      setItemDetailsPage(!itemDetailsPage)
 }
 /** @remarks Function to change tabs*/
 const handleTabChange = (newValue) => {
    
    setValue(newValue);
  //
    if(newValue !== 'Item Summary'){
      dispatch(resetIsFilter());
    }
     
    dispatch(changeSubModule({subModule:newValue}));
    if (newValue === 'Item Details') {
  
      setItemDetailsPage(true);
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.value === 'Item Summary'
        ? { ...option, disabled: true }
        : option.value === 'Item Details'
        ? { ...option, disabled: false }
        : option
        )
      );
    }else if(newValue === 'Dispositions'){
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
           option?.value === 'Dispositions'? { ...option, disabled: false } :option.value === 'Hazardous' ? {...option,disabled:true}: option
        )
      );
    }else {
      setItemDetailsPage(false);
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.value === 'Item Details' || option?.value === 'Dispositions'? { ...option, disabled: true } : {...option,disabled: false}
        )
      );
    }
  };
/** @remarks Useeffect to disable other tabs when we come from create button */
useEffect(() => {
    if (itemDetailsPage) {
      
      setValue(options[1]?.label);
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.value === 'Item Summary'
        ? { ...option, disabled: true }
        : option.value === 'Item Details'
        ? { ...option, disabled: false }
        : option
        )
      );
    } else if (value === 'Item Details') {
      setValue('');
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.value === 'Item Details' ? { ...option, disabled: true } : {...option,disabled: false}
        )
      );
    }
  }, [itemDetailsPage]);
/** @remarks Function to back to Item Summary page*/
const handleBackItemDetailsPage = ()=>{
  setValue(options[0]?.label)
}
/**
  @remarks
  This function to open Item setup status page
  @author Amar
  */
  const openStatusPopup = (value) => {
    setStatusPopup(!statusPopup);
  };
    /**
  @remarks
  This function to close  Item setup status page
  @author Amar
  */
  const closeDialog = () => {
    setStatusPopup(!statusPopup);
};
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

 /**
  @remarks
  This function to load browse component
  @author Sai Anil
  */
 const uploadDetails = () => {
  return (   
      <BrowseComponent closeDialog={closeDialogUpload} name={value}/>     
  );
};
/** @remarks Function to click on download button*/
const downloadFile = async () => {
  setDownloadBtn(true)
}
/** @remarks Function to show message from download component*/
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
/** @remarks Function to show message from status component*/
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
/** @remarks Function to click on template*/
 const downloadTemplate = () =>{
  setTemplateView(true);
}

const handleRowDataChange = (data) => {
  setLatestRowData(data);
};
const changeDisposition = (tabName) =>{
  handleTabChange(tabName)
}

  return (
    <div>
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => handleTabChange(e.value)} options={options} />
        {itemDetailsPage &&<span className='divison mr-4'>DIVISION: {division?.DIVISION}</span>}
        {!itemDetailsPage &&
        <div className='d-flex gap-2'>
          <div className='d-flex gap-2 align-items-center'>
          <span className='divison'>Division</span>
          <DivisionComponent />
          </div>
           {permissionsObj?.template && 
           <button className='secondary-button' disabled={templateLoader} onClick={downloadTemplate}><img src={template} alt="template"  width={16} className='me-1'/>Template{templateLoader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
          }
                {permissionsObj?.excelUpload && 
              <button className='secondary-button'onClick={handleVisibleUpload}><img src={upload} alt="upload"  width={15} className='me-1'/>Upload</button>
                }
          <>
                  {permissionsObj?.excelDownload  && <button disabled={latestRowData.length === 0 || loader} className='secondary-button'onClick={downloadFile}  ><img src={download} alt="download"   width={20} className='me-1' />Download{loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
                  }          
          </>
          {permissionsObj?.divisionStatus  && 
          <button className='primary-button' onClick={(e) => openStatusPopup(value)}><img src={status} alt="Status"  width={20} className='me-1'/>Status</button> 
          }
                  
        </div>
        }       
      </div>
      <div className="my-3 card">
        {value === 'Item Summary'  || itemDetailsPage === true ? (
          <ItemSummaryComponent onRowDataChange={handleRowDataChange} browseKey={browseKey} setKey={setBrowseKey} statusPopup={statusPopup} apVendorNumber={props?.apVendorNum} showStatusTabs={true} onClose={closeDialog} handleBackItemDetailsPage={handleBackItemDetailsPage} changeVIew={changeVIew} newValue={value} ref={childRef} itemDetailsPage={itemDetailsPage} handleItemDetailsPage={handleItemDetailsPage}
          tableData={tableData} columns={tablecolumns}/>
        ) : value === 'Hazardous' || value === 'Dispositions'?(
          <Hazardous onRowDataChange={handleRowDataChange} ref={childRef} changeTab={changeDisposition} browseKey={browseKey} setKey={setBrowseKey} statusPopup={statusPopup} showStatusTabs={false} onClose={closeDialog}/>
        ):(<></>)}
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

export default ItemComponent