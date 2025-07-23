import React, { forwardRef,useEffect,useImperativeHandle, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import StatusComponent from '../../Shared/Status/Status';
import { useGetVendorProfileFromMasterMutation, useSaveVendorProfileMutation } from '../../../services/vendorSetup';
import { useDispatch, useSelector } from 'react-redux';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useCustomerFeeAuditMutation } from '../../../services/customersSetup';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

  const VendorProfile = forwardRef((props, ref) => {
        const { onRowDataChange } = props;
    const [auditPopup,setAuditPopup]= useState(false);
    const [filterCols,setFilterCols] = useState([]);
    const [insertFields,setInsertFields] = useState([]);
    const [columns,setColumns] =useState([]);
    const [data,setData]=useState([]);
    const [totalRecords,setTotalRecords] = useState('');
    const [bulkRecords,setBulkRecords]= useState([]);
    const [bulkEditRecords,setBulkEditRecords] = useState([])
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
    const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
    const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
    const [getVendorProfileList, {  isLoading }] = useGetVendorProfileFromMasterMutation();
    const isFilter = useSelector((state) => state?.columnSelection?.isFilter);
    const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
    const [getCustomerFeeAudit, {}] = useCustomerFeeAuditMutation();
    const [auditcolumns,setAuditColumns]=useState([])
    const [auditdata,setAuditData] = useState([])
    const[saveVendorProfile,{}]=useSaveVendorProfileMutation()
    const [delRecords,setDelRecords]= useState([]);
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const [delMessage, setDelMessage] = useState();
    const [auditPayload,setAuditPayload] = useState(
       {
      requestMethod: "getAudit",
    pagination:{
       pageNumber: 0,
      pageSize: 15
        },
         searchParams: {
      sortBy: "",
      sortorder: "",
      filterData: ""
    },
      recordId: '',
      source: "FeeDetailsAud"
      }
    );
   let dispatch = useDispatch();
       const toast = useRef(null);
 /** @remarks Useeffect to get data trough prps */
useEffect(()=>{
    if (props?.columns && props?.tableData) {
      setData(props?.tableData)
      setColumns(props?.columns)
    }
  },[props?.columns,props?.tableData])
   /**
  @remarks
  This function to get Vendor profile list
  @author Amar
  */
  const [vendorPayLoad,setVendorPayLoad] = useState({
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
    
  })
   /** @remarks Useeffect to show message for upload */
  useEffect(() => {
    if(props?.browseKey === 'Success'){
      fetchVendorProfile(vendorPayLoad);
      props?.setKey('')
    }
  }, [props?.browseKey]);
   /** @remarks Useeffect to filtered data */
  useEffect(() => {
    if (isFilter?.filterState === true || isFilter?.filterState === false) {
      
      const filterString = generateFilterString(isFilter)
      const updatedVendorPayLoad = {
        ...vendorPayLoad,
        searchParams: {
          ...addFilObj,
          filterData: filterString
        },
        pagination: {
          pageNumber: 0,
          pageSize: 15
        }
      };
      setData([]);
      setColumns([]);
      setVendorPayLoad(updatedVendorPayLoad);
      fetchVendorProfile(updatedVendorPayLoad);
    }
  }, [isFilter]);

  /**
    @remarks
    useEffect to get delete records
    @author Sai Anil
    */  
    useEffect(() => {
      if (bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          return e?.FEE_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
 /** @remarks Function to hide delete popup */
  const hideDeletePopup =() =>{
  setShowDeletePopup(false);
  dispatch(clearDeleteRecordsData([]));
}
 /** @remarks Function to delete the records */
 const handleDeleteRecords = async ()=>{
      const body = {
    "requestMethod": "saveVendPrf",
    "opType": "DEL",
    "FEE_ID": delRecords
}
      try {
          let res = await saveVendorProfile(body).unwrap();
          if(res?.status_code === 200 || res?.res_status){
            const delDetails = data?.filter(record => !delRecords?.some(e=> e === record?.FEE_ID))
            setData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.res_status))
          }
      } catch (e) {}
  }
   /** @remarks Function to create the records */
  const createBulkRecord = async() => {
    const bulkCreatePayload = {
      "requestMethod": "saveVendPrf",
      "actionObject": bulkRecords,
      "opType": "ADD",
}
    let res = await saveVendorProfile(bulkCreatePayload)
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status))
      fetchVendorProfile(vendorPayLoad);
    }
}
 /** @remarks Useeffect to get edited records */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
 /** @remarks Function to update the records */
const editBulkRecord = async()=>{
  const payload={
    "requestMethod": "saveVendPrf",
    "actionObject": bulkEditRecords,
    "opType": "UPD",
}
try {
let res = await saveVendorProfile(payload)
if(res?.data?.status_code === 200 || res?.data?.res_status){
  dispatch(bulkEditResponse(res?.data?.res_status))
  fetchVendorProfile(vendorPayLoad);
}

}catch (e){
 
}
}
 /** @remarks Useeffec to get the inserted records */
useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);      
    }
}, [bulkData]);
 /** @remarks Function for Pagination */
  const pageChange = (params) =>{
    setData([]);
    setColumns([])
    vendorPayLoad.pagination.pageNumber = params.pageNumber;
    vendorPayLoad.pagination.pageSize = params.pageSize;
    fetchVendorProfile(vendorPayLoad);
  }
   /** @remarks Function for sorting */
  const onSort = (params) =>{
    setData([]);
    setColumns([])
    vendorPayLoad.searchParams.sortBy = params.sortBy;
    vendorPayLoad.searchParams.sortorder = params.sortorder;
    setVendorPayLoad(vendorPayLoad);
    fetchVendorProfile(vendorPayLoad);
  }
   /** @remarks Function to get Vendor profile data */
  const fetchVendorProfile = async (payload) => {
    try {
      let result = await getVendorProfileList(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){   
      setInsertFields(result?.insert_fields);
      setFilterCols(result?.filter_cols);
      setData(result?.result_set);
        setColumns(result?.columns);
        setTotalRecords(result?.total_records);
      if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
      }
    } catch (e) {}
  };
 /** @remarks Function to open audit popup */
const handleAuditPopUp = (data, field) => {
  setAuditPopup(!auditPopup)
  auditPayload.recordId = data?.FEE_ID;
  setAuditPayload(auditPayload);
  fetchVendorProfileAudit(auditPayload);
};
 /** @remarks Function to get the Audit data */
const fetchVendorProfileAudit = async(payload)=>{
    //  const payload = {
    //   requestMethod: "getAudit",
    //   doPages: "Y",
    //   pgnOffset: 0,
    //   pgnLimit: 25,
    //   recordId: data?.FEE_ID,
    //   source: "FeeDetailsAud"
    //   }
    try {
      let result = await getCustomerFeeAudit(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
      setAuditData(result?.result_set)
      setAuditColumns(result?.columns);
      setFilterCols(result?.filter_cols);
      }
    
    } catch (e) { }
}
 /** @remarks Function to close Audit popup */
const closeAuditPopup = () => {
  setAuditPopup(!auditPopup)
  fetchVendorProfile(vendorPayLoad);

}
 /** @remarks Function to show Audit data in grid */
const auditPopUpDetails = ()=>{
  return (
    <div>
      <PrimeDataTable hideButtons hideSort pageChange={auditChange} paginator={true} columns = {auditcolumns} pag data={auditdata} smartSearchOff={true} selectionMode={null} height={50}
       storeView={'storeView'}/>
       {/* <PrimeDataTable hideSort columns = {auditcolumns} data={auditdata} smartSearchOff={true} paginator ={true} selectionMode={null} height={50}
       storeView={'storeView'}/> */}
    </div>
  )
}
const auditChange = (params) =>{
  setAuditColumns([]);
  setAuditData([]);
  auditPayload.pagination = params;
  setAuditPayload(auditPayload);
  fetchVendorProfileAudit(auditPayload);
}

useImperativeHandle(ref, () => ({
  /**
@remarks
This function returns the Data array
@author Karthik Manthripragada
*/
  getData: () => data
}));
 /**
  @remarks
  This function to open Vendor profile status page
  @author Amar
  */
const openStatusComponent = ()=>{
 return(<StatusComponent showStatusTabs={props?.showStatusTabs} />) 
}
return (
  <div>
      <Toast ref={toast} />
      <PrimeDataTable columns={columns} pageChange={pageChange} insertFields={insertFields} filterCols={filterCols} isLoading={isLoading} data={data} menu={props.menu} paginator ={true} handleAuditPopUp={handleAuditPopUp} height={33} selectionMode="multiple" totalRecords={totalRecords} pageSort={onSort}
      createBulkRecord={createBulkRecord} editBulkRecord={editBulkRecord}/>
      {auditPopup &&
      <DialogBox header='Audit Data' content={auditPopUpDetails()} style={{width:'60vw'}} onHide={closeAuditPopup} selectionMode={null}/>
      }
      {props?.statusPopup &&
      <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
      }
      <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />  
  </div>
)
}
)
export default VendorProfile