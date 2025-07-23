import React, { forwardRef,useEffect,useImperativeHandle, useRef, useState} from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import VendorProfileView from '../VendorProfile/VendorProfileView';
import VendorItemDetails from '../VendorProfile/VendorItemDetails';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import StatusComponent from '../../Shared/Status/Status';
import { useCreateVendorMasterMutation, useGetVendorMasterAuditMutation, useGetVendorMasterListMutation, useGetVendorProfileFromMasterMutation, useGetVendorProfileMutation } from '../../../services/vendorSetup';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useNavigate } from 'react-router-dom';
import { changeNavigation, changeSubModule } from '../../../slices/navigation';
import { use } from 'react';

const VendorMaster = forwardRef((props, ref) => {
      const { onRowDataChange } = props;
  const toast = useRef(null);
  const [selectedField, setSelectedField] = useState(null);
  const [rowData,setRowData] = useState([]);
  const [columns,setColumns] = useState([]);
  const [filterCols,setFilterCols] = useState([]);
  const [insertFields,setInsertFields] = useState([]);
  const [auditPopUp,setAuditPopUp] = useState(false); 
  const [auditColumns, setVendorMasterAuditColumns] = useState([]);
  const [auditData, setVendorMasterAuditData] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null); 
  const [vendorNum, setAPVendorNum] = useState(null); 
  const [selectedVendorName, setSelectedVendorName] = useState(null); 
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord);
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  const [bulkRecords,setBulkRecords]= useState([]);
  const [bulkEditRecords,setBulkEditRecords] = useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState();
  const [delRecords,setDelRecords]= useState([]);
  const [totalRecords,setTotalRecords] = useState('');
  const dispatch = useDispatch();
  const [getVendorMasterList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetVendorMasterListMutation();
  const [getCustomerGroupStoreAudit, {}]=useGetVendorMasterAuditMutation();
  const [bulkRecordCrud,{}] =useCreateVendorMasterMutation();
  const isFilter = useSelector((state) => state?.columnSelection?.isFilter);
  const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
  const navObj = useSelector((state) => state.navigation);
  const [storeFilter, setStoreFilter] = useState([]);
  const [groupColumns,setGroupColumns] = useState({});

  useImperativeHandle(ref, () => ({
    /**
  @remarks
  This function returns the Data array
  @author Sai Anil
  */
    getData: () => rowData,
    getColumns: () =>columns
  }));
  const navigate = useNavigate();
 /**
  @remarks
  This function to open Vendor profile page
  @author Amar
  */  
  const handleOpenProfilePage = (field,source, rowData) =>{
    setSelectedField(source);
    if(source === 'Vendor'){
      setSelectedVendorId(rowData?.AP_VENDOR_NUMBER);
      setSelectedVendorName(rowData?.AP_VENDOR_NAME);
      props?.handleActionProfilePageNavigation(!props?.profilePageAction);
    }
    else{
      dispatch(changeSubModule({subModule:'Item Summary', }));
      dispatch(changeNavigation({ navigation: '/itemSetup' }));
      sessionStorage.setItem('storeFilter', JSON.stringify(storeFilter));
      navigate('/itemSetup', { state: { itemId: rowData?.AP_VENDOR_NUMBER ,fromVendorMaster:true} });
      setAPVendorNum(rowData?.AP_VENDOR_NUMBER)
    }
 
  }
 /**
  @remarks
  This function to open Vendor Master status page
  @author Amar
  */
  const openStatusComponent = ()=>{
   return(<StatusComponent showStatusTabs={props?.showStatusTabs}/>) 
  }

   /**
  @remarks
  This function to get Vendor master list
  @author Amar
  */
  const [vendorPayLoad,setVendorPayLoad] = useState({
    requestMethod: "getVendMstr",
    pagination:{
    pageNumber:0,
    pageSize:15
    },
    searchParams: {
      sortBy:"",
      sortorder:"",
      filterData:"",
      
      }
  })

   const resetGrid = ()=>{
    setRowData([]);
    setColumns([]);
  }
  /** @remarks Useeffect to get filtered data */
  useEffect(() => {
     let storedFilter = JSON.parse(sessionStorage.getItem('storeFilter'));
    if ((isFilter?.filterState !== undefined && isFilter?.filterState !== null && navObj?.CHILD_MODULE === "Vendor Master" && storedFilter === null)) {
     setStoreFilter(isFilter);
     
      const filterString = generateFilterString(isFilter);
      const updatedVendorPayLoad = {
        ...vendorPayLoad,
        searchParams: {
          ...addFilObj,
          filterData: filterString
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      setVendorPayLoad(updatedVendorPayLoad);
      // setRowData([]);
      resetGrid();
      fetchVendorMasterData(updatedVendorPayLoad);
    }
  }, [isFilter]);
  useEffect(() => {
    let storedFilter = JSON.parse(sessionStorage.getItem('storeFilter'));
    if(storedFilter){
      setGroupColumns(prev => ({ ...prev, FILTER_STRING: storedFilter?.filterString }))
      setStoreFilter(storedFilter);
      sessionStorage.removeItem('storeFilter');
    }
  },[])

  /** @remarks Function for pagination */
  const pageChange = (params) =>{
    setRowData([]);
    vendorPayLoad.pagination = params;
    fetchVendorMasterData(vendorPayLoad);
  }
    /** @remarks Function for sorting */
  const onSort = (params) =>{
    setRowData([]);
    vendorPayLoad.searchParams.sortBy = params.sortBy;
    vendorPayLoad.searchParams.sortorder = params.sortorder;
    setVendorPayLoad(vendorPayLoad);
    fetchVendorMasterData(vendorPayLoad);
  }
  /** @remarks Function to get vendor master data */
  const fetchVendorMasterData = async (payload) => {
    try {
      let result = await getVendorMasterList(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
      setInsertFields(result?.insert_fields);
      setFilterCols(result?.filter_cols);
      setRowData(result?.result_set);
      if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
      setColumns(result?.columns);
      setTotalRecords(result?.total_records);
      }else {
        setRowData([]);
        setColumns([]);
        setTotalRecords(0);
      }     
    } catch (e) {
      setRowData([]);
      setColumns([]);
      setTotalRecords(0);
    
    }
  };
    /**
  @remarks
  This function to get Audit information
  @author Amar
  */
  const closeAuditPopup = () =>{
    setAuditPopUp(false);
  }
  const handleAuditPopUp=(data)=>{
    setAuditPopUp(!auditPopUp);

    venAuditPayload.recordId = data?.RECLAIM_VENDOR_ID;
    setVenAuditPayload(venAuditPayload);
    fetchVendorMasterAudit(venAuditPayload);
  }

  const [venAuditPayload,setVenAuditPayload] = useState({
      requestMethod: "getAudit",
      pagination:{
       pageNumber: 0,
      pageSize: 10
        },
      recordId: '',
      source: "VendMasterAud"
  });
  const changeAudit = (params) =>{
    venAuditPayload.pagination = params;
    setVenAuditPayload(venAuditPayload);
    fetchVendorMasterAudit(venAuditPayload);
  }
 const fetchVendorMasterAudit = async(payload) =>{
  setVendorMasterAuditColumns([]);
  setVendorMasterAuditData([]);
  //   const body = {
  //     requestMethod: "getAudit",
  //     doPages: "Y",
  //     pgnOffset: 0,
  //     pgnLimit: 25,
  //     recordId: data,
  //     source: "VendMasterAud"
  // }
    try {
        let res=await getCustomerGroupStoreAudit(payload).unwrap();
        if (res?.res_status === true) {
          setVendorMasterAuditColumns(res?.columns);
          setVendorMasterAuditData(res?.result_set);
        }     
    } catch (e) {}
  }
    /**
  @remarks
  This function to open Audit table
  @author Amar
  */
  const auditPopUpDetails = ()=>{
    return (
  <>
    {/* {auditColumns?.length > 0 &&   */}
          <div>
            <PrimeDataTable hideButtons hideSort columns = {auditColumns} pageChange={changeAudit} data={auditData} smartSearchOff={true} paginator ={true} height={50}
             storeView={'storeView'}/>
          </div>
      {/* } */}
          </>
        )  
  }
    /**
  @remarks
  This function to create, edit and delete vendor master
  @author Amar
  */
  useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);       
    }
}, [bulkData]);
  const createBulkRecord = async() => {
    const bulkCreatePayload = {
    actionObject: bulkRecords,
    requestMethod: "saveVendMstr",
    opType: "ADD"
    } 
    let res = await bulkRecordCrud(bulkCreatePayload);
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status));
      fetchVendorMasterData(vendorPayLoad);
    }
}
  /** @remarks Useeffect to get edited records */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit);
  }
},[bulkEdit])
/** @remarks Function to update records */
const editBulkRecord = async()=>{
  const payload={
      opType: "UPD",
      requestMethod: "saveVendMstr",
      actionObject: bulkEditRecords
}
  let res = await bulkRecordCrud(payload);
  if(res?.data?.status_code === 200 || res?.data?.res_status){
  dispatch(bulkEditResponse(res?.data?.res_status))
  fetchVendorMasterData(vendorPayLoad);
}
else{
  dispatch(bulkEditResponse(true));
}
}
/** @remarks Useeffect to get deleted records */
useEffect(() => {
  if (bulkDelData?.length > 0) {
    const ids = bulkDelData?.map((e)=>{
      return e?.RECLAIM_VENDOR_ID
    })
    setDelMessage('Are you sure you want to delete the selected records?');
    setDelRecords(ids);
    setShowDeletePopup(!showDeletePopup);
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
    opType: "DEL",
    recordIds : delRecords,
    requestMethod: "saveVendMstr",
}
  try {
      let res = await bulkRecordCrud(body);
      if(res?.data?.status_code === 200 || res?.data?.res_status){
        const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.RECLAIM_VENDOR_ID))
        setRowData(delDetails);
        dispatch(clearDeleteRecordsData([]));
        dispatch(bulkCreateResponse(res?.data?.res_status))

      }     
  } catch (e) {}
}
  const [storeViewData,setStoreViewData] = useState({});
  const storeSelectedView = (params) =>{
    
    setStoreViewData(params);
  }
  return (
    <div>
       <Toast ref={toast} />
      {!props?.profilePageAction ? 
        <PrimeDataTable
               storeSelectedView={storeSelectedView}
                storeViewData={storeViewData} 
         groupColumns={groupColumns} pageChange={pageChange} pageSort={onSort} columns={columns} totalRecords={totalRecords} isLoading={isLoading}  data={rowData} filterCols={filterCols} menu={props.menu} paginator={true}  selectionMode={'multiple'} height={33} 
        insertFields={insertFields} createBulkRecord={createBulkRecord} editBulkRecord={editBulkRecord} handleOpenProfilePage={handleOpenProfilePage} handleAuditPopUp={handleAuditPopUp}/>
        : selectedField === 'Agreement' ? 
        <VendorItemDetails apVendorNumber={vendorNum} backButtonAction={props?.profilePageAction} backButtonFunction={props?.handleActionProfilePageNavigation}  /> 
      : <VendorProfileView backButtonAction={props?.profilePageAction}  backButtonFunction={props?.handleActionProfilePageNavigation} selectedVendorId={selectedVendorId} selectedVendorName={selectedVendorName}
      storeFilter={storeFilter}  storedDdata={(data) => setGroupColumns(prev => ({ FILTER_STRING: data?.filterString }))}/> }

      {props?.statusPopup &&
      <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
      }

      {auditPopUp &&
      <DialogBox header="Audit Data" content={auditPopUpDetails()} style={{width:'60vw'}} onHide={closeAuditPopup}/>
      }
       <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
    </div>
  )

})

export default VendorMaster