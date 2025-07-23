import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import StatusComponent from '../../Shared/Status/Status';
import DialogBox from '../../Shared/Dialog-Box/DialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { audit } from '../../../assests/icons';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../../slices/columnSelection';
import { generateFilterString, getLookUpPayLoad } from '../../Shared/lookupPayload';
import { useCreateRulesVendorCostingDataMutation, useDeleteRulesVendorCostingRecordsMutation, useGetRulesVendorCostingMutation, useUpdateRulesVendorCostingRecordsMutation,
  useGetVendorConditionsListMutation,
  useSaveVendorConditionsListMutation,
  useGetVendorCostingAuditMutation
 } from '../../../services/rulesSetup';
import { plusIcon } from '../../../assests/icons';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useGridSearchDataMutation } from '../../../services/common';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
const VendorCostingComponent = forwardRef((props, ref) => {
      const { onRowDataChange } = props;
  const [getRulesVendorCosting,{dataRes,isSuccessList,isLoadingList,isFetchingList,errorist}]= useGetRulesVendorCostingMutation()
  const [deleteRulesVendorCostingRecords,{}]= useDeleteRulesVendorCostingRecordsMutation()
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
  const [insertFields, setInsertFields] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [vendorAuditPopup,setVendorAuditPopup] = useState(false)
  const [bulkRecords, setBulkRecords] = useState([]);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [clausePopup, setClausePopup] = useState(false);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [isCheckBoxChecked,setCheckboxChecked] = useState(false);
  const [filterString,setFilterString]=useState('');
  const [getLookUpData] = useGridSearchDataMutation();
  const navObj = useSelector((state) => state.navigation);
  const [delRecords,setDelRecords]= useState([]);
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState();
  const [bulkEditRecords,setBulkEditRecords] = useState([]);
  const [totalRecords,setTotalRecords] = useState('');
  const [saveExcConditions,{}]= useSaveVendorConditionsListMutation();
  const [getVendorCostingAuditDetails,{}]= useGetVendorCostingAuditMutation();
  const [getVendorConditionsList,{}] = useGetVendorConditionsListMutation();
  const [createRulesVendorCostingData,{}]=useCreateRulesVendorCostingDataMutation()
  const [updateRulesVendorCostingRecords,{}]=useUpdateRulesVendorCostingRecordsMutation()
  const isFilter = useSelector((state) => state?.columnSelection?.isFilter);
  const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
  const [filterCols,setFilterCols] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [recordId,setRecordId] = useState('');
  const [loader,setLoader] = useState(false); 
  const [btnDisable,setBtnDisable] = useState(true); 
  const [vendorAuditcolumns,setVendorAuditColumns] = useState([]);
  const [vendorAuditData,setVendorAuditData] = useState([]);
  const [sampleData,setSampleData]= useState();
  const [storeFilter, setStoreFilter] = useState(null);
  const [groupColumns,setGroupColumns] = useState({});
  const [payloadCosting, setPayloadCosting] = useState({
    "requestMethod": "getVndCstng",
    "searchParams": {
      "filterData": "",
     "sortBy": "",
    "sortorder":"",
  },
  "pagination": {
      "pageNumber": 0,
      "pageSize": 15
  }
});

    const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
    const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
      /** @remarks Useeffect to get filtered data */
  useEffect(() => {
    
    if ((isFilter?.filterState === true || isFilter?.filterState === false)) {
      
      const filterString = generateFilterString(isFilter);
        if(isFilter.filterString?.length > 0) {
                setStoreFilter(isFilter); 
          }  
      const updatedVendorPayLoad = {
        ...payloadCosting,
        searchParams: {
         
          filterData: filterString,
          ...addFilObj 
        },
         pagination:{
          pageNumber:0,
          pageSize:15
          }
      };
      setPayloadCosting(updatedVendorPayLoad);
      setRowData([])
      setColumns([])
      fetchVendorCoastingList(updatedVendorPayLoad);
    }
  }, [isFilter]);
    /** @remarks Useeffect to get vendor costing data after upload success */
  useEffect(() => {
    if(props?.browseKey === 'Success'){
      fetchVendorCoastingList(payloadCosting);
      props?.setKey('')
    }
  }, [props?.browseKey]);
    /** @remarks Function to get vendor costing data */
  const fetchVendorCoastingList = async (payload) => {
    try {
      let result = await getRulesVendorCosting(payload).unwrap();
      if(result?.status_code === 200 || result?.res_status){
      setRowData(result?.result_set)
      setInsertFields(result?.insert_fields);
      setFilterCols(result?.filter_cols);
      setColumns(result?.columns);
      if (props.onRowDataChange) {
        props.onRowDataChange(result?.result_set); 
      }
      setTotalRecords(result?.total_records);
    }
    } catch (e) {}
  };
   /** @remarks Function for pagination */
  const pageChange = (params) =>{
     setRowData([])
     setColumns([])
    payloadCosting.pagination = params;
    fetchVendorCoastingList(payloadCosting);
  }
    /** @remarks Function for Sorting */
  const onSort = (params) =>{
    setRowData([])
    setColumns([])
    payloadCosting.searchParams.sortBy = params.sortBy;
    payloadCosting.searchParams.sortorder = params.sortorder;
    setPayloadCosting(payloadCosting);
    fetchVendorCoastingList(payloadCosting);
  }
  /** @remarks Function to open Audit popup */
  const handleAuditPopUp = (data)=>{
    setVendorAuditPopup(!vendorAuditPopup)
    fetchVedorCostingAuditDetails(data?.VENDOR_COSTING_RULE_ID,'grid')
  }
/** @remarks Function to open Exclusion Audit popup */
  const handleAuditPopUpExclusion = (data)=>{
    setSampleData(data)
    setVendorAuditPopup(!vendorAuditPopup)
    fetchVedorCostingAuditDetails(data,'exclusion')
  }
  /** @remarks Function to Close Audit popup */
  const closeVendorAudit = ()=>{
    setVendorAuditPopup(!vendorAuditPopup)
  }
  const [recId,setStoreRecId] = useState('');
  const changeAudit = (params) =>{
    
    fetchVedorCostingAuditDetails(recId,'grid',params);
  }
  /** @remarks Function to get Audit data */
  const fetchVedorCostingAuditDetails = async(data, type,pagination = {})=>{
    setStoreRecId(data);
    setVendorAuditData([]);
    setVendorAuditColumns([]);
    const payload ={
    requestMethod: "getAudit",
    pagination,
    recordId: data,
    source: type === 'grid' ? "VendCstgAud" : 'CondValidAud'  
}
  try {
    let res = await getVendorCostingAuditDetails(payload).unwrap()
    setVendorAuditData(res?.result_set);
    setVendorAuditColumns(res?.columns);
    } catch (error) {}
  }
  /** @remarks Function to show Audit data in grid */
  const vendorAuditPopupTemplate = ()=>{
    return (
      <PrimeDataTable hideSort hideButtons columns={vendorAuditcolumns} paginator={true} pageChange={changeAudit} data={vendorAuditData} smartSearchOff={true} height={50}
       storeView={'storeView'}/>
    )
  }
  useImperativeHandle(ref, () => ({
    /**
  @remarks This function returns the Data array @author Karthik Manthripragada
  */
    getColumns: () => columns
  }));
  /**
      @remarks This function to open Rules Definition status page  @author Amar
      */
  const openStatusComponent = () => {
    return (<StatusComponent showStatusTabs={props?.showStatusTabs} statusType={props?.statusType} />)
  }
  /**
 @remarks
 This Useeffect to get inserted data from parent component
 @author Sai Anil
 */
  useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);    
    }
}, [bulkData]);
/** @remarks Function to Insert data */
  const createBulkRecord = async () => {
    const bulkCreatePayload = {
    "opType": "ADD",
    "actionObject": bulkData
}
    let res = await createRulesVendorCostingData(bulkCreatePayload)
    if (res?.data?.res_status) {
      dispatch(bulkCreateResponse(res?.data?.res_status))
        fetchVendorCoastingList(payloadCosting)
    }
  }
  /** @remarks Function to close Clause popup */
  const closeDialog = () => {
    setClausePopup(!clausePopup);
  }
  /**
 @remarks this method show content of clause config with API data @author Shankar Anupoju
 */
  const openClause = async (field,params) => {
    setRecordId(params?.VENDOR_COSTING_RULE_ID);
    props?.excludeFromVendorCosting()
    setClausePopup(!clausePopup);
    const body = {
      requestMethod: "getCondValdn",
      searchParams: {
    recordId: params?.VENDOR_COSTING_RULE_ID 
  }
}
    setFilterString('');
    setClauses([]);
  let res = await getVendorConditionsList(body).unwrap();
    if(res.status_code === 200 && res.res_status){
     const resultSet =  res?.result_set?.map((item,index)=>{
      let arOperand = operatorList?.find(s=>s.value === item?.ARITHEMETIC_OPERAND);
      if(arOperand){
      return {
         ...item,
         ARITHEMETIC_OPERAND:arOperand?.name,
         enable:false
       }
      }
      return {...item,enable:false}
       
     });
      setClauses(resultSet || []);
      // let fieldList = {...fieldColumnsList};
      // res?.result_set?.map((i,index)=>{
      //  fieldList =  {...fieldList,[index]:[]}
      // });
      // setFieldColumnsList(fieldList);
      setFilterString(res.result_set?.length > 0 ? res?.result_set[0]?.FINAL_MODIFIER_RULE:'');
    }
  }
  /**
    @remarks
    useEffect to get delete records
    @author Sai Anil
    */  
    useEffect(() => {
      if (bulkDelData?.length > 0) {
        const ids = bulkDelData?.map((e)=>{
          return e?.VENDOR_COSTING_RULE_ID
        })
        setDelMessage('Are you sure you want to delete the selected records?');
        setDelRecords(ids)
        setShowDeletePopup(!showDeletePopup)
      }
  }, [bulkDelData?.length > 0]);
  const hideDeletePopup =() =>{
  setShowDeletePopup(false);
  dispatch(clearDeleteRecordsData([]));
}
  /**
    @remarks
    Function to delete vendorCosting records
    @author Sai Anil
    */  
    const handleDeleteRecords = async ()=>{
      const body = {
            "opType": "DEL",
            "actionObject": [{
             VENDOR_COSTING_RULE_ID : delRecords
            }]
        }
      try {
          let res = await deleteRulesVendorCostingRecords(body);
          if(res?.data?.status_code === 200 || res?.data?.res_status){
            const delDetails = rowData?.filter(record => !delRecords?.some(e=> e === record?.VENDOR_COSTING_RULE_ID))
            setRowData(delDetails);
            dispatch(clearDeleteRecordsData([]));
            dispatch(bulkCreateResponse(res?.data?.res_status))
          }   
      } catch (e) {}
  }
  /** @remarks Useeffect to get edited data */
  useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
  /** @remarks Function to update the data */
  const editBulkRecord = async()=>{
   const bulkEditPayload = {
    "opType": "UPD",
    "actionObject": bulkEditRecords
}
let res = await updateRulesVendorCostingRecords(bulkEditPayload)
if(res?.data?.status_code === 200 && res?.data?.res_status){
  dispatch(bulkEditResponse(res?.data?.res_status))
  fetchVendorCoastingList(payloadCosting)
}
else{
  dispatch(bulkEditResponse(true))
}
}
  /** @remarks FUnction to remove clauses */
  const removeClause = (index,type) => {
    let newClauses = [];
    setBtnDisable(false)
    if(type === 'single'){
      newClauses = clauses.filter((_, i) => i !== index);
    }else {
      newClauses = clauses.filter((item, i) => item?.selected === false);
      setIsHeaderChecked(false);
      setCheckboxChecked(false);
    }
    updateClauses(newClauses);
  };
    /*** clause operations start */
    const [clauses, setClauses] = useState([
      { OPERAND: '', CONDITION: '', ARITHEMETIC_OPERAND: '', VALUE: '', GROUPING: '' ,selected:false}
    ]);
      /** @remarks Function to generate Filter string for clauses */
const generateFilterStringClause = (conditions) => {
  const filterString = [];
  const groupedConditions = new Map();

  // Step 1: Group valid conditions by GROUPING
  for (const condition of conditions) {
    const { CONDITION, ARITHEMETIC_OPERAND, VALUE, GROUPING } = condition;

    if (
      !CONDITION?.trim() ||
      !ARITHEMETIC_OPERAND?.trim() ||
      VALUE === null || VALUE === undefined || VALUE === ''
    ) {
      continue; // skip invalid conditions
    }

    if (!groupedConditions.has(GROUPING)) {
      groupedConditions.set(GROUPING, []);
    }

    groupedConditions.get(GROUPING).push(condition);
  }

  // Step 2: Sort group keys
  const sortedGroupKeys = Array.from(groupedConditions.keys()).sort();

  const groupStrings = [];
  const groupOperands = [];

  // Step 3: Process each group
  for (let i = 0; i < sortedGroupKeys.length; i++) {
    const key = sortedGroupKeys[i];
    const group = groupedConditions.get(key);

    const conditionParts = [];

    group.forEach((cond, idx) => {
      const value =
        cond.ARITHEMETIC_OPERAND.toLowerCase() === "like"
          ? `'%${cond.VALUE}%'`
          : `${cond.VALUE}`;
      const arOperand = operatorList?.find(s=>s.name === cond.ARITHEMETIC_OPERAND);
      
      const part = `${cond.CONDITION} ${arOperand?.value} ${value}`;
      if (idx > 0) {
        conditionParts.push(cond.OPERAND?.toUpperCase() || "AND");
      }
      conditionParts.push(part);
    });

    groupStrings.push(`(${conditionParts.join(" ")})`);

    // Get the operand from the FIRST condition in this group (to connect from previous group)
    if (i > 0) {
      const firstCondition = group[0];
      groupOperands.push(firstCondition.OPERAND?.toUpperCase() || "AND");
    }
  }

  // Step 4: Join groups using correct inter-group operands
  let finalClause = groupStrings[0] || "";
  for (let i = 1; i < groupStrings.length; i++) {
    finalClause += ` ${groupOperands[i - 1]} ${groupStrings[i]}`;
  }

  return finalClause;
};



      
       /** @remarks Function to update clauses */
  const updateClauses = (clauses) =>{
    setClauses(clauses);
    const filterString = generateFilterStringClause(clauses);
    setFilterString(filterString);
  }
  /** @remarks Function to handel checkboxes in exclude validation */
  const handleCheckboxChange = (index) => {
    const newClauses = [...clauses];
    newClauses[index] = {
      ...newClauses[index],
      selected: !newClauses[index].selected
    };
    updateClauses(newClauses);
    const checkState = checkAnyOneChecked(newClauses);
    const checkAllChecked = newClauses.every((item) => item?.selected === true);
    setIsHeaderChecked(checkAllChecked)
    setCheckboxChecked(checkState);
  };  
   /** @remarks Function to check any checkboxe is clicked in exclude validation  */
  const checkAnyOneChecked = (newClauses) =>{
    const newState = newClauses.some((item) => item?.selected === true);
    return newState;
  }
  const operandOptions = [
    {name:'NULL',value:'NULL'},
    { name: 'AND', value: 'AND' },
    { name: 'OR', value: 'OR' }
  ];
  const [fieldColumnsList,setFieldColumnsList] = useState({});
  const operatorList = [
    { name: 'Greater Than', value: '>' },
    { name: 'Equal To', value: '=' },
    { name: 'Less Than', value: '<' },
  ];
  const groupingList = [
    {name:'NULL',value:'null'},
    { name: '0', value: '0' },
    { name: '1', value: '1' }
  ]
  /** @remarks Function to handle input changes in exclude validation */
  const handleChange = (index, field, value) => {
    setBtnDisable(false)
    let fieldVAlue = value?.name || value;
    const newClauses = Array.isArray(clauses) ? [...clauses] : [];
    if (index >= 0 && index < newClauses.length && field) {
      const updatedClause = { ...newClauses[index] };
      updatedClause[field] = fieldVAlue;
      newClauses[index] = updatedClause;
      console.log(newClauses);
      updateClauses(newClauses);
    }
  };
const [staticClauses,setStaticClauses]= useState([])
  const addClause = () => {
    setClauses([
      ...clauses,
      { OPERAND: '', CONDITION: '', ARITHEMETIC_OPERAND: '', VALUE: '', GROUPING: '' ,selected:false,enable:true}
    ]);
    setStaticClauses([...staticClauses,{OPERAND: '', CONDITION: '', ARITHEMETIC_OPERAND: '', VALUE: '', GROUPING: '' ,selected:false,enable:true}])
  };
 const setClauseJson = async () => {
  setLoader(true);
  setBtnDisable(true);

  const invalidClause = clauses.find((item, index) => {
    const condition = item.CONDITION;
    if (condition && fieldColumnsList[index]) {
      if (fieldColumnsList[index]?.length === 0) {
        toast.current.show({
          severity: 'error',
          summary: 'Invalid Condition',
          detail: `Condition "${condition}" not found in field list`,
          life: 3000,
        });
        return true;
      }else if (fieldColumnsList[index]?.length > 0) {
        const conditionExists = fieldColumnsList[index].some((field) => field.name === condition);
        if (!conditionExists) {
          toast.current.show({
            severity: 'error',
            summary: 'Invalid Condition',
            detail: `Condition "${condition}" not found in field list`,
            life: 3000,
          });
          return true;
        }
      }
    }
    return false;
  });

  if (invalidClause) {
    setLoader(false);         
    setBtnDisable(false);     
    return;                   
  }
  
  let selectedData = clauses.map(({ selected,enable, VENDOR_COSTING_RULE_ID, ...rest }) => rest);
  
  // selectedData = selectedData?.map((item)=>{
  //   let findArithObj = operatorList?.find(s=>s.name === item.ARITHEMETIC_OPERAND);
  //   return {...item,ARITHEMETIC_OPERAND:findArithObj.name};
  // });
  console.log(selectedData);
  
  const payLoad = {
    DATA: selectedData,
    FINAL_MODIFIER_RULE: filterString,
    VENDOR_COSTING_RULE_ID: recordId,
  };

  try {
    let res = await saveExcConditions(payLoad).unwrap();

    if (res.res_status || res.status_code === 200) {
      toast.current.show({
        severity: 'info',
        summary: 'Success',
        detail: res?.msg,
        life: 3000,
      });
    }

    setLoader(false);
    setBtnDisable(true);

  } catch (e) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong while saving.',
      life: 3000,
    });
    setLoader(false);
    setBtnDisable(false);
  }
};

    /** @remarks Function to handle header checkboxes in exclude validation popup */
  const handleHeaderCheckboxChange = () => {
    const newHeaderCheckedState = !isHeaderChecked;
    setIsHeaderChecked(newHeaderCheckedState);
    const updatedClauses = clauses.map(clause => ({
      ...clause,
      selected: newHeaderCheckedState
    }));
    updateClauses(updatedClauses);
    const checkState = checkAnyOneChecked(updatedClauses);
    setCheckboxChecked(checkState);  
  };
     /* Function to Reset fields */
     const resetPage = async() =>{
      // setClauses([]);
     setClauses(prevClauses =>
    prevClauses.filter(
      clause =>
        !staticClauses.some(staticClause =>
          hasMatchingValues(staticClause, clause)
        )
    )
  );
  const body = {
      requestMethod: "getCondValdn",
      searchParams: {
    recordId: recordId
  }
}
    setFilterString('');
    setClauses([]);
  let res = await getVendorConditionsList(body).unwrap();
    if(res.status_code === 200 && res.res_status){
      
      setClauses(res.result_set || []);
      setFilterString(res.result_set?.length > 0 ? res?.result_set[0]?.FINAL_MODIFIER_RULE:'');
    }      setFilterString('');
      setBtnDisable(false)
    }
    const hasMatchingValues = (obj1, obj2) => {
  return Object.keys(obj1).some(key => {
    const value1 = obj1[key]?.toString().trim();
    const value2 = obj2[key]?.toString().trim();
    return value1 && value2 && value1 === value2;
  });
};
     const [storeViewData,setStoreViewData] = useState({});
      const storeSelectedView = (params) =>{
        
        setStoreViewData(params);
      }
   /**
         @remarks Function to get dynamically lookup values @author Shankar Anupoju
         */
         const fetchSuggestions = async (field, data, index) => {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }     
          const newTimer = setTimeout(async () => {          
            let emptyArray = []   
            const obj = {navObj,field, data, emptyArray};
            let lookupPayLoad = getLookUpPayLoad(obj);
            lookupPayLoad = {...lookupPayLoad,opType: "F"}           
            try {
              let result = await getLookUpData(lookupPayLoad).unwrap();
              if(result.res_status && result.status_code === 200){
                let columns = result?.result_set?.map(item => ({ name: item?.KEY }));
                let fieldColumns = {...fieldColumnsList};
                fieldColumns[index] = columns;
                setFieldColumnsList(fieldColumns);
              }
            } catch (error) {}
          }, 1000);
          setDebounceTimer(newTimer);
        };
        /**
    /*** this.ediClause use for content of clause html start */
  const backToMainGrid =() =>{
    setClausePopup(!clausePopup);
    let data = {FILTER_STRING:storeFilter?.filterString}
    setGroupColumns(data);
    props?.excludeFromVendorCosting()
  }
    const editClause = () => {
      return (
        <div>
           <div className='row'>
        <div className='col-10'>
          <span className='page-title'>Conditional Validation</span>
        </div>
        <div className='col-2'>
        <Button onClick={backToMainGrid} className='mb-1 primary-button floatEnd'>Back to Vendor Costing</Button>
        </div>
        </div>
          <div className='row m-0' style={{ overflow: 'scroll' }}>
        <div className='d-flex justify-content-end pb-2'>
          <img src={plusIcon} alt="add" className='pointer' title='Add Clause' width={22} height={22} onClick={addClause} /> {(
          isCheckBoxChecked && 
          <div className='d-flex justify-content-end pb-2' >
          {/* <button onClick={() => removeClause('','all')}>Remove</button> */}
          <i className='pi pi-trash f-20' onClick={() => removeClause('','all')} style={{color: 'red', marginLeft: '6px'}}></i>
          </div>
        )}
        </div>                       
        <table className='custom-clause-table'>
          <tr>
            
            <th>
          {/* <Checkbox
            checked={isHeaderChecked}
            onChange={handleHeaderCheckboxChange}
          /> */}
          </th>
            <th>Operand</th>
            <th>Field</th>
            <th>Arithmetic Operator</th>
            <th>Value</th>
            <th>Grouping</th>
            <th>Audit</th>
            <th></th>
          </tr>
          {clauses.map((clause, index) => (
            <tr key={index}>
          
             <td>
            <Checkbox
            disabled={!clause?.enable}
            checked={clause.selected}
            onChange={() => handleCheckboxChange(index)}
          /></td>
             
             
          <td><Dropdown
            value={clause.OPERAND}
            onChange={(e) => handleChange(index, 'OPERAND', e.target.value)}
            options={operandOptions}
            disabled={index === 0}
            optionLabel='name'
           
            placeholder='Select'
            className='w-100'
            dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
          >
          </Dropdown></td>
          <td>                            
          <AutoComplete
                value={clause.CONDITION}
                suggestions={fieldColumnsList[index]}
                completeMethod={(e) => fetchSuggestions('CONDITION_NAME', e.query, index)}
                onChange={(e) => handleChange(index, 'CONDITION', e.value)}
                field="name"
                placeholder="Start typing..."
                className='form-auto-complete'
               optionLabel='name'
               optionValue='key'
            />
          </td>
          <td><Dropdown
            value={clause.ARITHEMETIC_OPERAND}
            onChange={(e) => handleChange(index, 'ARITHEMETIC_OPERAND', e.target.value)}
            options={operatorList}
            optionValue='name'
            optionLabel='name'
            placeholder='Select'
            className='w-100'
            dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
          >
          </Dropdown></td>
          <td>
            <InputText type="number" className="p-inputtext-sm numeric-input"
            value={clause.VALUE} onChange={(e) => handleChange(index, 'VALUE', e.target.value)}
            onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault();
                }
            }}
            />
            </td>
          <td><Dropdown
            options={groupingList}
            optionLabel='name'
            optionValue='value'
            placeholder='Select'
            className="w-100"
            value={clause.GROUPING}
            onChange={(e) => handleChange(index, 'GROUPING', e.target.value)}
            dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
          ></Dropdown></td>
           <td>
          
             <img src={audit} alt='Audit' className='pointer' width={20} onClick={() => handleAuditPopUpExclusion(clause?.CONDITIONAL_VALIDATION_ID)}/>
           
          </td>
         
          <td>
             {(index > 0 && !isCheckBoxChecked && clause?.enable === true) &&  (
            <i className='pi pi-trash f-16' onClick={() => removeClause(index,'single')} style={{color: 'red'}}></i>
             )}  
          </td>
         
            </tr>
          ))}
        </table>
          </div>
          <div className='row ps-3 pe-3 pt-3'>
        <label className='label p-0'>Final Rule</label>
        <InputTextarea rows={2} cols={30} value={filterString}/>
          </div>
          <div className='d-flex justify-content-center gap-2 mt-3'>
        <button className="secondary-button" onClick={backToMainGrid}>Cancel</button>
        <button className="border-button" onClick={resetPage}>Reset</button>
        <button className="primary-button" onClick={setClauseJson} disabled = {btnDisable}>Save {loader ? <span class="spinner-border spinner-border-sm loaderCss" role="status" ></span> : ''}</button>
      </div>
        </div>
      )
    }
  return (
    <div>
    <Toast ref={toast} />
    {!clausePopup ? 
      <PrimeDataTable  groupColumns={groupColumns}  storeSelectedView={storeSelectedView}
        storeViewData={storeViewData} isLoading={isLoadingList} columns={columns} filterCols={filterCols} data={rowData} paginator={true}  height={33}  insertFields={insertFields} createBulkRecord={createBulkRecord} handleAuditPopUp={handleAuditPopUp}
      selectionMode="multiple" openClause ={openClause} editBulkRecord={editBulkRecord}  totalRecords={totalRecords}
      pageSort={onSort} pageChange={pageChange} />
      : editClause()}
      {props?.statusPopup &&
        <DialogBox  header={props?.statusHeader} content={openStatusComponent()} style={{ width: '70vw' }} onHide={props?.onClose} />
      }
      {vendorAuditPopup &&
      <DialogBox header="Audit Data" content={vendorAuditPopupTemplate()} style={{ width: '70vw' }} onHide={closeVendorAudit} />
      }
      <ConfirmDialog  visible={showDeletePopup} onHide={hideDeletePopup} message={delMessage}
           header="Delete Customer" icon="pi pi-info-circle" accept={handleDeleteRecords} acceptClassName= 'p-button-danger rounded' rejectClassName='btnReject' />
    </div>
  )
})
export default VendorCostingComponent