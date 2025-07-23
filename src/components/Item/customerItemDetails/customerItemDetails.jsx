import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { Toast } from 'primereact/toast';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useGetCustDetailsMutation, useGetItemAuditDetailsMutation, useUpdateCustomerItemDetailsMutation } from '../../../services/itemSetup';
import { useDispatch, useSelector } from 'react-redux';
import { generateFilterString } from '../../Shared/lookupPayload';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import {useCustomerItemDetailsCreateMutation} from '../../../services/itemSetup';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { changeSubModule } from '../../../slices/navigation';
import { audit } from '../../../assests/icons';

const CustomerItemDetails=(props)=> {   
  const toast = useRef(null);
  const [custItemData, setCustItemData] = useState([]);
  const [custItemColumns, setCustItemColumns] = useState([]);
  const [custItemAuditPopup, setCustItemAuditPopup] = useState(false);
  const [custItemAuditData, setCustItemAuditData] = useState([]);
  const [custItemAuditColumns, setCustItemAuditColumns] = useState([]);
  const [totalAuditRecords, setTotalAuditRecords] = useState('');
  const [getAuditData,{dataAudit,isSuccessAudit,isLoadingAudit,isFetchingAudit,errorAudit}] =useGetItemAuditDetailsMutation();
  const [getCustItemList, { }] = useGetCustDetailsMutation();
  const [updateCustomerItemDetails,{}]=useUpdateCustomerItemDetailsMutation()
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [bulkEditRecords,setBulkEditRecords] = useState([])
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const [bulkRecords,setBulkRecords]= useState([]);
  const [delRecords,setDelRecords]= useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState();
  const [customerItemDetailsCreate,{}]= useCustomerItemDetailsCreateMutation()
  const dispatch = useDispatch();
  const [filterCols,setFilterCols] = useState([]);
  const [insertFields,setInsertFields]= useState([]);
  const [totalRecords,setTotalRecords]= useState('');
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter);
  const navObj = useSelector((state) => state.navigation);

    const [upDateFields,setUpdateFields]= useState()
  
  const [custItemPayLoad,setCustItemPayLoad] = useState({
    "requestMethod": "getCustItemDetails",
    "pagination": {
        "pageNumber": 0,
        "pageSize": 15
    },
    "searchParams": {
        "sortBy": "",
        "sortorder": "",
        "filterData": ""
    },
   
    "MASTER_ITEM_ID": props?.upcData?.MASTER_ITEM_ID?.toString()
})
const [auditPayLoad,setAuditPayLoad] = useState(
    {
      "requestMethod": "getAudit",
       "pagination":{
      "pageNumber": 0, 
      "pageSize": 15
    },
      // "searchParams": {
          "recordId": '',
          "source": "CustItemAud"
      // }
  }
)

  /** @remarks Function to open Audit popup */
  const handleAuditPopUp = (data) =>{
    setCustItemAuditPopup(!custItemAuditPopup);
    auditPayLoad.recordId = data?.CUST_REC_ID;
    fetchAudit();
  }
  /** @remarks Function to close Audit popup */
  const closeDialog = () => {
    setCustItemAuditPopup(!custItemAuditPopup);
    dispatch(changeSubModule({subModule:'Item Details - Customer Item Details'}));
  };
     
/** @remarks Useeffect to get edited records */
      useEffect(()=>{
  if (bulkEdit.length >0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
/** @remarks Function to get Audit data */
  const fetchAudit = async(data) =>{
    dispatch(changeSubModule({subModule:'item'}));
    setCustItemAuditData([]);
    setCustItemAuditColumns([]);
 
   // auditPayLoad.recordId = data;
    try {
        let res=await getAuditData(auditPayLoad).unwrap();
        if (res?.status_code === 200 && res?.res_status === true) {
          setCustItemAuditData(res?.result_set);
            setCustItemAuditColumns(res?.columns);
            setTotalAuditRecords(res?.total_records);
        }
    } catch (e) {}
  }
 /** @remarks Useeffect to get filtered list */
  useEffect(() => {
    
    if (isFilter?.filterState === true || isFilter?.filterState === false || navObj?.CHILD_MODULE === 'Item Details - Customer Item Details') { 
      const filterString = generateFilterString(isFilter)
      const updatedCustItemPayLoad = {
        ...custItemPayLoad,
        searchParams: {
          ...custItemPayLoad.searchParams,
          filterData: filterString
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      // setCustItemPayLoad(updatedCustItemPayLoad);
      fetchCustItemData(updatedCustItemPayLoad);
    }
  }, [isFilter]);
  /** @remarks Function to get Customer item data */
    const fetchCustItemData = async (payload) => {
      const startTime = Date.now();
    let result = await getCustItemList(payload).unwrap();
    const duration = (Date.now() - startTime) / 1000; // in seconds
    if(result?.status_code === 200 && result?.res_status === true){
    setFilterCols(result?.filter_cols);
    setCustItemData(result?.result_set);
    setTotalRecords(result?.total_records);
    if (result?.result_set?.length ===0) {
      toast.current.show({ severity: 'info',summary: 'No Records',
        detail: `No customer item records found (in ${duration} seconds)`,
        life: 3000 });
        let filterData=result?.columns?.filter((item)=>item?.field !== 'Audit')
          setCustItemColumns(filterData);
    }else{
      toast.current.show({ severity: 'info',summary: 'Fetch Successful',
        detail: `Customer item records retrieved successfully (in ${duration} seconds)`,
        life: 3000 });
  
    setCustItemColumns(result?.columns);
    }
      const insertCols = result?.insert_fields?.map((item)=>{
      if(item.field === 'CUSTOMER_ITEM_DESCR'){
        return {...item,value:props?.upcData?.ITEM_DESCRIPTION_CASE}
      }
      return item
    })
    setInsertFields(insertCols)
    if (result?.update_by_columns) {
     setUpdateFields(result?.update_by_columns) 
    }
  }
    };
    const auditPageChange = (params) =>{
      auditPayLoad.pagination = params;
      setAuditPayLoad(auditPayLoad);
      fetchAudit();
    }
     /** @remarks Function to populate audit grid */
  const openAuditComponent = () => {
    return (
      <div>
          <PrimeDataTable
          columns={custItemAuditColumns}
          hideButtons
          globalViews={true}
          data={custItemAuditData}
          totalRecords={totalAuditRecords}
          pageChange={auditPageChange}
          menu={props.menu}
          paginator={true}
          smartSearchOff={true}
          height={50}
          isLoading = {isLoadingAudit}
          hideSort
        />
      </div>  
    );
  };
   /** @remarks Function to update records */
  const editBulkRecord = async(data)=>{
    let payLoad={
    "actionObject": data ? data : bulkEditRecords
  }
  let res = await updateCustomerItemDetails(payLoad).unwrap()
  if(res?.status_code === 200 || res?.res_status){
    dispatch(bulkEditResponse(res?.res_status))
    fetchCustItemData(custItemPayLoad);  }
  }
   /** @remarks Useeffect to get edited records */
  useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);       
    }
}, [bulkData]);
   /** @remarks Function to create records */
  const createBulkRecord = async() => {
    const bulkCreatePayload = {
    "actionObject": bulkRecords,
      "MASTER_ITEM_ID": props?.upcData?.MASTER_ITEM_ID?.toString(),
      "MASTER_UPC":props?.upcData?.MASTER_UPC,
      "ITEM_DESCRIPTION_CASE" : props?.upcData?.ITEM_DESCRIPTION_CASE,
      "UPC_MFG":  props?.upcData?.UPC_MFG,
      "UPC_ITEM": props?.upcData?.UPC_ITEM,
    }
    let res = await customerItemDetailsCreate(bulkCreatePayload)
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status))
       fetchCustItemData(custItemPayLoad);
    }
}
   /** @remarks Useeffect to get delete records */
useEffect(() => {
  if (bulkDelData?.length > 0) {
    const ids = bulkDelData?.map((e)=>{
      return e?.CUST_REC_ID
    })
    setDelMessage('Are you sure you want to delete the selected records?');
    setDelRecords(ids)
    setShowDeletePopup(!showDeletePopup)
  }
}, [bulkDelData?.length > 0]);
/** @remarks Function to open delete popup */
const hideDeletePopup =() =>{
setShowDeletePopup(false);
dispatch(clearDeleteRecordsData([]));
}
/** @remarks Function to delete records */
const handleDeleteRecords = async ()=>{
  const body = {
    "recordIds": delRecords,
    "opType": "DEL"
}
  try {
      let res = await updateCustomerItemDetails(body).unwrap();
      if(res?.status_code === 200 || res?.res_status){
        const delDetails = custItemData?.filter(record => !delRecords?.some(e=> e === record?.CUST_REC_ID));
        fetchCustItemData(custItemPayLoad);
        setCustItemData(delDetails);
        dispatch(clearDeleteRecordsData([]));
        dispatch(bulkCreateResponse(res?.res_status))
      }
      
  } catch (e) {}
}

const pageChange = (params) =>{
  // resetGrid();
  custItemPayLoad.pagination = params;
  setCustItemPayLoad(custItemPayLoad);
  fetchCustItemData(custItemPayLoad);
}
const onSort = (params) =>{
  // resetGrid();
  custItemPayLoad.searchParams.sortBy = params.sortBy;
  custItemPayLoad.searchParams.sortorder = params.sortorder;
  setCustItemPayLoad(custItemPayLoad);
  fetchCustItemData(custItemPayLoad);
}
  return (
    <div>
       <Toast ref={toast} />      
      <PrimeDataTable data={custItemData}  columns={custItemColumns} selectionMode={"multiple"}
    copyRow={props?.copyRow} handleAuditPopUp={handleAuditPopUp}  
    totalRecords={totalRecords}
    globalViews={true} 
    insertFields={insertFields} editBulkRecord={editBulkRecord}
    filterCols={filterCols} createBulkRecord={createBulkRecord} upDateFields={upDateFields}  pageChange={pageChange} pageSort={onSort} paginator={true}/>
    {custItemAuditPopup && (
        <DialogBox
          header="Audit Data"
          content={openAuditComponent()}
          style={{ width: "65vw" }}
          onHide={closeDialog}
        />
      )}
       <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />  
    </div>
  )
}

export default CustomerItemDetails