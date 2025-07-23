import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useCreateBulkStoreMutation, useCreateCustomerGroupMutation, useCustomerGroupStoreAuditMutation, useGetCustomerGroupMutation, useStoreDeleteCustomerGroupMutation, useUpdateStoreDetailRecordsMutation } from '../../../services/customersSetup';
import { useGetGroupStoreDataMutation } from '../../../services/customersSetup';
import { Button } from 'primereact/button';
import StatusComponent from '../../Shared/Status/Status';
import { useDispatch, useSelector } from 'react-redux';
import { clearDeleteRecordsData,bulkCreateResponse, bulkEditResponse, bulkCreate, changeIsFilter } from '../../../slices/columnSelection';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { generateFilterString } from '../../Shared/lookupPayload';
import { changeSubModule } from '../../../slices/navigation';

const CustomerGroupsComponent = forwardRef((props, ref) => {
  const { onRowDataChange } = props;
  const [columns,setColumns] = useState([]);
  const [filterCols,setFilterCols] = useState([])
  const [rowData,setRowData] = useState([]);
  const [selectedRowData,setSelectedRowData] = useState({});
  const [storeGroupData,setStoreGroupData] = useState([]);
  const [insertFields,setInsertFields] = useState([]);
  const [storeInsertFields,setStoreInsertFields] = useState([])
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
  const [delRecords,setDelRecords]= useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState(); 
  const [recordIdAudit, setRecordIdAudit] = useState(); 
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const [bulkRecords,setBulkRecords]= useState([]);
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [bulkEditRecords,setBulkEditRecords] = useState([])
  const [groupAuditColumns, setGroupAuditColumns] = useState([]);
  const [groupAuditData, setGroupAuditData] = useState([]);
  const [totalRecords,setTotalRecords] = useState('');
  const [storeTotalRecords,setStoreTotalRecords] = useState('');
  const division = useSelector((state) => state.division);
  const toast = useRef(null);
  const [groupColumns,setGroupColumns] = useState({});
  const [storeFilter, setStoreFilter] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const childRef = useRef(null);
  const dispatch = useDispatch();
  const [getCustomerGroup, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetCustomerGroupMutation();
  const [getGroupStoreData,{}] = useGetGroupStoreDataMutation();
  const [createCustomerGroup,{}] = useCreateCustomerGroupMutation();
  const [storeDeleteCustomerGroup,{}]= useStoreDeleteCustomerGroupMutation();
  const [updateStoreDetailRecords,{}]=useUpdateStoreDetailRecordsMutation();
  const [createBulkStore,{}]=useCreateBulkStoreMutation()
  const [getCustomerGroupStoreAudit,{}]=useCustomerGroupStoreAuditMutation();
  const [auditPayLoad,setAuditPayLoad] = useState({ 
    requestMethod: "getAudit",
        recordId: '',
        source: "CustGrpAud",
        pagination:{
       pageNumber: 0,
      pageSize: 15
        },
         searchParams: {
      sortBy: "",
      sortorder: "",
      filterData: ""
    }
      });
  const [storeGrpPayload,setStoreGrpPayload] = useState({
    pagination:{
      pageNumber:0,
      pageSize:15
      },
      searchParams: {
        sortBy:"",
        sortorder:"",
        filterData:""
      }
  });
  const [customerPayLoad,setCustomerPayload]  = useState({
    requestMethod: "getRCGroup",
    pagination:{
    pageNumber:0,
    pageSize:15
    },
    searchParams: {
      sortBy:"",
      sortorder:"",
      filterData:""
      }
  })
  const [visibleStorePopup, setVisibleStorePopup] = useState(false);
  const [auditPopUp,setAuditPopUp] = useState(false) 
  const [rowIndex,setRowIndex] = useState();
  /** @remarks Function to Open store popup */
  const openStorePopup = (data,index) => {
        setUpdateFields([])
    setVisibleStorePopup(!visibleStorePopup);
    setRowIndex(index)
    setSelectedRowData(data);
    setStoreGroupData(data)
    dispatch(changeSubModule({subModule:"Store Assignment"}))
  }
  /** @remarks Useeffect for Load Customer group data on success Upload */
  useEffect(() => {
    if(props?.browseKey === 'Success'){
      fetchCustomerData(customerPayLoad);
      props?.setKey('')
    }
  }, [props?.browseKey]);
  /** @remarks Function to get Customer group data */
  const [upDateFields,setUpdateFields]= useState()
  const fetchCustomerData = async (payload) => {
    try {
      let result = await getCustomerGroup(payload).unwrap();
      if(result?.res_status){
        
        setInsertFields(result?.insert_fields);

        let columns = result.columns.filter(col => col.field  !== 'CHAIN_DESC');
        setColumns(columns);
        const resData = result.result_set?.map((item) => {
          let chainNum = item.CHAIN_NUM || '';
          let chainDesc = item.CHAIN_DESC || '';
          let chainValue = chainNum;
          if (chainNum && chainDesc) {
            chainValue = chainNum + ' - ' + chainDesc;
          } else if (chainDesc && !chainNum) {
            chainValue = chainDesc;
          }
          return { ...item, CHAIN_NUM: chainValue };
        })
        setRowData(resData); 
        if (props.onRowDataChange) {
        props.onRowDataChange(resData); 
      }
        setTotalRecords(result?.total_records);
        setFilterCols(result?.filter_cols)
        if (result?.update_by_columns?.length !==0) {
          setUpdateFields(result?.update_by_columns)
        }
      }
    } catch (e) {}
  };
    /** @remarks Useeffect to get filtered data */
  useEffect(() => { 
    
    
    if (isFilter?.filterState === true || isFilter?.filterState === false) {
        setStoreFilter(isFilter); 
      const filterString = generateFilterString(isFilter)
      const updatedCustomerPayLoad = {
        ...customerPayLoad,
        searchParams: {
          ...customerPayLoad.searchParams,
          filterData: filterString
        },
        pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      resetGrid();
      setCustomerPayload(updatedCustomerPayLoad);
      fetchCustomerData(updatedCustomerPayLoad);
    }
  }, [isFilter]);
/** @remarks Function to Open Audit popup */
  const handleAuditPopUp=(data)=>{
    auditPayLoad.recordId = data?.RCLM_CUST_STR_REC_ID;
    setAuditPayLoad(auditPayLoad);
    setAuditPopUp(!auditPopUp);
    setRecordIdAudit(data?.RCLM_CUST_STR_REC_ID);
   
    fetchCustomerGroupAudit(auditPayLoad);
    dispatch(changeIsFilter({ filterState: null  }));
    
  }
  /** @remarks Function to CLose Audit popup */
  const closeAuditPopup = () =>{
    setAuditPopUp(false);
  }
      /**
  @remarks
  This function returns the columns array
  @author Shankar Anupoju
  */
  useImperativeHandle(ref, () => ({
    getColumns: () => columns,
    getData: () =>rowData,
    getTemplateCols:() => insertFields
  }));
/**
@remarks
Function to send selected row value to dialog box
@author Shankar Anupoju
   */
  const [storeCols,setStoreCols] = useState([])
    /**
  @remarks
  This function is to create customer group
  @author Shankar Anupoju
  */
  const createBulkRecord = async() => {
    let updateData = bulkRecords.map((item)=>{
      return {...item,CHAIN_NUM:item.CHAIN_NUM.split('-')[0]}
    })

    const bulkCreatePayload = {
    "DATA": updateData,
    "requestMethod": "saveRcmCustGrp",
    }
    let res = await createCustomerGroup(bulkCreatePayload)
    if(res?.data?.res_status){
      // toast.current.show({ severity: 'info',summary: 'Create', detail: 'Created successfully', life: 3000 });
      dispatch(bulkCreateResponse(res?.data?.res_status))
      fetchCustomerData(customerPayLoad);
    }
}
  /** @remarks Useeffect to get inserted records */
useEffect(() => {
  if (bulkData) {
      setBulkRecords(bulkData);   
  }
}, [bulkData]);
  /** @remarks Function for back to customer  group main grid*/
const backToGroupGrid = ()=>{
  
  dispatch(changeSubModule({subModule:'Customer Groups'}))
  let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
setVisibleStorePopup(!visibleStorePopup)
//fetchCustomerData(customerPayLoad)

}
  /** @remarks Function for Pagination */
const pageChange = (params) =>{
  resetGrid();
  customerPayLoad.pagination = params;
  setCustomerPayload(customerPayLoad);
  fetchCustomerData(customerPayLoad);
}
  /** @remarks Function for Sorting */
const onSort = (params) =>{
  resetGrid();
  customerPayLoad.searchParams.sortBy = params.sortBy;
  customerPayLoad.searchParams.sortorder = params.sortorder;
  setCustomerPayload(customerPayLoad);
  fetchCustomerData(customerPayLoad);
}
const auditPageChange = (params) =>{
  resetAuditGrid();
  auditPayLoad.pagination = params;
  setAuditPayLoad(auditPayLoad);
  fetchCustomerGroupAudit(auditPayLoad);
}
  /** @remarks Function for Sorting */
const onAuditSort = (params) =>{
  resetAuditGrid();
  auditPayLoad.searchParams.sortBy = params.sortBy;
  auditPayLoad.searchParams.sortorder = params.sortorder;
  setAuditPayLoad(auditPayLoad);
  fetchCustomerGroupAudit(auditPayLoad);
}
const resetAuditGrid = () =>{
setGroupAuditColumns([]);
setGroupAuditData([]);
}
  /** @remarks Function for store grid Pagination */
const storePageChange = (params) =>{
  storeGrpPayload.pagination = params;
  fetchGroupStoreData();
}
  /** @remarks Function to reset grid data */
const resetGrid = () =>{
  setRowData([]);
  setColumns([]);
  setStoreCols([]);
  setStoreData([]);
}
  /** @remarks Function for store grid Sorting */
const onSortStore = (params) =>{
  storeGrpPayload.searchParams.sortBy = params.sortBy;
  storeGrpPayload.searchParams.sortorder = params.sortorder;
  fetchGroupStoreData();
}
  /** @remarks Function to get store data */
  const storeDetails = () => { 
    return (
      <div>
        <div className='d-flex gap-4 align-items-center'>
  <p style={{ fontWeight: 500 ,fontSize:18}}>Reclaim Customer Group: {storeGroupData?.RCLM_CUSTOMER_GRP_NUM}</p>
  <p style={{ fontWeight: 500,fontSize:18 }}>Reclaim Customer Group Name: {storeGroupData?.RCLM_CUSTOMER_GRP_NAME}</p>
  <p style={{ fontWeight: 500,fontSize:18 }}>C&S Chain: {storeGroupData?.CHAIN_NUM}</p>
  <Button onClick={backToGroupGrid} className='mb-1 ms-auto primary-button'>Back to Groups</Button>
</div>
        <PrimeDataTable columns={storeCols}  totalRecords = {storeTotalRecords} data={storeData} pageChange={storePageChange}  selectionMode={"multiple"} paginator ={true} style={{ width: '50vh' }} pageSort={onSortStore}
        handleAuditPopUp={handleAuditPopUp}  ref={childRef} storeView={'storeView'} insertFields={storeInsertFields}
        crudEnabled={true} globalViews={true} editBulkRecord={editStoreRecords} createBulkRecord={createBulkStoreRecord}
        visibleStorePopup={visibleStorePopup} upDateFields={upDateFields}/>

      </div>
    )
  }
    /**
@remarks
useEffect to get storeDetails api consumption
@author Sai Anil
   */
useEffect(() => {
  fetchGroupStoreData();
}, [storeGroupData]);
  /** @remarks Function for store grid Pagination */
const fetchGroupStoreData = async () => {
  setStoreData([])
  setStoreCols([])
  if (storeGroupData?.CHAIN_NUM !== undefined) {
    const filterString = generateFilterString(isFilter);
    storeGrpPayload.CHAIN_NUM = `${storeGroupData?.CHAIN_NUM}`;
    storeGrpPayload.RCLM_CUSTOMER_GRP_NUM = `${storeGroupData?.RCLM_CUSTOMER_GRP_NUM}`;
    storeGrpPayload.GRP_STATUS = `${storeGroupData?.GRP_STATUS}`;
    storeGrpPayload.GRP_EFFECTIVE_END_DATE = `${storeGroupData?.GRP_EFFECTIVE_END_DATE}`;
    storeGrpPayload.GRP_EFFECTIVE_START_DATE= `${storeGroupData?.GRP_EFFECTIVE_START_DATE}`;
    storeGrpPayload.USE_ICOST_AT_NO_SALES = `${storeGroupData?.USE_ICOST_AT_NO_SALES}`;
    storeGrpPayload.filterData = filterString;
    
    try {
      const result = await getGroupStoreData(storeGrpPayload).unwrap();
      if(result?.res_status){
        setStoreData(result?.result_set)
        setStoreCols(result?.columns)
        const insertFields = result?.insert_fields?.map((item)=>{
          if(item.field === 'STORE_EFFECTIVE_END_DATE'){
            return {...item,default_value:storeGroupData.GRP_EFFECTIVE_END_DATE,default:false,maxDate:storeGroupData.GRP_EFFECTIVE_END_DATE};
          
          }
          return item;
        })
        
        setStoreInsertFields(insertFields);
        setStoreTotalRecords(result?.total_records); 
        // setUpdateFields(result?.update_by_columns)
        if (result?.update_by_columns.length !==0) {
          setUpdateFields(result?.update_by_columns)
        }
      }
    } catch (e) {
    }
  }
};
/**
    @remarks
    useEffect to get delete records
    @author Sai Anil
    */  
    useEffect(() => {
      if (bulkDelData&&bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          if (visibleStorePopup === false) {
            return e?.RCLM_CUSTOMER_GRP_NUM
          }else{
            return e?.RCLM_CUST_STR_REC_ID
          }
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
/**
    @remarks
    Function to delete records
    @author Sai Anil
    */  
    const handleDeleteRecords = async ()=>{
      const body = {
        requestMethod: "delRcmCustGrp",
        recordIds: delRecords,
        columnName: visibleStorePopup ===false ?  "RCLM_CUSTOMER_GRP_NUM": "RCLM_CUST_STR_REC_ID"
    }
      try {
          let res=await storeDeleteCustomerGroup(body).unwrap();          
          if (res?.res_status === true) {
            setVisibleStorePopup(true)
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.RCLM_CUST_STR_REC_ID))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.res_status))
            fetchCustomerData(customerPayLoad)
          }
      } catch (e) {}
  }
    /** @remarks Function to delete popup */
    const hideDeletePopup =() =>{
    setShowDeletePopup(false);
    dispatch(clearDeleteRecordsData([]));
  }
    const fetchCustomerGroupAudit = async(body) =>{
      setGroupAuditColumns([])
      setGroupAuditData([])
    //   const body = {
    //     requestMethod: "getAudit",
    //     recordId: data,
    //     source: "CustGrpAud",
    //     pagination:{
    //    pageNumber: 0,
    //   pageSize: 15
    //     }
    // }
      try {
          let res=await getCustomerGroupStoreAudit(body).unwrap();
          if (res?.res_status === true) {
            setGroupAuditColumns(res?.columns)
            setGroupAuditData(res?.result_set)
            setRecordIdAudit(null)
          }
      } catch (e) {}
    }
     /** @remarks Function to store Cust Group audit data */
  const auditPopUpDetails = ()=>{
    return (
      <>
         {groupAuditColumns?.length > 0 &&  
      <div>
        <PrimeDataTable hideButtons  columns = {groupAuditColumns} data={groupAuditData} smartSearchOff={true} pageChange={auditPageChange} pageSort={onAuditSort} paginator ={true} 
        />
      </div>
  }
      </>
    )  
  }
  const dataTable = () => {
    return (
      <div>
        <PrimeDataTable columns={columns} data={rowData} menu={props.menu} selectionMode={'multiple'} height={32}/>
      </div>
    )
  }
/**
  @remarks
  This function to open Customer Group status page
  @author Amar
  */
  const openStatusComponent = ()=>{
    return(<StatusComponent showStatusTabs={props?.showStatusTabs} moduleName={props?.moduleName}/>) 
   } 
   const editStoreRecords = async(data)=>{
    let storeEditPaylod ={};
      storeEditPaylod ={
        "DATA": [
            {
               ...storeGroupData,
                "GRP_STORES_DATA":data ? data : bulkEditRecords
            }
        ],
        "columnName":"RCLM_CUST_STR_REC_ID",
        "requestMethod": "updateRcmCustGrp",
       }    
    try {
      let response = await updateStoreDetailRecords(storeEditPaylod).unwrap()
      if(response?.status_code === 200 || response?.res_status){
      dispatch(bulkEditResponse(response?.res_status))
      fetchGroupStoreData();
   }
   else{
    dispatch(bulkEditResponse(true))
   }
    } catch (error) {}
  }
   /** @remarks Function to update store data */
 const editGroupRecords = async(data)=>{
    let storeEditPaylod ={};
      storeEditPaylod ={
             "DATA": data ? data : bulkEditRecords,
              "GRP_STORES_DATA": [],
        "requestMethod": "updateRcmCustGrp",
        columnName: "RCLM_CUSTOMER_GRP_NUM"
       }   
    try {
      let response = await updateStoreDetailRecords(storeEditPaylod).unwrap()
       if(response?.status_code === 200 || response?.res_status){
     dispatch(bulkEditResponse(response?.res_status))
     fetchCustomerData(customerPayLoad);
   }
   else{
    dispatch(bulkEditResponse(true))
   }
    } catch (error) {}
  }
   /** @remarks Useeffect to get edit records */
   useEffect(()=>{
  if (bulkEdit.length > 0) { 
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])

/**
  @remarks
  This function to create store assignment
  @author Sai Anil
  */
   useEffect(()=>{
  if (bulkCreate.length > 0) {
    setBulkRecords(bulkCreate)
  }
},[bulkCreate])
 /** @remarks Function to create store data */
  const createBulkStoreRecord = async()=>{
  const storeCreatePaylod={
    "DATA": [
        {
                "RCLM_CUSTOMER_GRP_NUM": storeGroupData?.RCLM_CUSTOMER_GRP_NUM,
                "RCLM_CUSTOMER_GRP_NAME": storeGroupData?.RCLM_CUSTOMER_GRP_NAME,
                "CHAIN_NUM": storeGroupData?.CHAIN_NUM?.split('-')[0],
                // "STORE_DETAILS": storeGroupData?.STORE_DETAILS,
                "GRP_EFFECTIVE_START_DATE": storeGroupData?.GRP_EFFECTIVE_START_DATE,
                "GRP_EFFECTIVE_END_DATE": storeGroupData?.GRP_EFFECTIVE_END_DATE,
                "GRP_STATUS": storeGroupData?.GRP_STATUS,
                
                "USE_ICOST_AT_NO_SALES": storeGroupData?.USE_ICOST_AT_NO_SALES,
          "GRP_STORES_DATA": bulkRecords
        }
    ],
    "requestMethod": "saveRcmCustGrp",
   }
    try {
      console.log(storeCreatePaylod);
      let response = await createBulkStore(storeCreatePaylod).unwrap();
       if(response?.status_code === 200){
     dispatch(bulkCreateResponse(response?.res_status))
     fetchGroupStoreData();
   }
    } catch (error) {}
  }
   /** @remarks Useeffect for back to Group grid */
  useEffect(()=>{
    if (division && visibleStorePopup === true) {
      
      backToGroupGrid()
    }
  },[division])
    const [storeViewData,setStoreViewData] = useState({});
    const storeSelectedView = (params) =>{
      
      setStoreViewData(params);
    }
  return (
    <div className="card p-2">
       <Toast ref={toast} />
    {!visibleStorePopup === true ? 
    <>
        <span className='page-title mb-2 ms-2'>Reclaim Customer Group Definition</span>
      <PrimeDataTable  
        storeSelectedView={storeSelectedView}
        storeViewData={storeViewData} 
        
        groupColumns={groupColumns} columns={columns} data={rowData} totalRecords = {totalRecords}  filterCols={filterCols} menu={props.menu} visibleStorePopup={visibleStorePopup} openStorePopup={openStorePopup} paginator={true} insertFields={insertFields} createBulkRecord={createBulkRecord} pageChange={pageChange} pageSort={onSort}
      height={33} type={"Customer Groups"} selectionMode={'multiple'} isLoading={isLoading} editBulkRecord={editGroupRecords}
     upDateFields={upDateFields}/>
     </>
     : storeDetails()}
      {props?.visible &&
        <DialogBox header={"Download Status"} style={{ width: '63vw' }} content={dataTable()} onHide={props?.onClose}/>
      }
      {auditPopUp &&
      <DialogBox header="Audit Data" content={auditPopUpDetails()}  style={{width:'60vw'}} onHide={closeAuditPopup}/>
      }
       {props?.statusPopup &&
            <DialogBox content={openStatusComponent()} style={{width:'60vw'}} onHide={props?.onClose}/>
      }
       <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
    </div>
  )
})
export default CustomerGroupsComponent;