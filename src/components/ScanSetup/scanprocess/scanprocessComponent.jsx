import React, { forwardRef,useEffect,useImperativeHandle, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { Dialog } from 'primereact/dialog';
import StatusComponent from '../../Shared/Status/Status';
import { Toast } from 'primereact/toast';
import { useGetScanAuditMutation, useGetScanProcessListMutation } from '../../../services/scanSetup';
import { generateFilterString } from '../../Shared/lookupPayload';
import { useSelector } from 'react-redux';

const ScanProcessComponent = forwardRef((props, ref) => {
      const { onRowDataChange } = props;
  const toast = useRef(null);
  const [auditPopup,setAuditPopup]= useState(false);
  const [rowData,setRowData] = useState([]);
  const [columns,setColumns] = useState([]);
  const [auditData,setAuditData] = useState([]);
  const [auditColumns,setAuditColumns] = useState([]);
  const [filterCols,setFilterCols] = useState([]);
  const [totalRecords,setTotalRecords] = useState('');
  const [insertFields, setInsertFields] = useState([]);
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
  const [getScanProcessList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetScanProcessListMutation();
  const [getAuditScanProcess, {}] = useGetScanAuditMutation();
  const [auditTotalRecords,setAuditTotalRecords] = useState('');
/**
  @remarks
  This function to get Audit data
  @author Amar
  */
const handleAuditPopUp = (data) => {
    setAuditPopup(!auditPopup);
    fetchScanProcessAudit(data)
  };
  /** @remarks Function to close Audit popup*/
const closeAuditPopup = () => {
  setAuditPopup(!auditPopup);
}
/** @remarks Function to get Audit data */
const fetchScanProcessAudit = async(data) =>{
  const body = {
    "requestMethod": "getAudit",
    "pagination":{
      "pageNumber": 0, 
      "pageSize": 15
    },
    // "searchParams": {
        "recordId": data?.scan_master_id, 
        "source": "scanAudit"
    // },
}
  try {
      let res=await getAuditScanProcess(body).unwrap();
      if (res?.res_status === true && res?.status_code === 200) {
        setAuditColumns(res?.columns);
        setAuditData(res?.result_set);
        setAuditTotalRecords(res?.total_records)
      }
  } catch (e) {}
}
/** @remarks Function to show Audit data in grid */
const auditPopUpDetails = ()=>{
return (
  <div>
    <PrimeDataTable hideButtons hideSort height={50} columns = {auditColumns} data={auditData} totalRecords={auditTotalRecords} smartSearchOff={true} paginator ={true} selectionMode={null}
    />
  </div>
)
}
/** @remarks Function to open status component */
  const openStatusComponent = ()=>{
    return(<StatusComponent showStatusTabs={props?.showStatusTabs}/>) 
   }
  /**
  @remarks
  This function to get Scan process list
  @author Amar
  */
   const [scanProcessPayLoad,setScanProcessPayLoad] = useState({
    requestMethod: "getScans",
    pagination :{
        "pageNumber": 0,
        "pageSize": 15
    },
    searchFormat: "JSON",
    searchParams: {
        filterData: ""
    }
  })
  /** @remarks Useeffect to get filtered data */
  useEffect(() => {
    if (isFilter?.filterState === true || isFilter?.filterState === false) {
      
      const filterString = generateFilterString(isFilter)
      const updatedScanProcessPayLoad = {
        ...scanProcessPayLoad,
        searchParams: {
          ...scanProcessPayLoad.searchParams,
          filterData: filterString
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      setRowData([]);
      if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
      setColumns([])
      setScanProcessPayLoad(updatedScanProcessPayLoad);
      fetchScanProcessData(updatedScanProcessPayLoad);
    }
  }, [isFilter]);
 /** @remarks Function fto get Scan process data */
  const fetchScanProcessData = async (Payload) => {
    
    try {
      let result = await getScanProcessList(Payload).unwrap();
      if(result?.status_code === 200 || result?.res_status === 'True'){
      const filteredData = result?.columns?.filter(item => item.filter);
      
         let createData = result?.columns?.filter(item => item.create);
      createData = createData.map((item)=>{
        return {...item, visibility:true}
      })
      setInsertFields(createData);
      setFilterCols(filteredData);
      setRowData(result?.result_set);
      if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
      setColumns(result?.columns);
      setTotalRecords(result?.total_records);
    }
    } catch (e) {}
  };
  useImperativeHandle(ref, () => ({
  getRowData: () => rowData,
  getColumns: ()=>columns
  }));
  /** @remarks Function for pagination */
  const pageChange = (params) =>{
    setRowData([]);
    if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
    setColumns([])
    scanProcessPayLoad.pagination.pageNumber = params.pageNumber;
    scanProcessPayLoad.pagination.pageSize = params.pageSize;
    fetchScanProcessData(scanProcessPayLoad);
  }
  /** @remarks Function for sorting */
  const onSort = (params) =>{
    setRowData([]);
    if (props.onRowDataChange) {
        props.onRowDataChange([]); 
      }
    setColumns([])
    scanProcessPayLoad.searchParams.sortBy = params.sortBy;
    scanProcessPayLoad.searchParams.sortorder = params.sortorder;
    setScanProcessPayLoad(scanProcessPayLoad);
    fetchScanProcessData(scanProcessPayLoad);
  }
return (
<div>
<Toast ref={toast} />
    <PrimeDataTable isLoading={isLoading} columns={columns} insertFields={insertFields} filterCols={filterCols} data={rowData} menu={props.menu} paginator={true}  selectionMode={'multiple'} handleAuditPopUp={handleAuditPopUp} height={33} totalRecords={totalRecords} pageSort={onSort} pageChange={pageChange}/>
    {auditPopup &&
    <DialogBox header='Audit Data' content={auditPopUpDetails()} style={{width:'60vw'}} onHide={closeAuditPopup} selectionMode={null}/>
    } 
    {props?.statusPopup &&
          <DialogBox content={openStatusComponent()} style={{width:'60vw'}} onHide={props?.onClose}/>
        }  
</div>
)
}
)
export default ScanProcessComponent