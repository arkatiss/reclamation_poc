import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { PickList } from 'primereact/picklist';
import { dragVertical } from '../../../assests/icons';
import StatusComponent from '../../Shared/Status/Status';
import { useDispatch, useSelector } from 'react-redux';
import { useBulkRecordCreateCustProfileMutation, useCreateCustomerFeesMutation, useCustomerFeeAuditMutation, useDeleteCustomerProfileMutation, useGetCustomerFeeMutation, useGetCustomerProfileAuditMutation, useGetCustomerProfileGLAuditMutation, useGetCustomerProfileMutation, useGetCustomerProfileScanAuditMutation, useGetScannedSourcesMutation, useUpdateCustomerProfileMutation, useUpdateScanGLCustomerProfileMutation } from '../../../services/customersSetup';
import { Toast } from 'primereact/toast';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { SelectButton } from 'primereact/selectbutton';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { generateFilterString } from '../../Shared/lookupPayload';
import { changeSubModule } from '../../../slices/navigation';
const CustomerProfileComponent = forwardRef((props, ref) => {
    const { onRowDataChange } = props;
  const division = useSelector((state) => state.division);
  let [visibleSelectionPopup, setVisibleSelectionPopup] = useState(false);
  let [customerFeePopup, setcustomerFeePopup] = useState(false);
  let [customerAuditPopup, setCustomerAuditPopup] = useState(false);
  const [columns, setColumns] = useState([]);
  const [filterCols, setFilterCols] = useState([])
  const [rowData, setRowData] = useState([]);
  const isFilter = useSelector((state) => state?.columnSelection?.isFilter)
  const [feeRecord, setFeeRecord] = useState({});
  const [insertFields, setInsertFields] = useState([]);
  const [auditColumns, setAuditColumns] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [reclmCustProfId, setReclmCustProfId] = useState(null);
  const [bulkEditRecords,setBulkEditRecords] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [feesInsertFields, setFeesInsertFields] = useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false); 
  const [showCustomerFeesDeletePopup,setShowCustomerFeesDeletePopup]= useState(false);
  const [customerFeesAuditPopup,setCustomerFeesAuditPopup]= useState(false);
  const [scanRecord, setScanRecord] = useState({})
  const [totalRecords,setTotalRecords] = useState('')
  const [getCustomerProfile, { dataResult, isSuccess, isLoading, isFetching, error }] = useGetCustomerProfileMutation();
  const [getCustomerFee, { }] = useGetCustomerFeeMutation();
  const [getScannedSources, { }] = useGetScannedSourcesMutation();
  const [getAuditData, { }] = useGetCustomerProfileAuditMutation();
  const [createBulkRecordProfile, { }] = useBulkRecordCreateCustProfileMutation();
  const [updateScanAndGL, { }] = useUpdateScanGLCustomerProfileMutation();
  const [updateCustomerProfile, { }] = useUpdateCustomerProfileMutation();
  const [createCustomerFees, { }] = useCreateCustomerFeesMutation();
  const [getCustomerFeeAudit, {}] = useCustomerFeeAuditMutation();
  const [deleteGridRecords, {}] = useDeleteCustomerProfileMutation();
  const [getProfileAuditScan, { }] = useGetCustomerProfileScanAuditMutation();
  const [getProfileAuditGl, { }] = useGetCustomerProfileGLAuditMutation();
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit);
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const toast = useRef(null);
  const [delMessage, setDelMessage] = useState();
  const [delRecords,setDelRecords]= useState([]);
  const [feesAuditColumns, setFeesAuditColumns] = useState([]);
  const [feesAuditData, setFeesAuditData] = useState([]);
  const [totalRecordsFees,setTotalRecordsFees] = useState('');
  const [feeColumns, setFeeColumns] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [pickListSource, setPickListSourceItems] = useState([]);
  const [pickListTarget, setPickListTargetItems] = useState([]);
  const [selectedSourceData, setSelectedSourceData] = useState([]);
  const [selectedTargetData, setSelectedTargetData] = useState([]);
   const [sourceSelection, setSourceSelection] = useState([]);
    const [targetSelection, setTargetSelection] = useState([]); 
    const [groupColumns,setGroupColumns] = useState({});
      const [storeFilter, setStoreFilter] = useState([]);
  const [customerPayLoad,setCustomerPayload] = useState({
    requestMethod: "getCustomerProfile",
    pagination: {
      pageNumber: 0,
      pageSize: 15
    },
    searchParams: {
      sortBy: "",
      sortorder: "",
      filterData: ""
    }
  });
  const [auditPayLoad,setAuditPayLoad] = useState({
    "requestMethod": "getAudit",
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
  const [fetchAuditPayload,setFetchAuditPayload] = useState({
    pagination: {
      pageNumber: 0,
      pageSize: 15
  },
    requestMethod: "getAudit",
    recordId: '',
    source: "CustProfAud",
  })
  const [auditPayload,setAuditPayload] = useState({
    pagination: {
      pageNumber: 0,
      pageSize: 15
  },
    requestMethod: "getAudit",
    recordId: '',
    source: '',
  })
   /** @remarks Function to open Scaned source and Excluded rules popup */
  const openSelectionPopup = (data, field) => {
    setScanRecord({ data: data?.RCLM_CUST_PROFILE_ID, type: field })
    setVisibleSelectionPopup(!visibleSelectionPopup);
    setSelectedField(field)
    setReclmCustProfId(data?.RCLM_CUST_PROFILE_ID)
  }
  /**
    @remarks useEffect to get delete records @author Amar */  
    useEffect(() => {
      let ids;
      setDelRecords([]);
      if(bulkDelData?.length > 0 && bulkDelData[0]?.FEE_ID){
         ids = bulkDelData?.map((e)=>{
          return e?.FEE_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids);
        setShowCustomerFeesDeletePopup(!showCustomerFeesDeletePopup);
      }
      if (bulkDelData?.length > 0 && bulkDelData[0]?.RCLM_CUST_PROFILE_ID) {
         ids = bulkDelData?.map((e)=>{
          return e?.RCLM_CUST_PROFILE_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids);
        setShowDeletePopup(!showDeletePopup);
      }
  }, [bulkDelData?.length > 0]);
    /**
    @remarks Function to delete customer fees records @author Amar */  
    const handleDeleteCustomerFeesRecords = async ()=>{
      const body = {
        requestMethod: "deleteCustFees",
        opType: "DEL",
        userId: "2",
        actionObject: delRecords
        }
      try {
          let res = await createCustomerFees(body);
          if( res?.data?.res_status){
            const delDetails = feeData?.filter(record => !delRecords?.some(e=> e === record?.FEE_ID));
            setFeeData(delDetails);
            dispatch(clearDeleteRecordsData([]));
      
           dispatch(bulkCreateResponse(res?.data?.res_status))
          }     
      } catch (e) {
      }
  }
  /**
    @remarks Function to delete records @author Amar */  
    const handleDeleteRecords = async ()=>{
      const body = {
        requestMethod: "delRcmProfile",
        recordIds: delRecords
    }
      try {
          let res = await deleteGridRecords(body);
          if( res?.data?.res_status){
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.RCLM_CUST_PROFILE_ID))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.data?.res_status))
          }     
      } catch (e) {}
  }
   /** @remarks Function to open delete popup */
const hideDeletePopup =() =>{
  setShowDeletePopup(false);
  setShowCustomerFeesDeletePopup(false);
  dispatch(clearDeleteRecordsData([]));
}
 /** @remarks Function to get Audit data */
  const handleAuditPopUp = (data, field) => {
    if(field === 'customerFee'){
      setcustomerFeePopup(!customerFeePopup);
      setFeeRecord(data)
       dispatch(changeSubModule({subModule:field}));
    }
    else if(field === 'audit'){
    setAuditSelectedValue('Profile Audit');
    setCustomerAuditPopup(!customerAuditPopup);
    fetchAuditDetails(data);
    setReclmCustProfId(data?.RCLM_CUST_PROFILE_ID)     
    }
  };
  /**
    @remarks This function to open get Audit data @author Amar */
  const fetchAuditDetails = async (data) => {
    setAuditColumns([]);
    setFilterCols([]);
    fetchAuditPayload.recordId = data?.RCLM_CUST_PROFILE_ID;
    setFetchAuditPayload(fetchAuditPayload);
    try {
      let result = await getAuditData(fetchAuditPayload).unwrap();
      if( result?.res_status){
      setAuditData(result?.result_set)
      if (result?.result_set?.length===0) {
        let filterdColumns = result?.columns?.filter((item)=> item?.field !=='Audit')
              setAuditColumns(filterdColumns);
      }else{
              setAuditColumns(result?.columns);
      }
      setFilterCols(result?.filter_cols);
    } 
  }
  catch (e) {}
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
  useEffect(()=>{
    if (bulkEdit.length > 0) {
      setBulkEditRecords(bulkEdit)
    }
  },[bulkEdit]);
  const editBulkRecord = async()=>{
    const payload={
      "customerData": bulkEditRecords
  }
  let res = await updateCustomerProfile(payload)
  if(res?.data?.res_status){
    dispatch(bulkEditResponse(res?.data?.res_status))
    fetchCustomerData(customerPayLoad);
  }
  }
  const fetchCustomerData = async (payload) => {
    try {
      let result = await getCustomerProfile(payload).unwrap();
      if(result?.res_status){
      setInsertFields(result?.insert_fields)
      setRowData(result?.result_set);
      if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
      setTotalRecords(result?.total_records);
      setColumns(result?.columns);
      setFilterCols(result?.filter_cols);
    }
    } catch (e) { }
  };
  const closeDialog = () => {
     
    setVisibleSelectionPopup(false);
    setcustomerFeePopup(false);
    setCustomerAuditPopup(false)
          fetchCustomerData(customerPayLoad);

    //  dispatch(changeIsFilter({ 
    //         filterState: true, 
    //          jsonData: isFilter?.jsonData 
    //       }));  
  };
  /**
         @remarks This function to fetch data in customerFee popup  @author */
  const customerFeePayload = {
    "requestMethod": "getFees",
    "profileLevel": feeRecord?.PROFILE_LEVEL,
    "RCLM_CUST_PROFILE_ID": feeRecord?.RCLM_CUST_PROFILE_ID,
    pagination:{
      pageNumber:0,
      pageSize:15
      },
      searchParams: {
        sortBy:"",
        sortorder:"",
        filterData:""
        }
  }
  const customerScanPayload = {
    "requestMethod": "getscanGL",
      "RCLM_CUST_PROFILE_ID": scanRecord?.data,
      "columnType": scanRecord?.type === "scannedSources" ? "SCAN" : "GL"
  }
   /** @remarks Useeffect to get Customer fee and Customer scan data */
  useEffect(() => {
    if (feeRecord?.PROFILE_LEVEL && feeRecord?.RCLM_CUST_PROFILE_ID) {
      fetchCustomerFeeData();
    }
    if (scanRecord?.data) {
      fetchCustomerScanData()
    }
  }, [feeRecord, scanRecord]);
   /** @remarks Function to get Customer san data */
  const fetchCustomerScanData = async () => {
    setSource([]);
    setTarget([]);
    setPickListSourceItems([]);
    setPickListTargetItems([]);
    setSelectedSourceData([]);
    setSelectedTargetData([]);

    const res = await getScannedSources(customerScanPayload).unwrap();
    
    const formattedArray = res?.available?.map((item, index) => ({
      id: item?.lookupKey,
      code: `generatedCode${index}`,
      name: item.lookupKey + ' - ' + item?.lookupCode,
      key: item?.lookupKey
    }));
    const formatSelected = res?.selected?.map((item, index) => ({
      id: item?.lookupKey,
      code: `generatedCode${index}`,
      name:  item?.lookupCode && item?.lookupKey && item?.lookupCode.includes(item?.lookupKey)
      ? item?.lookupCode
      : item?.lookupKey + ' - ' + item?.lookupCode,
      key: item?.lookupKey
    }))
    
    setSource(formattedArray)
    setTarget(formatSelected)
    setPickListSourceItems(formattedArray);
    setPickListTargetItems(formatSelected);
    setScanRecord({});
  }
   /** @remarks Function to get Customer fee data */
  const fetchCustomerFeeData = async () => {
    if (feeRecord?.PROFILE_LEVEL && feeRecord?.RCLM_CUST_PROFILE_ID) {
      try {
        const result = await getCustomerFee(customerFeePayload).unwrap();
        if( result?.res_status){
          if (result?.result_set?.length==0) {
            let filterData=result?.columns?.filter((item)=>item?.field !== 'Audit')
            setFeeColumns(filterData);
          }else{
            setFeeColumns(result?.columns)
          }
          setFeeData(result?.result_set);
        setFeesInsertFields(result?.insert_fields);
        setTotalRecordsFees(result?.total_records);
        }      
      } catch (e) {}
    }
  };
  useImperativeHandle(ref, () => ({
    /**
    @remarks This function returns the columns array @author Shankar Anupoju */
    getColumns: () => columns,
    getData: () => rowData,
    getTemplateCols:() => insertFields
  }));
   /** @remarks Function to get changed Scaned sources and Excl GL data */
  const onChange = (event) => {
    const addedItems = event.target.filter(item => !pickListTarget.includes(item));
    const removedItems = event.source.filter(item => !pickListSource.includes(item));
    setSelectedSourceData(addedItems);
    setSelectedTargetData(removedItems);
    setSource(event.source);
    setTarget(event.target);
     setSourceSelection([]);
        setTargetSelection([]);
  };
   /** @remarks Function to get Scaned sources and Excl GL items data */
  const ItemTemplate = (item) => {
    return (
      <div className="d-flex flex-row">
        <div className="p-2"><img className="w-2rem" src={dragVertical} width={10} /></div>
        <div className="p-2"><span className="font-bold">{item.name}</span></div>
      </div>
    );
  };
 /**
    @remarks
    This function to Update Scan and GL
    @author Amar
    */
  const handleSubmitScanAndGL = async (data) => {
    
    const sourceData = selectedSourceData?.map((i)=>{
      return{ lookupKey: i?.key, lookupCode:selectedField === 'excludedGis' ?  i?.name?.split(' - ')[1] : i?.name }
    })
    const targetData = selectedTargetData?.map((i)=>{
      return{ lookupKey: i?.key, lookupCode: i?.name}
    })
    
    let payload; 
    if(selectedField === 'excludedGis'){
      payload = {
        RCLM_CUST_PROFILE_ID: reclmCustProfId,
        exclGLs_I: sourceData,
        exclGLs_R: targetData
      }
    }
      else{
        payload = {
          RCLM_CUST_PROFILE_ID: reclmCustProfId,
          scanSources_I: sourceData,
          scanSources_R: targetData
        }
      }
    try {
      let result = await updateScanAndGL(payload).unwrap();
      if(result?.res_status === true){
      }
      closeDialog();
    } catch (e) {}
  }
     /** @remarks Function to populate Scaned sources and Excl GL items */
  const SelectionDetails = () => {
    return (
      <div className="">
      <PickList
        dataKey="id"
        className="picklistData"
        source={source}
        target={target}
        onChange={onChange}
        itemTemplate={ItemTemplate}
        breakpoint="1280px"
        sourceHeader="Available"
        targetHeader="Selected"
        sourceStyle={{ height: '24rem', width: '25rem' }}   // Set width for source
        targetStyle={{ height: '24rem', width: '25rem' }}   // Set width for target
        targetSelection={targetSelection} 
        onTargetSelectionChange={(e) => setTargetSelection(e.value)} 
        sourceSelection={targetSelection}
        onSourceSelectionChange={(e)=>setTargetSelection(e.value)}
      />
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button className='secondary-button' onClick={closeDialog}>Cancel</button>
        <button className='primary-button' onClick={handleSubmitScanAndGL}>Submit</button>
      </div>
     </div>
    );
  };
  
 /**
    @remarks
    This function to create customer fees
    @author Amar
    */
  const createCustomerFeesBulkRecord = async() => {
    const createData = bulkRecords.map((r)=>{
      return {...r,PROFILE_ID:feeRecord?.RCLM_CUST_PROFILE_ID, PROFILE_LEVEL: bulkRecords[0]?.PROFILE_LEVEL,"SOURCE":'CUSTOMER','FEE_TYPE':'CUSTOMER'}
    });
    const bulkCreatePayload = {
    requestMethod: "saveCustFees",
    opType: "ADD",
    actionObject: createData,
    }
    let res = await createCustomerFees(bulkCreatePayload);
    if(res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status));
      fetchCustomerFeeData();
    }
 }
 /**
    @remarks
    This function to edit customer fees
    @author Amar
    */
    const editCustomerFeesBulkRecord = async(data) => {
      const bulkCreatePayload = {
      requestMethod: "updateCustFees",
      opType: "UPD",
      actionObject: data? data : bulkEditRecords,
      "SOURCE":"CUSTOMER"
      }
      let res = await createCustomerFees(bulkCreatePayload);
      if(res?.data?.res_status){
        dispatch(bulkEditResponse(true))
        fetchCustomerFeeData();
      }
   }
      /** @remarks Function back to main grid */
 const backToGroupGrid = ()=>{
  
    let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
  setcustomerFeePopup(!customerFeePopup);
  setFeeColumns([]);
  setFeeData([]);
  setRowData([]);
  setColumns([]);
  dispatch(changeSubModule({subModule:'Customer Profile'}));
  }
     /** @remarks Function pagination in customer fee */
  const pageChangeCustFees = (params) =>{
    resetGrid();
    customerFeePayload.pagination = params;
    fetchCustomerFeeData();
  }  

  const feeauditPageChange = (params) =>{
    setFeesAuditData([]);
    auditPayLoad.pagination = params;
    handleFeesAudit(auditPayLoad);
  }
   /** @remarks Function to get customer fee data */
  const customerFeeDetails = () => {
    return (
      <div>
        <div className='row mt-1 mb-1'>
        <div className='col-10'>
          <span style={{ fontWeight: '500', fontSize: '1.2rem' }}>Customer Fees</span>
        </div>
        <div className='col-2'>
        <Button onClick={backToGroupGrid} className='mb-1 primary-button floatEnd'>Back to Profile</Button>
        </div>
        </div>
        <PrimeDataTable 
        // groupColumns={groupColumns}
          insertFields={feesInsertFields}
          columns={feeColumns}
          totalRecords={totalRecordsFees}
          data={feeData}
          storeView
          menu={props.menu}
          selectionMode={'multiple'}
          crudEnabled={true}
          globalViews={true}
          createBulkRecord= {createCustomerFeesBulkRecord}
          height={50}
          handleAuditPopUp={handleAuditPopUpFees}
          editBulkRecord={editCustomerFeesBulkRecord}
          paginator={true}
          pageChange={pageChangeCustFees} 
          visibleStorePopup={true}
        />
      </div>
    );
  };
     /** @remarks Function to populate customer fee audit */
  const openCustomerFeesAuditComponent = () => {
    return (
      <div>  
          <PrimeDataTable
          hideButtons
          globalViews={true}
          columns={feesAuditColumns}
          data={feesAuditData}
          totalRecords={feesAuditData?.length > 0 ? feesAuditData?.length : 0}
          menu={props.menu}
          smartSearchOff={true}
          height={50}
          hideSort
          paginator={true}
          pageChange={feeauditPageChange}
          pageSort={onSort}
        />
      </div>
    );
  };
   /**
    @remarks
    This function to get customer fees audit
    @author Amar
    */
    const handleAuditPopUpFees = async(data) => {
      setCustomerFeesAuditPopup(!customerFeesAuditPopup);
      handleFeesAudit(data?.FEE_ID);
    }
       /** @remarks Function to get customer fee audit data */
    const handleFeesAudit = async(recId) => {
      setFeesAuditColumns([]);
      setFeesAuditData([]);
      auditPayLoad.recordId = recId;
      let res = await getCustomerFeeAudit(auditPayLoad);
      if(res?.data?.res_status){
        setFeesAuditColumns(res?.data?.columns)
        setFeesAuditData(res?.data?.result_set)
      }
  }
   /** @remarks Function to close customer fee popup */
  const closeFeesAuditDialog = () =>{
    setCustomerFeesAuditPopup(!customerFeesAuditPopup);
  }  
  /**
    @remarks
    This function to open Customer Profile status page
    @author Amar
    */
  const openStatusComponent = () => {
    return (<StatusComponent showStatusTabs={props?.showStatusTabs} moduleName={props?.moduleName} />)
  }
    /**
    @remarks
    This function to open audit page
    @author Amar
    */
    const options = ['Profile Audit','Scan Source', 'Excluded GL'];
    const [auditSelectedValue, setAuditSelectedValue] = useState('Profile Audit');
    const changeMenu = (e) => {
      setAuditSelectedValue(e.value)
      const auditType = e?.value === 'Profile Audit' ? 'CustProfAud' : e?.value === 'Scan Source' ? 'CustProfScan' : 'CustProfGL';
      fetchAuditDetailsScanAndGL(auditType);
    }
     /**
    @remarks
    This function to open get Scan and GL Audit data
    @author Amar
    */
  const fetchAuditDetailsScanAndGL = async (data) => {
    setAuditData([])
    setAuditColumns([]);
    auditPayload.recordId = reclmCustProfId;
    auditPayload.source = data;
    setAuditPayload(auditPayload);
    try {
      let result = data === 'CustProfAud' ? await getAuditData(auditPayload).unwrap() : data === 'CustProfScan' ? await getProfileAuditScan(auditPayload).unwrap() : await getProfileAuditGl(auditPayload).unwrap();
      if( result?.res_status){
      setAuditData(result?.result_set)
      setAuditColumns(result?.columns);
      setFilterCols(result?.filter_cols);
    }
   } catch (e) { }
  };
         /**
    @remarks
    This function to show profile audit,scan,excluded Gl
    @author Amar
    */
  const openAuditComponent = () => {
    return (
      <div>
         <SelectButton className='selectiveButton' value={auditSelectedValue} onChange={(e) => changeMenu(e)} options={options} />       
          <PrimeDataTable   
          hideButtons      
          columns={auditColumns}
          data={auditData}
          totalRecords={auditData?.length > 0 ? auditData?.length : 0}
          menu={props.menu}
          pageChange={auditPageChange}
          paginator={true}
          smartSearchOff={true}
          height={50}
          hideSort
          storeView={'storeView'}
        />
      </div>
    );
  };
      /**
    @remarks
    This function to create customer profile
    @author Amar
    */
    const dispatch = useDispatch();
    const [bulkRecords,setBulkRecords]= useState([]);
    const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
    useEffect(() => { 
      if (bulkData) {
          setBulkRecords(bulkData); 
      }
  }, [bulkData]);
  const createBulkRecord = async() => {
   const bulkCreatePayload = {
   "customerData": bulkRecords
   }
   let res = await createBulkRecordProfile(bulkCreatePayload)
   if( res?.data?.res_status){
     dispatch(bulkCreateResponse(res?.data?.res_status))
     fetchCustomerData(customerPayLoad);
   }
}
      /**
    @remarks
    This function to Grid next page
    @author Shankar Anupoju
    */
const pageChange = (params) =>{
  resetGrid();
  customerPayLoad.pagination = params;
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
   /** @remarks Function to reset Grid data */
const  resetGrid = ()=>{
  setRowData([]);
  setColumns([]);
};
   /** @remarks Function for audit pagination */
const auditPageChange = (params) =>{
  auditPayload.pagination = {}
  auditPayload.pagination = params;
  setAuditPayload(auditPayload);
  const auditType = auditSelectedValue === 'Profile Audit' ? 'CustProfAud' : auditSelectedValue === 'Scan Source' ? 'CustProfScan' : 'CustProfGL';
  fetchAuditDetailsScanAndGL(auditType);
}
  const [storeViewData,setStoreViewData] = useState({});
  const storeSelectedView = (params) =>{
    
    setStoreViewData(params);
  }
   /** @remarks Useeffect for back to main grid */
useEffect(()=>{
    if (division && customerFeePopup === true) {
      backToGroupGrid()
    }
  },[division])
  return (
    <div>
      <Toast ref={toast} />
      {!customerFeePopup === true ? 
      <PrimeDataTable  groupColumns={groupColumns} height={33} columns={columns} totalRecords={totalRecords} data={rowData} menu={props.menu} insertFields={insertFields} visibleSelectionPopup={visibleSelectionPopup} 
        storeSelectedView={storeSelectedView}
        storeViewData={storeViewData}
       openSelectionPopup={openSelectionPopup} pageChange={pageChange}  pageSort={onSort} filterCols={filterCols} paginator={true} handleAuditPopUp={handleAuditPopUp} selectionMode={'multiple'} isLoading={isLoading} createBulkRecord ={createBulkRecord } editBulkRecord={editBulkRecord}/>
    : customerFeeDetails()}
      {visibleSelectionPopup &&
        <DialogBox header='Manage Selection' content={SelectionDetails()} style={{ width: '60vw' }} onHide={closeDialog} />
      }
      {props?.statusPopup &&
        <DialogBox content={openStatusComponent()} style={{ width: '70vw' }} onHide={props?.onClose} />
      }
    {customerAuditPopup && (
        <DialogBox
          header="Audit Data"
          content={openAuditComponent()}
          style={{ width: "65vw" }}
          onHide={closeDialog}
        />
      )}
    {customerFeesAuditPopup && (
        <DialogBox
          header="Audit Data"
          content={openCustomerFeesAuditComponent()}
          style={{ width: "65vw" }}
          onHide={closeFeesAuditDialog}
        />
      )}
      <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
       <ConfirmDialog  visible={showCustomerFeesDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer Fees" icon="pi pi-info-circle" accept={handleDeleteCustomerFeesRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />     
    </div>
  );
})
export default CustomerProfileComponent;