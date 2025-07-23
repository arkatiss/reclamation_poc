import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { audit } from '../../../assests/icons';
import { Input } from 'antd';
import { AutoComplete } from 'primereact/autocomplete';
import { useGetItemAuditDetailsMutation, useItemsVendorDeductMutation, useUpdateItemDetailsMutation } from '../../../services/itemSetup';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useLookUpSearchMutation } from '../../../services/common';
import { Dropdown } from 'primereact/dropdown';
import { changeSubModule } from '../../../slices/navigation';
import { useDispatch } from 'react-redux';
import { Skeleton } from 'primereact/skeleton';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';

const ItemDetails = forwardRef((props, ref) => {
    const [is_RECALL_CLASSIFICATION, setRECALL_CLASSIFICATION] = useState(false);

  useEffect(() => {
    if (props?.upcData?.RECALL_CLASSIFICATION) {
      setRECALL_CLASSIFICATION(true);
    }
  }, [props?.upcData?.RECALL_CLASSIFICATION]); 
    const [visible, setVisible] = useState(false);
    const [auditData, setAuditData] = useState([]);
    const [auditColumns, setAuditColumns] = useState([]);
    const [insertFields, setInsertFields] = useState([]);
    const [dataDetails, setDataDetails] = useState({}); 
    const [editFlag, setEditFlag] = useState({}); 
    const [disableFalg, setDisableFalg] = useState(false); 
    const [errors, setErrors] = useState({});  
    const [getItemAuditList, {  dataResult, isSuccess, isLoading, isFetching, error }] = useGetItemAuditDetailsMutation(); 
    const [getLookUpSearch, { }] = useLookUpSearchMutation();
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [staticValues,setStaticValues] = useState({});
    const [objResult, setObjResult] = useState({});
    const [vendorDeductPopUp,setVendorDeductPopUp]= useState(false);
    const [totalRecords, setTotalRecords] = useState('');
    const [auditPayLoad,setAuditPayLoad] = useState({
        "requestMethod": "getAudit",
            CHILD_MODULE:"item",
            "DIVISION":1,
                "recordId": '',
                "source": '',
                "pagination": {
                    "pageNumber": 0,
                    "pageSize": 15
                },
    
  })
    const toast = useRef(null);
    let dispatch = useDispatch();
     /** @remarks Useeffect to get insert fields */
    useEffect(() =>{
        setInsertFields(props?.itemInsertFields)
    },[props?.itemInsertFields])
    /** @remarks Useeffect to get item data through props */
    useEffect(() =>{
        setDataDetails(props?.itemData)
        if(Object?.keys(props?.itemData)?.length > 0 ){
            setDisableFalg(true)
        }
    },[props?.itemData])
    /** @remarks Useeffect to get erros info through props */
    useEffect(() =>{
        setErrors(props?.formErrors)
    },[props?.formErrors])
    /** @remarks Useeffect to get data through props */
    useEffect(() =>{  
        if(Object.keys(props?.itemData)?.length === 0){
            const obj = {};
            const editFlagObj = {};
           props?.insertSummaryFields?.map((i) =>{
                if(i.create){
                    obj[i?.field] = '';
                    editFlagObj[i?.field] = i?.edit
                }
            })
            setEditFlag(editFlagObj)
            setDataDetails(obj)
        }
    },[props?.insertSummaryFields])
    /** @remarks Useeffect to get data through props */
    useEffect(() =>{
        let staticFields = {};
        props?.insertSummaryFields?.map((item)=>{
            if(item?.field === 'RECLAIM_ITEM_STATUS' || item?.field === 'RECALL_FLAG' ||  item?.field === 'SWELL_FLAG' || item?.field === 'CASE_UPC_XREF' || item?.field === 'ITEM_TYPE' || item?.field === 'DEBIT_AUTHORIZED' || item?.field === 'APPLY_TO_ALL_CUST_ITEMS' || item?.field === 'WH_DEBIT_AUTHORIZED' || item?.field === 'CREDIT_AUTHORIZED'){
                staticFields[item?.field] = item?.VALUES ? item?.VALUES : []
            }
        });
        setStaticValues(staticFields);       
    },[props?.itemInsertFields])

    /** @remarks Function to open Audit popup */
    const openAuditPopup = (type) =>{
        setVisible(true)
        fetchItemAudit(type === 'Item' ? 'ItemMasterAud' : 'BusCommentAud');
    }
      /** @remarks Function to get Audit data */
    const fetchItemAudit = async(type) =>{
        setAuditColumns([]);
        setAuditData([]);
        if(type === 'BusCommentAud'){
            dispatch(changeSubModule({subModule:'item'}));
        }
        if(type === 'ItemMasterAud'){
            dispatch(changeSubModule({subModule:'item'}));
        }
        auditPayLoad.recordId = dataDetails?.MASTER_ITEM_ID
        auditPayLoad.source = type;
        try {
            let result = await getItemAuditList(auditPayLoad).unwrap();
            if(result?.status_code === 200 || result?.res_status){
            setAuditColumns(result?.columns)
            setAuditData(result?.result_set)
            setTotalRecords(result?.total_records);
        }      
          } catch (e) {}
    }

    const pageChange = (params) =>{
        setAuditData([]);
        setAuditColumns([]);
        auditPayLoad.pagination = params;
        setAuditPayLoad(auditPayLoad);
        fetchItemAudit();
      }
    /** @remarks Function to close Audit popup */
    const closeAudit = () =>{
        setVisible(false); 
        dispatch(changeSubModule({subModule:'Item Summary'}));
    }
      /** @remarks Function to fetch Autosearch data */
    const fetchSuggestions = async (e, query, index) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          const newTimer = setTimeout(async () => {       
            var field = props?.insertSummaryFields?.filter(obj => {
                return obj?.field === e
            })
          let dynamicPayload = { ...field[0]?.url.payload };
          dynamicPayload.searchValue = query;
          const body = {
            url: field[0]?.url.url,
            method: field[0]?.url.method,
            payload: {...dynamicPayload,opType:"I"},
          };
          try {
            let result = await getLookUpSearch(body).unwrap();
            if(result?.res_status === true){
                if(result?.result_set?.length > 0){
                    let finalObj = {...objResult}
                    finalObj = {...finalObj, [e]: result?.result_set}
                    setObjResult(finalObj);
                }else{
                    let finalObj = {...objResult}
                    setDataDetails({...dataDetails,[e]:''})
                  finalObj = {...finalObj, [e]: []}
                    setObjResult(finalObj);
                      toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Not Found',
                      });
                }
            }
            else{
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Not Found',
                  });
            }          
        }                   
           catch (error) {
          }
        }, 1000);
        setDebounceTimer(newTimer);
      };
   /** @remarks Function to handle Input fields change */  
      const handleChange = (e,key) => {
        if (key === "DEBIT_AUTHORIZED" && disableFalg) {
            setVendorDeductPopUp(!vendorDeductPopUp)
        }
        if(key === 'RECALL_CLASSIFICATION') {
            setRECALL_CLASSIFICATION(false)
        }
        let info = {...dataDetails}
       info[key] = e?.target?.value;
       if(info?.RECALL_FLAG === 'N'){
        info = {...info, RECALL_CLASSIFICATION: ''}
       }
       setDataDetails(info);    
       if((Object.keys(props?.itemData)?.length === 0)){
        props?.updatedData(info);
       }
       let err = {...errors}
       if(key === 'RECLAIM_VENDOR' || key === 'DISPOSITION'){
        err[key] = false
        setErrors(err)
        }
        };
    /** @remarks useeffect to get updated Item data */
      useEffect(() =>{       
        if((Object.keys(props?.itemData)?.length === 0)){
            setDataDetails(props?.updatedItemData);  
        }
      },[props?.updatedItemData])
    /** @remarks Function to get Item details */
        useImperativeHandle(ref, () => ({
            getData: () => dataDetails, 
        }));
    /** @remarks Function for date format */
        const formatDate = (dateString) => {
            if(dateString){
            const date = new Date(dateString);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
            }
        };
         /** @remarks Function to show Skeleton */
        const handleSkeleton = () =>{
            return <Skeleton className="mb-2" height='2.3rem'></Skeleton>
        }
         /** @remarks Function to handle Vendor Duduct Yes action */
        const handleYes = ()=>{
            props?.handleYes('yes')
            setVendorDeductPopUp(!vendorDeductPopUp)
        }
        /** @remarks Function to handle Vendor Duduct No action */
         const handleNo = ()=>{
            setVendorDeductPopUp(!vendorDeductPopUp)
        }
        /** @remarks Function to close Vendor Duduct popup */
        const closeVendorDeductPopuup=()=>{
            setVendorDeductPopUp(!vendorDeductPopUp)
        }
        /** @remarks Function to open Vendor Duduct popup */
        const openVendorDuduct = ()=>{
            return (
                <div className='' style={{display:'flex',flexDirection:"column",justifyContent:'center', alignItems:'center'}}>
                    <h5>Apply to all Customer Items?</h5>
                    <div className='' style={{display:'flex', flexDirection:'row', gap:4, marginTop:"4px"}}>
                       <button className='secondary-button' onClick={handleYes}>YES</button>
          <button className='primary-button' onClick={handleNo}>NO</button>
                    </div>
                </div>
            )
        }
    return (      
        <div className='d-flex flex-column item-details'>
            <Toast ref={toast} />
            <div className=''>
                <div className=' d-flex ml-auto gap-2 float-right p-1'>
                </div>
            </div>
            <div className='row m-0 d-flex mt-3'>
                <div className='col-2'>
                    <label className='label'>Case UPC XREF</label><br/>
                    {dataDetails?.CASE_UPC_XREF === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.CASE_UPC_XREF}
                        value={dataDetails?.CASE_UPC_XREF}
                        placeholder="Select"
                        onChange={(e) => handleChange(e, 'CASE_UPC_XREF')}
                        showClear={!!dataDetails?.CASE_UPC_XREF}
                    />}
                </div>
                {
                    dataDetails?.ITEM_TYPE && <div className='col-2'>
                    <label className='label'>Item Type</label><br/>
                   
                      {dataDetails?.ITEM_TYPE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" disabled= {true}  
                    value={dataDetails?.ITEM_TYPE } />
                    
                    }
                    
                    
                </div>
                }

              

                
                <div className='col-2 col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>Nielsen Child Product Group</label>
                    {dataDetails?.NIELSEN_CHILD_GROUP === "" && props?.itemLoader ? handleSkeleton():
                    <>
                   <Input className="textboxCSS" name={"cSNielsenChild"}  
                   disabled= {disableFalg} 
                   value={dataDetails?.NIELSEN_CHILD_GROUP + (dataDetails?.NIELSEN_CHILD_GROUP_DESCR ? " - " + dataDetails?.NIELSEN_CHILD_GROUP_DESCR : '')}      
                   onChange={(e) => handleChange(e, 'NIELSEN_CHILD_GROUP')} allowClear />

                    {/* <AutoComplete className='autoCompleteWidth'
                            value={dataDetails?.NIELSEN_CHILD_GROUP + (dataDetails?.NIELSEN_CHILD_GROUP_DESCR ? " " + dataDetails?.NIELSEN_CHILD_GROUP_DESCR : '')}
                            suggestions={objResult['NIELSEN_CHILD_GROUP']}
                            completeMethod={(e) => fetchSuggestions('NIELSEN_CHILD_GROUP', e.query)}
                            onChange={(e) => handleChange(e, 'NIELSEN_CHILD_GROUP')}
                            placeholder="Start typing..."
                            disabled={disableFalg} /><i
                                className={`clear-icon2 pointer pi pi-times`}
                                onClick={() => handleChange({ target: { value: '' } }, 'NIELSEN_CHILD_GROUP')} /> */}
                                </>
                    }
                </div>
                <div className='col-sm-2'>
                    <label className='label'>C&S Nielsen Cat</label><br/>
                    {dataDetails?.CS_NIELSEN_NUM === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"cSNielsenCat"}  disabled= {disableFalg} value={dataDetails?.CS_NIELSEN_NUM&&dataDetails?.CS_NIELSEN_NUM+(dataDetails?.CS_NIELSEN_DESCR ? " : "+dataDetails?.CS_NIELSEN_DESCR :'')} onChange={(e) => handleChange(e, 'CS_NIELSEN_NUM')} allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>C&S Item Cat</label><br/>
                    {dataDetails?.CS_ITEM_CAT === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" disabled= {disableFalg} name={"cSItemCat"}  
                    value={dataDetails?.CS_ITEM_CAT +(dataDetails?.CS_ITEM_CAT_DESCRIPTION ? " : "+dataDetails?.CS_ITEM_CAT_DESCRIPTION:'')} onChange={(e) => handleChange(e, 'CS_ITEM_CAT')} allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>GL #</label><br/>
                    {dataDetails?.GL_NUM === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" disabled= {disableFalg} name={"gl"}  
                    value={dataDetails?.GL_NUM + (dataDetails?.GL_DESCRIPTION ? " : " + dataDetails?.GL_DESCRIPTION : '')} onChange={(e) => handleChange(e, 'GL_NUM')} allowClear />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Vendor Deduct</label>
                    {dataDetails?.DEBIT_AUTHORIZED === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.DEBIT_AUTHORIZED}
                        value={dataDetails?.DEBIT_AUTHORIZED}
                        placeholder="Select"
                        onChange={(e) => handleChange(e, 'DEBIT_AUTHORIZED')}
                        showClear={!!dataDetails?.DEBIT_AUTHORIZED}
                    />}
                </div>
            </div>
            <div className='row m-0 d-flex mt-3'>             
                <div className='col-sm-2'>
                    <label className='label'>UPC Credit Auth</label><br/>
                    {dataDetails?.CREDIT_AUTHORIZED === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.CREDIT_AUTHORIZED}
                        value={dataDetails?.CREDIT_AUTHORIZED}
                        placeholder="Select"
                        onChange={(e) => handleChange(e, 'CREDIT_AUTHORIZED')}
                        disabled= {disableFalg}
                         showClear={!!dataDetails?.CREDIT_AUTHORIZED}
                    />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Swell Flag</label>
                    {dataDetails?.SWELL_FLAG === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.SWELL_FLAG}
                        value={dataDetails?.SWELL_FLAG}
                        placeholder="Select"
                        onChange={(e) => handleChange(e, 'SWELL_FLAG')}
                         showClear={!!dataDetails?.SWELL_FLAG}
                    />}
                </div>
                  
                <div className='col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>Reclaim Vendor <label className='starColor'>*</label></label>
                    {dataDetails?.RECLAIM_VENDOR === "" && props?.itemLoader ? handleSkeleton():
                         <><AutoComplete
                            value={dataDetails?.RECLAIM_VENDOR}
                            suggestions={objResult['RECLAIM_VENDOR']}
                            completeMethod={(e) => fetchSuggestions('RECLAIM_VENDOR', e.query)}
                            onChange={(e) => handleChange(e, 'RECLAIM_VENDOR')}
                            placeholder="Start typing..."
                            className={errors?.RECLAIM_VENDOR ? 'p-invalid autoCompleteWidth' : 'autoCompleteWidth'}
                        />
                        <i
                            className={`clear-icon2 pointer pi pi-times`}
                            onClick={() => handleChange({ target: { value: '' } }, 'RECLAIM_VENDOR')}
                        /></>
                    }
                </div>
                <div className='col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>Disposition <label className='starColor'>*</label></label>
                    {dataDetails?.DISPOSITION === "" && props?.itemLoader ? handleSkeleton():
                    <><AutoComplete className={errors?.DISPOSITION ? 'p-invalid autoCompleteWidth' : 'autoCompleteWidth'}
                            value={dataDetails?.DISPOSITION}
                            suggestions={objResult['DISPOSITION']}
                            completeMethod={(e) => fetchSuggestions('DISPOSITION', e.query)}
                            onChange={(e) => handleChange(e, 'DISPOSITION')}
                            placeholder="Start typing..."
                             showClear={!!dataDetails?.DISPOSITION} />
                            <i
                                className={`clear-icon2 pointer pi pi-times`}
                                onClick={() => handleChange({ target: { value: '' } }, 'DISPOSITION')} />
                                
                                </>
                    }
                </div>
                <div className='col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>Debit Reason</label>
                    {dataDetails?.VNDR_DEDUCT_REASON === "" && props?.itemLoader ? handleSkeleton():
                    <><AutoComplete className='autoCompleteWidth'
                            value={dataDetails?.VNDR_DEDUCT_REASON}
                            suggestions={objResult['VNDR_DEDUCT_REASON']}
                            completeMethod={(e) => fetchSuggestions('VNDR_DEDUCT_REASON', e.query)}
                            onChange={(e) => handleChange(e, 'VNDR_DEDUCT_REASON')}
                            placeholder="Start typing..."
                             showClear={!!dataDetails?.VNDR_DEDUCT_REASON} />
                            <i
                                className={`clear-icon2 pointer pi pi-times`}
                                onClick={() => handleChange({ target: { value: '' } }, 'VNDR_DEDUCT_REASON')} /></>
                    }
                </div>
                <div className='col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>AP Vendor</label>
                    {dataDetails?.AP_VENDOR_NUM === "" && props?.itemLoader ? handleSkeleton():
                    <><AutoComplete className='autoCompleteWidth'
                            value={dataDetails?.AP_VENDOR_NUM}
                            suggestions={objResult['AP_VENDOR_NUM']}
                            completeMethod={(e) => fetchSuggestions('AP_VENDOR_NUM', e.query)}
                            onChange={(e) => handleChange(e, 'AP_VENDOR_NUM')}
                            placeholder="Start typing..."
                            disabled={disableFalg}
                            showClear={!!dataDetails?.AP_VENDOR_NUM} /><i
                                className={`clear-icon2 pointer pi pi-times`}
                                onClick={() => handleChange({ target: { value: '' } }, 'AP_VENDOR_NUM')} /></>
                    }
                </div>
            </div>
            <hr className='mt-3'/>
            <div className='row m-0 d-flex mt-2'> 
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Reclaim Item Status</label> 
                    {dataDetails?.RECLAIM_ITEM_STATUS === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.RECLAIM_ITEM_STATUS}
                        onChange={(e) => handleChange(e,'RECLAIM_ITEM_STATUS')}
                        value={dataDetails?.RECLAIM_ITEM_STATUS}
                        placeholder="Select"
                         showClear={!!dataDetails?.RECLAIM_ITEM_STATUS}
                    />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Recall Flag</label>
                    {dataDetails?.RECALL_FLAG === "" && props?.itemLoader ? handleSkeleton():
                    <Dropdown className='w-100'
                        options={staticValues?.RECALL_FLAG}
                        onChange={(e) => handleChange(e, 'RECALL_FLAG')}                     
                        value={dataDetails?.RECALL_FLAG}
                        placeholder="Select"
                         showClear={!!dataDetails?.RECALL_FLAG}
                    />}
                </div>
                <div className='col-sm-2 d-grid auto-complete-with-clear m-0'>
                    <label className='label'>Recall Classification</label>
                    {dataDetails?.RECALL_CLASSIFICATION === "" && props?.itemLoader ? handleSkeleton():
                    <><AutoComplete className='autoCompleteWidth'
                            value={dataDetails?.RECALL_CLASSIFICATION}
                            suggestions={objResult['RECALL_CLASSIFICATION']}
                            completeMethod={(e) => fetchSuggestions('RECALL_CLASSIFICATION', e.query)}
                            onChange={(e) => handleChange(e, 'RECALL_CLASSIFICATION')}
                            placeholder="Start typing..."
                            disabled={dataDetails?.RECALL_FLAG === 'Y' ? false : true}
                              />
                              {!is_RECALL_CLASSIFICATION && !!dataDetails?.RECALL_CLASSIFICATION && (
  <i
    className="clear-icon2 pointer pi pi-times"
    onClick={() => handleChange({ target: { value: '' } }, 'RECALL_CLASSIFICATION')}
  />
)}
                                </>
                    }
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Brand Name</label><br/>
                    {dataDetails?.BRAND_NAME === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.BRAND_NAME} disabled= {disableFalg} onChange={(e) => handleChange(e, 'BRAND_NAME')} allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>UPC Credit Auth</label><br/>
                    {dataDetails?.CREDIT_AUTHORIZED === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.CREDIT_AUTHORIZED} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Private Label</label><br/>
                    {dataDetails?.PRIV_LAB_FLAG === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS"  value={dataDetails?.PRIV_LAB_FLAG} disabled allowClear />}
                </div>
            </div>
            <div className='row m-0 d-flex mt-3'>
                <div className='col-sm-2'>
                    <label className='label'>Private Label Type</label><br/>
                    {dataDetails?.PRIV_LAB_TYPE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.PRIV_LAB_TYPE} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Private Label Sub Type</label><br/>
                    {dataDetails?.PRIV_LAB_SUBTYPE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.PRIV_LAB_SUBTYPE} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Haz Flag</label><br/>
                    {dataDetails?.HAZ_FLAG === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.HAZ_FLAG} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>NOS Flag</label><br/>
                    {dataDetails?.NOS_FLAG === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.NOS_FLAG} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Audit</label><br/>
                    <p><img src={audit} alt={''} className={!disableFalg ? 'disbaledImg' : 'pointer'} width={20} onClick={() => openAuditPopup('Item')} /></p>
                </div>               
            </div>
            <hr className='mt-3'/>
            <div className='row m-0 d-flex mt-2'>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Last Purchase Date</label>
                    {dataDetails?.LAST_PURCHASE_DATE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"}  value={formatDate(dataDetails?.LAST_PURCHASE_DATE)} disabled allowClear />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Last Sold Date</label>
                    {dataDetails?.LAST_SOLD_DATE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"}  value={formatDate(dataDetails?.LAST_SOLD_DATE)} disabled allowClear />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Last Scan Date</label>
                    {dataDetails?.LAST_SCAN_DATE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"} value={formatDate(dataDetails?.LAST_SCAN_DATE)} disabled allowClear />}
                </div>
                <div className='col-sm-2 d-grid'>
                    <label className='label'>Average # Scans Per Week</label>
                    {dataDetails?.AVG_NUM_SCANS_WEEK === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"} value={dataDetails?.AVG_NUM_SCANS_WEEK} disabled allowClear />}
                </div>
            </div>
            <hr className='mt-3'/>
            <div className='row m-0 d-flex mt-2'>
                <span className='title-tag'>Notes</span>
            </div>
            <div className='row m-0 d-flex mt-2'>           
                <div className='col-sm-2'>
                    <label className='label'>Reclamation Memo</label><br/>
                    {dataDetails?.MEMO === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" value={dataDetails?.MEMO} onChange={(e) => handleChange(e, 'MEMO')} allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Creation Date</label><br/>
                    {dataDetails?.CREATION_DATE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"} 
                    value={formatDate(dataDetails?.CREATION_DATE)} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Created By</label><br/>
                    {dataDetails?.CREATED_BY === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"} value={dataDetails?.CREATED_BY} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Last Update Date</label><br/>
                    {dataDetails?.LAST_UPDATE_DATE === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"} 
                    value={formatDate(dataDetails?.LAST_UPDATE_DATE)} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Last Update By</label><br/>
                    {dataDetails?.LAST_UPDATED_BY === "" && props?.itemLoader ? handleSkeleton():
                    <Input className="textboxCSS" name={"apVendor"}  value={dataDetails?.LAST_UPDATED_BY} disabled allowClear />}
                </div>
                <div className='col-sm-2'>
                    <label className='label'>Audit</label><br/>
                    <p><img src={audit} alt={''} className={!disableFalg ? 'disbaledImg' : 'pointer'} width={20} onClick={() => openAuditPopup('Note')} /></p>
                </div>
            </div>
            <Dialog header="Audit Data"  visible={visible} style={{ width: '50vw' }} onHide={closeAudit}>
                <PrimeDataTable hideButtons hideSort isLoading={isLoading} columns={auditColumns} smartSearchOff={true} data={auditData}  height={50}
                paginator={true}
                totalRecords={totalRecords}
                pageChange={pageChange}/>
            </Dialog>
            {vendorDeductPopUp &&
                <DialogBox  header={"Vendor Deduct"} content={openVendorDuduct()} style={{width:'40vw'}} onHide={closeVendorDeductPopuup}/>
            } 
        </div>  
    )
})

export default ItemDetails