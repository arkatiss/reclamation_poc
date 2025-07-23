import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useGetHazardousItemsMutation, useHazardousDeatilsUpdateMutation } from '../../../services/itemSetup';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import { bulkEditResponse } from '../../../slices/columnSelection';
import { Dispositions, HazardousDetails } from './masterDetails';
import { changeSubModule } from '../../../slices/navigation';

export const  Hazardous= forwardRef((props, ref) => {
    const { onRowDataChange } = props;
    const [rowData,setRowData] = useState([]);
    const [columns,setColumns] = useState([]);
    const [filterCols,setFilterCols] = useState([]);
    const [totalRecords,setTotalRecords] = useState('');
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [getHazardousList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetHazardousItemsMutation();
    const [updateHazardousList, { }] = useHazardousDeatilsUpdateMutation();
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter);
    const [bulkEditRecords,setBulkEditRecords] = useState([])
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
    const [insertFields,setInsertFields] = useState([]);
    const [viewHazardous,setViewHazardous] = useState(true);
    const [masterUpcObj,setMasterUpcObj] = useState({});
    const [storeFilter, setStoreFilter] = useState([]);
    const [groupColumns,setGroupColumns] = useState({});
/**@remarks
  This function to open Vendor Master status page
  @author Amar */
  const openStatusComponent = ()=>{
    return(<StatusComponent showStatusTabs={props?.showStatusTabs}/>) 
   }

   const [hazardousPayLoad,setHazardousPayLoad] = useState({
    "requestMethod": "getHazardous",
    "searchParams": {
        "filterData": "" 
        },
    "pagination": {
        "pageNumber": 0,
        "pageSize": 15
    },
  })
  /** @remarks Useeffect to get filtered records */
  useEffect(() => {
    if (isFilter?.filterState === true || isFilter?.filterState === false) { 
    
      const filterString = generateFilterString(isFilter);
       if(isFilter.filterString?.length > 0) {
              setStoreFilter(isFilter); 
        }  
      const updatedHazardousPayLoad = {
        ...hazardousPayLoad,
        searchParams: {
          ...hazardousPayLoad.searchParams,
          filterData: filterString
        },
        //  pagination:{
        //   pageNumber:0,
        //   pageSize:15
        //   }
      };
      setRowData([]);
      setColumns([])
      setHazardousPayLoad(updatedHazardousPayLoad);
      fetchHazardousData(updatedHazardousPayLoad);
    }
  }, [isFilter]);
  /** @remarks Useeffect to get records */
  useEffect(() => {
    
    if(props?.browseKey === 'Success'){
      fetchHazardousData(hazardousPayLoad);
      props?.setKey('')
    }
  }, [props?.browseKey]);
  /** @remarks Function to get records */
    const fetchHazardousData = async (payload) => {
    try {
      const startTime = Date.now();
    let result = await getHazardousList(payload).unwrap();
    const duration = (Date.now() - startTime) / 1000; // in seconds
    if(result?.status_code === 200 || result?.res_status){
      if (result?.result_set?.length===0) {
        toast.current.show({ severity: 'info',summary: 'No Records',
          detail: `No hazardous records found (in ${duration} seconds)`,
          life: 3000 });
      } else {
      toast.current.show({ severity: 'info',summary: 'Fetch Successful',
        detail: `Hazardous records retrieved successfully (in ${duration} seconds)`,
        life: 3000 });
      }
    setFilterCols(result?.filter_cols);
    setRowData(result?.result_set);
    if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
        setColumns(result?.columns);
        setTotalRecords(result?.total_records);
        setInsertFields(result?.insert_fields)
      }else {
          setRowData(result?.result_set);
         setColumns(result?.columns);
        setTotalRecords(result?.total_records);
      }
    } catch (e) {}
    };
     /** @remarks Function for Pagination */
    const pageChange = (params) =>{
      setRowData([]);
      setColumns([]);
      hazardousPayLoad.pagination = params;
      fetchHazardousData(hazardousPayLoad);
    }
     /** @remarks Function for Sorting */
    const onSort = (params) =>{
      setRowData([]);
      setColumns([]);
      hazardousPayLoad.searchParams.sortBy = params.sortBy;
      hazardousPayLoad.searchParams.sortorder = params.sortorder;
      setHazardousPayLoad(hazardousPayLoad);
      fetchHazardousData(hazardousPayLoad);
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
      "requestMethod": "saveHazardousItemDetails"
    }
    let res = await updateHazardousList(payload)
    if(res?.data?.status_code === 200 || res?.data?.res_status){
      dispatch(bulkEditResponse(res?.data?.res_status))
      fetchHazardousData(hazardousPayLoad);
    }
    else{
      dispatch(bulkEditResponse(true))
    }
    }
    const handleShowUpcDetails =(params=null) =>{
      dispatch(changeSubModule({subModule:'Dispositions'}));
      props?.changeTab('Dispositions');
       setMasterUpcObj(params);
      setViewHazardous(!viewHazardous);
     
      
    }
    const backToMainGrid = () =>{
      props?.changeTab('Hazardous');
    let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
    setViewHazardous(!viewHazardous);
    }
    useImperativeHandle(ref, () => ({
            getData: () => rowData,
        }));
  return (
    <div>
       <Toast ref={toast} />
       {viewHazardous  &&
       
      
        <PrimeDataTable columns={columns}  groupColumns={groupColumns} menu={props.menu} paginator ={true} handleShowUpcDetails={handleShowUpcDetails} data={rowData} filterCols={filterCols} isLoading={isLoading} totalRecords={totalRecords} pageSort={onSort} pageChange={pageChange} editBulkRecord ={editBulkRecord} selectionMode={'multiple'} insertFields={insertFields}/>
       }
       { !viewHazardous &&
         <Dispositions masterUpcObj={masterUpcObj} handleShowUpcDetails={backToMainGrid}/>
       }
       
        {props?.statusPopup &&
          <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
        }  
    </div>
  )
 })

