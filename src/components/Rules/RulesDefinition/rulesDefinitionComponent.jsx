import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useCreateCustomerFeesMutation, useCustomerFeeAuditMutation } from '../../../services/customersSetup';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { bulkCreate, bulkCreateResponse, bulkDelete, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { Button } from 'primereact/button';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useGetRulesAuditRecMutation, useGetRulesVendorFeeMutation,useGetRulesDefListMutation, useSaveRulesDefMutation, useDeleteRulesDefMutation } from '../../../services/rulesSetup';
import { ConfirmDialog } from 'primereact/confirmdialog';

const RulesDefinitionComponent = forwardRef((props, ref) => {
      const { onRowDataChange } = props;
  const [getRulesDefinitionList, { }] = useGetRulesDefListMutation();
  const [saveRulesDef, {  }] = useSaveRulesDefMutation();
  const [deleteRulesDef, { }] = useDeleteRulesDefMutation();
  const [createCustomerFees, { }] = useCreateCustomerFeesMutation();
  const [getCustomerFeeAudit, {}] = useCustomerFeeAuditMutation();
  const [getRulesAuditRec,{}]= useGetRulesAuditRecMutation();
  const [customerFeeDetails,setCustomerFeeDetails]= useState([])
  const[customerFeeDetailsColumns,setCustomerFeeDetailsColumns]= useState([])
  const [getRulesVendorFee,{}]= useGetRulesVendorFeeMutation();
  const [insertFields, setInsertFields] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [hasCustomerFeePopUp, setHasCustomerFeePopuP] = useState(false)
  const [customerFeeAudit, setCustomerFeeAudit] = useState(false)
  const [customerFeeAuditData, setCustomerFeeAuditData] = useState([])
  const [rulesVendorFeePopUp,setRulesVendorFeePopUp]= useState(false)
  const [rulesDefAuditColumns, setRulesDefAuditColumns] = useState([])
  const [rulesDefAuditData, setRulesDefAuditData] = useState([])
  const [rulesDefAudit, setRulesDefAudit] = useState(false)
  const bulkData = useSelector((state) => state?.columnSelection?.bulkRecord)
  const [bulkEditRecords,setBulkEditRecords] = useState([])
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [bulkRecords, setBulkRecords] = useState([]);
  const [filterCols,setFilterCols] = useState([]);
  const userObject = useSelector(state => state?.user?.userData)
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [createPopup, setCreatePopup] = useState(true);
  const isFilter = useSelector((state) => state?.columnSelection?.isFilter);
  const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
  const [totalRecords,setTotalRecords] = useState('');
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const [delRecords,setDelRecords]= useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState();
  const [upDateFields,setUpdateFields]= useState();
  const [customerFeeColumns,setCustomerFeeColumns] = useState([])
  const [customerFeeAuditColumns,setCustomerFeeAuditColumns]= useState([])
  const [customerFeeData, setCustomerFeeData] = useState([]);
  const [storeFilter, setStoreFilter] = useState([]);
    const [groupColumns,setGroupColumns] = useState({});
    const [storeCustProfileId, setStoreCustProfileId] = useState('');
  const [vendorAuditPayLoad,setVendorAuditPayLoad] = useState({
    "requestMethod": "getVendProfile",
    "searchParams": {
        "filterData": '',
        "sortBy": "",
        "sortorder": "",
        },
    "pagination": {
        "pageNumber": 0,
        "pageSize": 15
    },
    recordId:''
})

const [customerAuditPayLoad,setCustomerAuditPayLoad] = useState({
  "requestMethod": "getVendProfile",
   "source":"FeeDetailsAud",
  "searchParams": {
      "filterData": '',
      "sortBy": "",
      "sortorder": "",
      },
  "pagination": {
      "pageNumber": 0,
      "pageSize": 15
  },
  recordId:''
})
    /**
    @remarks useEffect to get delete records @author Amar */  
    useEffect(() => {
      if (bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          return e?.RULE_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
 /**
    @remarks useEffect upload success to load Rules def data */
  useEffect(() => {
    if(props?.browseKey === 'Success'){
      fetchRulesDefinitionList(payloadGetRules);
      props?.setKey('')
    }
  }, [props?.browseKey]);
/**
    @remarks Function to delete records @author Amar
    */  
    const handleDeleteRecords = async ()=>{
      const body = {
        requestMethod: "delRulesDef",
        recordIds: delRecords
    }
      try {
          let res = await deleteRulesDef(body);
          if(res?.data?.status_code === 200 || res?.data?.res_status){
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.RULE_ID))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.data?.res_status))
          }      
      } catch (e) {}
  }
   /**  @remarks Function to hide Delete popup */
const hideDeletePopup =() =>{
  setShowDeletePopup(false);
  dispatch(clearDeleteRecordsData([]));
}
  const [payloadGetRules, setpayloadGetRules] = useState({
    "requestMethod": "getRulesDef",
    "searchParams": {
      "filterData": "",
     "sortBy": "",
    "sortorder":"",
  },
  "pagination": {
      "pageNumber": 0,
      "pageSize": 15
  }
});

   /**  @remarks Useeffect to get Edited records through popup */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
/**  @remarks Useeffect to get filtered data */
  useEffect(() => {  
    if ((isFilter?.filterState === true ||  isFilter?.filterState === false) && props?.fromExploded === false) {
      if(storeCustProfileId){

      }else {
 const filterString = generateFilterString(isFilter);
       if(isFilter.filterString?.length > 0) {
              setStoreFilter(isFilter); 
        }  
      const updatedVendorPayLoad = {
        ...payloadGetRules,
        searchParams: {
          
          filterData: filterString,
          ...addFilObj 
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      setpayloadGetRules(updatedVendorPayLoad);
         setRowData([]);
         setColumns([]);
      fetchRulesDefinitionList(updatedVendorPayLoad);
      }
     
    }
  }, [isFilter]);
  /**  @remarks Useeffect to get Rules def data from getting Exploded rules component */
  useEffect(() => { 
    if(props?.fromExploded === true){
      setStoreCustProfileId(props?.fromExplodedKey?.CUSTOMER_PROFILE_ID);
      let filterData = "RULE_ID = " + [props?.fromExplodedKey?.CUSTOMER_PROFILE_ID];
      filterData = filterData.replace(/(\d+)/, "['$&']");
      const updatedVendorPayLoad = {
        ...payloadGetRules,
        searchParams: {
        
          filterData: filterData, 
          ...addFilObj 
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
  fetchRulesDefinitionList(updatedVendorPayLoad)
  }
   }, [props?.fromExploded]);
   /**  @remarks Function to get Rules def list */
  const fetchRulesDefinitionList = async (payload) => {
    try {
      let result = await getRulesDefinitionList(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
      if (result?.update_by_columns.length !==0) {
        setUpdateFields(result?.update_by_columns)
      }
       setFilterCols(result?.filter_cols);
       let filtercolumns = result?.columns?.map((item,index)=>{
      if (item?.header === 'C&S Chain') {
        return{
          ...item, field: 'CHAIN_NUMBER_'
        }
      }
      return item
    })
    let filteredData = result?.result_set?.map((item, index) => {
      let updatedItem = { ...item };
    
      if (item["CHAIN_NUMBER_"]) {
        updatedItem["CHAIN_NUMBER_"] = item["CHAIN_NUMBER"];
      }
    
      if (item["AP_VENDOR_NUMBER"]) {
        updatedItem["AP_VENDOR_NUMBER"] = `${item["AP_VENDOR_NUMBER"]} - ${item["AP_VENDOR_NAME"]}`;
      }
    
      if (item["RCLM_CUSTOMER_GRP_NUM"]) {
        updatedItem["RCLM_CUSTOMER_GRP_NUM"] = `${item["RCLM_CUSTOMER_GRP_NUM"]} - ${item["RCLM_CUSTOMER_GRP_NAME"]}`;
      }
    
      return updatedItem;
    }); 
    if (result?.result_set?.length===0) {
      let filterdColumns = result?.columns?.filter((item)=> item?.field !=='RULE_UPDATEABLE' && item?.field !=='HAS_VENDOR_FEE' && item?.field !=='HAS_CUSTOMER_FEE' && item?.field !=='Audit')
      setColumns(filterdColumns)
    }else{
      setColumns(filtercolumns)
    }
      setRowData(filteredData)
      if (props.onRowDataChange) {
        props.onRowDataChange(filteredData); 
      }
      setInsertFields(result?.insert_fields)
      setTotalRecords(result?.total_records);
      }
    } catch (e) {}
  };
  /**  @remarks Funtion for pagination */
  const pageChange = (params) =>{
    setRowData([]);
    setColumns([]);
    payloadGetRules.pagination.pageNumber = params.pageNumber;
    payloadGetRules.pagination.pageSize = params.pageSize;
    fetchRulesDefinitionList(payloadGetRules);
  }
    /**  @remarks Funtion for sorting */
  const onSort = (params) =>{
    setRowData([]);
    setColumns([]);
    payloadGetRules.searchParams.sortBy = params.sortBy;
    payloadGetRules.searchParams.sortorder = params.sortorder;
    setpayloadGetRules(payloadGetRules);
    fetchRulesDefinitionList(payloadGetRules);
  }
  const [rulesDefpayload,setRulesDefPayload] = useState({
     "requestMethod": "getAudit",
    "pagination": {"pageNumber": 0, "pageSize": 10},
     searchParams: {
      sortBy: "",
      sortorder: "",
      filterData: ""
    },
        "recordId": '', // rule_id
        "source": "FeeDetailsAud"  
  });
    /**  @remarks Funtion to open Rules Audit popup */
  const handleRulesAuditPopUp = (data) => {
    setRulesDefAudit(!rulesDefAudit);
    setRulesDefAuditData([]);
      setRulesDefAuditColumns([]);

    rulesDefpayload.recordId = data?.RULE_ID;
    setRulesDefPayload(rulesDefpayload);
    fetchRulesDefAuditData(rulesDefpayload)
  }
  const changeRulesAudit = (params)=>{
    rulesDefpayload.pagination = params;
      setRulesDefAuditData([]);
      setRulesDefAuditColumns([]);
       setRulesDefPayload(rulesDefpayload);
    fetchRulesDefAuditData(rulesDefpayload)
  }
    /**  @remarks Funtion to get Audit data */
  const fetchRulesDefAuditData = async (data) => {
    
    vendorAuditPayLoad.recordId = data?.recordId
    try {
      let res = await getRulesAuditRec(vendorAuditPayLoad).unwrap();
      if (res?.res_status) {
      setRulesDefAuditColumns(res?.columns);
      setRulesDefAuditData(res?.result_set);
      }
    } catch (error) {}
  }

  const vendorfeeauditPageChange = (params) =>{
    setRulesDefAuditData([]);
    setRulesDefAuditColumns([])
    vendorAuditPayLoad.pagination.pageNumber = params.pageNumber;
    vendorAuditPayLoad.pagination.pageSize = params.pageSize;
    fetchRulesDefAuditData(vendorAuditPayLoad);
  }

  const customerfeeauditPageChange = (params) =>{
    setRulesDefAuditColumns([]);
    setRulesDefAuditData([]);
    customerAuditPayLoad.pagination.pageNumber = params.pageNumber;
    customerAuditPayLoad.pagination.pageSize = params.pageSize;
    fetchCustomerAuditData(customerAuditPayLoad);
  }
  /**
@remarks This function to open Rules Definition status page @author Amar */
  const openStatusComponent = () => {
    return (<StatusComponent showStatusTabs={props?.showStatusTabs} statusType={props?.statusType}/>)
  }
  useImperativeHandle(ref, () => ({
    /**
  @remarks This function returns the columns array @author Shankar Anupoju */
    getColumns: () => columns,
    getData: () => rowData,
    getTemplateCols: () => insertFields
  }));
   /**  @remarks Funtion to handle Audit popup */
  const handleAuditPopUp = (data, field) => {
    console.log(data);
  if (field === "HAS_CUSTOMER_FEE") {
    setHasCustomerFeePopuP(true); 
    fetchCustomerFeeDetails(data);
    setRowData(data)
    setUpdateFields([])
  } else if (field === "HAS_VENDOR_FEE") {
    setRulesVendorFeePopUp(!rulesVendorFeePopUp); 
    fetchVendorFeeData(data);
    setRowData(data)
    setUpdateFields([])
  } else if (field === "Audit") {
        setRulesDefAuditData([]);
      setRulesDefAuditColumns([]);
    setRulesDefAudit(!rulesDefAudit);
    rulesDefpayload.recordId = data?.RULE_ID;
    setRulesDefPayload(rulesDefpayload);
    fetchRulesDefAuditData(rulesDefpayload);
        setRowData(data)
  }
};
 /**  @remarks Funtion to get Vendor fee data */
  const fetchVendorFeeData = async(data)=>{
  setInsertFields([])
  const payload={
    "requestMethod": "getFeesByRules",
    "searchParams": { 
      "RULE_ID": data?.RULE_ID,
        "SOURCE": "RULE",
        "FEE_TYPE": "VENDOR",
	"AP_VENDOR_NUMBER": data?.AP_VENDOR_NUMBER,
	"NEW_VENDOR": data?.NEW_VENDOR,
	"STORE": data?.STORE,
	"CHAIN_NUMBER": data?.CHAIN_NUMBER,
	"RECALL_CLASS": data?.RECALL_CLASS,
	"RCLM_CUSTOMER_GRP_NUM": data?.RCLM_CUSTOMER_GRP_NUM,
	"GL_CODE": data?.GL_CODE
  }
  }
  let res = await getRulesVendorFee(payload).unwrap()
  if(res?.status_code === 200 || res?.res_status){
  setCustomerFeeDetailsColumns(res?.columns)
  setCustomerFeeDetails(res?.result_set)
  setInsertFields(res?.insert_fields)
  if (res?.update_by_columns?.length !==0) {
    setUpdateFields(res?.update_by_columns)
  }
  }
}
 /**  @remarks Funtion to get Customer fee data */
  const fetchCustomerFeeDetails = async (data) => {
    setInsertFields([])
    const payload={
    "requestMethod": "getFeesByRules",
     "searchParams": {      
        "RULE_ID": data?.RULE_ID,
        "SOURCE": "RULE",
        "FEE_TYPE": "CUSTOMER",
        "AP_VENDOR_NUMBER":  data?.AP_VENDOR_NUMBER,
        "NEW_VENDOR": data?.NEW_VENDOR,
        "STORE": data?.STORE,
        "CHAIN_NUMBER": data?.CHAIN_NUMBER,
        "RECALL_CLASS": data?.RECALL_CLASS,
        "RCLM_CUSTOMER_GRP_NUM":data?.RCLM_CUSTOMER_GRP_NUM,
        "GL_CODE": data?.GL_CODE
    } 
}
    try {
      let res = await getRulesVendorFee(payload).unwrap();
      if(res?.status_code === 200 || res?.res_status){
      setCustomerFeeData(res?.result_set)
      setInsertFields(res?.insert_fields)
      if (res?.update_by_columns?.length !==0) {
        setUpdateFields(res?.update_by_columns)
      }
      setCustomerFeeColumns(res?.columns);
      } 
    } catch (error) {}
  };
   /**  @remarks Funtion to create Customer fee */
const createBulkCustomerFee = async()=>{
const createData = bulkRecords.map((r)=>{
      return {...r,PROFILE_ID:rowData?.RULE_ID, PROFILE_LEVEL: "RULE","SOURCE":'RULE','FEE_TYPE':'CUSTOMER','STATUS':'Active'}
    });
    const bulkCreatePayload = {
    requestMethod: "saveCustFees",
    opType: "ADD",
    actionObject: createData,
    } 
    let res = await createCustomerFees(bulkCreatePayload);
    if(res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status));
      fetchCustomerFeeDetails(rowData);
    }
}
 /**  @remarks Funtion to update customer fee */
const editBulkCustomerFee = async(data)=>{
      const bulkCreatePayload = {
      requestMethod: "updateCustFees",
      opType: "UPD",
      'SOURCE':"RULE",
      actionObject: data ? data : bulkEditRecords,
      }
      let res = await createCustomerFees(bulkCreatePayload);
      if(res?.data?.res_status){
      dispatch(bulkEditResponse(true))
      fetchCustomerFeeDetails(rowData);
      }
}
 /**  @remarks Funtion to create Vendor fee */
const createBulkVendorFee = async()=>{
const createData = bulkRecords.map((r)=>{
      return {...r,PROFILE_ID:rowData?.RULE_ID, PROFILE_LEVEL: "RULE","SOURCE":'RULE','FEE_TYPE':'VENDOR','STATUS':'Active'}
    });
   const keysToRemove = ['FEE_ID', 'RECLAIM_VENDOR_ID', 'RECALL_FEE_FLAG', 'FEE_EXPIRED']
    const removeKeys = (ary, keys) => {
      return ary?.map(obj => {
          const newObj = { ...obj }; 
          keys?.forEach(key => {
              delete newObj[key]; 
          });
          return newObj;
      });
  };
  const updatedActionObject = removeKeys(createData, keysToRemove);
    const bulkCreatePayload = {
    requestMethod: "saveCustFees",
    opType: "ADD",
    actionObject: updatedActionObject,
    }  
    let res = await createCustomerFees(bulkCreatePayload);
    if(res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status));
      fetchVendorFeeData(rowData);
    }
}
 /**  @remarks Funtion to update Vendor fee */
const editBulkVendorFee = async(data)=>{
      const bulkCreatePayload = {
      requestMethod: "updateCustFees",
      opType: "UPD",
      'SOURCE':"RULE",
      actionObject: data ? data : bulkEditRecords,
      }
      let res = await createCustomerFees(bulkCreatePayload);
      if(res?.data?.res_status){
      dispatch(bulkEditResponse(true))
      fetchVendorFeeData(rowData);
      }
}
 /**  @remarks Funtion to handle Audit popup */
const handleAuditPopUpFees = (data)=>{
  setRulesDefAudit(!rulesDefAudit);
  handleFeesAudit(data?.FEE_ID);
}
 /**  @remarks Funtion to get Fees Audit data */
 const handleFeesAudit = async(recId) => {
  
      setRulesDefAuditColumns([]);
      setRulesDefAuditData([]);
      customerAuditPayLoad.recordId = recId;
      let res = await getCustomerFeeAudit(customerAuditPayLoad);
      if(res?.data?.status === "SUCCESS" || res?.data?.res_status){
        setRulesDefAuditColumns(res?.data?.columns)
        setRulesDefAuditData(res?.data?.result_set)
      }
  }
   /**  @remarks Funtion to handle Audit popup */
  const getCustomerFeeAuditDetails = (data) => {
    setCustomerFeeAudit(!customerFeeAudit)
    setCustomerFeeAuditData([])
    setCustomerFeeAuditColumns([])
    fetchCustomerAuditData(data?.FEE_ID)
  }
   /**  @remarks Funtion to handle Audit data */
  const fetchCustomerAuditData = async (data) => {
    
     setRulesDefAuditColumns([]);
      setRulesDefAuditData([]);
      customerAuditPayLoad.recordId = data;

 try {
    let res = await getCustomerFeeAudit(customerAuditPayLoad).unwrap();
    setCustomerFeeAuditData(res?.result_set)
      setCustomerFeeAuditColumns(res?.columns)
  } catch (error) {}
  }
   /**  @remarks Useeffect to get Inserted data */
  useEffect(() => {
    if (bulkData) {
      setBulkRecords(bulkData);
    }
  }, [bulkData]);
   /**  @remarks Funtion to handle Create Rules def  */
  const createBulkRecord = async () => {
    const bulkCreatePayload = {
      "requestMethod": "saveRulesDef",
      "opType": "ADD",
      "actionObject": bulkRecords,
    }
    let res = await saveRulesDef(bulkCreatePayload);
    if (res?.data?.res_status) {
      dispatch(bulkCreateResponse(true))
      setCreatePopup(!createPopup)
      fetchRulesDefinitionList(payloadGetRules);
    }
  }
     /**  @remarks Funtion to handle Update Rules def  */
  const editBulkRecord = async (data) => {
    const bulkCreatePayload = {
      "requestMethod": "saveRulesDef",
      "opType": "UPD",
      "actionObject": data ? data :bulkEditRecords,
    }
    let res = await saveRulesDef(bulkCreatePayload);
    if (res?.data?.res_status) {
      dispatch(bulkEditResponse(true))
      fetchRulesDefinitionList(payloadGetRules);
    }
  }
     /**  @remarks Funtion to handle back to main grid */
  const backToGroupGrid = ()=>{
    let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
    //props?.changeVIew();
    setHasCustomerFeePopuP(false);
    setRulesDefAudit(false)
    setRulesVendorFeePopUp(false)
    setRulesDefAuditColumns([])
    setRulesDefAuditData([])
    }
    /**  @remarks Funtion to show Customer Fee Data in grid  */
  const hasCustomerFeeContent = () => {
    return (
      <>
      <div className='row m-1'>
      <div className='col-10'>
        <span style={{ fontWeight: '500', fontSize: '1.2rem' }}>Customer Fees</span>
      </div>
      <div className='col-2'>
      <Button onClick={backToGroupGrid} className='mb-1 primary-button floatEnd'>Back to Rules</Button>
      </div>
      </div>
      <PrimeDataTable
       enableCrud = {rowData?.RULE_UPDATEABLE === 'N' ? false : true }
      columns={customerFeeColumns} data={customerFeeData} handleAuditPopUp={getCustomerFeeAuditDetails}
      menu={props.menu} createBulkRecord={createBulkCustomerFee} editBulkRecord={editBulkCustomerFee}
      crudEnabled={true}
      storeView
      globalViews={true}
      height={50}
      insertFields={insertFields}
      selectionMode={"multiple"}
      upDateFields={upDateFields}
      visibleStorePopup={true}
      />
      </>
    )
  }
     /**  @remarks Funtion to show Customer fee Audit data in grid  */
  const customerFeeAuditTemplate = () => {
    return (
      <PrimeDataTable hideButtons hideSort height={50} storeView smartSearchOff={true} columns={customerFeeAuditColumns} data={customerFeeAuditData} 
      paginator={true}
             pageChange={customerfeeauditPageChange} pageSort={onSort}/>
    )
  }
       /**  @remarks Funtion to show Rules def Audit data in grid  */
  const rulesDefAuditPopUp = () => {
    return (
      <div>
            <PrimeDataTable hideButtons hideSort height={50} smartSearchOff={true} columns={rulesDefAuditColumns} data={rulesDefAuditData}
            storeView={"storeView"}           paginator={true}
             pageChange={vendorfeeauditPageChange} pageSort={onSort}/>
      </div>
    )
  }
       /**  @remarks Funtion to show Vendor fee data in grid  */
  const rulesVendorTemplate = ()=>{
    return (
      <div>
<div className='row m-1'>
      <div className='col-10'>
           <span style={{ fontWeight: '500', fontSize: '1.2rem' }}>Vendor Fees</span>
      </div>
      <div className='col-2'>
              <Button onClick={backToGroupGrid} className='mb-1 ms-auto primary-button floatEnd'>Back to Rules</Button>
      </div>
      </div>
            <PrimeDataTable 
            enableCrud = {rowData?.RULE_UPDATEABLE === 'N' ? false : true }
            crudEnabled={true} 
            
            storeView
            createBulkRecord={createBulkVendorFee} editBulkRecord={editBulkVendorFee} selectionMode={"multiple"}
      globalViews={true} insertFields={insertFields}  columns={customerFeeDetailsColumns} data={customerFeeDetails}
                handleAuditPopUp={handleAuditPopUpFees} upDateFields={upDateFields} visibleStorePopup={true}/>
      </div>
    )
  }
  const [storeViewData,setStoreViewData] = useState({});
  const storeSelectedView = (params) =>{
    
    setStoreViewData(params);
  }
    /**  @remarks Funtion to close Rules def audit popup  */
  const closeRulesDefPopUp = () => {
    setRulesDefAudit(!rulesDefAudit)
  }
  /**  @remarks Funtion to close Customer fee audit popup  */
  const closeCustomerFeeAuditPopUp = () => {
    setCustomerFeeAudit(!customerFeeAudit)
  }
  return (
    <div>
      <Toast ref={toast} />
      {!hasCustomerFeePopUp && !rulesVendorFeePopUp && !hasCustomerFeePopUp ? (
      <PrimeDataTable 
      
        filterCols={filterCols} 
        pageChange={pageChange} 
        groupColumns={groupColumns}
        storeSelectedView={storeSelectedView}
        storeViewData={storeViewData}
        columns={columns} 
        data={rowData} 
        paginator={true} 
        height={33} 
        insertFields={insertFields} 
        createBulkRecord={createBulkRecord}
        handleAuditPopUp={handleAuditPopUp} 
        handleRulesAuditPopUp={handleRulesAuditPopUp}
        selectionMode = "multiple"
        totalRecords={totalRecords}
        pageSort={onSort}
        editBulkRecord={editBulkRecord}
        upDateFields={upDateFields}
      />
    ) : (
      <>
        {rulesVendorFeePopUp && rulesVendorTemplate()}
        {hasCustomerFeePopUp && hasCustomerFeeContent()}
      </>
    )}
      {props?.statusPopup &&
        <DialogBox  header ={props?.statusHeader}content={openStatusComponent()} style={{ width: '70vw' }} onHide={props?.onClose} />
      }
      <>
        {customerFeeAudit &&
          <DialogBox header = "Audit Data" content={customerFeeAuditTemplate()} style={{ width: '60vw' }} onHide={closeCustomerFeeAuditPopUp} />
        }
        {rulesDefAudit &&
          <DialogBox header = "Audit Data" content={rulesDefAuditPopUp()} style={{ width: '60vw' }} onHide={closeRulesDefPopUp} />
        }
         <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />           
      </>
    </div>
  )
})
export default RulesDefinitionComponent;