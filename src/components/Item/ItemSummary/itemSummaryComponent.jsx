import  { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import {  whiteSave } from '../../../assests/icons/';
import TabsComponent from '../../Shared/tabs/Tabs';
import ItemDetails from '../ItemDetails/itemDetails';
import CandSWarehouseDetails from '../CandSWarehouseDetails/CandSWarehouseDetails';
import CustomerItemDetails from '../customerItemDetails/customerItemDetails';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import StatusComponent from '../../Shared/Status/Status';
import ModShipperDetails from '../modShipperDetails/modShipperDetailsC';
import { useDispatch, useSelector } from 'react-redux';
import { generateFilterString } from '../../Shared/lookupPayload';
import {useGetItemSummaryMutation,useGetItemDetailsMutation, useUpdateItemDetailsMutation, useSaveItemDetailMutation, useItemsVendorDeductMutation} from '../../../services/itemSetup';
import TobaccoDetails from '../tobaccoDetails/tobaccoDetailsC';
import DealDetails from '../dealDetails/dealDetailsC';
import {  changeSubModule, resetSubModule } from '../../../slices/navigation';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { recordsMsgs, resetIsFilter } from '../../../slices/columnSelection';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';

const ItemSummaryComponent = forwardRef((props, ref) => {
    const toast = useRef(null);
    const [visibleUPCDetails, setVisibleUPCDetails] = useState(false);
    const [upcData, setUpcData] = useState({});
    const options = ['Item Details', 'C&S Warehouse Details', 'Customer Item Details', 'Mod/Shipper Details', 'Hazardous, DEA Details', 'Tobacco Details'];
    const [value, setValue] = useState(0);
    const [upcComm, setUpcComm] = useState('');
    const [unitFactor, setUnitFactor] = useState('');
    const [apVendor, setApVendor] = useState('');
    const [upcMfg, setUPCMfg] = useState('');
    const [upcCase, setUPCCase] = useState('');
    const [upcItem, setUPCItem] = useState('');
    const [upcUnit, setUPCUinit] = useState('');
    const [unitDesc, SetUnitDesc] = useState('');
    const [upcPrefix, setUpcPrefix] = useState('');
    const [columns,setColumns] = useState([])
    const [data,setData] = useState([]);
    const [insertFields,setInsertFields] = useState([]);
    const [showBackToVendor,setShowBackToVendor] = useState(false); 
    const navObj = useSelector((state) => state.navigation);
    const [getItemSummary,{resultItemSummary,isSuccessItemSummary,isLoading,isFetchingSummary,errorSummary}]= useGetItemSummaryMutation()
    const [getItemDetails,{resultItemDetails,isSuccessItemDetails,isLoadingItemDetails,isFetchingItemDetails,errorItemDetails}]= useGetItemDetailsMutation();
    const [updateItemDetails,{resultUpdateItemDetails,isSuccessUpdateItemDetails,isLoadingUpdateItemDetails,isFetchingUpdateItemDetails,errorUpdateItemDetails}]= useUpdateItemDetailsMutation();
    const [saveItemSummary,{resultSaveItemSummary,isSuccessSaveItemSummary,isSaveLoading,isFetchingSavingSummary,errorItemSummary}]= useSaveItemDetailMutation();
    const [itemData,setItemData]= useState({})
    const [itemInsertFields,setItemInsertFields]= useState([]);
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
    const [filterCols,setFilterCols] = useState([]);
    const dispatch = useDispatch();
    const[copyRow,setCopyRow] = useState(false);
    const[showUpdateBtn,setShowUpdateBtn] = useState(false);
    const[loader,setShowLoader] = useState(false);
    const [totalRecords,setTotalRecords] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [itemsVendorDeduct,{}]= useItemsVendorDeductMutation()
    const [errors, setErrors] = useState({
 UPCComm:'',
  UPCUnit: '',
  UPCMfg:'',
  UPCItem:'',
  UPCCase:''
});
    const copyAndAddRow = ()=>{
        setCopyRow(!copyRow)
    }    /**
    @remarks Function to open Item details form @author Amar
    */
    const location = useLocation();
    useEffect(() =>{
        const { itemId } = location.state || {};
        
        if(itemId){
            setShowBackToVendor(!showBackToVendor);
            let filterData = "AP_VENDOR_NUM = " + [itemId];
            filterData = filterData.replace(/(\d+)/, "['$&']");
            const updatedItemSummaryPayLoad = {
                ...itemPayload,
                searchParams: {
                  ...itemPayload.searchParams,
                  filterData: filterData
                }
              };
            fetchItemSummaryData(updatedItemSummaryPayLoad);
        }
      },[location.state])
      useEffect(() => {
        if(props?.browseKey === 'Success'){
            fetchItemSummaryData(itemPayload);
          props?.setKey('')
        }
      }, [props?.browseKey]);
    const handleShowUpcDetails = (data) => {
        
        setValue(0);
        setShowLoader(true)
        setUpcData(data);
        props.changeVIew(true);
        setUpcComm('');
        setApVendor('');
        setUnitFactor('');
        setUpdatedItemData({});
        setItemData({})
        props?.handleItemDetailsPage(!props?.itemDetailsPage)
        if (data) {
        itemDetails(data)
        }
    }
    const [masterId,setMsaterId]= useState();
    const itemDetails = async(data)=>{
        setMsaterId(data)
        const payload={
        searchParams: {
            sortBy:"",
            sortorder:"",
            filterData:""
            },
            MASTER_ITEM_ID: data?.MASTER_ITEM_ID
        }
        const startTime = Date.now();
        const result = await getItemDetails(payload).unwrap();
        const duration = (Date.now() - startTime) / 1000; // in seconds
        if(result && result.result_set && result.result_set.length > 0){
            toast.current.show({ severity: 'info',summary: 'Fetch Successful',
                detail: `Item details records retrieved successfully (in ${duration} seconds)`,
                life: 3000 });
            setItemData(result?.result_set[0]);
            setShowUpdateBtn(true)
            setShowLoader(false)
            setItemInsertFields(result?.insert_fields);
            setUpcComm(result?.result_set[0]?.UPC_COMMODITY);
            setUpcPrefix(result?.result_set[0]?.UPC_PREFIX)
            setUPCMfg(result?.result_set[0]?.UPC_MFG)
            setUPCCase(result?.result_set[0]?.UPC_CASE)
            setUPCItem(result?.result_set[0]?.UPC_ITEM)
            setUPCUinit(result?.result_set[0]?.UPC_UNIT)
            setUnitFactor(result?.result_set[0]?.UNIT_FACTOR);
            SetUnitDesc(result?.result_set[0]?.ITEM_DESCRIPTION_CASE);
            setLockUPC(result?.result_set[0]?.LOCK_UPC_COMM_FLAG)
        }    else {
            toast.current.show({ severity: 'info',summary: 'No Records',
                detail: `No item details records found (in ${duration} seconds)`,
                life: 3000 });
        }    
    }
    /**
    @remarks Function to Go back to Grid @author Amar
    */
    const handleBack = () => {
        setVisibleUPCDetails(false);
    }
    useImperativeHandle(ref, () => ({
        /**
        @remarks This function returns the columns array @author Shankar Anupoju
        */
        changeVIewOne: () => handleBack(),
        getData: () => data,
    }));
    /**
   @remarks Function to Save Item details @author Amar
   */
   const childRef = useRef(null);
    const handleSaveItemDetails = async(type) => {
        let finalJson;
        let reqObj = {UPC_MFG : '', UPC_ITEM: '',  UNIT_FACTOR : '', ITEM_DESCRIPTION_CASE: '', RECLAIM_VENDOR: '',DISPOSITION: ''}
        if (childRef.current) {
            let data = childRef?.current?.getData();
            finalJson = {...data}
            finalJson['UPC_PREFIX'] = upcPrefix;
            finalJson['UPC_COMMODITY'] = upcComm;
            finalJson['UPC_MFG'] = upcMfg;
            finalJson['UPC_CASE'] = upcCase;
            finalJson['UPC_ITEM'] = upcItem;
            finalJson['UPC_UNIT'] = upcUnit;
            finalJson['UNIT_FACTOR'] = unitFactor;
            finalJson['ITEM_DESCRIPTION_CASE'] = unitDesc;           
            finalJson['LOCK_UPC_COMM_FLAG'] = locUPC;           
        }  
        if(!finalJson?.hasOwnProperty('RECLAIM_VENDOR')){
            finalJson = {...finalJson, RECLAIM_VENDOR: ''}
        } 
        if(!finalJson?.hasOwnProperty('DISPOSITION')){
            finalJson = {...finalJson, DISPOSITION: ''}
        }    
        let obj = {}
        Object?.keys(reqObj).map((i)=>{
            if(finalJson[i] === ''){
                obj[i] = true
            }
            else{
             obj[i] = false
           }
        })
        setFormErrors(obj)
        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
             toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please give required validation',
              });
        }
        // if (finalJson?.UPC_MFG.length !==5) {
        //        toast.current.show({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Please enter atleast 5 characters for upc mfg',
        //       });
        //       return;
        // }
        // if (finalJson?.UPC_ITEM.length !==5) {
        //        toast.current.show({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Please enter atleast 5 characters for upc item',
        //       });
        //       return;
        // }
        // if (finalJson?.UPC_UNIT.length !==5) {
        //        toast.current.show({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Please enter atleast 5 characters for upc unit',
        //       });
        //       return;
        // }
        //   if (finalJson?.UPC_COMMODITY.length !==2) {
        //        toast.current.show({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Please enter atleast 2 characters for upc commodity',
        //       });
        //       return;
        // }
        if(!finalJson?.UPC_MFG || !finalJson?.UPC_ITEM || !finalJson?.UNIT_FACTOR || !finalJson?.ITEM_DESCRIPTION_CASE || !finalJson?.RECLAIM_VENDOR || !finalJson?.DISPOSITION){
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Mandatory fields are required',
              });
        }
        else{
            const payload = {
                "requestMethod": "saveItemDetails",
                "actionObject": [finalJson]
                }               
            try {
                let result = await saveItemSummary(payload).unwrap();
                if(result?.res_status){
                    props?.changeVIew();
                }
                } catch (e) {}
        }
    }
     const vendorDeductApi = async(data)=>{
            setCheckState("")
            let payload={
        "requestMethod": "saveCustDebitAuth",
            "actionObject": {
                "MASTER_ITEM_ID": data["MASTER_ITEM_ID"],
                "updValue": data["DEBIT_AUTHORIZED"]
            }
            }
            let res = await itemsVendorDeduct(payload).unwrap()
            if (res?.res_status) {
                setCheckState("")
            }
        }
    const handleUpdateItemDetails = async() =>{
        let finalJson;
        if (childRef.current) { 
            let data = childRef?.current?.getData()
            finalJson = {...data}
            finalJson['UPC_PREFIX'] = upcPrefix;
            finalJson['UPC_COMMODITY'] = upcComm;
            finalJson['UPC_MFG'] = upcMfg;
            finalJson['UPC_CASE'] = upcCase;
            finalJson['UPC_ITEM'] = upcItem;
            finalJson['UPC_UNIT'] = upcUnit;
            finalJson['UNIT_FACTOR'] = unitFactor;
            finalJson['ITEM_DESCRIPTION_CASE'] = unitDesc;           
            finalJson['LOCK_UPC_COMM_FLAG'] = locUPC;           
        }    
        if(!finalJson?.UPC_MFG || !finalJson?.UPC_ITEM || !finalJson?.UNIT_FACTOR || !finalJson?.ITEM_DESCRIPTION_CASE || !finalJson?.RECLAIM_VENDOR || !finalJson?.DISPOSITION){
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Mandatory fields are required',
              });
        }
        else{ 
        const payload = {
            "opType": "UPD",
            "actionObject": [{
                MASTER_ITEM_ID: finalJson?.MASTER_ITEM_ID,
                AP_VENDOR_NUM: finalJson?.AP_VENDOR_NUM,
                DISPOSITION: finalJson?.DISPOSITION,
                VNDR_DEDUCT_REASON: finalJson?.VNDR_DEDUCT_REASON, 
                RECLAIM_ITEM_STATUS: finalJson?.RECLAIM_ITEM_STATUS,
                RECALL_FLAG: finalJson?.RECALL_FLAG,
                SWELL_FLAG: finalJson?.SWELL_FLAG === undefined ? '' : finalJson?.SWELL_FLAG,
                CASE_UPC_XREF: finalJson?.CASE_UPC_XREF,
                RECALL_CLASSIFICATION: finalJson?.RECALL_CLASSIFICATION,
                UPC_COMMODITY: finalJson?.UPC_COMMODITY,
                UNIT_FACTOR: finalJson?.UNIT_FACTOR,
                LOCK_UPC_COMM_FLAG: finalJson?.LOCK_UPC_COMM_FLAG,
                DEBIT_AUTHORIZED: finalJson?.DEBIT_AUTHORIZED === undefined ? '' : finalJson?.DEBIT_AUTHORIZED,
                RECLAIM_VENDOR: finalJson?.RECLAIM_VENDOR,
                MEMO: finalJson?.MEMO,
                CREDIT_AUTHORIZED:finalJson?.DEBIT_AUTHORIZED
            }]
            }
        try {
            let result = await updateItemDetails(payload).unwrap();
            if(result?.res_status){
                 if (checkState === 'yes') {
            vendorDeductApi(finalJson)
            // itemDetails(masterId)

        }
         itemDetails(masterId)
            }    
            } catch (e) { }
        }
    }
    /**
@remarks
Function to Change UpcComm Value
@author Amar
*/

    const handleChange = (e, val) => {
        if(val === 'UPCComm'){
            setUpcComm(e?.target?.value)
            if (e.target.value.length < 2) {
      setErrors(prev => ({ ...prev, UPCComm: 'Must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, UPCComm: '' }));
    }
        }
        else if (val === 'Unitfactor') {
    if (e?.target?.value?.includes?.('.')) {
        return;
    }
    setUnitFactor(e?.target?.value);
    setFormErrors(false);
}
        else if(val === 'UPCPrefix'){
            setUpcPrefix(e?.target?.value)
        }
       
        else if(val === 'UPCMfg'){
            setUPCMfg(e?.target?.value)
            setFormErrors(false)
              if (e.target.value.length < 5) {
      setErrors(prev => ({ ...prev, UPCMfg: 'Must be at least 5 characters' }));
    } else {
      setErrors(prev => ({ ...prev, UPCMfg: '' }));
    }
        }
        else if(val === 'UPCCase'){
            setUPCCase(e?.target?.value)
             setFormErrors(false)
              if (e.target.value.length < 5) {
      setErrors(prev => ({ ...prev, UPCCase: 'Must be at least 5 characters' }));
    } else {
      setErrors(prev => ({ ...prev, UPCCase: '' }));
    }
        }
          else if(val === 'UPCItem'){
            setUPCItem(e?.target?.value)
            setFormErrors(false)
              if (e.target.value.length < 5) {
      setErrors(prev => ({ ...prev, UPCItem: 'Must be at least 5 characters' }));
    } else {
      setErrors(prev => ({ ...prev, UPCItem: '' }));
    }
        }       
        // else if(val == 'UPCUnit'){
        //     setUPCUinit(e?.target?.value)
        // }
        else if(val == 'UnitDesc'){
            SetUnitDesc(e?.target?.value)
            setFormErrors(false)
        }        
        else if(val == 'lockUpc'){
            setLockUPC(e?.target?.value)
        }

        else if (val === 'UPCUnit') {
    setUPCUinit(e.target.value);

    if (e.target.value.length < 5) {
      setErrors(prev => ({ ...prev, UPCUnit: 'Must be at least 5 characters' }));
    } else {
      setErrors(prev => ({ ...prev, UPCUnit: '' }));
    }
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
    const [itemPayload,setItemPayload] = useState(
            {
                "pagination": {
                    "pageNumber": 0,
                    "pageSize": 15
                },
                "requestMethod": "getItemSum",
                "orderBy": "upcItemEquals",
                "searchFormat": "json",
               "searchParams": {
                    "filterData": ""
    },
        }
)
    const [storeFilter,setStoreFilter] = useState({});
     useEffect(() => {
        if (
            !location?.state?.itemId && 
            ((isFilter?.filterState === true || (isFilter?.filterState === false && value !== 1 && value !== 2 )) && navObj?.CHILD_MODULE === 'Item Summary')
          ) {
            
            
            if(isFilter.filterString?.length > 0) {
                setStoreFilter(isFilter); 
            }  
            
            const filterString = generateFilterString(isFilter);
            
            const updatedItemSummaryPayLoad = {
              ...itemPayload,
              searchParams: {
                ...itemPayload.searchParams,
                filterData: filterString,
              },
               pagination:{
          pageNumber:0,
          pageSize:15
          }
            };
            setItemPayload(updatedItemSummaryPayLoad);
            setData([]);
            setColumns([]);
            fetchItemSummaryData(updatedItemSummaryPayLoad);
          }
    //       else{
    //         debugger
    //         setData([]);
    //         setColumns([]);
    //         let filterDataVal = "AP_VENDOR_NUM = " + [location?.state?.itemId];
    //         filterDataVal = filterDataVal.replace(/(\d+)/, "['$&']");
    //         if(location?.state?.itemId){
    //     const updatedItemSummaryPayLoad = {
    //         ...itemPayload,
    //         searchParams: {
    //           ...itemPayload.searchParams,
    //           filterData: filterDataVal,
    //         },
    //          pagination:{
    //             pageNumber:0,
    //             pageSize:15
    //             }
    //       };
    //       fetchItemSummaryData(updatedItemSummaryPayLoad);
    //       setItemPayload(updatedItemSummaryPayLoad);
    // }
    //       } 
}, [isFilter,props?.newValue,navObj?.CHILD_MODULE]);
    const fetchItemSummaryData = async (payload) => {
        
    try {
      let result = await getItemSummary(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
        
         const columnsData = result?.columns?.map((item) => {
        if(item.field === 'GL_DESCRIPTION'){
            return {...item,field:'ITEM_DESCRIPTION_CASE',header:'Item Description'};
        }
        return item;
      });
        const resData = result?.result_set?.map((item) => {
            if (item.GL_NUM && item.GL_DESCRIPTION) {
            return {...item,GL_NUM: `${item.GL_NUM} - ${item.GL_DESCRIPTION}`};
            }
            
            return item;
        });
      setData(resData);

       if (props.onRowDataChange) {
        props.onRowDataChange(resData); 
      }

     
      setColumns(columnsData);
      setFilterCols(result?.filter_cols);
      setInsertFields(result?.insert_fields);
      setTotalRecords(result?.total_records);
      if (result?.result_set?.length > 0) {
        dispatch(recordsMsgs('Loading...'));
    } else {
            dispatch(recordsMsgs('Query to get the results')); 
    }
    // if (location?.state?.fromVendorMaster && result?.result_set?.length === 0) {
    //     dispatch(recordsMsgs('No Records Found')); 
    // }
    }else {
         setColumns(result?.columns);
         setTotalRecords(result?.total_records);
         setData(result?.result_set);
    }
    } catch (e) {}
  };
    const handleTabChange = (e)=>{
         dispatch(resetIsFilter());
        dispatch(resetSubModule());
        setValue(e)
        if(e === 0){
            dispatch(changeSubModule( {subModule:'Item Summary'}));
           }
       if(e === 1){
        dispatch(changeSubModule( {subModule:'Item Details - C&S Warehouse Details'}));
       }
        else if(e===2){
        dispatch(changeSubModule( {subModule:'Item Details - Customer Item Details'}));
       // dispatch(changeIsFilter({filterState: false, filterString: null ,jsonData:null,clearChips:true}))
       }
       else if(e===3){
         dispatch(changeSubModule( {subModule:'Item Details - Mod/Shipper Details'}));
       }
       else if(e===4){
        dispatch(changeSubModule( {subModule:'Item Details - Hazardous, DEA Details'}));
      }
      else if(e===5){
        dispatch(changeSubModule( {subModule:'Item Details - Tobacco Details'}));
      } 
    }
  const pageChange = (params) =>{
    itemPayload.pagination = params;
    setData([]);
    setColumns([])
    let filterDataVal = "AP_VENDOR_NUM = " + [location?.state?.itemId];
    filterDataVal = filterDataVal.replace(/(\d+)/, "['$&']");
    if(location?.state?.itemId){
        const updatedItemSummaryPayLoad = {
            ...itemPayload,
            searchParams: {
              ...itemPayload.searchParams,
              filterData: filterDataVal,
            },
          };
          fetchItemSummaryData(updatedItemSummaryPayLoad);
          setItemPayload(updatedItemSummaryPayLoad);
    }
   else{
    
    setItemPayload(itemPayload);
    fetchItemSummaryData(itemPayload);
   }
  }
  const onSort = (params) =>{
    itemPayload.searchParams.sortBy = params.sortBy;
    
    setData([]);
    setColumns([])
    itemPayload.searchParams.sortorder = params.sortorder;
    let filterDataVal = "AP_VENDOR_NUM = " + [location?.state?.itemId];
    filterDataVal = filterDataVal.replace(/(\d+)/, "['$&']");
    if(location?.state?.itemId){
        const updatedItemSummaryPayLoad = {
            ...itemPayload,
            searchParams: {
              ...itemPayload.searchParams,
              filterData: filterDataVal,
            },           
          };
          fetchItemSummaryData(updatedItemSummaryPayLoad);
          setItemPayload(updatedItemSummaryPayLoad);
    }
   else{
    
    setItemPayload(itemPayload);
    fetchItemSummaryData(itemPayload);
   }
  }
  const navigate = useNavigate();
  const handleBackToVendor = () =>{
    navigate('/vendorSetup');
  }
  const [groupColumns,setGroupColumns] = useState({});
  const backToItemSummary = () =>{
    
    let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
  //  dispatch(changeIsFilter(storeFilter));
   setShowUpdateBtn(false)
   setShowLoader(false)
    props?.changeVIew();
    setValue(0)
    setItemData({})
    setUpcComm('');
    setUpcPrefix('')
    setUPCMfg('')
    setUPCCase('')
    setUPCItem('')
    setUPCUinit('')
    setUnitFactor('');
    SetUnitDesc('');
    setLockUPC('')
  }
  const handleClickCreate = () =>{
    setUpcData([]);
    setUpcComm('');
    setUpcPrefix('')
    setUPCMfg('')
    setUPCCase('')
    setUPCItem('')
    setUPCUinit('')
    setUnitFactor('');
    SetUnitDesc('');
    setLockUPC('')
    props?.handleItemDetailsPage(!props?.itemDetailsPage)
    setItemData({});
    setUpdatedItemData({});
    setShowUpdateBtn(false)
}
    const [staticValues,setStaticValues] = useState(["Y", "N"]);
    const [updatedItemData,setUpdatedItemData] = useState({})
    const [locUPC,setLockUPC] = useState();
    const updateItemData = (data) =>{
        setUpdatedItemData(data);
    }
      const [storeViewData,setStoreViewData] = useState({});
      const storeSelectedView = (params) =>{
        
        setStoreViewData(params);
      }
    const [checkState,setCheckState]= useState()

 const handleYes = (data)=>{
    setCheckState(data)
}
    return (
        <div>
              <Toast ref={toast} />
        <div className='row'>
        <div className='col-10'></div>
        <div className='col-2'>
            {showBackToVendor ? 
             <Button onClick={handleBackToVendor} className='mb-1 ms-auto primary-button m-1'>Back to  Vendor Master</Button>    
        : ''}
            </div>
            </div>
            {!props?.itemDetailsPage ?
            <>
            {!showBackToVendor ?
            <div className='row'>
            <div className='col-11'></div>
            <div className='col-1'>
            </div></div> : ''}            
                <PrimeDataTable 
                  storeSelectedView={storeSelectedView}
                storeViewData={storeViewData} 
fromVendorMaster={location?.state?.fromVendorMaster}
                data={data} groupColumns={groupColumns} itemSummaryCreate={true} handleClickCreate={handleClickCreate} pageChange={pageChange} totalRecords={totalRecords} insertFields={insertFields} filterCols={filterCols} pageSort={onSort} columns ={columns} isLoading={isLoading} visibleUPCDetails={!props?.itemDetailsPage} handleShowUpcDetails={handleShowUpcDetails} paginator={true} selectionMode={'multiple'} height={33}/>
                </> :
                <>
                    <div className='p-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className='page-title'>{itemData?.MASTER_UPC ? itemData?.MASTER_UPC + '- Details' : 'Create'} </span>
                                 <div className=' d-flex ml-auto gap-2'>
                              {(navObj?.CHILD_MODULE === 'Item Summary') && (
                                  <>
                                      {showUpdateBtn ? (
                                          <button className='primary-button float-right m-1' onClick={handleUpdateItemDetails}>
                                              <img src={whiteSave} alt="save" width={16} className='me-2' />Update
                                          </button>
                                      ) : (
                                          <button className="primary-button" onClick={handleSaveItemDetails}>
                                              <img src={whiteSave} alt="save" width={16} className='me-2' />Save
                                          </button>
                                      )}
                                     
                                  </>
                                  
                              )}
                               <button className="secondary-button" htmlType='submit' onClick={backToItemSummary}>Close</button>
                                 </div>
                            </div>
                            <hr className="mt-1" />
                            <div className='card p-3' style={{ boxShadow: "0px 2px 10px 0px #0000001A" }}>
                                <p className='title-tag mb-0'>Item Details </p>  
                                <hr className="mt-1" />
                                <div className='row d-flex'>
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Prefix</label>
                                        {upcPrefix === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>: 
                                        <InputText  className= 'textboxCSS w-100' value={upcPrefix} onChange={(e) =>handleChange(e, 'UPCPrefix')} disabled={showUpdateBtn ? true : false}/>}
                                    </div>
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Comm</label>
                                        {upcComm === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>: <InputText  className= 'textboxCSS w-100' maxLength={2} value={upcComm} onChange={(e) =>handleChange(e, 'UPCComm')}/>
                                        }
                                        {errors.UPCComm && <small className="text-danger">{errors.UPCComm}</small>}

                                    </div>  
                                      
                                                        <div className='col-2'>
                                                        <label className='label'>Master UPC</label><br/>
                                                       
                                                         
                                                        <InputText className="textboxCSS w-100" disabled= {true}  
                                                        value={itemData?.MASTER_UPC ?? '' } />
                                                        
                                                        
                                                        
                                                        
                                                    </div>
                                                   
                                                         <div className='col-2'>
                                                        <label className='label'>RTL UPC MFG</label><br/>
                                                       
                                                       
                                                        <InputText className="textboxCSS w-100" disabled= {true}  
                                                        value={itemData?.RTL_UPC_MFG ??'' } />
                                                        
                                                        
                                                        
                                                        
                                                    </div>
                                                    
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Mfg <label className='starColor'>*</label></label>
                                        {upcMfg === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText className={formErrors['UPC_MFG'] ? 'p-invalid w-100 textboxCSS' : 'w-100 textboxCSS'} maxLength={5} value={upcMfg}  onChange={(e) =>handleChange(e, 'UPCMfg')} disabled={showUpdateBtn ? true : false}/>}
                                {errors.UPCMfg && <small className="text-danger">{errors.UPCMfg}</small>}

                                    </div>
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Case</label>
                                        {upcCase === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText  className={formErrors['UPCCase'] ? 'p-invalid w-100 textboxCSS' : 'w-100 textboxCSS'} maxLength={5} value={upcCase} onChange={(e) =>handleChange(e, 'UPCCase')} disabled={showUpdateBtn ? true : false}/>}
                                        {errors.UPCCase && <small className="text-danger">{errors.UPCCase}</small>}
                                    </div>
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Item <label className='starColor'>*</label></label>
                                        {upcItem === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText className={formErrors['UPC_ITEM'] ? 'p-invalid w-100 textboxCSS' : 'w-100 textboxCSS'} value={upcItem}  maxLength={5}  onChange={(e) =>handleChange(e, 'UPCItem')} disabled={showUpdateBtn ? true : false}/>}
                                      {errors.UPCItem && <small className="text-danger">{errors.UPCItem}</small>}

                                    </div>
                                    <div className='col-sm-2'>
                                        <label className='label'>UPC Unit</label>
                                        {upcUnit === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText  className= 'textboxCSS w-100'  maxLength={5} value={upcUnit}  onChange={(e) =>handleChange(e, 'UPCUnit')} disabled={showUpdateBtn ? true : false}/>}
  {errors.UPCUnit && <small className="text-danger">{errors.UPCUnit}</small>}
                                    </div>                                 
                                    <div className='col-sm-2 pt-2'>
                                        <label className='label'>Unit Factor <label className='starColor'>*</label></label><br />
                                        {unitFactor === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText className={formErrors['UNIT_FACTOR'] ? 'p-invalid w-100 textboxCSS' : 'w-100 textboxCSS'} value={unitFactor} onChange={(e) =>handleChange(e, 'Unitfactor')}/>}
                                    </div>
                                    <div className='col-sm-2 pt-2'>
                                        <label className='label'>Unit Description <label className='starColor'>*</label></label>
                                        {unitDesc === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <InputText className={formErrors['ITEM_DESCRIPTION_CASE'] ? 'p-invalid w-100 textboxCSS' : 'w-100 textboxCSS'} value={unitDesc}  onChange={(e) =>handleChange(e, 'UnitDesc')} disabled={showUpdateBtn ? true : false}/>}
                                    </div>
                                    <div className='col-sm-2 pt-2'>
                                        <label className='label'>Lock UPC Comm Flag</label><br />                                       
                                        {locUPC === '' && loader ? <Skeleton className="mb-2" height='2.3rem'></Skeleton>:
                                        <Dropdown className='w-100'
                                            options={staticValues}
                                            value={locUPC}
                                            placeholder="Select"
                                            onChange={(e) => handleChange(e, 'lockUpc')}
                                        />}
                                    </div>
                                </div>
                            </div>
                            <div className='p-1 mt-4' >                          
                            <div className="d-flex  align-items-center tabSection">
                                 <TabsComponent tabs={options} tabChange = {handleTabChange} activetab={value}
                                 tabName = {options[value]} copyAndAddRow ={copyAndAddRow} copyRow={copyRow} upcData={upcData} />
                            </div>
                                <div>
                            {options[value] === 'Item Details' ? (
                                <ItemDetails  handleYes = {handleYes} formErrors={formErrors} ref={childRef} close={props?.changeVIew} upcData={upcData} insertSummaryFields={insertFields} itemData={itemData} itemLoader={loader}  itemInsertFields={itemInsertFields} updatedData = {updateItemData} updatedItemData={updatedItemData}/>
                            ) : options[value] === 'C&S Warehouse Details' ? (
                                <CandSWarehouseDetails upcData={upcData} />
                            ) : options[value] === 'Customer Item Details' ? (
                                <CustomerItemDetails  copyRow={copyRow} upcData={upcData}/>
                            ) : options[value] === 'Mod/Shipper Details' ? (
                                <ModShipperDetails upcData={upcData}/>
                            ) : options[value] === 'Tobacco Details' ? (
                                <TobaccoDetails upcData={upcData}/>
                            ) : options[value] === 'Hazardous, DEA Details' ? (
                                <DealDetails upcData={upcData}/>
                            ) : (
                                <></>
                            )}
                            </div>
                            </div>
                    </div>
                </>
            }
             {props?.statusPopup &&
                <DialogBox content={openStatusComponent()} style={{width:'70vw'}} onHide={props?.onClose}/>
                }    
        </div>
         
    )
        })
export default ItemSummaryComponent;