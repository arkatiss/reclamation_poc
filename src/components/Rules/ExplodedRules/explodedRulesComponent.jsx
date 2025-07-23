import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useGetExplodedRulesListMutation, useGetExplodedRulesVendorFeeMutation, useGetRulesDefCustomerFeeAuditMutation } from '../../../services/customersSetup';
import { InputSwitch } from 'primereact/inputswitch';
import { rulesFilterString } from '../../Shared/lookupPayload';
import { useDispatch, useSelector } from 'react-redux';
import { useExplodeRulesVendorFeeMutation, useGetRulesAuditRecMutation } from '../../../services/rulesSetup';
import { recordsMsgs } from '../../../slices/columnSelection';

const ExplodedRulesComponent = forwardRef((props, ref) => {
      const { onRowDataChange } = props;

  const [getExplodedRulesList, { dataResult, isSuccess, isLoading, isFetching, error }] = useGetExplodedRulesListMutation();
  const [columns, setColumns] = useState([]);
  const [columnsSwitch, setColumnsSwitch] = useState([]);
  const [insertFields, setInsertFields] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [hasVendorPopUp,setHasVendorPopUp] = useState(false)
  const [hasVendorAuditPopUp,setHasVendorAuditPopUp] = useState(false)
  const [hasVendorAuditColumns,setHasVendorAuditColumns] = useState([]);
  const [hasVendorAuditData,setHasVendorAuditData]= useState([])
  const [filterCols,setFilterCols] = useState([])
  const isFilter = useSelector((state)=>state?.columnSelection?.isFilter);
  
  const [checked, setChecked] = useState(false);
  const [switchText, setSwitchText] = useState('Summarized View Off');
  const dispatch = useDispatch();
  const [explodeRulesVendorFee,{}]= useExplodeRulesVendorFeeMutation()
  const [getRulesAuditRec,{}]= useGetRulesAuditRecMutation();
  const [hasVendorFeeColumns,setHasVendorFeeColumns] = useState([]);
  const [hasVendorFeeData,setHasVendorFeeData]= useState([]);
  const [tableColumns,setTableColumns] = useState([ {header: 'Rule', field: 'EXPLOSION_SOURCE'},{header: 'Reclaim AP Vendor', field: 'Reclaim AP Vendor'}, {header: 'AP Vendor', field: 'AP Vendor'},{header: 'Reclaim Customer Group', field: 'Reclaim Customer Group'},{header: 'Facility', field: 'FACILITY'}, {header: 'GL', field: 'GL_CODE'},{header: 'Chain', field: 'chain'},{header: 'Cust Division', field: 'DIVISION_NAME'}, {header: 'Reclaim Customer', field: 'Reclaim Customer'},{header: 'UPC', field: 'upc'},{header: 'Whse Item Code', field: 'WHSE_ITEM_CODE'},{header: 'Cust Item', field: 'CUSTOMER_ITEM_CODE'},{header: 'Item Purch Status', field: 'ITEM_PURCHASE_STATUS'},{header: 'Customer Credit', field: 'CREDIT_AUTHORIZED'},{header: 'Vendor Deduct', field: 'DEBIT_AUTHORIZED'},{header: 'Disposition', field: 'DISPOSITION'},{header: 'Reclaim As Service', field: 'RECLAIM_AS_SERVICE'},{header: 'Vendor Fees', field: 'HAS_VENDOR_FEE'},{header: 'Customer Fees', field: 'HAS_CUSTOMER_FEE'},{header: 'Purchase Cost', field: 'PURCHASE_COST'},{header: 'Sales Cost', field: 'WEIGHTED_AVG_SALES_COST'},{header: 'Customer State', field: 'CUSTOMER_STATE'},{header: 'Tobacco Tax', field: 'TOBACCO_STATE_TAX'},{header: 'Bottle Deposit', field: 'BOTTLE_DEPOSIT'},{header: 'Is Recall', field: 'RECALL_FLAG'},{header: 'Recall Class', field: 'RECALL_CLASS'},{header: 'Is Swell', field: 'SWELL'},{header: 'Error Message', field: 'ERROR_MESSAGE'},{header: 'Comment', field: 'COMMENTS'},{header: 'Rule Effective From', field: 'RULE_EFFECTIVE_FROM'},{header: 'Rule Effective To', field: 'LAST_UPDATE_BY'},{header:'ELS last update',field:'TIME_DATA'}]);
  const navObj = useSelector((state) => state.navigation);

  const [totalRecords,setTotalRecords] = useState('');
    const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
  
  const [explodePayload,setExplodedPayload]= useState({
    "query": {
      "bool": {
        "must": [
          {
            "bool": {
              "should": [
                
                {
                  "match": {
                    "RECLAIM_VENDOR_NUM": ""
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "_source": [],
    "from": 0,
    "size": 50
  })
/**  @remarks Useeffect to show Columns to filter  */
useEffect(() => {

  const VALUES = [{key:'Yes',value:'Y'},{key:'No',value:'N'},{key:'Null',value:'null'}];
 

  let staticColumns = [
    { field: "AP_VENDOR_NUMBER", header: "AP Vendor number" },
     {field: "RECLAIM_VENDOR_NUM",header:"Orig Rclm AP Vendor"},  
    {field: "CS_STORE_NUM",header:"Reclaim Customer"},  
    { field: "CHAIN_NUMBER", header: "C&S CHAIN" },
    {field:'GL_NUM',header:'GL'},
    {field:'RCLM_CUSTOMER_GRP_NUM',header:'Reclaim Customer Group'},
    {field:"ITEM_UPC",header:"UPC"},
    {field: "CUSTOMER_ITEM",header:"Customer Item"},
    {field: "CS_WHSE_ITEM_CODE",header:"Warehouse Item"},
    {field: "DISP_TYPE_DESCR",header:"Disposition"},
    {field: "RULE_EFFECTIVE_FROM",header:"Effective From",type:"DATE"},
    {field: "RULE_EFFECTIVE_TO",header:"Effective To",type:"DATE"},
    {field: "HAZD_FLAG",header:"Hazardous",VALUES},
    {field: "PRIVATE_LABEL",header:"Private Label",VALUES},
    {field: "CREDIT_AUTHORIZED",header:"Customer Credit",VALUES},
    {field: "DEBIT_AUTHORIZED",header:"Vendor Debit",VALUES},
    {field: "RECALL_FLAG",header:"Recall",VALUES},
    {field: "SWELL",header:"Swell",VALUES},  
   

  ];
  setFilterCols(staticColumns)
}, []);
/**  @remarks Useeffect to get filtered data  */
useEffect(() => {
   
//   if (addFilObj!==null && Object.keys(addFilObj)) {
//     console.log(addFilObj)
//       const filterString = rulesFilterString(isFilter,addFilObj);
//    if (Object.keys(filterString).length > 0) {
//     fetchExplodedRulesList(filterString);
// }
//   }
   if (((isFilter?.filterState === true || isFilter?.filterState === false) || (addFilObj!==null && Object.keys(addFilObj).length > 0))) {
    const filterString = rulesFilterString(isFilter,addFilObj,filterCols);
    
    if(navObj?.CHILD_MODULE === 'Exploded Rules') {
      if (Object.keys(filterString).length > 0 || Object.keys(addFilObj).length > 0) {
        
        fetchExplodedRulesList(filterString);
      } else {
        fetchExplodedRulesList(explodePayload)
      }
    }
  }
}, [isFilter]);
/**  @remarks Useeffect to get Expolded rules data  */
  const fetchExplodedRulesList = async (payload) => {
    
    setRowData([])
    setColumns([])
    try {
      let result = await getExplodedRulesList(payload).unwrap();
      const finalCols = [...tableColumns]
      setColumns(finalCols)
      if(result?.hits?.hits?.length > 0 ){
      const data = result?.hits?.hits?.map((i) => {
        return i?._source
      })
        let filteredDataFinal=data?.map((item,index)=>{
          return {...item, 'Reclaim AP Vendor':item?.RECLAIM_VENDOR_NUM + '-'+item.RECLAIM_VENDOR_NAME, 'AP Vendor':item?.RECLAIM_VENDOR_NUM + '-'+item.RECLAIM_VENDOR_NAME, 'Reclaim Customer Group':item?.RCLM_CUSTOMER_GRP_NUM + '-'+item.RCLM_CUSTOMER_GRP_NAME, 'Reclaim Customer' : item?.CUST_STORE_NUM + '-'+item.CUSTOMER_NAME, 'chain': item?.CHAIN_NUMBER + '-'+item.CHAIN_NAME, 'upc': item?.ITEM_UPC + '-'+item.UPC_DESCRIPTION_CASE,TIME_DATA:formatTimestampToDate(item?.TIME_DATA)}
        })
      setRowData(filteredDataFinal)
       if (props.onRowDataChange) {
        props.onRowDataChange(filteredDataFinal); 
      }
      setInsertFields(result?.resultSet)
      setTotalRecords(result?.hits?.total);
      const finalCols = [...tableColumns];
      setColumnsSwitch(finalCols)
      const filteredData = finalCols?.filter(item => 
         item.field !== 'CUSTOMER_STATE' && item.field !== 'DIVISION_NAME' && item.field !== 'Reclaim Customer' 
    );
              setColumns(filteredData)
               if (result?.hits?.hits?.length > 0) {
                      dispatch(recordsMsgs('Loading...'));
                  } 
                  else {
                    dispatch(recordsMsgs('Query to get the results')); 
            }
            }           
            else {
              setTotalRecords(0)
              dispatch(recordsMsgs('Query to get the results')); 
      }
    } catch (e) {}
  };
  /**
  @remarks This function to open Rules Definition status page @author Amar */
  const openStatusComponent = () => {
    return (<StatusComponent showStatusTabs={props?.showStatusTabs} statusType={props?.statusType}/>)
  }
/**  @remarks Function to handle Audit popup  */
  const handleAuditPopUp = (data,field)=>{
    if (field === "HAS_VENDOR_FEE" || field === "HAS_CUSTOMER_FEE") {
      setHasVendorPopUp(!hasVendorPopUp)
    fetchExplodedRulesVendorFee(data,field)
    }else{
      setHasVendorAuditPopUp(!hasVendorAuditPopUp)
      fetchExplodRulesVendorAuditData(data)
    }
  }
  const [headerName,setHeaderName] = useState('');
/**  @remarks Function to get Vendor Fee data  */
  const fetchExplodedRulesVendorFee = async(data,field)=>{
    setHeaderName(field === "HAS_VENDOR_FEE" ? "Vendor Fees" : "Customer Fees");
  //  dispatch(changeSubModule( {subModule:field === "HAS_VENDOR_FEE" ? "Vendor Fees" : "Customer Fees"}));
    const payload={
    
    "requestMethod": "getFeesByRulesExp",
    "searchParams": {
        "ruleId": data?.FEE_GRP_ID,
        "feeType": field === "HAS_VENDOR_FEE" ? "VENDOR": "CUSTOMER"
    }
  }
  try {
    let res= await explodeRulesVendorFee(payload).unwrap();
     setHasVendorFeeColumns(res?.columns);
    setHasVendorFeeData(res?.result_set);
   
  } catch (error) { 
  }
  }
  /**  @remarks Function to show vendor Fee data in grid  */
  const explodedRuleshasVendorFeeTemplate = ()=>{
    return (<PrimeDataTable   columns={hasVendorFeeColumns} data={hasVendorFeeData} storeView={'storeView'} smartSearchOff={true} handleAuditPopUp={handleAuditPopUp} />)
  }
  /**  @remarks Function to Close Vendor Fee popup  */
  const closehasVendorTemplate=()=>{
    setHasVendorPopUp(!hasVendorPopUp)
    // dispatch(changeSubModule( {subModule:'Exploded Rules'}));
  }
    /**  @remarks Function to Close Vendor Fee Audit popup  */
  const closehasVendorAuditTemplate=()=>{
        setHasVendorAuditPopUp(!hasVendorAuditPopUp)
  }
    /**  @remarks Function to get Vendor Fee audit popup  */
  const fetchExplodRulesVendorAuditData=async(data)=>{
        const payload={

    "requestMethod": "getAudit",
        "source": "FeeDetailsAud",
        "recordId":data?.FEE_ID
}

    let response = await getRulesAuditRec(payload).unwrap()
    if (response?.res_status) {
       setHasVendorAuditColumns(response?.columns) 
      setHasVendorAuditData(response?.result_set)
     
    }
  }
function formatTimestampToDate(timestampMs) {
  const parsedTimestamp = Number(timestampMs);

  if (isNaN(parsedTimestamp)) return 'Invalid timestamp';

  const date = new Date(parsedTimestamp);
  if (isNaN(date.getTime())) return 'Invalid date';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthShort = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();

  return `${day}-${monthShort}-${year}`;
}

    /**  @remarks Function to show exploded rules Audit data in grid  */
  const explodeRuleAuditTemplate = ()=>{
    return (<PrimeDataTable hideButtons storeView hideSort columns={hasVendorAuditColumns} data={hasVendorAuditData} smartSearchOff={true} height={50}
    handleAuditPopUp={handleAuditPopUp}/>)
  }
  /**  @remarks Function to Switch Summerized view  */
  const handleSwitch = (e) =>{
    setChecked(e.value)
    setSwitchText(e?.value === true ? 'Summarized View On' : 'Summarized View Off')
    if(e?.value === true){
      const filteredData = columnsSwitch;
      setColumns(filteredData)
    }
    else{ 
            const filteredData = columnsSwitch?.filter(item => 
              item.field !== 'CUSTOMER_STATE' && item.field !== 'DIVISION_NAME' && item.field !== 'Reclaim Customer' 
         );
            setColumns(filteredData)
    } 
  }
   /**  @remarks Function to navigate Rules Def page  */
   const handleOpenRulesDefPage = (field, rowData) =>{
    if(rowData[field] === 'R'){
      // if(rowData[field] === 'M'){
      props?.changeVIew(rowData)
    }
   }
     /**  @remarks Function to change the tab(Rules De)  */
     useImperativeHandle(ref, () => ({
           changeTabOne: () => 'RuleDef',
            getData: () => rowData,
       }));

       const pageChange = (direction)=>{
        console.log(direction.page)
    let oldPayload = rulesFilterString(isFilter) || {}; 

    if (!oldPayload || typeof oldPayload !== "object") {
      console.error("Invalid oldPayload:", oldPayload);
      return; 
    }

    let newPayload = {
      ...oldPayload,
      from: direction.page, 
    };

  setExplodedPayload(newPayload);
   fetchExplodedRulesList(newPayload)
     }
     
  const pageSort = (field,SortOrder)=>{
    setRowData([])
   console.log("Sorting Field:", field, "Sort Order:", SortOrder);

  // Perform sorting based on the field and SortOrder
  const sortedData = [...rowData].sort((a, b) => {
    // Compare the field values
    const valueA = a[field] ? a[field].toString().toLowerCase() : '';
    const valueB = b[field] ? b[field].toString().toLowerCase() : '';

    if (valueA < valueB) {
      return SortOrder === 1 ? -1 : 1; 
    }
    if (valueA > valueB) {
      return SortOrder === 1 ? 1 : -1; 
    }
    return 0; 
  });

  // Update the state with the sorted data
  setRowData(sortedData);
  }
  return (
    <div>{rowData?.length > 0 && <div className="d-flex gap-2 justify-content-end align-items-end pb-2">
       <InputSwitch className='switchInupt' checked={checked} onChange={(e) => handleSwitch(e)} /><span className='switchText'>{switchText}</span></div>}
      <PrimeDataTable isLoading={isLoading} totalRecords={totalRecords} columns={columns} data={rowData} paginator={true} height={33} handleAuditPopUp={handleAuditPopUp}
      filterCols={filterCols} handleOpenRulesDefPage = {handleOpenRulesDefPage} pageChange={pageChange} pageSort={pageSort}/>
      {props?.statusPopup &&
        <DialogBox  header={props?.statusHeader} content={openStatusComponent()} style={{ width: '70vw' }} onHide={props?.onClose} />
      }
      {hasVendorPopUp &&
      <DialogBox header={headerName} content={explodedRuleshasVendorFeeTemplate()} style={{ width: '70vw' }} onHide={closehasVendorTemplate}/>}
      {hasVendorAuditPopUp &&
      <DialogBox content={explodeRuleAuditTemplate()} style={{ width: '70vw' }} onHide={closehasVendorAuditTemplate}/>}
    </div>
  )
})

export default ExplodedRulesComponent;