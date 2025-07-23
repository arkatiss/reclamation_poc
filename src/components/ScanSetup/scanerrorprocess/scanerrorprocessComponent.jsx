import React, { forwardRef,useEffect,useImperativeHandle, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import StatusComponent from '../../Shared/Status/Status';
import { Toast } from 'primereact/toast';
import { useGetScanErrorAuditMutation, useGetScanErrorProcessListMutation, useSaveScanErrorProcessMutation } from '../../../services/scanSetup';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { ConfirmDialog } from 'primereact/confirmdialog';

const ScanErrorProcessComponent= forwardRef((props, ref) => {
      const { onRowDataChange } = props;
  const toast = useRef(null);
  const [auditPopup,setAuditPopup]= useState(false); 
  const [rowData,setRowData]= useState([]);
  const [columns,setColumns]= useState([]);
  const [auditData,setAuditData] = useState([]);
  const [auditColumns,setAuditColumns] = useState([]);
  const [filterCols,setFilterCols] = useState([]);    
  const [insertFields,setInsertFields] = useState([]);
  const [getScanErrorProcessList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetScanErrorProcessListMutation();
  const [crudScanErrorProcess, { }] = useSaveScanErrorProcessMutation();
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
  const [getAuditScanProcess, { }] = useGetScanErrorAuditMutation();
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
  const [bulkRecords,setBulkRecords]= useState([]);
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords);
  const [delRecords,setDelRecords]= useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const dispatch = useDispatch();
  const [totalRecords,setTotalRecords] = useState('');
  const [auditTotalRecords,setAuditTotalRecords] = useState('');
  const [delMessage, setDelMessage] = useState();
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [bulkEditRecords,setBulkEditRecords] = useState([]);
    const [auditScanPayload,setAuditScanPayload] = useState({
     "requestMethod": "getAudit",
      "pagination":{
        "pageNumber": 0, 
        "pageSize": 15
      },
      // "searchParams": {
          "recordId": '',
          "source": "scanAudit"
  });
  /**
    @remarks
    This function to get Audit data
    @author Amar
    */
  const handleAuditPopUp = (data) => {
      setAuditPopup(!auditPopup);
      auditScanPayload.recordId = data?.record_id;
      setAuditColumns([]);
      setAuditData([]);
      setAuditScanPayload(auditScanPayload);
      fetchScanProcessAudit(auditScanPayload)
    };
    /** @remarks Function to close Audit popup */
  const closeAuditPopup = () => {
    setAuditPopup(!auditPopup);
  }
  const changeAuditPage = (params) =>{
    auditScanPayload.pagination = params;
     setAuditColumns([]);
     setAuditData([]);
     setAuditScanPayload(auditScanPayload);
      fetchScanProcessAudit(auditScanPayload);
  }
  /** @remarks Function to get Audit data */
  const fetchScanProcessAudit = async(payload) =>{
  //   const body = {
  //     "requestMethod": "getAudit",
  //     "pagination":{
  //       "pageNumber": 0, 
  //       "pageSize": 10
  //     },
  //     // "searchParams": {
  //         "recordId": data?.record_id,
  //         "source": "scanAudit"
  //     // },
  // }
    try {
        let res=await getAuditScanProcess(payload).unwrap();
        if (res?.res_status === true) {
          setAuditColumns(res?.columns);
          setAuditData(res?.result_set);
          setAuditTotalRecords(res?.total_records)
        }
        else{
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Audit failed',
          });
        }
    } catch (e) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Audit failed',
      });
    }
  }
    /** @remarks Function to show Audit data in Grid*/
  const auditPopUpDetails = ()=>{
    return (
      <div>
        <PrimeDataTable hideButtons hideSort height={50} paginator={true} pageChange={changeAuditPage} totalRecords={auditTotalRecords} columns = {auditColumns} data={auditData} smartSearchOff={true} selectionMode={null}
        storeView={'storeView'}/>
      </div>
    )
    }
    /**
  @remarks
  This function to get Scan error process list
  @author Amar
  */
const [scanErrorProcessPayLoad,setScanErrorProcessPayLoad] = useState({
  "requestMethod": "getScansStg",
  "pagination": {
      "pageNumber": 0,
      "pageSize": 15
  },
  "searchParams": {
      "sortBy": "cs_cust_number",
      "sortorder": "ASC",
      "filterData": ""
  },
})
  /** @remarks Useeffect to get filtered data */
useEffect(() => {
  if (isFilter?.filterState === true || isFilter?.filterState === false) {
    const filterString = generateFilterString(isFilter)
    const updatedScanProcessPayLoad = {
      ...scanErrorProcessPayLoad,
      searchParams: {
        ...scanErrorProcessPayLoad.searchParams,
        filterData: filterString
      },
       pagination:{
          pageNumber:0,
          pageSize:15
          }
    };
    setRowData([]);
     if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
    setColumns([])
    setScanErrorProcessPayLoad(updatedScanProcessPayLoad);
    fetchScanErrorProcessData(updatedScanProcessPayLoad);
  }
}, [isFilter]);
  /** @remarks Function to get upload message */
useEffect(() => {
  if(props?.browseKey === 'Success'){
    fetchScanErrorProcessData(scanErrorProcessPayLoad);
    props?.setKey('')
  }
}, [props?.browseKey]);
  /** @remarks Function to get Scan error process data */
const fetchScanErrorProcessData = async (Payload) => {
  try {
    let result = await getScanErrorProcessList(Payload).unwrap();
    if(result?.status_code === 200 || result?.res_status){
    const filteredData = result?.columns?.filter(item => item.filter);
    let createData = result?.columns?.filter(item => item.create);
      createData = createData.map((item)=>{
        return {...item, visibility:true}
      })
    setInsertFields(createData);
    setFilterCols(filteredData);
    setRowData(result?.result_set);
    if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
    setColumns(result?.columns);
    setTotalRecords(result?.total_records);
  }
  else{
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: result?.msg,
    });
  }
  } catch (e) {}
};

useImperativeHandle(ref, () => ({
/**
@remarks
This function returns the Data array
@author Karthik Manthripragada
*/
getRowData: () => rowData,
getColumns: ()=>columns
}));
         /**
  @remarks
  This function to open Vendor Master status page
  @author Amar
  */
  const openStatusComponent = ()=>{
    return(<StatusComponent showStatusTabs={props?.showStatusTabs}/>) 
   }
     /** @remarks Function to store created data */
   useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData); 
    }
}, [bulkData]); 
 /** @remarks Function to create data */
   const createBulkRecord = async() => {
    const bulkCreatePayload = {
      "requestMethod": "saveScanData",
      "actionObject": bulkRecords,
      "opType": "ADD",
    }
     const updatedData = bulkCreatePayload.actionObject.map(item => ({
    ...item,
    process_status: item.process_status || "NEW",
  }));
  const updatedPayload = {
    ...bulkCreatePayload,
    actionObject: updatedData,
  };    
    let res = await crudScanErrorProcess(updatedPayload);
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkCreateResponse(true));
      fetchScanErrorProcessData(scanErrorProcessPayLoad);
    }
  }
 /** @remarks Function to store edited data */
  useEffect(()=>{
    if (bulkEdit.length > 0) {
      setBulkEditRecords(bulkEdit)
    }
  },[bulkEdit])
   /** @remarks Function to update data */
  const editBulkRecord = async()=>{
    const payload={
      "requestMethod": "saveScanData",
      "actionObject": bulkEditRecords,
      "opType": "UPD"
  }
  let res = await crudScanErrorProcess(payload)
  if(res?.data?.status_code === 200 || res?.data?.res_status){
    dispatch(bulkEditResponse(true));
    fetchScanErrorProcessData(scanErrorProcessPayLoad);
    toast.current.show({ severity: 'info',summary: 'Update', detail: 'Updated successfully', life: 3000 });
  }
  else{
    dispatch(bulkEditResponse(true));
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail:'Failed',
    });
  }
}
/**
    @remarks
    useEffect to get delete records
    @author Amar
    */  
    useEffect(() => {
      if (bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          return e?.record_id
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
  const hideDeletePopup =() =>{
    setShowDeletePopup(false);
    dispatch(clearDeleteRecordsData([]));
  }
  /**
    @remarks
    Function to delete records
    @author Amar
    */  
    const handleDeleteRecords = async ()=>{
      const payload={
        "requestMethod": "saveScanData",
        "recordId": delRecords,
        "opType": "DEL"
    }
      try {
          let res = await crudScanErrorProcess(payload);
          if(res?.data?.status_code === 200 || res?.data?.res_status){
            toast.current.show({ severity: 'info',summary: 'Delete', detail: 'Deleted successfully', life: 3000 });
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.record_id))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(true))

          }
          else{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Delete failed',
            });
          }        
      } catch (e) { }
  }
   /** @remarks Function for pagination */
  const pageChange = (params) =>{
    setRowData([]);
    if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
    setColumns([])
    scanErrorProcessPayLoad.pagination.pageNumber = params.pageNumber;
    scanErrorProcessPayLoad.pagination.pageSize = params.pageSize;
    fetchScanErrorProcessData(scanErrorProcessPayLoad);
  }
  /** @remarks Function for sorting */
  const onSort = (params) =>{
    setRowData([]);
     if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
    setColumns([])
    scanErrorProcessPayLoad.searchParams.sortBy = params.sortBy;
    scanErrorProcessPayLoad.searchParams.sortorder = params.sortorder;
    setScanErrorProcessPayLoad(scanErrorProcessPayLoad);
    fetchScanErrorProcessData(scanErrorProcessPayLoad);
  }
return (
<div>
<Toast ref={toast} />
    <PrimeDataTable isLoading={isLoading} selectionMode={"multiple"} filterCols={filterCols} editBulkRecord={editBulkRecord} columns={columns} data={rowData} insertFields={insertFields} menu={props.menu} paginator ={true} handleAuditPopUp={handleAuditPopUp} height={33} createBulkRecord={createBulkRecord} totalRecords={totalRecords} pageSort={onSort} pageChange={pageChange}/>
    {auditPopup &&
    <DialogBox header='Audit Data' content={auditPopUpDetails()} style={{width:'60vw'}} onHide={closeAuditPopup} selectionMode={null}/>
    }
    {props?.statusPopup &&
          <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
        } 
         <ConfirmDialog visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />            
</div>
)
}
)

export default ScanErrorProcessComponent