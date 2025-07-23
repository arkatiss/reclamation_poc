import { SelectButton } from 'primereact/selectbutton';
import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { useFileDownloadDetailsMutation, useFileStatusDetailsMutation, useFileStatusExistingURLMutation, useGetFileStatusDetailsMutation, useGetStatusGenerateFileMutation, useGetStatusTrackerMutation } from '../../../services/customersSetup';
import { useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import  './status.scss';
import { Checkbox } from 'primereact/checkbox';

const StatusComponent=(props)=> {
  const [options,setOptions]= useState([]);
    const optionsU = ['Upload Status'];
    const optionsD = ['Download Status'];
    const [value, setValue] = useState('');
    const [columnsData,setColumnsData]= useState([]);
    const [rowData,setRowData]= useState([]);
    const [totalRecords,setTotalRecords] = useState('');
    const [type,setType] = useState('');
    const toast = useRef(null);
    const [getFileStatus,{dataResultStatus, isSuccessStatus, isLoadingStatus, isFetchingStatus, errorStatus}] = useFileStatusDetailsMutation();
    const [getStatusTracker,{dataResult, isSuccess, isLoading, isFetching, error}] = useGetStatusTrackerMutation(); 
    const [fileDownload,{dataResultFileDwl, isSuccessFileeDwl, isLoadingFileeDwl, isFetchingFileeDwl, errorFileeDwl}] = useFileDownloadDetailsMutation(); 
    const [getFileDownload,{dataResultFile, isSuccessFile, isLoadingFile, isFetchingFile, errorFile}] = useGetStatusGenerateFileMutation();
    const navObj = useSelector((state) => state.navigation);

    const [typeKey,setTypeKey]= useState('')

    const[requestId,setRequestID]= useState('')

    const [reqFileName,setReqFileName]= useState('')

    const[reqBy,setReqBy]= useState('')

    const [reqFrom,setReqFrom]= useState('')

    const[reqTo,setReqTo]= useState('')

    const [searchDisabaled,setSearchDisabled]= useState(false)
    const [refreshFlag,setRefreshFlag] = useState(false)
    const getModuleName =() =>{
        let moduleName = '';
        let moduleTypeParent = navObj.PARENT_MODULE;
        let moduleTypeChild = navObj.CHILD_MODULE;
        if(moduleTypeParent === 'customerSetup' && moduleTypeChild === 'Customer Master'){
           moduleName = 'customer_master';
        } else if(moduleTypeParent === 'customerSetup' && moduleTypeChild === 'Customer Groups'){
          moduleName = 'customer_group';
       }
       else if(moduleTypeParent === 'customerSetup' && moduleTypeChild === 'Customer Profile'){
        moduleName = 'customer_group';
     }
       

        return moduleName;
      }
      const resetGrid = ()=>{
        setColumnsData([]);
        setRowData([]);
      }
      const getControlName =() =>{
        let jobName = '';
        let downloadModule = navObj.CHILD_MODULE;
        if(downloadModule === 'Customer Master'){
           jobName = 'CUSTOMER_MASTER_DWL';
        }else if(downloadModule === 'Customer Groups'){
          jobName = 'CUSTOMER_GROUP_DWL';
        }else if(downloadModule === 'Customer Profile'){
          jobName = 'CUSTOMER_PROFILE_DWL';
        }else if(downloadModule === 'Item Summary'){
          jobName = 'ITEM_DWL';
        }else if(downloadModule === 'Vendor Master'){
          jobName = 'VENDOR_MASTER_DWL';
        }else if(downloadModule === 'Vendor Profile'){
          jobName = 'VENDOR_PROFILE_DWL';
        }else if(downloadModule === 'Rules Definition'){
          jobName = 'RULES_DWL';
        }else if(downloadModule === 'Vendor Costing'){
            jobName = 'VENDOR_COSTING_DWL';
        }else if(downloadModule === 'Scanomatic'){
            jobName = 'SCANOMATIC_DWL';
        }else if(downloadModule === 'Scan Process'){
            jobName = 'SCAN_PROCESSING_DWL';
        }else if(downloadModule === 'Scan Error Process'){
            jobName = 'SCAN_DWL';
        }else if(downloadModule === 'Exploded Rules'){
          jobName = 'RULES_EXPLODED_DWL';
      }else if(downloadModule === 'Value Maps'){
        jobName = 'VALUE_MAP';
    }else if(downloadModule === 'Hazardous'){
      jobName = 'HAZARDOUS_TEMPLATE';
  }

        return jobName;
      }
      const getControlNameUPL =() =>{
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

const [fileStatusExistingURL,{}]=useFileStatusExistingURLMutation()
    const [statusPayload,setStatusPayload] = useState({
     
      "requestMethod": "string",
  "doPages": "Y",
  "pgnOffset": "0",
  "pgnLimit": "15",
  "searchFormat": "string",
  "sortBy": "file_id",
  "sortOrder": "DESC",
  // "control_name" : type === 'DOWNLOAD' ? getControlName() : getControlNameUPL(),
  "searchParams": {
        "filterData": "control_type = ['UPLOAD']"
    }
  } )
  useEffect(() => {
    let intervalId;
  
    if (refreshFlag) {
      intervalId = setInterval(() => {
       refreshStatus();
      }, 15000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshFlag, value]); 
  
    const changeOptionInfo = (e) => {
        setValue(e.value);
        resetGrid();
        if(e?.value === 'Download Status'){
          fetchStatusData('DOWNLOAD')
          setType('DOWNLOAD')
        }else if(e?.value === 'Upload Status'){
          fetchStatusData('UPLOAD')
          setType('UPLOAD')
        }  
      }
      useEffect(() => {
        let OptionsInfo = [];
       if(navObj?.CHILD_MODULE === 'Vendor Master' || navObj?.CHILD_MODULE === 'Scan Process' || navObj?.CHILD_MODULE === 'Customer Master' || navObj?.CHILD_MODULE === 'Value Maps' || navObj?.CHILD_MODULE === 'Customer Profile' || navObj?.CHILD_MODULE === 'Exploded Rules'){
        OptionsInfo = ['Download Status'];
        fetchStatusData('DOWNLOAD');
        setType('DOWNLOAD')
       }
       else{
        OptionsInfo = ['Upload Status','Download Status'];
        fetchStatusData('UPLOAD');
        setType('UPLOAD')
       }
       setValue(OptionsInfo[0])
       setOptions(OptionsInfo)
      }, [navObj]); 
      const fetchStatusData = async (key) => {
        setTypeKey(key)
      // let control_name_URL =  key === 'DOWNLOAD' ? getControlName() : getControlNameUPL();
        let controlNameURL;
      if (navObj.CHILD_MODULE === 'Scanomatic' && key === 'DOWNLOAD') {
        controlNameURL = "SCANOMATIC_DWL','SCANOMATIC_TEMPLATE_DWL";
      }else if(navObj.CHILD_MODULE === 'Hazardous' && key === 'DOWNLOAD'){
         controlNameURL = "HAZARDOUS','HAZARDOUS_TEMPLATE"
      } else {
        controlNameURL = key === 'DOWNLOAD' ? getControlName() : getControlNameUPL();
      }
       const updatedstatusPayLoad = {
        ...statusPayload,
        control_name : key === 'DOWNLOAD' ? getControlName() : getControlNameUPL(),
        searchParams: {
          ...statusPayload.searchParams,
          // filterData: `file_id = [32586] and control_type =['${key}']`
          filterData: `control_type = ['${key}'] and control_name = ['${controlNameURL}']`
        },
      };
        try {
          let result = await getFileStatus(updatedstatusPayLoad).unwrap();
          console.log('Data Result:', result);
          if(result?.status  === 'Success'){
            
              if (result?.resultSet?.length===0) {
                let filterdColumns = result?.columns?.filter((item)=> item?.field !=='validation_status')
                setColumnsData(filterdColumns);
        
              }else{
                setColumnsData(result?.columns);
              }
              setRowData(result?.resultSet);
              setTotalRecords(result?.totalElements);
           
          }          
        else{
          // toast.current.show({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'failed',
          // });
        }
        } catch (e) {
          console.error('Error fetching customer list:', e);
        }
      };
      const handleClickFileName = async (rowData, field) => {
    
      const payload = {
        "file_id": rowData?.file_id
      }
        try {
          let result = await fileDownload(payload).unwrap();
          console.log('Data Result:', result);
          if(result?.file_url){
            clearSearch()
             window.open(result?.file_url,'_blank');
          }     
              
        else{
          // toast.current.show({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'failed',
          // });
        }
        } catch (e) {
          console.error('Error fetching customer list:', e);
        }
      };
      const handleClickErrorFile = async (rowData, field) => {
        const payload = {
          "file_id": rowData?.error_file_id,
          "file_type": "errorFile"
        }
          try {
            let result = await fileDownload(payload).unwrap();
            console.log('Data Result:', result);
            if(result?.file_url){
               window.open(result?.file_url,'_blank');
            }     
                
          else{
            // toast.current.show({
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: 'failed',
            // });
          }
          } catch (e) {
            console.error('Error fetching customer list:', e);
          }
        };
      const statusPageChange = (params) =>{
        resetGrid();
        statusPayload.pgnOffset = params.pageNumber;
        statusPayload.pgnLimit = params.pageSize;
        setStatusPayload(statusPayload);
         fetchStatusData(type);
      }

      const onSort = (params) =>{
        resetGrid();
        statusPayload.sortBy = params.sortBy;
        statusPayload.sortOrder = params.sortorder;
        setStatusPayload(statusPayload);
        fetchStatusData(type);
      }

      const clearSearch = ()=>{
        setRequestID('')
        setReqFileName('')
        setReqBy('')
        setReqFrom('')
        setReqTo('')
        fetchStatusData(typeKey)
      }
      useEffect(() => {
  const shouldEnable = [requestId, reqFileName, reqBy, reqFrom, reqTo].some(val => val !== "");
  setSearchDisabled(!shouldEnable);
}, [requestId, reqFileName, reqBy, reqFrom, reqTo]);

      const searchCriteria= async()=>{
        resetGrid();
         let control_name_URL =  typeKey === 'DOWNLOAD' ? getControlName() : getControlNameUPL()
         let newString=''
         if (requestId !=="") {
          newString+= ` and file_id = ['${requestId}']`
         }
          if (reqFileName !=="") {
          newString+= ` and file_name = ['${reqFileName}.xlsx']`
         }
          if (reqBy !=="") {
          newString+= ` and requested_by = ['${reqBy}']`
         }
          if (reqFrom !=="") {
          newString+= ` and date_from = ['${reqFrom}']`
         }
         if (reqTo !=="") {
          newString+= ` and date_to = ['${reqTo}']`
         }

        //  if ([requestId, reqFileName, reqBy, reqFrom, reqTo].some(val => val !== "")) {
        //    
        //   setSearchDisabled(!searchDisabaled);
        //   }
      let controlNameURL;
      if (navObj.CHILD_MODULE === 'Scanomatic' && typeKey === 'DOWNLOAD') {
        controlNameURL = "SCANOMATIC_DWL','SCANOMATIC_TEMPLATE_DWL";
      } else {
        controlNameURL = typeKey === 'DOWNLOAD' ? getControlName() : getControlNameUPL();
      }
      const updatedstatusPayLoad = {
        ...statusPayload,
        control_name: getControlName(),
        "pgnOffset": "0",
        "pgnLimit": "15",
        searchParams: {
          ...statusPayload.searchParams,
          filterData: `control_type = ['${typeKey}'] and control_name = ['${controlNameURL}']${newString} `
        },
      }
      try {
          let result = await getFileStatus(updatedstatusPayLoad).unwrap();
          console.log('Data Result:', result);
          if(result?.status  === 'Success'){
          setSearchDisabled(!searchDisabaled);

              if (result?.resultSet?.length===0) {
                let filterdColumns = result?.columns?.filter((item)=> item?.field !=='validation_status')
                setColumnsData(filterdColumns);
        
              }else{
                setColumnsData(result?.columns);
              }
              setRowData(result?.resultSet);
              setTotalRecords(result?.totalElements);
           
          }          
        else{
           setRowData([]);
              setTotalRecords(0);
          // toast.current.show({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'failed',
          // });
        }
        } catch (e) {
           setRowData([]);
              setTotalRecords(0);
          console.error('Error fetching customer list:', e);
        }
      }


    const handleDateChangeFrom = (e) => {
  if (e?.value) {
    const date = new Date(e.value);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setReqFrom(formattedDate);
  }
};
    const refreshStatus = () =>{
      if(reqBy || reqFileName || requestId || reqFrom || reqTo){
        //resetGrid();
          searchCriteria();
        }else{
          changeOptionInfo({ value: value });
        }
      }

      const handleDateChangeTo =(e)=>{
        if (e?.value) {
          const date = new Date(e.value);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setReqTo(formattedDate);
    } 
      }
return(
    <>
          <span><b>Search Criteria:</b></span>

    <div className="d-flex flex-row gap-3 align-items-center mb-2">
      <div className="d-flex flex-column">
        <label htmlFor="requestId" className="p-text">File ID</label>
        <InputText id="requestId" placeholder="File ID"  className='w-100 searchInputs'
        value={requestId} onChange={(e)=>setRequestID(e?.target?.value)}/>
      </div>

      <div className="d-flex flex-column">
        <label htmlFor="fileName" className="p-text">File Name</label>
        <InputText id="fileName" placeholder="File Name"  className='w-100 searchInputs'
        value={reqFileName} onChange={(e)=>setReqFileName(e?.target?.value)}/>
      </div>

      <div className="d-flex flex-column">
        <label htmlFor="requestedBy" className="p-text">Requested By</label>
        <InputText id="requestedBy" placeholder="Requested By" className='w-100 searchInputs' 
        value={reqBy} onChange={(e)=>setReqBy(e?.target?.value)}/>
      </div>

      <div className="d-flex flex-column">
        <label htmlFor="requestedFrom" className="p-text">Requested From</label>
        
           <Calendar showButtonBar
           id="requestedFrom" placeholder="Select Date"
           value={reqFrom ? new Date(reqFrom) : null}
           dateFormat="yy-mm-dd"
                                   
                                    onChange={handleDateChangeFrom}
                                  className={'calender-css autoWidth'}
                                    showIcon
                                    
                                  />
      </div>

      <div className="d-flex flex-column">
        <label htmlFor="requestedTo" className="p-text">Requested To</label>
        <Calendar showButtonBar id="requestedTo" placeholder="Select Date"  dateFormat="yy-mm-dd" className="calender-css autoWidth"
          value={reqTo ? new Date(reqTo) : null}  onChange={handleDateChangeTo} showIcon/>
      </div>

      <div className='d-flex flex-row gap-3 align-items-center mt-3'>
         <Button className="primary-button" onClick={()=>searchCriteria()}
            disabled={searchDisabaled}>Search</Button>
      <Button className="secondary-button" onClick={()=>clearSearch()}>Reset</Button>
      </div>
    </div>
    <div className="d-flex mb-3 align-items-center justify-content-between">
  <SelectButton
    className="selectiveButton"
    value={value}
    onChange={(e) => changeOptionInfo(e)}
    options={options}
  />

  <div className="d-flex align-items-center ms-auto">
    <div className="d-flex align-items-center me-3">
    <Checkbox checked={refreshFlag} onChange={(e) => {
      setRefreshFlag(e.checked)
    }} />

      <span className="ms-2">Auto Refresh</span>
    </div>
    <div style={{ opacity: refreshFlag ? 0.5 : 1 }} onClick={()=>!refreshFlag ? 
      refreshStatus() : null}>
      <i className="pi pi-sync" style={{ cursor: 'pointer' }}></i>
      <span className="ms-2">Refresh</span>
    </div>
  </div>
</div>


   
     <div className="prime-data-table-container" style={{ height: "400px", overflow: "auto" }}>
  <PrimeDataTable
    hideButtons
    columns={columnsData}
    isLoading={isLoading}
    data={rowData}
   // height='70'
    pageChange={statusPageChange}
    paginator={true}
    handleClickFileName={handleClickFileName}
    handleClickErrorFile={handleClickErrorFile}
    showColumnGroupIcon={false}
    storeView={"storeView"}
    smartSearchOff={true}
    totalRecords={totalRecords}
    pageSort={onSort}
    hideSort
  />
</div>

     </>
)
}
export default StatusComponent;