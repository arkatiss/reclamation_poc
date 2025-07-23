import React, { useEffect, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { Toast } from 'primereact/toast';
import { useGetItemAuditDetailsMutation, useGetItemWhDetailsMutation, useGetWhItemsEditMutation } from '../../../services/itemSetup';
import { useDispatch, useSelector } from 'react-redux';
import { generateFilterString } from '../../Shared/lookupPayload';
import { bulkEditResponse } from '../../../slices/columnSelection';
import { changeSubModule } from '../../../slices/navigation';

const CandSWarehouseDetails = (props) => {
  const [whseData, setWhseData] = useState([]);
  const [whseColumns, setWhseColumns] = useState([]);
  const toast = useRef(null);
  const [whseAuditPopup, setWhseAuditPopup] = useState(false);
  const [whseAuditData, setWhseAuditData] = useState([]);
  const [whseAuditColumns, setWhseAuditColumns] = useState([]);
  const [totalRecords, setTotalRecords] = useState('');
  const [getAuditData,{}] =useGetItemAuditDetailsMutation();
  const [getWhList, { }] = useGetItemWhDetailsMutation();
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter);
  const [insertFields,setInsertFields]= useState([])
  const [filterCols , setFilterCols]= useState([])
  const [bulkEditRecords,setBulkEditRecords] = useState([])
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit);
   const navObj = useSelector((state) => state.navigation);
  const [getWhItemsEdit,{}] = useGetWhItemsEditMutation();
  let dispatch = useDispatch()
  const [whPayLoad,setWhPayLoad] = useState({
    "requestMethod": "getWhItemDetails",
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
  const [auditPayLoad, setAuditPayLoad] = useState(
     {
      "requestMethod": "getAudit",
       "pagination":{
        "pageNumber": 0, 
        "pageSize": 15
      },
      // "searchParams": {
          "recordId": '',
          "source": "WhItemAud"
      // }
  }
  )
  /** @remarks Useeffect to get filtered list */
  useEffect(() => {
    
    
    if (isFilter?.filterState === true || isFilter?.filterState === false || navObj?.CHILD_MODULE === 'Item Details - C&S Warehouse Details') { 
      const filterString = generateFilterString(isFilter)
      const updatedWhPayLoad = {
        ...whPayLoad,
        searchParams: {
          ...whPayLoad.searchParams,
          filterData: filterString
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
       fetchWhData(updatedWhPayLoad);
    }
  }, [isFilter]);
   /** @remarks Function to get WH data */
    const [upDateFields,setUpdateFields]= useState()
    const fetchWhData = async (payload) => {
      
    try {
      const startTime = Date.now();

    let result = await getWhList(payload).unwrap();
    const duration = (Date.now() - startTime) / 1000; // in seconds

    let filtercolumns = result?.columns?.map((item,index)=>{
      if (item?.header === 'AP Ven#-Name') {       
        return{
          ...item, field: 'AP_VENDOR_NUM_'
        }
      }
      return item
    })
    let filteredData=result?.result_set?.map((item,index)=>{
      if (item["AP_VENDOR_NUM"]) {     
        return{
          ...item ,'AP_VENDOR_NUM_': item["AP_VENDOR_NUM"]
        }
      }
      return item
    })
    if (result?.result_set?.length===0) {
      toast.current.show({ severity: 'info',summary: 'No Records',
         detail: `No warehouse records found (in ${duration} seconds)`,
         life: 3000 });
      let filterData=filtercolumns?.filter((item)=>item?.field !== 'Audit')
          setWhseColumns(filterData);
    }else{
      toast.current.show({ severity: 'info',summary: 'Fetch Successful',
        detail: `Warehouse records retrieved successfully (in ${duration} seconds)`,
          life: 3000 });
      setWhseColumns(filtercolumns)
    }
    setWhseData(filteredData);
    setInsertFields(result?.insert_fields)
    setFilterCols(result?.filter_cols)
    setUpdateFields(result?.update_by_columns)
    } catch (e) {
    }
    };
/** @remarks Function to open Audit popup */
  const handleAuditPopUp = (data) =>{
    setWhseAuditPopup(!whseAuditPopup);
    auditPayLoad.recordId = data?.WHSE_ITEM_ID;
    setAuditPayLoad(auditPayLoad);
    fetchAudit();
  }
  /** @remarks Function to close Audit popup */
  const closeDialog = () => {
    setWhseAuditPopup(!whseAuditPopup);
    dispatch(changeSubModule({subModule:'Item Details - C&S Warehouse Details'}));
  };
  const auditPageChange = (params) => {
     auditPayLoad.pagination = params;
    fetchAudit();
   
  }
  /** @remarks Function to open Audit popup */
  const fetchAudit = async() =>{
    setWhseAuditData([]);
    setWhseAuditColumns([]); 
    dispatch(changeSubModule({subModule:'item'}));
  
    try {
        let res=await getAuditData(auditPayLoad).unwrap();
        if (res?.status_code === 200 && res?.res_status === true) {
          setWhseAuditData(res?.result_set);
            setWhseAuditColumns(res?.columns);
            setTotalRecords(res?.total_records);
        }
    } catch (e) {}  
  }
  /** @remarks Function to open Audit grid*/
  const openAuditComponent = () => {
    return (
      <div>
         {whseAuditColumns?.length > 0 &&  
          <PrimeDataTable
          hideButtons
          fromVendorMaster={true}
         globalViews={true}
          columns={whseAuditColumns}
          data={whseAuditData}
          menu={props.menu}
          totalRecords={totalRecords}
          paginator={true}
          pageChange={auditPageChange}
          smartSearchOff={true}
          height={50}
          hideSort
        />
        }
      </div>
    );
  };
/** @remarks Function to get edited records */
  useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
  /** @remarks Function to update records */
},[bulkEdit])
  const editBulkRecord = async(data)=>{
  const payload={
  "opType": "UPD",
  "actionObject": data ? data : bulkEditRecords
}
let res = await getWhItemsEdit(payload)
if(res?.data?.status_code === 200 || res?.data?.res_status){
  dispatch(bulkEditResponse(res?.data?.res_status))
  fetchWhData(whPayLoad);
  toast.current.show({ severity: 'info',summary: 'Update', detail: 'Updated successfully', life: 3000 });
}
else{
  dispatch(bulkEditResponse(true))
  toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: res?.data?.msg,
  });
}
}

const pageChange = (params) =>{
  // resetGrid();
  whPayLoad.pagination = params;
  setWhPayLoad(whPayLoad);
  fetchWhData(whPayLoad);
}
const onSort = (params) =>{
  // resetGrid();
  whPayLoad.searchParams.sortBy = params.sortBy;
  whPayLoad.searchParams.sortorder = params.sortorder;
  setWhPayLoad(whPayLoad);
  fetchWhData(whPayLoad);
}
  return (
    <div>
       <Toast ref={toast} />
      <PrimeDataTable data={whseData} columns={whseColumns} 
      fromVendorMaster={true}
      globalViews={true} 
      selectionMode={"multiple"} handleAuditPopUp={handleAuditPopUp}
      insertFields={insertFields} editBulkRecord={editBulkRecord} filterCols={filterCols} upDateFields={upDateFields}
      pageChange={pageChange} pageSort={onSort} paginator={true}/>

      {whseAuditPopup && (
        <DialogBox
          header=""
          content={openAuditComponent()}
          style={{ width: "65vw" }}
          onHide={closeDialog}
        />
      )}
    </div>
  )
}
export default CandSWarehouseDetails