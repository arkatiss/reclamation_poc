import  { useState, forwardRef, useEffect, useRef } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { useMasterObjRetMutation,useMasterObjUpdMutation } from '../../../services/itemSetup';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import { bulkEditResponse } from '../../../slices/columnSelection';
import { Button } from 'primereact/button';

export const Dispositions = forwardRef((props, ref) => {
    console.log(props);
    const { onRowDataChange } = props;
    const [rowData,setRowData] = useState([]);
    const [columns,setColumns] = useState([]);
    const [filterCols,setFilterCols] = useState([]);
    const [totalRecords,setTotalRecords] = useState('');
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [getHazardousMasterObj, {  dataResult, isSuccess, isLoading, isFetching, error }] = useMasterObjRetMutation();
    const [updateHazardousMasterObj, { }] = useMasterObjUpdMutation();
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter);
    const [bulkEditRecords,setBulkEditRecords] = useState([])
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
    const [insertFields,setInsertFields] = useState([]);
    const [masterUpcObj,setMasterUpcObj]= useState({});
    const [upcPayload,setUpcPayload] = useState({
         "requestMethod": "getHazardous",
        "searchParams": {
        "filterData": ''
    },
    "pagination": {
        "pageNumber": 0,
        "pageSize": 15
    }
    })

    useEffect(()=>{
        if(props?.masterUpcObj && Object?.keys(props?.masterUpcObj).length > 0){
            setMasterUpcObj(props?.masterUpcObj);
            upcPayload.searchParams.filterData = `MASTER_ITEM_ID = ['${props.masterUpcObj?.MASTER_ITEM_ID}']`;
            setUpcPayload(upcPayload);
            fetchUpcData(upcPayload);
        }
    },[props?.masterUpcObj]);
    const fetchUpcData = async (payload) =>{
        
    let res = await getHazardousMasterObj(payload).unwrap();
    //console.log(result);
//   let res =   {
//     "requestMethod": "getHazardous",
//     "res_status": true,
//     "status_code": 200,
//     "total_records": 0,
//     "result_set": [],
//     "columns": [
//         {
//             "field": "MASTER_ITEM_ID",
//             "header": "Master Item Id"
//         },
//         {
//             "field": "MASTER_UPC",
//             "header": "Master Upc"
//         },
//         {
//             "field": "STATE",
//             "header": "State"
//         },
//         {
//             "field": "STATE_DISPOSITION",
//             "header": "State Disposition"
//         },
//         {
//             "field": "USER_DISPOSITION",
//             "header": "User Disposition"
//         },
//         {
//             "field": "USER_LOCK_FLAG",
//             "header": "User Lock Flag"
//         }
//     ],
//     "filter_cols": [
//         {
//             "field": "MASTER_ITEM_ID",
//             "header": "MASTER ITEM ID"
//         }
//     ],
//     "insert_fields": [
//         {
//             "create": false,
//             "edit": true,
//             "field": "USER_DISPOSITION",
//             "header": "User Disposition",
//             "required": false,
//             "type": "TEXT",
//             "visibility": true
//         },
//         {
//             "create": false,
//             "edit": true,
//             "field": "USER_LOCK_FLAG",
//             "header": "User Lock Flag",
//             "required": false,
//             "type": "LIST",
//             "VALUES": [
//                 "Y",
//                 "N"
//             ],
//             "visibility": true
//         }
//     ]
// }
    if(res.res_status && res?.status_code === 200){
        setColumns(res?.columns);
        setRowData(res?.result_set);
        setInsertFields(res?.insert_fields);
        setTotalRecords(res?.total_records);


    }

    }
     /** @remarks Function for Pagination */
    const pageChange = (params) =>{
      setRowData([]);
      setColumns([]);
      upcPayload.pagination = params;
      fetchUpcData(upcPayload);
    }
     /** @remarks Function for Sorting */
    const onSort = (params) =>{
    //   setRowData([]);
    //   setColumns([]);
    //   hazardousPayLoad.searchParams.sortBy = params.sortBy;
    //   hazardousPayLoad.searchParams.sortorder = params.sortorder;
    //   setHazardousPayLoad(hazardousPayLoad);
    //   fetchHazardousData(hazardousPayLoad);
    }
     /** @remarks Useeffect to get Edited records */
    useEffect(()=>{
      if (bulkEdit.length > 0) {
        setBulkEditRecords(bulkEdit)
      }
    },[bulkEdit])
     /** @remarks Function for update records */
      const editBulkRecord = async()=>{
      const payload={
      "opType": "UPD",
      "actionObject": bulkEditRecords,
      "requestMethod": "saveHazardousChildItemDetails"
    }
     let res = await updateHazardousMasterObj(payload)
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkEditResponse(res?.data?.res_status))
      fetchUpcData(upcPayload);
    }
    else{
      dispatch(bulkEditResponse(true))
    }
    }
    const backToMainGrid = () =>{
        props?.handleShowUpcDetails();
    }

  return (
    <div>
       <Toast ref={toast} />
      <div className='row m-1'>
            <div className='col-10'>
                 <span style={{ fontWeight: '500', fontSize: '1.2rem' }}>MASTER UPC : {masterUpcObj?.MASTER_ITEM_ID}</span>
            </div>
            <div className='col-2'>
                    <Button onClick={backToMainGrid} className='mb-1 ms-auto primary-button floatEnd'>Back to Hazardous</Button>
            </div>
            </div>

       
        <PrimeDataTable columns={columns} globalViews={true}  paginator ={true}  data={rowData}  
         totalRecords={totalRecords} smartSearchOff= {true} hideSort pageChange={pageChange} visibleStorePopup={true} editBulkRecord ={editBulkRecord} selectionMode={'multiple'} insertFields={insertFields}/>
      

      
        
       
    </div>
  )
 })

