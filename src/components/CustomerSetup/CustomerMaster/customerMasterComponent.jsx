import React, { useImperativeHandle, forwardRef,  useState, useEffect, useRef } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { Dialog } from 'primereact/dialog';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useGetCustomerDataMutation ,useBulkRecordCreateMutation, useDeleteCustomerMutation, useBulkRecordUpdateMutation} from '../../../services/customersSetup';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { generateFilterString } from '../../Shared/lookupPayload';

const CustomerMasterComponent = forwardRef((props,ref) => {
    const { onRowDataChange } = props;
    const [getCustomerList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetCustomerDataMutation();
    const [bulkRecordCreate,{}] =useBulkRecordCreateMutation();
    const [deleteGridRecords, { }] = useDeleteCustomerMutation();
    const [bulkRecordUpdate,{}] = useBulkRecordUpdateMutation()
    const [rowData,setRowData] = useState([]);
    const [columns,setColumns] = useState([]);
    const [totalRecords,setTotalRecords] = useState('');
    const [filterCols,setFilterCols] = useState([]);
    const [insertFields,setInsertFields] = useState([]);
    const [delMessage, setDelMessage] = useState();
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
    const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
    const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
    const [bulkRecords,setBulkRecords]= useState([]);
    const [delRecords,setDelRecords]= useState([]);
    const [showDeletePopup,setShowDeletePopup]= useState(false);
    const [bulkEditRecords,setBulkEditRecords] = useState([])
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [createPopup,setCreatePopup] = useState(true);
    const [customerPayLoad,setCustomerPayLoad] = useState({
      requestMethod: "getCustomerDetails",
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
/**
    @remarks
    useEffect to get delete records
    @author Amar
    */  
    useEffect(() => {
      if (bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          return e?.RCLM_CUSTOMER_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        // setDelMessage('Are you sure you want to delete the selected records ' + ids +'?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
/**
    @remarks
    Function to delete records
    @author Amar
    */  
    const handleDeleteRecords = async ()=>{
      const body = {
        requestMethod: "customerDelete",
        RCLM_CUSTOMER_ID: delRecords
    }
      try {
          let res = await deleteGridRecords(body);
          if(res?.data?.status_code === 200 || res?.data?.res_status){
            toast.current.show({ severity: 'info',summary: 'Delete', detail: 'Deleted successfully', life: 3000 });
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.RCLM_CUSTOMER_ID))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.data?.res_status))
          }
          else{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Delete failed',
            });
          }        
      } catch (e) {}
  }
   /** @remarks Function to hide delete popup */
const hideDeletePopup =() =>{
  setShowDeletePopup(false);
  dispatch(clearDeleteRecordsData([]));
}
   /** @remarks Function to get customer data */
  const fetchCustomerData = async (payload) => {
  try {
    let result = await getCustomerList(payload).unwrap();
    if(result?.res_status){
    // Remove specified columns and then append the concatenated columns at their original positions
    const concatColumns = [
      {
      field: 'ACCOUNT_NAME_NBR',
      header: 'Account'
      },
      {
      field: 'RCLM_CUSTOMER_GRP_NAME_NBR',
      header: 'Reclaim Customer Group'
      },
      {
      field: 'DIVISION_NAME_NBR',
      header: 'Division'
      },
      {
      field: 'CHAIN_NAME_NBR',
      header: 'C&S Chain'
      },
    ];
    const columnsToRemove = [
      'ACCOUNT_NAME', 'ACCOUNT_NUMBER',
      'RCLM_CUSTOMER_GRP_NAME', 'RCLM_CUSTOMER_GRP_NUM',
      'DIVISION_NAME', 'DIVISION_NBR',
      'CHAIN_NAME', 'CHAIN_NUM'
    ];

    // Find the indexes of the columns to be replaced (using the first occurrence)
    const findInsertIndex = (cols, fields) => {
      for (let i = 0; i < cols.length; i++) {
      if (fields.includes(cols[i].field)) {
        return i;
      }
      }
      return cols.length;
    };

    let filteredColumns = result.columns.filter(col => !columnsToRemove.includes(col.field));
    // Insert concatColumns at the position of the first removed column, or at the end if not found
    const insertIdx = findInsertIndex(result.columns, columnsToRemove);
    let columns = [
      ...filteredColumns.slice(0, insertIdx),
      ...concatColumns.map(({ field, header }) => ({ field, header })),
      ...filteredColumns.slice(insertIdx)
    ];

    const resultData = result.result_set.map(item => {
      const {
      ACCOUNT_NAME, ACCOUNT_NUMBER,
      RCLM_CUSTOMER_GRP_NAME, RCLM_CUSTOMER_GRP_NUM,
      DIVISION_NAME, DIVISION_NBR,
      CHAIN_NAME, CHAIN_NUM,
      ...rest
      } = item;
      return {
      ...rest,
      ACCOUNT_NAME_NBR: ACCOUNT_NAME
        ? ACCOUNT_NUMBER
        ? `${ACCOUNT_NUMBER} - ${ACCOUNT_NAME}`
        : ACCOUNT_NAME
        : ACCOUNT_NUMBER || '',
      RCLM_CUSTOMER_GRP_NAME_NBR: RCLM_CUSTOMER_GRP_NAME
        ? RCLM_CUSTOMER_GRP_NUM
        ? `${RCLM_CUSTOMER_GRP_NUM} - ${RCLM_CUSTOMER_GRP_NAME}`
        : RCLM_CUSTOMER_GRP_NAME
        : RCLM_CUSTOMER_GRP_NUM || '',
      DIVISION_NAME_NBR: DIVISION_NAME
        ? DIVISION_NBR
        ? `${DIVISION_NBR} - ${DIVISION_NAME}`
        : DIVISION_NAME
        : DIVISION_NBR || '',
      CHAIN_NAME_NBR: CHAIN_NAME
        ? CHAIN_NUM
        ? `${CHAIN_NUM} - ${CHAIN_NAME}`
        : CHAIN_NAME
        : CHAIN_NUM || '',
      };
    });
    
     setColumns(columns);
    setRowData(resultData);
    if (props.onRowDataChange) {
        props.onRowDataChange(resultData); 
      }
    setTotalRecords(result?.total_records);
     setInsertFields(result?.insert_fields)
    setFilterCols(result?.filter_cols);
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
};
const myRef = useRef(null)
   /** @remarks Useffect to get delete records */
useEffect(() => {
  if(myRef?.current){
    const columnsData = myRef?.current?.getDeleteRecords();
  }
},[myRef?.current])
   /** @remarks Useffect to get filtered data */
useEffect(() => {
  if (isFilter?.filterState === true || isFilter?.filterState === false) {
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
    setCustomerPayLoad(updatedCustomerPayLoad);
    resetGrid();
    fetchCustomerData(updatedCustomerPayLoad);
  }
}, [isFilter]);
    useImperativeHandle(ref, () => ({
           /**
  @remarks
  This function returns the columns array
  @author Shankar Anupoju
  */
        getColumns: () => columns,
        getData: () =>rowData,
        getTemplateCols:() => insertFields

    }));
    /**
  @remarks
  This function to open Customer Master status page
  @author Amar
  */
  const openStatusComponent = ()=>{
    return(<StatusComponent showStatusTabs={props?.showStatusTabs} moduleName={props?.moduleName}/>) 
   }  
      /** @remarks function to reset Grid rows and columns */     
  const resetGrid = ()=>{
    setRowData([]);
    setColumns([]);
  }
     /** @remarks function to create records */
   const createBulkRecord = async() => {
    const bulkCreatePayload = {
    "customerData": bulkRecords
    }
    let res = await bulkRecordCreate(bulkCreatePayload)
    if(res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status))
      fetchCustomerData(customerPayLoad);
      setCreatePopup(!createPopup)
    }
}
   /** @remarks Useffect to get inserted records */
useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);       
    }
}, [bulkData]);
   /** @remarks Function to update(edit) records */
  const editBulkRecord = async()=>{
    const payload={
      "customerData": bulkEditRecords
  }
  let res = await bulkRecordUpdate(payload)
  if(res?.data?.status_code === 200 || res?.data?.res_status){
    dispatch(bulkEditResponse(res?.data?.res_status))
    fetchCustomerData(customerPayLoad);
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
   /** @remarks Useffect to get edite records */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
  /** @remarks Function for Pagination */
const pageChange = (params) =>{
  resetGrid();
  customerPayLoad.pagination = params;
  setCustomerPayLoad(customerPayLoad);
  fetchCustomerData(customerPayLoad);
}
/** @remarks Function for Sorting */
const onSort = (params) =>{
  resetGrid();
  customerPayLoad.searchParams.sortBy = params.sortBy;
  customerPayLoad.searchParams.sortorder = params.sortorder;
  setCustomerPayLoad(customerPayLoad);
  fetchCustomerData(customerPayLoad);
}
    return (
        <div> 
          <Toast ref={toast} />
            <PrimeDataTable columns={columns} data={rowData} totalRecords={totalRecords}  filterCols={filterCols} menu={props.menu} paginator={true}  selectionMode={'multiple'} height={33} insertFields={insertFields} createBulkRecord={createBulkRecord} editBulkRecord={editBulkRecord}
            isLoading={isLoading} pageChange={pageChange} pageSort={onSort} />
            <Dialog header="Download Status" style={{ width: '63vw' }} visible={props?.visible} onHide={props?.onClose}>
            <PrimeDataTable isLoading={isLoading} columns={columns} data={rowData} menu={props.menu} selectionMode={'multiple'} height={32}/>
            </Dialog>
            {props?.statusPopup &&
            <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
            }          
           <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />           
        </div>
    );
})

export default CustomerMasterComponent;
