import React, { forwardRef, useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useGetVendorProfileFromMasterMutation, useSaveVendorProfileMutation } from '../../../services/vendorSetup';
import { Toast } from 'primereact/toast';
import { useCustomerFeeAuditMutation } from '../../../services/customersSetup';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { changeSubModule } from '../../../slices/navigation';
import { generateFilterString } from '../../Shared/lookupPayload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
  const VendorProfileView = forwardRef((props, ref) => {
    const [storeFilter, setStoreFilter] = useState([]);

  useEffect(() => {
    if (props?.storeFilter) {
      setStoreFilter(props.storeFilter);
    }
  }, [props?.storeFilter]);
    const toast = useRef(null);
    const [auditPopup,setAuditPopup]= useState(false);
    const [profileColumns, setProfileColumns] = useState([]);
    const [profileData, setProfileData] = useState([]); 
    const [getVendorProfileList, { }] = useGetVendorProfileFromMasterMutation();
    const [getCustomerFeeAudit, {}] = useCustomerFeeAuditMutation();
    let dispatch = useDispatch();
    const [auditcolumns,setAuditColumns]=useState([])
    const [auditdata,setAuditData] = useState([])
    const [filterCols,setFilterCols] = useState([]);
    const [bulkRecords,setBulkRecords]= useState([]);
    const [bulkEditRecords,setBulkEditRecords] = useState([])
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
    const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
    const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
    const [insertFields,setInsertFields] = useState([]);
    const [delRecords,setDelRecords]= useState([]);
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const [delMessage, setDelMessage] = useState();
    const[saveVendorProfile,{}]=useSaveVendorProfileMutation();
      const bulkCreateResponseData = useSelector((state)=>state?.columnSelection?.bulkCreateResponse)
    
    dispatch(changeSubModule({subModule:'Vendor Profile'}));
     /** @remarks Useeffect to get deleted records */
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

 /** @remarks Function to delete records */
 const handleDeleteRecords = async ()=>{
      const body = {
    "requestMethod": "saveVendPrf",
    "opType": "DEL",
    "FEE_ID": delRecords
      }
      try {
          let res = await saveVendorProfile(body).unwrap();
          if(res?.data?.status_code === 200 || res?.data?.res_status){
            toast.current.show({ severity: 'info',summary: 'Delete', detail: 'Deleted successfully', life: 3000 });
            const delDetails = profileData?.filter(record => !delRecords?.some(e=> e === record?.FEE_ID))
            setProfileData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(true))
            setShowDeletePopup(false);
          }
          else{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Delete failed',
            });
          }         
      } catch (e) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Delete failed',
        });
      }
  }
  const [vendorId,setVendorId]= useState()
   /** @remarks Function to carete records */
  const createBulkRecord = async() => {
    const bulkCreatePayload = {
      "requestMethod": "saveVendPrf",
      "actionObject": bulkRecords,
      "opType": "ADD",
}
    let res = await saveVendorProfile(bulkCreatePayload)
    if(res?.data?.status_code === 200 || res?.data?.res_status){
       toast.current.show({ severity: 'info',summary: 'Create', detail: 'Created successfully', life: 3000 });
      dispatch(bulkCreateResponse(res?.data?.res_status))
      setVendorId(props?.selectedVendorId)
      fetchVendorProfile(props?.selectedVendorId);      
    }
    else{
      // toast.current.show({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: res?.data?.msg,
      // });
    }
}
 /** @remarks useeffect to get edited records */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
 /** @remarks Function for update records */
const editBulkRecord = async()=>{
  const payload={
    "requestMethod": "saveVendPrf",
    "actionObject": bulkEditRecords,
    "opType": "UPD",
}
let res = await saveVendorProfile(payload)
if(res?.data?.status_code === 200 || res?.data?.res_status){
  dispatch(bulkEditResponse(res?.data?.res_status))
  fetchVendorProfile(props?.selectedVendorId);
  toast.current.show({ severity: 'info',summary: 'Update', detail: 'Updated successfully', life: 3000 });
}
else{
  // dispatch(bulkEditResponse(true))
  // toast.current.show({
  //   severity: 'error',
  //   summary: 'Error',
  //   detail: res?.data?.msg,
  // });
}
}
 /** @remarks useeffect to get inserted records */
useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);      
    }
}, [bulkData]);
 /** @remarks useeffect to call vendor profile data */
    useEffect(() => {
      if (props?.selectedVendorId) {
          setProfileColumns([]);
          setProfileData([]);
        //  fetchVendorProfile(props?.selectedVendorId)

      }
    },[props?.selectedVendorId, props?.selectedVendorName])

      const isFilter = useSelector((state) => state?.columnSelection?.isFilter);
      const navObj = useSelector((state) => state.navigation);
    
      useEffect(()=>{
        if (bulkCreateResponseData) {
          const filterString = generateFilterString(isFilter);
          
          fetchVendorProfileQ(filterString)
        }
      },[bulkCreateResponseData])
     useEffect(() => {
        if ((isFilter?.filterState === true || isFilter?.filterState === false  && navObj?.CHILD_MODULE === "Vendor Profile"  && isFilter?.filterString || props?.selectedVendorId)) {
      if (isFilter?.filterString === undefined) {
        fetchVendorProfileQ('')
      }
       // if ((isFilter?.filterState === true || isFilter?.filterState === false  && navObj?.CHILD_MODULE === "Vendor Profile" && props?.selectedVendorId && isFilter?.filterString)) {
          
          const filterString = generateFilterString(isFilter);
          //  
      //    const payload = {      
      //     "requestMethod": "getVendProfile",
      //     "searchParams": {
      //         "filterData": filterString,
      //         "sortBy": "",
      //         "sortorder": "",
      //         "inactiveVendor": "N",
      //         "systemDefaults": "N",
      //         "inactiveFees": "N"
      //         },
      //     "pagination": {
      //         "pageNumber": 0,
      //         "pageSize": 15
      //     },
      // }
          // setVendorPayLoad(updatedVendorPayLoad);
          // setRowData([]);
          // fetchVendorProfileQ(filterString);
          fetchVendorProfileQ(filterString)
        }
      }, [isFilter]);

      const fetchVendorProfileQ = async (data) => {  

    let filterData = "AP_VENDOR_NUMBER = ['" + props?.selectedVendorId + "']";
      // filterData = filterData.replace(/(\d+)/, "['$&']");
      if (data !=='') {
        filterData += " AND " + data;
      }
      const payload = {      
           "requestMethod": "getVendProfile",
          "searchParams": {
              "filterData": filterData,
              "sortBy": "",
              "sortorder": "",
              "inactiveVendor": "N",
              "systemDefaults": "N",
              "inactiveFees": "N"
              },
          "pagination": {
              "pageNumber": 0,
              "pageSize": 15
          },
      }
      try {
        let result = await getVendorProfileList(payload).unwrap();
        if(result?.res_status){
          setTimeout(()=>{
          setProfileColumns(result?.columns);
          setProfileData(result?.result_set);
          setFilterCols(result?.filter_cols);
          setInsertFields(result?.insert_fields);
          },1000)          
        }
          else{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed',
            });
          }
      } catch (e) {}
    };
     /** @remarks Function to get vendor profile data */
    const fetchVendorProfile = async (data) => {  
      let filterData = "AP_VENDOR_NUMBER =" + [data];
      filterData = filterData.replace(/(\d+)/, "['$&']");
      const payload = {      
          "requestMethod": "getVendProfile",
          "searchParams": {
              "filterData": filterData,
              "sortBy": "",
              "sortorder": "",
              "inactiveVendor": "N",
              "systemDefaults": "N",
              "inactiveFees": "N"
              },
          "pagination": {
              "pageNumber": 0,
              "pageSize": 15
          },
      }
      try {
        let result = await getVendorProfileList(payload).unwrap();
        if(result?.res_status){
          // setTimeout(()=>{
          setProfileColumns(result?.columns);
          setProfileData(result?.result_set);
          setFilterCols(result?.filter_cols);
          setInsertFields(result?.insert_fields);
          // },1000)          
        }
          else{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed',
            });
          }
      } catch (e) {}
    };
 
// const handleAuditPopUp = () => {
//   setAuditPopup(!auditPopup)
// };

/**
    @remarks
    Function to close Audit popup
    @author Amar
    */ 
const closeAuditPopup = () => {
  setAuditPopup(!auditPopup)
}
/**
    @remarks
    Function to open Audit popup
    @author Amar
    */ 
const handleAuditPopUp = (data, field) => {
   
  setAuditPopup(!auditPopup)
  fetchVendorProfileAudit(data)
  // setAuditProfileData([])
  // setAuditProfileColumns([])
};
/**
    @remarks
    Function to get Audit data
    @author Amar
    */ 


const fetchVendorProfileAudit = async(data)=>{
  // setAuditData([]);
  //     setAuditColumns([]);
  // setAuditProfileData([])
  // setAuditProfileColumns([])
     const payload = {
      requestMethod: "getAudit",
      doPages: "Y",
      pgnOffset: 0,
      pgnLimit: 25,
      // searchParams: {
      recordId: data?.FEE_ID,
      source: "FeeDetailsAud"
    // }
      }
    try {
      let result = await getCustomerFeeAudit(payload).unwrap();
      if(result?.res_status){
         
       
setAuditData(result?.result_set)
      setAuditColumns(result?.columns); 
      
      }
      else{
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: result?.msg,
        });
      }
    } catch (e) {
      
    }
}
/**
    @remarks
    Function to show Audit data in grid
    @author Amar
    */ 
const auditPopUpDetails = ()=>{
    const isLoading = !auditdata || !auditcolumns?.length; 

  return (
    <div>
      {/* <PrimeDataTable hideSort columns={auditcolumns} data={auditdata} smartSearchOff={true} paginator ={true} selectionMode={null} height={50}
      /> */}
      <DataTable value={isLoading ? Array(5).fill({}) : auditdata} scrollHeight="50vh">
        {isLoading
          ? Array(3)
              .fill({})
              .map((_, index) => (
                <Column key={index} body={() => <Skeleton width="100%" height="1.5rem" />} />
              ))
          : auditcolumns.map((item) => (
              <Column
                key={item.field}
                field={item.field}
                header={item.header}
                body={(rowData) =>
                  isLoading ? <Skeleton width="100%" height="1.5rem" /> : rowData[item.field]
                }
              />
            ))}
      </DataTable>
    </div>
  )
}
/**
    @remarks
    Function to go back to vendor master page
    @author Amar
    */  
const handleBackToVendor = ()=>{
  props?.backButtonFunction(!props?.backButtonAction)
  props?.storedDdata(storeFilter)
  dispatch(changeSubModule({subModule:'Vendor Master'}));
}
return (
  <div>
     <Toast ref={toast} />
    <div className='row'>
      <div className='col-5'>
      <span className='title-tag'>Vendor Profile - {props?.selectedVendorId} {props?.selectedVendorName}</span>
      </div>
      <div className='col-4'></div>
      <div className='col-3'>
      <div className='d-flex gap-2 float-end'>
      <Button onClick={handleBackToVendor} className='mb-1 ms-auto primary-button'>Back to  Vendor Master</Button>
      </div>
      </div>
    </div>
   <div className='mt-3'>
      <PrimeDataTable globalViews={true} columns={profileColumns} selectionMode={'multiple'} data={profileData}  handleAuditPopUp={handleAuditPopUp} insertFields={insertFields} filterCols={filterCols} createBulkRecord={createBulkRecord} editBulkRecord={editBulkRecord} visibleStorePopup={true}/>
      </div>
      {auditPopup ?
      <DialogBox header='Audit Data' visible={auditPopup} content={auditPopUpDetails()} style={{width:'60vw'}} onHide={closeAuditPopup} selectionMode={null} paginator={false}/>
      :""}
          <ConfirmDialog visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />  
  </div>
)
}
)

export default VendorProfileView