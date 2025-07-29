import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { filterConditions } from './filterConditions';
import './DataTableComponent.scss';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { setting, audit, minus, explode, activeExploded, linkIcon, warning, hambergMenu, agreementIcon, deleteRoundIcon, saveGridIcon, exclusionIcon, removeIcon, editIcon, settingGray,settingGreen, arrowBlue, arrowGray } from '../../../assests/icons';
import { Checkbox } from 'primereact/checkbox';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { PrimeIcons } from 'primereact/api';
import SmartSearch from './smartSearch';
import EditRecord from './editRecord';
import roles from '../../../roles';
import {ColumnGrouping} from '../picklist';
import {BulkCreate, Crudlabels} from './BulkCrud/index'
import  GridBodyRenderer  from './GridBodyCellRender';
import { SavedColOrders } from '../savedColumnOrders';
import DialogBox from '../Dialog-Box/DialogBox';
import {  useDispatch, useSelector } from 'react-redux';
import { FormControl,InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Toast } from 'primereact/toast';
import { bulkDelete, changeIsFilter,bulkEdit, clearBulkEditRecords, clearBulkCreateRecords, bulkCreateResponse, bulkEditResponse,getEditGridView } from '../../../slices/columnSelection';
import { useGridSearchDataMutation, useGridViewEditMutation, useGridViewInsertMutation, useGridViewRetrieveMutation, useLookUpSearchMutation } from '../../../services/common';
import { getLookUpPayLoad } from '../lookupPayload';
import DatatableLoader from './datatableLoader';
import { AutoComplete } from 'primereact/autocomplete';
import { resetAddFilObj } from '../../../slices/filters';
import { InputSwitch } from 'primereact/inputswitch';
import { useUtils } from './utils';


const PrimeDataTable = forwardRef((props, ref) => {
const { fetchSuggestions } = useUtils();
  const updatedRoleOptions = props?.roleOptions?.map(role => ({
    ...role,
    key: role.name
  })) || [];
  const [products, setProducts] = useState([]);
  const [saveBulkUpload, setSaveBulkUpload] = useState(false);
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const [filterRules, setFilterRules] = useState([
    { field: "", type: "", userInputValue: '',list:[],logicalCondition: "",filterValues:[] },
  ]);
  const [isDateenabled, setIsDateEnabled] = useState(false);
  const [dateCalendar,setDateCalendar]= useState(false)
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [childAccordion, setChildAccordion] = useState(false);
 const [logicalConditions] = useState([{ headerName: "AND", field: "AND" }, { headerName: "OR", field: "OR" }]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
  const menu = useRef(null);
  const [showColumnsList, setShowColumnsList] = useState(false);
  const [formData, setFormData] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [editTableData, setEditTableData] = useState([])
  const dt = useRef();
  const [productColumns, setProductColumns] = useState([]);
  const [secondaryColumns, setSecondaryColumns] = useState([]);
const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});    const [chips, setChips] = useState([]); 
    const [showAddFilter, setShowAddFilter] = useState(true);
    const [selectedRowIndex,setSelectedRowIndex] = useState();
    const [multiRecord,setMultiRecord] = useState([])
    const [saveButton,setSaveButton] = useState(true)
    const [updateByColumn,setUpdateByColumn] = useState(false);
    const isFilter = useSelector((state)=>state?.columnSelection?.isFilter)
    const navObj = useSelector((state) => state.navigation);
    const division = useSelector((state) => state.division);
    const [clearViewRecord,setClearViewRecord] = useState(false);
    const [isContainsEnabled,setIsContainsEnabled] = useState(false)
    const [isBetweenEnabled,setIsBetweenEnabled] = useState(false)
    const [copyRecord,setCopyRecord] = useState(false)
    const [localProducts, setLocalProducts] = useState([]);
    const [copiedRecords,setCopiedRecords] = useState([])
    const [gridOptions,setGridOptions] = useState([
      { label: "Create", key: "create" ,command:(e)=>handleItemClick("Create")},
      { label: "Edit", key: "edit",command:(e)=>handleItemClick("Edit") },
      { label: "Delete", key: "delete" ,command:(e)=>handleItemClick("Delete")},
      { label: "Update By Column", key: "bulkUpdateByColumn" ,command:(e)=>handleItemClick("BulkUpdateByColumn")},
      { label: "Copy & Add Entry", key: "copyAndCreate",command:(e)=>handleItemClick("CopyAndCreate") }
    ]);
    const [filteredGridOptions,setFilteredGridOptions] = useState([]);
  const [gridSearchData] = useGridSearchDataMutation();
  const bulkCreateResponseData = useSelector((state)=>state?.columnSelection?.bulkCreateResponse)
  const bulkEditResponseData = useSelector((state)=>state?.columnSelection?.bulkEditResponse)
    const optionListStatus =[  { name: 'Active', code: 'Active' }, { name: 'Inactive', code: 'Inactive' },]
    const [retOrderGrp,setRetOrderGrp] = useState('')
    const [first,setFirst] = useState(0)
  const dispatch = useDispatch();
  const [sortField, setSortField] = useState(null); 
    const [sortOrder, setSortOrder] = useState(1); 
    const [rowCount,setRowCount] = useState(15)
    const [divisionResetFlag,setDivisionResetFlag] = useState([]);
    const addFilObj = useSelector((state) => state.additionalFilters.addFilObj);
    const [insertGridView, { dataResult, isSuccess, isLoading, isFetching, error }] = useGridViewInsertMutation() 
    const [gridViewEdit, { dataResult1, isSuccess1, isLoading1, isFetching1, error1 }] = useGridViewEditMutation()
    let [getSavedGridViews, { data: dataResult2, isSuccess2, isLoading2, isFetching2, error2 }] = useGridViewRetrieveMutation();
    const [savedViews,setSavedViews] = useState([]);
    const [chipName,setChipName] = useState(null);
    const [permissionObj,setPermissionObj] = useState({});
    const [insertFields,setInsertFields] = useState([]);
    const [gridColumns,setGridColumns] = useState([]);
    
   /**
  @remarks
  This useEffect is to get permissions for a division
  @author Shankar Anupoju
  */
  useEffect(()=>{
    if(divisionResetFlag !== division) {
       
      setActiveLabel("Edit");
      setOpenForm("")
    }
    if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division?.SCREENDATA?.length > 0){  
      
      setDivisionResetFlag(division);
      const permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE);
      
      if(permissions){
        setPermissionObj(permissions);
        const filteredGridOptions = gridOptions.filter(option => permissions[option.key]);
        setFilteredGridOptions(filteredGridOptions)
      } 
      if (!props?.groupColumns || Object.keys(props.groupColumns).length === 0) {
        setChips([]);
      }
     
    }
      if (division,navObj.PARENT_MODULE,navObj.CHILD_MODULE) {
    setShowAddFilter(true)
     setFilterRules([{}])
    }
   
  },[navObj.PARENT_MODULE,navObj.CHILD_MODULE,division]);
   useEffect(()=>{
    
     if(division?.SCREENDATA?.length === 0){
      dispatch(changeIsFilter({ filterState: false }));
    }

   },[division]);
   useEffect(()=>{
      setInsertFields(props?.insertFields)
   },[props?.insertFields])
  useEffect(()=>{
     
 if(filteredGridOptions?.length > 0){
  filteredGridOptions.map((item)=>{
    if(item.key === 'edit'){
        
      setActiveLabel('Edit')
    }
  })
 }
  },[filteredGridOptions,isFilter?.filterState ,props?.data,props?.columns,navObj.PARENT_MODULE,navObj.CHILD_MODULE,division,localProducts])

useEffect(() => {
  dispatch(resetAddFilObj());
  
  if (
    (!props?.globalViews) &&
    (navObj.PARENT_MODULE && navObj.CHILD_MODULE && division && !props?.storeView && !props?.fromVendorMaster)
  ) {
    fetchSavedGridViews();
  }
}, [navObj.CHILD_MODULE]);

  useEffect(()=>{
    if (division) {
   setShowSmartSearch(false)
     setFilterRules([{}])
    }
  },[division])
  
  const onPage = (event) => {
    const obj = {pageNumber:event.page,pageSize:event.rows};
    setRowCount(event.rows)
    setFirst(event?.first);
    {navObj?.CHILD_MODULE !== 'Exploded Rules' && props?.pageChange(obj) }
    // {navObj?.CHILD_MODULE === 'Exploded Rules' && props?.pageChange()}
};
 
const pageChangeExplod = (direction)=>{

      setFirst(direction?.first);

      setRowCount(direction.rows)

  props?.pageChange(direction)
}
  const onInputChange = (e, field) => {
    const value = e.target.value;
    setEditRowData({ ...editRowData, [field]: value });
  };

  const inputRefs = useRef({}); 
  // const renderEditableField = (field, rowData, index) => {
  //   return editingRowIndex === index ? (
  //     <InputText value={editRowData[field]} onChange={(e) => onInputChange(e, field)}   ref={el => (inputRefs.current[field] = el)}/>
  //   ) : (
  //     rowData[field]
  //   );
  // };
  const setEditing = (index, field) => {
    
  setEditingRowIndex(index);

};
const updateRowData = (rowIdx, fieldValue, fieldName) => {
  
  setProducts(prev => {
    const oldRow = prev[rowIdx];
    if (oldRow[fieldName] === fieldValue) return prev;

    const updatedRow = { ...oldRow, [fieldName]: fieldValue };
    const newRows = [...prev];
    newRows[rowIdx] = updatedRow;
    return newRows;
  });
};

  const fetchLookUp = (field, query, index, rowData) =>{
    fetchSuggestions(field, query,null, insertFields,setInsertFields);
  }
  const renderEditableField = (field, rowData, index) => {
  
    const value = rowData[field.field || ''];
  // handleRowClickFun({data: rowData}, insertFields, setInsertFields);
    let rowDataValue = {...field, value: value};


    const handleBlur = () => {
      setEditingRowIndex(null);

    };
    return (
      <div>
        <EditRecord field={rowDataValue} insertFields={insertFields} setInsertFields={setInsertFields}  fetchSuggestions={fetchLookUp} index={index} updateRowData={updateRowData}/>
      </div>
    )
  };
  useEffect(() => {
    if(productColumns?.length > 0) {
  // Merge productColumns with insertFields: if a column in productColumns matches a field in insertFields, update it with insertField's data; otherwise, keep the productColumn as is.
  let gridData = productColumns.map((col) => {
    const match = insertFields?.find((item) => item?.field === col?.field);
    return match ? { ...col, ...match } : col;
  });
      console.log(gridData);
      console.log(productColumns)
      setGridColumns(gridData);
    }
  },[productColumns])

  const addFilterObject = () => {
    
    setMsg('Loading....')
    
   console.log(chipName)
    const lastFilter = filterRules[filterRules.length - 1];
  
    if ((lastFilter && isFilterComplete(lastFilter)) || Object.keys(addFilObj)?.length > 0) {
      
       setDateCalendar(false)
      // handleInputClick()
      setIsContainsEnabled(true)
      setProducts([]);
      setLocalProducts([]);
      setProductColumns([]);
      if (chipName !== null && chipName !== undefined) {
        // Update the chip at chipIndex with lastFilter
        const updatedChips = [...chips];
        const chipIndex = chips.findIndex(chip => chip.field === chipName);
        updatedChips[chipIndex] = { ...lastFilter, logicalCondition: lastFilter.logicalCondition || "AND" };
        dispatch(changeIsFilter({
          filterState: isFilter?.filterState,
          queryString: updatedChips,
          jsonData: isFilter?.jsonData
        }));
         setChipName(null);
      } else {
        dispatch(changeIsFilter({
          filterState: isFilter?.filterState,
          queryString: lastFilter && isFilterComplete(lastFilter) ? [...chips, lastFilter] : chips,
          jsonData: isFilter?.jsonData
        }));
      }
     
      if (lastFilter && isFilterComplete(lastFilter)) {
        
        const chipIndex = chips.findIndex(chip => chip.field === chipName);
        setChips(prevChips => {
          if (chipIndex !== null && chipIndex !== undefined && chipIndex !== -1) {
            // Update the chip at chipIndex with lastFilter
            const updatedChips = [...prevChips];
            updatedChips[chipIndex] = { ...lastFilter, logicalCondition: lastFilter.logicalCondition || "AND" };
            return updatedChips;
          } else {
            // Add new chip
            return [...prevChips, { ...lastFilter, logicalCondition: lastFilter.logicalCondition || "AND" }];
          }
        });
        setFilterRules([
          { field: "", type: "", userInputValue: '', list: [], logicalCondition: "", filterValues: [] },
        ]);
                // setDateCalendar(!dateCalendar)
      }
    }else{
       toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: 'Please select the query fields',
  }); 
    }
  };

const isFilterComplete = (filter) => {
  if (filter?.type === "=") {
      return filter.field && filter.type && filter.filterValues.length !==0;
  }else{
  return filter.field && filter.type && filter.userInputValue;

  }
};

const removeChip = (index) => {
  if(navObj?.CHILD_MODULE === 'Item Summary' && chips.length === 1) {
setMsg('Query to get the results')
  }else {
setMsg('Loading...')
 
// dispatch(changeIsFilter({ filterState: isFilter?.filterState , jsonData: isFilter?.filterString}));

  }
  const chipIndex = chips.findIndex(chip => chip.field === chipName);
  if(index === chipIndex){
    setFilterRules([{ field: "", type: "", userInputValue: '', list: [], logicalCondition: "", filterValues: [] }]);
  }
   
 
  setProducts([]);
  setLocalProducts([]);
  setProductColumns([]);
    const updatedChips = chips.filter((_, i) => i !== index);
    setChips(updatedChips);
    
    if (updatedChips.length === 0) {
        setShowAddFilter(!showAddFilter);
         setShowSmartSearch(!showSmartSearch);
        dispatch(changeIsFilter({ filterState: isFilter?.filterState , jsonData: isFilter?.jsonData}));
    } else {
        dispatch(changeIsFilter({ filterState: isFilter?.filterState, queryString: updatedChips, jsonData: isFilter?.jsonData }));
    }
    setRowCount(15)
};
  
  const handleInputClick = () => {
    setDateCalendar(false)
  setShowSmartSearch((prev) => !prev);
  setShowAddFilter((prev) => !prev);
  setIsContainsEnabled((prev) => !prev);
  setFilterRules([{ field: "", type: "", userInputValue: "", list: [], logicalCondition: "", filterValues: [] }]);
};

  const handleFieldChange = (value, index,type) => {
    if (value ) {
      if (type ==="DATE") {        
        setDateCalendar(true)
        setIsContainsEnabled(false)
            const newFilterRules = [...filterRules];
          newFilterRules[index].type = "=";
            setFilterRules(newFilterRules);
          setFilterRules(newFilterRules)
        //  setIsDateEnabled(true);
      } else {
          const newFilterRules = [...filterRules];
          newFilterRules[index].type = "";
            setFilterRules(newFilterRules);
        // setIsDateEnabled(false);
                 setDateCalendar(false)

      }
    }
    const newFilterRules = [...filterRules];
    if (newFilterRules[index] !== undefined) {
      newFilterRules[index] = { ...newFilterRules[index], field:value };
   //   newFilterRules[index].field = value;
    }
    setFilterRules(newFilterRules);
    const values = props?.data.map((item) => item[value]).filter((value) => value !== undefined);
    const containsStrings = values.some(num => typeof num === 'string');
    if (!containsStrings) {
      const strings = values.map(String);
      setSuggestions(strings)
    } else {
      setSuggestions(values)
    }
  };

  const handleDateSearch = (e,val)=>{
    const date = new Date(e);
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
const day = date.getDate().toString().padStart(2, '0'); 
const hours = date.getHours().toString().padStart(2, '0'); 
const minutes = date.getMinutes().toString().padStart(2, '0'); 
const seconds = date.getSeconds().toString().padStart(2, '0'); 

// Formatted output
const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
const newFilterRules = [...filterRules];

newFilterRules[val].filterValues = formattedDate.split(",");;
newFilterRules[val].userInputValue = formattedDate;

  setFilterRules(newFilterRules);
    }

  const handleTypeChange = (value, index) => {
    const newFilterRules = [...filterRules];
    // newFilterRules[index].type = value;
    if (value) {
    const containsConditions = ["in", ">", ">=", "<", "<="];
    setIsContainsEnabled(containsConditions.some(condition => value.includes(condition)));
    setIsBetweenEnabled(false)
    setDateCalendar(false)

  }
  if (value === "between") {
    setIsBetweenEnabled(true)
  }else{
    setIsBetweenEnabled(false)
  }
    if (newFilterRules[index] !== undefined) {
      newFilterRules[index] = { ...newFilterRules[index], type:value };
    //  newFilterRules = [...newFilterRules[index],type: value];
      
      //newFilterRules[index].type = value;
    }
    setFilterRules(newFilterRules);
  };

      const [debounceTimer, setDebounceTimer] = useState(null); // Store debounce timer

  const handleUserInputValueChange = (value, index,freezeColumns = null) => {
  const newFilterRules = [...filterRules];
    if (newFilterRules[index]) {
       newFilterRules[index] = { 
      ...newFilterRules[index], 
      userInputValue: value?.filter, 
      list: freezeColumns ? newFilterRules[index]?.totalList :[] 
    };
    //  newFilterRules[index].userInputValue = value?.filter;
      //newFilterRules[index].list = []; 
    }
    
    setFilterRules(newFilterRules);

    if (debounceTimer) {
            clearTimeout(debounceTimer);
      }
    const newTimer = setTimeout(() => {
        getQueryData(newFilterRules[index]?.field, value?.filter, index, newFilterRules[index]?.header);
    }, 1000); 

    setDebounceTimer(newTimer);
  };

  const handleChipClick = (value,index,colObj=null) =>{

    console.log("handleChipClick", value, index);
    if(colObj && colObj.type === 'DATE') {
       setDateCalendar(true)
      setIsContainsEnabled(false)
    }
     let selectedValue = value;
     
    // Remove duplicates based on 'name'
    let uniqueList = [];
    const seenNames = new Set();
    (selectedValue?.totalList || []).forEach(item => {
      if (item && !seenNames.has(item.key)) {
      uniqueList.push(item);
      seenNames.add(item.key);
      }
    });
    // Reorder uniqueList: matched values first, then the rest
    const matched = [];
    const unmatched = [];
    uniqueList.forEach(i => {
      if (Array.isArray(value.filterValues) && value.filterValues.includes(i.key)) {
      matched.push(i);
      } else {
      unmatched.push(i);
      }
    });
    uniqueList = [...matched, ...unmatched];
    selectedValue = { ...selectedValue, list: uniqueList };
    setChipName(value?.field);
    setFilterRules([selectedValue])
  }

  const handleTextValue = (value,index)=>{
    const newFilterRules = [...filterRules];
    // Create a new object to avoid mutating a frozen/read-only object
    newFilterRules[index] = { 
      ...newFilterRules[index], 
      filterValues: value?.split(","), 
      userInputValue: value 
    };
    setFilterRules(newFilterRules);
  }

const handleBetweenValues = (value, index, position) => {
    const newFilterRules = [...filterRules];
    if (!newFilterRules[index].userInputValue) {
        newFilterRules[index].userInputValue = '';
    }
    const currentValues = newFilterRules[index].userInputValue.split(" and ");
    if (position === "first") {
        newFilterRules[index].userInputValue = `${value} and ${currentValues[1] || ''}`.trim();
    } else if (position === "second") {
        newFilterRules[index].userInputValue = `${currentValues[0] || ''} and ${value}`.trim();
    }
    const valuesArray = newFilterRules[index].userInputValue
        .split(" and ")
        .map(val => val.trim());

newFilterRules[index].filterValues = ["" + valuesArray[0] + "' and '" + valuesArray[1] + ""];
    setFilterRules(newFilterRules);
};


const [loading,setLoading]= useState(false)
  const getQueryData = async (field, data, index, hdr) => {
  const newFilterRules = [...filterRules];
  const obj = {navObj,chips,field, data, index};
  let lookupPayLoad = getLookUpPayLoad(obj);
  lookupPayLoad = {...lookupPayLoad,opType: "F"}
 setLoading(true); 
try {
  const result = await gridSearchData(lookupPayLoad);
  const resultSet = result?.data?.result_set;
  
  // myList = resultSet?.map((item) => ({ name: item })) || [];

  

 let finalObj = resultSet?.map((i) => ({
  name: i?.KEY + (i?.VALUE ? '-' : '') + i?.VALUE,
  key: navObj?.PARENT_MODULE === 'scanSetup'
    ? i.hasOwnProperty(lookupPayLoad?.columnName?.toUpperCase()) ? i[lookupPayLoad?.columnName?.toUpperCase()] : i.KEY
    : i?.KEY
})) || [];

let updatedRules = [...newFilterRules];
let currentRule = updatedRules[index];

updatedRules[index] = {
  ...currentRule,
  list: currentRule?.totalList
    ? [...currentRule.totalList, ...finalObj]
    : finalObj,
  totalList: currentRule?.totalList
    ? [...currentRule.totalList, ...finalObj]
    : finalObj
};

setFilterRules(updatedRules);


  if (!resultSet?.length) {
    newFilterRules[index].list = [];
    setFilterRules(newFilterRules);
    setLoading(false)
  }

  } catch (error) {
  }finally {
}
};

const autoCompleteRef = useRef(null);

const appendSuggestion = (value, index) => {
  
  const newFilterRules = [...filterRules];
  newFilterRules[index].filterValues = value;
  setFilterRules(newFilterRules);
};

const search = (index) => {
  const newFilterRules = [...filterRules];
  if (newFilterRules[index] && newFilterRules[index].userInputValue !== "") {
    const newList = ["1","2"];
       newFilterRules[index].list = newList;
      setFilterRules(newFilterRules);
    
  }
};

const handleCheckboxChange = (checked, suggestion, suggestionIndex, index) => {
  const newFilterRules = [...filterRules];

  if (newFilterRules[index]) {
    const suggestionList = newFilterRules[index].list;
    suggestionList[suggestionIndex].checked = checked;
    newFilterRules[index].list = suggestionList;
    const checkedValues = suggestionList.filter(s => s.checked).map(s => s.value); 
    newFilterRules[index].userInputValue = checkedValues;
    setFilterRules(newFilterRules);
  }
};

  const handleUserDateValueChange = (value, index) => {
   const newFilterRules = [...filterRules];
  if (newFilterRules[index] !== undefined) {
    if (Array.isArray(value)) {
      newFilterRules[index].userInputValue = value; // Handle date ranges
    } else if (value instanceof Date) {
      newFilterRules[index].userInputValue = value; // Handle single dates
    } else {
      newFilterRules[index].userInputValue = value?.target?.value || ''; // Handle text values
    }
  }
  setFilterRules(newFilterRules);
};


 const logicalhandleChange = (value, index) => {
  const newFilterRules = [...filterRules];
  newFilterRules[index].logicalCondition = value;
  setFilterRules(newFilterRules);
    const updatedChips = [...chips];
  if (index < updatedChips.length) {
    updatedChips[index].logicalCondition = value;
    setChips(updatedChips);
  }
};

const handleLogicalConditionChange = (value, index) => {
  // Create a new chips array with the updated logical condition
  const updatedChips = chips.map((chip, i) => 
    i === index ? { ...chip, logicalCondition: value } : chip
  );
  setChips(updatedChips);
};

  const deleteFilterObject = (index) => {
    const updatedFilterRules = [...filterRules];
    updatedFilterRules.splice(index, 1);
    setFilterRules(updatedFilterRules);
    if (updatedFilterRules.length === 0) {
      setShowSmartSearch(false);
      setFilterRules([
        { field: "", type: "", userInputValue: "", logicalCondition: "",list:[],filterValues:[] },
      ]);
    }
  };
  
  const activeButtonTemplate = (field, rowData,index) => {
    return (
      <div className='d-flex align-items-center'>
        <span >{rowData[field]}</span>
      </div>
    );
  };
  const getStoreDetails = (rowData) => {
    return (
      <div>
        <span className='text-decoration-underline pointer text-color' onClick={() => props?.openStorePopup(rowData)}>{rowData.STORE_DETAILS}</span>
      </div>
    )
  }
  /**
    @remarks
    Function to show process bar in status popup
    @author Amar
    */
  const showStatusDownload = (field, rowData) => {
    return (
      <div>
      {rowData?.validation_status === 'Inprogress' || rowData?.validation_status.toLowerCase() === 'pending' ? (
        <span className='processText'>
        Processing <i className="pi pi-spin pi-spinner" style={{ fontSize: '12px' }}></i>
        </span>
      ) : rowData?.validation_status.toLowerCase() === 'requested' ? (
        <span className='reqText'>
        Requested <i className="pi pi-clock" style={{ fontSize: '12px' }}></i>
        </span>
      ) : rowData?.validation_status.toLowerCase() === 'success' ? (
        <span className='completedText'>
        Success <i className="pi pi-check" style={{ fontSize: '12px' }}></i>
        </span>
      ) : (
        <span className='FailedText'>
        Failed <i className="pi pi-exclamation-circle" style={{ fontSize: '12px' }}></i>
        </span>
      )}
      </div>
    )
  }

  const getMasterUPCDetails = (field,rowData) => {
    return (
      <div>
        {navObj?.CHILD_MODULE !== 'Vendor Costing' && navObj?.CHILD_MODULE !== 'Scanomatic' && navObj?.CHILD_MODULE !== 'Dea' ? 
        <span className='text-decoration-underline pointer text-color' onClick={() => props?.handleShowUpcDetails(rowData)}>{rowData.MASTER_UPC}</span>
        : <span>{rowData.MASTER_UPC}</span>
      }
        
      </div>
    )

  }
  const getCustomerFeeDetails = (field,rowData) => {
    return (
      <div className='text-center'>
<img 
        className="pointer" 
        src={(field === 'audit' || field === 'Audit' || field === 'AUDIT') ? audit : setting} 
        alt={field} 
        width={20} 
        onClick={() => props?.handleAuditPopUp(rowData, field)} 
      />      </div>
    )

  }
  
  const getCustomerFeeDetailsRule = (field,rowData) => {

    return (
      <div className='text-center'>
        {/* <i 
         className="pi pi-cog pointer"
         title={rowData[field] === 'Y' ? 'Y' : 'N'}
        width={20} 
        style={{ color: rowData[field] === 'Y' ? 'green' : undefined }}
        onClick={() => props?.handleAuditPopUp(rowData, field)}></i> */}
<img 
        className="pointer" 
        src={rowData[field] === 'Y' ?  settingGreen : settingGray} 
        alt={field} 
         title={rowData[field] === 'Y' ? 'Y' : 'N'}
        width={20} 
        onClick={() => props?.handleAuditPopUp(rowData, field)} 
      />     
       </div>
    )

  }
  /**
    @remarks
    Function to show Rule in Exploded rule
    @author Amar
    */
  const explodedRulesRule = (field,rowData) => {
    return (
      <div className='text-center'>
        <img 
        className="pointer"
        src={rowData[field] === 'R' ?  arrowBlue : arrowGray } 
        // src={rowData[field] === 'M' ?  arrowBlue : arrowGray } 
        // title={rowData[field]} 
        alt={rowData[field]} 
        width={13} 
        onClick={() => props?.handleOpenRulesDefPage(field, rowData)} 
      />      </div>
    )
  }
  
  const hazLockCheckboxes = (field,rowData) => {
    return (
      <div>
      <Checkbox  checked={rowData[field] === 'Y'} />
      {
        
      }
    </div>
    )
  }
  /**
    @remarks
    Function to show Audit date format
    @author Amar
    */
  const lastUPDDateAudit = (field,rowData)=>{
    const formatDate = (dateString) => {
      if(dateString){
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        return dateObject.toLocaleString('en-US', options).replace(',', '');
      }
  };
    return (   
      <div>
        <span>{formatDate(rowData[field])}</span>
      </div>
    )
  }

  const dateFormatChange = (field, rowData) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Return an empty string for empty or undefined input
    }

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return ""; // Handle invalid date formats
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div>
      <span>{formatDate(rowData[field])}</span>
    </div>
  );
};

  const getRulesDefAuditIcon = (field,rowData)=>{
    return (
      <div>
        <img className="pointer" src={field === 'rulesAudit' && audit} alt={field} width={20} onClick={()=>props?.handleRulesAuditPopUp(rowData, field)} />
      </div>
    )
  }
/**
    @remarks
    Function to show AP vendor number heighlight
    @author Amar
    */  
  const getVendorProfileView = (field,rowData) => {
    return (
    
      <div className='vendorMasterIconCss'>
          {navObj?.CHILD_MODULE === "Vendor Master" && !rowData?.SOURCE ? 
          <>
           <span className='text-decoration-underline pointer text-color vendorNumCSS' title={'Navigate to Vendor Profile- '+ rowData.AP_VENDOR_NUMBER} onClick={()=>props?.handleOpenProfilePage(field,'Vendor', rowData)}>{rowData.AP_VENDOR_NUMBER}
         </span> 
         <span className='text-decoration-underline pointer text-color' title='Navigate to Item Summary' onClick={()=>props?.handleOpenProfilePage(field,'Agreement', rowData)}><img src={agreementIcon} alt="Agreement" width={17} className=''/></span>
          </>
        : <span>{rowData.AP_VENDOR_NUMBER}</span>
        }
        
      </div>
    )

  }

  /**
    @remarks
    Function to show delete Icon in division grid
    @author Amar
    */ 
  const selectAction = (field,rowData, index)=>{
    return(
      <div>
      <img src={editIcon} title='edit' alt={field} width={20} className='pointer me-2' onClick={() => props?.editRowRecord(field, rowData, index)}/>
      <img src={deleteRoundIcon} title='delete' alt={field} width={20} className='pointer'
      onClick={() => props?.deleteRowRecord(field, rowData, index)}/>

      </div>
  )
  }
 
const divisionInfoView = (field,rowData,index)=>{
   return (
    <p className=" pi pi-eye ml-3" style={{margin:"auto", display:'flex',alignItems:'center',justifyContent:'center' ,fontSize:'20px',cursor:'pointer',color:'#007ad8'}}
    onClick={()=>props?.changeDefaultScreenMenu(field, rowData,index)}></p>
   )
}
    
    /**
    @remarks
    Function to show EXCLUSION VALIDATION Icon in Vendor Costing
    @author Amar
    */ 
    const showExclusion = (field,rowData)=>{
      return(
        <div className='text-center'>
  <img src={exclusionIcon} alt={field} width={24} className='pointer' onClick={()=>props?.openClause(field, rowData)} />
        </div>
    
    )
    }
  const checkBoxes = (field, rowData,index) => {
    const isDisabled = index !== selectedRowIndex && roles[0]?.role !== 'user';
    return (
      <div>
        <Checkbox  disabled={isDisabled} checked={rowData[field]} onChange={(e) => handleCheckEvent(e.checked, rowData, field, index)} />
        {
          (field === 'view' || field === 'update' || field === 'hasWarehouseDamages') &&
          <span className="ms-2">{rowData[field] ? 'Y' : 'N'}</span>
        }
      </div>
    );
  }
  /**
    @remarks
    Function to show checkbox for Manual add in value map
    @author Amar
    */
  const getCheckBoxValueMap = (field, rowData,index) => {
    
    return (
      <div className='d-flex justify-content-center'>
        <Checkbox checked={rowData[field]}  onChange={(e) => handleCheckEventValueMap(e.checked, rowData, field, index)}/>
      </div>
    );
  }
/**
    @remarks
     Function to show Vendor debit and customer credit details in exploded rule
    @author Amar
    */
  const getVendorCustomerDebitCreditDetails = (field, rowData) => {
    return (
      <div>
        <Checkbox  checked={rowData[field]} />
        {
          <span className="ms-2">{rowData[field] ? 'Y' : 'N'}</span>
        }
      </div>
    );
  }
/**
    @remarks
    Function to show Is Recall and Is Swell in exploded rule
    @author Amar
    */
  const getIsRecallAndSwell = (field, rowData) => {
    return (
      <div>
        <Checkbox  checked={rowData[field]} />
        {
          <span className="ms-2">{rowData[field] ? 'Y' : 'N'}</span>
        }
      </div>
    );
  }
  
  /**
    @remarks
    Function to show claer Icon
    @author Amar
    */
    const getActionClear = (field, rowData, index) => {
      return (
        <div>
           <img src={removeIcon} alt={field} width={20} title='Clear row' class="pointer" onClick={() => props?.handleClearValueMap(field, rowData, index)}/>
        </div>
      );
    }
  
  const handleCheckEvent = (checked, rowData, field, index) => {
    
    const updateData = products.map(item => {
      if (item.wAvgHorizonValidation === rowData.wAvgHorizonValidation) {
        return { ...item, [field]: checked }
      } return item
    })
    setProducts(updateData);
  }
    /**
    @remarks
    Function to checkbox event value map creation manual
    @author Amar
    */
  const handleCheckEventValueMap = (checked, rowData, field, index) => {
    const updateData = products.map((item , i)=> {
      if (item.column === rowData.column && i === index) {
        return { ...item, [field]: checked }
      } return item
    })
    setProducts(updateData);
    {navObj?.PARENT_MODULE !=="settings" &&
    props?.setUpdatedTableData(updateData);
    }
    {navObj?.PARENT_MODULE === "settings" &&
      props?.updateScreenPermissions(checked,rowData,field,index)
    }
  }

  const getSelection = (field,rowData,index) => {
    return (
      <div className='text-center'>
        <img  className="pointer" src={minus} alt={field} width={20} onClick={() => props?.openSelectionPopup(rowData,field)}/>
      </div>

    )
  }
  const getexclusionValidation =(field,rowData,index) => {
    return (
      <div>
        <img src={warning} alt={field} width={20} onClick={() => props?.openSelectionPopup(rowData,field)}/>
      </div>
    )
  }

const handleChangeDate = (index, field, e) => {
   const newValue = e.target.value;

  const updatedProducts = products.map((row, i) => {
    if (i === index) {
      return {
        ...row, 
        [field]: newValue, 
      };
    }
    return row; 
  });
  setStoreProducts(updatedProducts)
  setProducts(updatedProducts);
  };
    const getEffectiveDate =(field, rowData,index) => {
    return (
      <div>
      
        <div className="flex-auto ">
                <Calendar showButtonBar id="buttondisplay"  className="calField w-95" value={rowData[field]}  onChange={(e) => handleChangeDate(index, field, e)}  showIcon 
/>
            </div>
      </div>
    )
  }
          const [storeProducts,setStoreProducts] = useState([])
          const [currentStoreIndex,setCurrentStoreIndex] = useState()
          const [valIndex, setValIndex] = useState({})

          const inputRef1 = useRef({})
   const handleChange = (index, field, e) => {
    let value =  e?.target?.value || "";

    if (field === 'seqNumber' || field === 'width') {
        value = value.replace(/[^0-9]/g, '');      
    }

    const newValue = value || "";
    // Store latest value to prevent lag
    if (!inputRef1.current[index]) {
        inputRef1.current[index] = {};
    }
    inputRef1.current[index][field] = newValue;

    // Preserve focus tracking
    setValIndex({ [field]: { [index]: true } });

    setCurrentStoreIndex(index);

    // Update storeProducts
    setStoreProducts((prevProducts) =>
        prevProducts.map((row, i) => (i === index ? { ...row, [field]: newValue } : row))
    );
    
    // Update localProducts
    setLocalProducts((prevLocal) =>
        prevLocal.map((row, i) => (i === index ? { ...row, [field]: newValue } : row))
    );

    // ✅ Update table data based on the current tab
    props?.setUpdatedTableData(
        (prevData) =>
            prevData.map((row, i) => (i === index ? { ...row, [field]: newValue } : row)),
        props.valueTab
    );

    // Restore focus after state update
    setTimeout(() => {
        const inputElement = document.querySelector(`[data-index="${index}"][data-field="${field}"]`);
        if (inputElement) {
            inputElement.focus();
        }
    }, 0);
};

useEffect(()=>{
  if (props?.valueTab!="") {
    setValIndex({})
  }
},[props?.valueTab])

   useImperativeHandle(ref, () => ({
       
        getStoreData: () => storeProducts,
        currentRowIndex: ()=> currentStoreIndex,
        getStoreDetails:() =>products,
        getDeleteRecords: ()=> formData

    }));

  const getSelectionInput = (field, rowData, index) => {
  const isParentActive =
    document.activeElement?.tagName === "INPUT" &&
    [ "Value Map Name", "Start date", "End date", "Description"].includes(
      document.activeElement?.getAttribute("label")
    );

  return (
    <div>
      <InputText
        type="text"
        className="p-inputtext-sm w-75"
        placeholder=""
        value={rowData[field]}
        onChange={(e) => handleChange(index, field, e)}
        autoFocus={valIndex[field]?.[index] === true && !isParentActive}
        data-field={field} // Add attribute for easy selection
        data-index={index}
      />
    </div>
  );
};
   /**
    @remarks
    Function to show dropdown for customer group creation status
    @author Amar
    */
  const getSelectionList = (field, rowData,index) => {
    return (
      <div>
      <Dropdown value={rowData[field]}  options={optionListStatus}  optionLabel="name" className="tableDropDown" placeholder="" onChange={(e) => handleChange(index, field, e)} />
      </div>

    )
  }

  /**
    @remarks
    Function to show primary and secondary columns
    @author Shankar Anupoju
    */
  const formatColumnGrouping = () =>{
    return (
      <ColumnGrouping columns={props.columns} dragCols ={adjustedCols}  saveColumns={saveGroupColumns} chips={chips} productColumns={props?.columns}  draggedColumns= {productColumns} draggedColumnsSecondary= {secondaryColumns} removeChip={removeChip} />
    )
  }
  let prodCols = useRef(null);
  useEffect(()=>{
     
    setActiveLabel("")
    
    if((props?.data?.length > 0 || Object.keys(props?.data).length > 0) && props?.columns?.length > 0){
      // Ensure props.data is always an array for setProducts
      if (props?.data && typeof props?.data === 'object' && !Array.isArray(props?.data)) {
        const dataArray = [props?.data];

        setProducts(dataArray);
        setLocalProducts(dataArray);
      } else if (Array.isArray(props?.data)) {
        setProducts(props?.data);
      } else {
        setProducts([]);
      }
      //  
      if(prodCols?.current){
        const cols = prodCols.current;
        setProductColumns(cols);
      } 
      const columns = props?.columns?.map(column => column?.field);
      initFilters(columns);
    }
    if(props?.data?.length === 0){
      setProducts(props?.data)
    }
    
    if (isFilter?.filterState === true && props?.data?.length > 0 && !props?.storeView) {
      
      if(isFilter?.jsonData?.primary?.length > 0){
        setProductColumns(isFilter?.jsonData?.primary);
      }
      if(isFilter?.jsonData?.secondary?.length > 0){
        setSecondaryColumns(isFilter?.jsonData?.secondary);
        setChildAccordion(true)
      }else {
        setSecondaryColumns([]);
        setChildAccordion(false)
      }
      
    } 
      else{
          setProductColumns((prodCols?.current && !props?.storeView) ? prodCols?.current : props?.columns);
        // setProductColumns(props?.columns)
    }
    
  },[isFilter?.filterState ,props?.data,props?.columns,navObj,prodCols]);

  const onFilter = (e) => {
    setFilters(e.filters);
};
    useEffect(() => {
      if(products?.length > 0){
        applyLocalSortingAndFiltering();
      
      }
      else {
        if (props?.data && typeof props?.data === 'object' && !Array.isArray(props?.data)) {
        const dataArray = [props?.data];

        setProducts(dataArray);
        setLocalProducts(dataArray);
      }else {
        setLocalProducts([]); 
      }
        
        // setMsg('Query to get the results')
      }
      
    }, [filters, products,sortField, sortOrder]);

  /**
    @remarks
    Function to filter the grid sorting,search,filter
    @author Shankar Anupoju
    */
    const [msg,setMsg] = useState('Query to get the results')
    const applyLocalSortingAndFiltering = () => {
      
      let filteredProducts = [...products]; 
      if (filters.global?.value) {
        
          const globalValue = filters.global.value.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
              Object.values(product).some(val =>
                  val.toString().toLowerCase().includes(globalValue)
              )
          );
      }
      Object.keys(filters).forEach(field => {
        if (field !== 'global') { 
            const fieldFilter = filters[field];
            const constraints = fieldFilter.constraints;
    
            constraints.forEach(constraint => {
                if (constraint.value) {
                    switch (constraint.matchMode) {
                        case 'startsWith':
                            filteredProducts = filteredProducts.filter(product =>
                                product[field]?.toString().toLowerCase().startsWith(constraint.value.toLowerCase())
                            );
                            break;
                        case 'contains':
                            filteredProducts = filteredProducts.filter(product =>
                                product[field]?.toString().toLowerCase().includes(constraint.value.toLowerCase())
                            );
                            break;
                        case 'notContains':
                            filteredProducts = filteredProducts.filter(product =>
                                !product[field]?.toString().toLowerCase().includes(constraint.value.toLowerCase())
                            );
                            break;
                        case 'endsWith':
                            filteredProducts = filteredProducts.filter(product =>
                                product[field]?.toString().toLowerCase().endsWith(constraint.value.toLowerCase())
                            );
                            break;
                        case 'equals':
                            filteredProducts = filteredProducts.filter(product =>
                                product[field]?.toString().toLowerCase() === constraint.value.toLowerCase()
                            );
                            break;
                        case 'notEquals':
                            filteredProducts = filteredProducts.filter(product =>
                                product[field]?.toString().toLowerCase() !== constraint.value.toLowerCase()
                            );
                            break;
                        default:
                            break;
                    }
                }
            });
        }
    });
    
      setLocalProducts(filteredProducts);
  };

const [selectedView, setSelectedView] = useState({});
const [storeSelectedView, setStoreSelectedView] = useState({});

  useEffect(() => { 
setStoreSelectedView(props?.storeViewData);
  },[props?.storeViewData])
  useEffect(()=>{
    if(props?.groupColumns && Object.keys(props?.groupColumns).length > 0){
      
      saveGroupColumns(props?.groupColumns);
      
      if (
        !('storeViewData' in props) ||
        (props?.storeViewData && Object.keys(props?.storeViewData).length === 0)
      ) {
        dispatch(changeIsFilter({ queryString: props?.groupColumns?.FILTER_STRING, filterState: false }));
      }
      
      setChips(props?.groupColumns?.FILTER_STRING);
    }
  },[props.groupColumns])
  const saveGroupColumns = (data) =>{
    
    if(props?.storeSelectedView && data?.FILENAME){
     props?.storeSelectedView(data);
      
    }
    if(data?.FILENAME) {
      setSaveId(data?.ID);
      setSelectedView(data);

    }
   
     setColumnsBtn(false)
    if(data?.closeModel){
      
      const val = 'retrieve' + new Date();
      setShowColumnsList(!showColumnsList);
      setRetOrderGrp(val);
      setExpandedRows(null)

    }else {
      setProducts([]);
      setLocalProducts([]);
      updateView({filterData:data?.FILTER_STRING} || []);
     // setChildAccordion(true)
      setClearViewRecord(false)
    }
  }

  const [activeLabel, setActiveLabel] = useState("");
  const [openForm,setOpenForm] = useState("")

const handleItemClick = (event) => {
  
  const label = event;
  if (props?.itemSummaryCreate && label === 'Create') {
    props?.handleClickCreate();
    setActiveLabel("")
  }
  else {
let activeField = label === 'Create' ? 'Create': label === 'Edit' ? 'Edit' : label === "Delete" 
? "Delete" :label === "BulkUpdateByColumn" ? "BulkUpdateByColumn": label === "CopyAndCreate" ? "CopyAndCreate" : ""

setActiveLabel(activeField === "" ? "Edit" : activeField);
setColumnRecord({columnSelected:"",columnValue:""})
  }
//setActiveLabel("")

};

const clearGridOptions = ()=>{
   
 // setActiveLabel("")
  if(activeLabel.toLowerCase() !== 'edit'){
    handleItemClick("")
  }
  //
  setSelectedProducts([])
}

  const toggleMenu = (event) => {
    menu.current.toggle(event);
  };

  const onSelectionChange = (e) => {
    
    if(e.type === 'checkbox' || e.type === 'all'){
      const selectedIndexes = e.value.map((product) => {
        const index = products.indexOf(product);
        if (index === -1) {
        }
        return index;
      });
  
      setSelectedProducts((prevSelectedIndexes) => {
        const indexesToAdd = selectedIndexes.filter(
          (index) => !prevSelectedIndexes.includes(index)
        );
        const indexesToRemove = prevSelectedIndexes.filter(
          (index) => !selectedIndexes.includes(index)
        );
        let updatedIndexes = [...prevSelectedIndexes, ...indexesToAdd];
        updatedIndexes = updatedIndexes.filter(
          (index) => !indexesToRemove.includes(index)
        );
        return updatedIndexes;
      });
    }
  };

  useEffect(() => {
    if (selectedProducts) {
      const editTableDataRecords = products && products.map((item, index) => {
          if (selectedProducts.includes(index)) {
            return item;
          }
        });
      const result =editTableDataRecords && editTableDataRecords.filter((item) => item !== undefined);
      setEditTableData(result);
      setFormData(result)
    }
  }, [selectedProducts]);

  const showMultiCreate = () => {
    setOpenForm("Create")

  };
  const showMultiEdit = () => {
    const keysToRemove = [
    "RCLM_CUSTOMER_ID",
    "RCLM_CUSTOMER_GRP_ID",
    "CHAIN_DESC",
    "AUTHORIZED_CUST_CREDIT",
    "LAST_SALES_DATE",
    "LAST_SCAN_DATE",
    "RCLM_PROFILE_ID",
    "RCLM_CUSTOMER_GRP_NAME"
];
const newArray = formData.map(obj => {
    const newObj = { ...obj
    };
    keysToRemove.forEach(key => {
        delete newObj[key];
    });
    return newObj;
});
{navObj?.CHILD_MODULE === 'Customer Profile' ?  dispatch(bulkEdit(newArray)) :  dispatch(bulkEdit(formData))}
    setOpenForm("Edit")
    console.log(newArray)
  };

  const deleteRecords = () => {
    setFormData(formData)
    dispatch(bulkDelete(formData))
    setOpenForm("Delete")

  }
 
   const initFilters = (globalFilterOptions) => {
        let initialFilters = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };

        globalFilterOptions.forEach(field => {
            initialFilters[field] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] };
        });

        setFilters(initialFilters);
        setGlobalFilterValue('');
    };
    
const exploded = (rowData) => { 
   return <img src={rowData.HAS_RULE_EXPLODED === 'Y' ? activeExploded  : explode} alt={rowData.HAS_RULE_EXPLODED} title={
    rowData.HAS_RULE_EXPLODED} width={20}/>  
}

/**
    @remarks
    Function to show link icon in exploded rule
    @author Amar
    */
const ruleLink = (rowData) => { 
  return <img src={linkIcon} alt={rowData.exploded} width={20}/>  
}
/**
    @remarks
    Function to show link for File name in status popup
    @author Amar
    */
    const showFileNameLink = (field, rowData) => { 
      return(
        <>
        {rowData?.validation_status === 'Inprogress' || rowData?.validation_status === 'PENDING' ? <span className='disbaleFileName' disabled>{rowData[field]}</span>  :
        rowData?.validation_status === 'Failed' || rowData?.validation_status === 'Error'  ? <span className='disbaleFileName' disabled></span> :
        <span className='fieldNameLink' onClick={()=>props?.handleClickFileName(rowData, field)}>{rowData[field]}</span> 
        }
        </>
      )
    }
    const showErrorLink = (field, rowData) => { 
      return(
        <>
        {rowData?.error_count > 0 ? <span title='Go to Error File' className='fieldNameLinkError' onClick={()=>props?.handleClickErrorFile(rowData, field)}>{rowData[field]}  <i className="pi pi-link" style={{ fontSize: '12px' }}/></span> : <span>{rowData[field]}</span>
        
        }
        </>
      )
    }
    
const handleRulesDef = (field, rowData) => {
  const optionList = getOptionList(field)
  const isDisabled = rowData.hasRuleExploded === 'Y';
  return (      
    <div>
    {!isDisabled &&
      <Dropdown value={rowData[field]}  optionLabel='' filter disabled={isDisabled} dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
    showClear className="tableDropDown" placeholder=""/>
    }
    {isDisabled &&
      <span>{rowData[field]}</span>
    }
    </div>
  )
}

const getOptionList = (field) => {
const lov = products.map(item => {
  return item[field]
})
return lov
}

const getCustAndVendorFees = (field) => {
  return(
  <div className='text-center'>  <img src={setting} alt={field} width={20}/></div>
)
}
const closeMultiCreate =(editRes = null) => {  
  dispatch(editRes === null ? clearBulkCreateRecords() : clearBulkEditRecords())
  setSelectedProducts([])
 // if(activeLabel !== 'Edit'){
  setActiveLabel("Edit")
 // }

  setOpenForm(editRes === null ? "" : "none")
  setCopiedRecords([])
}

useEffect(()=>{
  
  if (bulkCreateResponseData) {
    closeMultiCreate()
    dispatch(bulkCreateResponse(null))
  }
},[bulkCreateResponseData])
const recMsg =useSelector((state) => state?.columnSelection?.recordsMsg);
useEffect(()=>{
 setMsg(recMsg)
},[recMsg, navObj?.CHILD_MODULE === 'Exploded Rules' ?  msg: ''])
const closeMultiEdit = () => {
  closeMultiCreate("none")
};

useEffect(()=>{
  if (bulkEditResponseData) {
    dispatch(bulkEditResponse(null))
    closeMultiCreate("none")
    setActiveLabel("Edit")
    setOpenForm("")
  }
},[bulkEditResponseData])
/**
    @remarks
    Function to show Active button in exploded rule
    @author Amar
    */
const showItemPurchaseStatus = (field, rowData) =>{
  return <span className={rowData[field] ? 'Active-Class' : 'inActive'}>{rowData[field] ? 'Active' : 'Inactive'}</span>
}
const openColumnsGrouping =() =>{
  setShowColumnsList(!showColumnsList) 

}
/**
    @remarks
    Function to clear col views
    @author Sai Anil
    */
   const clearView = (data)=>{
      if(props?.storeSelectedView){
     props?.storeSelectedView({});
      
    }
    setProducts([]);
    setLocalProducts([]);
    setProductColumns([]);
    setChips([])
          firtsRef.current = [];
            secondRef.current = [];
     prodCols.current = null;
      setClearViewRecord(true)
      // setSecondaryColumns([])
      setChildAccordion(false);
    dispatch(changeIsFilter({ filterState: false, queryString: "", jsonData: []  }));
   }

/**
    @remarks
    Function to show saved column order views
    @author Shankar Anupoju
    */
const savedColumnOrders = () =>{
  return ( <SavedColOrders changeOrder={saveGroupColumns} filterApplied={props?.groupColumns}  applySavedView={storeSelectedView} savedViews={savedViews} retOrderGrp={retOrderGrp}  openColumnsGrouping={openColumnsGrouping} clearView={clearView}
  clearViewRecord={clearViewRecord} fRef={firtsRef} sRef = {secondRef}/>)
}
const statusChange = (field,rowData,index) =>{
 
  return (
    navObj?.CHILD_MODULE === 'Users' && navObj?.PARENT_MODULE === 'settings' ? 
      <div>
        <InputSwitch
          checked={rowData?.STATUS === "ACTIVE" ? true : false}
          onChange={(e) => props?.userStatusChange(e, field, rowData, index)}
        />
      </div>
    :
      <div>
        {rowData?.STATUS}
      </div>
  );

}
const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
     setFilters((prevFilters) => ({
        ...prevFilters,
        global: { value, matchMode: FilterMatchMode.CONTAINS }
    }));
  };

  const gridBody = useCallback((item, index) => {
  return (rowData) => {
   // console.log("gridBody", editingRowIndex, index, editingField,item.field);
    // const isEditing = editingRowIndex === index;
    
    return (
      <GridBodyRenderer
      activeLabel={activeLabel}
      productColumns={productColumns}
        field={item?.field}
        item={item}
        editingRowIndex={editingRowIndex}
        rowData={rowData}
        index={index}
       // isEditing={isEditing}
        fieldTypeMap={{ [item.field]: item.type }} 
        inputType={item?.type} // <-- pass this
        renderEditableField={renderEditableField}
        insertFields={insertFields}
        setInsertFields={setInsertFields}
        setEditing={setEditing}
        handleRulesDef={handleRulesDef}
        exploded={exploded}
        activeButtonTemplate={activeButtonTemplate}
        getStoreDetails={getStoreDetails}
        getCustomerFeeDetails={getCustomerFeeDetails} 
        getCustomerFeeDetailsRule={getCustomerFeeDetailsRule} 
        lastUPDDateAudit={lastUPDDateAudit}
        dateFormatChange={dateFormatChange}
        explodedRulesRule={explodedRulesRule}
        checkBoxes={checkBoxes}
        getSelection={getSelection}
        getexclusionValidation={getexclusionValidation}
        getEffectiveDate={getEffectiveDate}
        getSelectionInput={getSelectionInput}
        getMasterUPCDetails={getMasterUPCDetails}
        getCustAndVendorFees={getCustAndVendorFees}
        ruleLink={ruleLink}
        showItemPurchaseStatus={showItemPurchaseStatus}
        getVendorCustomerDebitCreditDetails={getVendorCustomerDebitCreditDetails}
        getIsRecallAndSwell={getIsRecallAndSwell}
        getActionClear={getActionClear}
        getCheckBoxValueMap={getCheckBoxValueMap}
        getVendorProfileView={getVendorProfileView}
                 

handleIconClick={props?.openStorePopup}
selectAction= {selectAction}
getSelectionList = {getSelectionList}
showFileNameLink = {showFileNameLink}
showErrorLink = {showErrorLink}
showStatusDownload = {showStatusDownload}
getRulesDefAuditIcon={getRulesDefAuditIcon}
showExclusion = {showExclusion}
// screenFeatures = {screenFeatures}
divisionInfoView={divisionInfoView}
hazLockCheckboxes={hazLockCheckboxes}
statusChange={statusChange}
      />
    );
  };
},[activeLabel]);

const [expandedRows, setExpandedRows] = useState(null);
const onRowToggle = (e) => {
  setExpandedRows(e.data);
};

useEffect(()=>{
  if (isFilter?.jsonData?.length ===0) {
    setExpandedRows(null)
  }
},[isFilter])
const rowExpansionTemplate = (data) => {
  return (
    <div className='card'>
    <DataTable value={[data]} resizableColumns="true" columnResizeMode="expand" onColumnResizeEnd={(e)=> handleColumnResize(e, 'secondary')}
 responsiveLayout="scroll" scrollable scrollHeight="400px" filterIcon={<i className=' pi pi-ellipsis-v filterIcon'/>}>
    {secondaryColumns&&secondaryColumns.map((item, index) => {
      return (<Column frozen={item?.frozen} headerStyle={{ maxWidth: item?.width ? `${item.width}px` : undefined ,
        wordWrap: item?.width ? 'break-word':'',  
        whiteSpace: item?.width ? 'normal' : '',   
        overflow: item?.width ? 'hidden'  :'', 
        }}
        filterField = {item.field} 
        bodyStyle={{ maxWidth: item?.width ? `${item.width}px` : undefined }}
        width={`${item?.width}px`}
        style={{ maxWidth: item?.width }} field={item?.field} header={item?.header} 
        body={ gridBody(item) }>
        </Column>
      )
    })}
    </DataTable>
    </div>
  );
};

/**
    @remarks
    Function to handle rowclick
    @author Sai Anil
    */
  // const [clickCounter, setClickCounter] = useState(0);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);

  const handleRowClick = (rowIndex) => {
    if (dt.current) {
        const rootElement = dt.current?.container || dt.current?.el;
        const scrollableElement = rootElement?.querySelector('.p-datatable-scrollable-body');

        if (scrollableElement) {
            const scrollPosition = scrollableElement.scrollTop;
            setClickedRowIndex(rowIndex);
            // Restore the scroll position after state update
            setTimeout(() => {
                scrollableElement.scrollTop = scrollPosition;
            }, 0);
        } else {
        }
    } else {
    }
};

/**
    @remarks
    Function to handle last frozen border
    @author Raja
    */
    const lastFrozenIndex = productColumns?.map((col, index) => (col.frozen ? index : -1)).reduce((a, b) => Math.max(a, b), -1);

    const wrapperRef = useRef(null);

   useEffect(() => {
    if (wrapperRef.current) {
        const wrapper = wrapperRef.current.querySelector('.p-datatable-wrapper');
        if (wrapper) {
            wrapper.style.height = `calc(100vh - ${props.height}vh)`;
        }
    }
}, [props.height, props.totalRecords, localProducts, productColumns]);

    /**
    @remarks
    Function to handle onchnage for bulkCreate fields
    @author Sai Anil
    */
    const handleInputChange = (event, data) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
    @remarks
    Function to add records to datatable
    @author Sai Anil
    */
    const addMultiCreate = () => {
    const newMultiRecord = [...multiRecord];
    newMultiRecord.push(formData);
    const filteredMultiRecord = newMultiRecord.filter((obj) => Object.keys(obj).length !== 0);

    setMultiRecord(filteredMultiRecord);
  
    setFormData((prevState) => ({}));
    setFormData((prevState) => {
      return {};
    });
  };

  /**
    @remarks
    Function to add records to datatable
    @author Sai Anil
    */
  const addRecordsToTable  =()=>{
    const updatedProducts = [...products];
    multiRecord.forEach(record => {
      updatedProducts.unshift(record);
    });
    setProducts(updatedProducts);
   // setSaveButton(!saveButton)
  }

  /**
    @remarks
    Function make api call for newly added bulk records
    @author Sai Anil
    */

  /**
    @remarks
    Function make retrieve previously saved views
    @author Shankar Anupoju
    */
  const updateView = (params) =>{
    setChips(params.filterData);

    

    //setSelectedView();

  }

  /**
    @remarks
    Function is used to copy and  new record to the table
    @author Sai Anil
    */
  useEffect(()=>{
    if (props?.copyRow === true && selectedProducts?.length) {
      const getTableRecord =  products[selectedProducts];
    const copiedRecord = { ...getTableRecord };

    const updatedProducts = [
      ...products.slice(0, selectedProducts + 1),
      copiedRecord, 
      ...products.slice(selectedProducts + 1),
    ];
    setProducts(updatedProducts)
    }
  },[props?.copyRow,selectedProducts])


  const copyAndCreate = () => {
  setCopiedRecords(formData);
  setOpenForm("CopyAndCreate")
};

  const [columnRecord,setColumnRecord] = useState({
    columnSelected:"",columnValue:""
  })
      const toast = useRef(null);

      const [statusField,setStatusField]= useState()

      const [upType,setUpType]= useState()
        const [getLookUpSearch, { data: lookupData }] = useLookUpSearchMutation();
        const [filteredSuggestions, setFilteredSuggestions] = useState([]);

        const [urlDetails,setUrlDetails]= useState()

       /**
    @remarks
    Function is used to handleColumne for updateByColumn
    @author Sai Anil
    */

  const handleChangeAutoComplete = (data) => {
  setColumnRecord((prevState) => ({
    ...prevState,
    columnValue: data?.name ? data?.name : data,
  }));

};
const fetchAutoSuggestions = async (query) => {
  if (!query) return setFilteredSuggestions([]);
  const { url } = urlDetails?.target?.value || {};
  if (!url) return;

  const payload = { 
    ...url.payload, 
    searchValue: query, 
    opType: "I" 
  };
  const body = { url: url.url, method: url.method, payload };
  const result = await getLookUpSearch(body);
  setFilteredSuggestions(Array.isArray(result?.data?.result_set) 
    ? result.data.result_set.map(name => ({ name })) 
    : []);
};

  const handleColumnChange = (e) => {
  const { field, VALUES, url, type } = e?.target?.value || {};
  if (!field) return;

  setColumnRecord(prev => ({ ...prev, columnSelected: field }));

  if (VALUES?.length) {
    setUpType("list");
    setStatusField(VALUES.map(item => ({ name: item })));
  } else if (url) {
    setUpType("Autocomplete");
    setUrlDetails(e, url);
  } else {
    setUpType(type === "DATE" ? "Date" : type === "DECIMAL" ? "decimal" : "");
  }
};

 /**
    @remarks
    Function is used to handleValueChange for updateByColumn
    @author Sai Anil
    */
  const handleValueChange = (e) => {
  setColumnRecord(prevState => ({
    ...prevState, 
    columnValue: e
  }));
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Extract components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // Combine into desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const handleValueChangeVM = (e) => {
  const selectedDate = e; 
setColumnRecord(prevState => ({
  ...prevState, 
  columnValue: formatDate(selectedDate)
}));
// setColumnRecord(e)
};

const renderHeader = (field, label,width) => {
  let dataLabel = label;
  if(field === 'AP_VENDOR_NUMBER' && navObj?.CHILD_MODULE === 'Vendor Profile' && props?.columns?.length > 0){
    
    dataLabel = props?.columns?.find(i=>i.field === field).header;
  }
  const isSorted = sortField === field;
  const icon = isSorted
      ? sortOrder === 1
          ? 'pi pi-sort-amount-up'  
          : 'pi pi-sort-amount-down' 
      : 'pi pi-sort';

  return (
      <div className="custom-header">
          <span title={dataLabel}>{dataLabel}</span>
          {!props?.hasOwnProperty('hideSort') && products?.length > 0 &&
          <i 
          className={`sort-icon ${icon}`} 
           style={{ marginLeft: '5px' }} 
          onClick={() =>  handleSortClick(field)}  // Handle sort on icon click
        />
          }
          
      </div>
  );
};

const handleSortClick = (field) => {
    let mySortOrder;
    if (field === sortField) {
        mySortOrder = sortOrder === 1 ? -1 : 1; // Toggle sort order
    } else {
        mySortOrder = 1;  // Default to ascending order
    }

    setSortField(field);
    setSortOrder(mySortOrder);

    const order = mySortOrder === 1 ? 'ASC' : 'DESC';
    const sortObj = { sortBy: field, sortorder: order };

    // Call the parent function to handle the sorting (if applicable)
    // props?.pageSort(sortObj);
    if (navObj?.CHILD_MODULE !== 'Exploded Rules') {
        const order = mySortOrder === 1 ? 'ASC' : 'DESC';
        const sortObj = { sortBy: field, sortorder: order };

        // Call the parent function to handle the sorting for other modules
        props?.pageSort(sortObj);
    }else{
      props?.pageSort(field,sortOrder)
    }
};

/**
    @remarks
    Function is used to submit for updateByColumn for upding column
    @author Sai Anil
    */

const updateByColumnValue = async () => {
  if (!(products?.length && selectedProducts.length && columnRecord?.columnSelected && columnRecord?.columnValue)) {
    return toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select the update fields' });
  }
  const updatedRecords = selectedProducts
    .map(index => products[index] && { ...products[index], [columnRecord.columnSelected]: columnRecord.columnValue })
    .filter(Boolean);

  if (updatedRecords.length) {
    try {
      props?.editBulkRecord(updatedRecords);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update records' });
    }
  }
  setColumnRecord({ columnSelected: "", columnValue: "" });
  setUpdateByColumn(prev => !prev);
};

const removeRecord = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index); 
    setProducts(updatedProducts); 
};

const clearInlineData = (index) => {
  let updatedProducts = [...products];
  const newRow = {CHAIN_NUM: '',STORE_DETAILS: '',GRP_EFFECTIVE_START_DATE: null, GRP_EFFECTIVE_END_DATE: null,GRP_STATUS: null,USE_ICOST_AT_NO_SALES: '',RCLM_CUSTOMER_GRP_ID: '',RCLM_CUSTOMER_GRP_NAME: '',isNewRecord: true};
  if (updatedProducts[index]) {
    updatedProducts[index] = { ...newRow };
    setProducts(updatedProducts);
  }
};

const [adjustedCols,setAdjustedCols]= useState([])
const [saveColumnsBtn,setColumnsBtn]= useState(true)

const firtsRef = useRef([])
const secondRef = useRef([])
const [saveEnable,setSaveEnable]= useState(false)

const handleColumnResize = (event, key) => {
  
  //setSaveButton(!saveButton);
  // setColumnsBtn(true);
  const { column, delta, element } = event;
  
  const clientWidth = element?.clientWidth || 0; // Get the current width of the column element
  const field = column?.props?.filterField;
  if (!field) {
    return;
  }
  // let updateProdColumns;
  if(key === 'primary'){
    
    let updateObject  = productColumns?.find((i) =>i?.field === field)
updateObject = {...updateObject, width: clientWidth}
    firtsRef.current = [...firtsRef.current, updateObject]
    
  }
  else if(key === 'secondary'){
    let updateObject  = secondaryColumns?.find((i) =>i?.field === field)
updateObject = {...updateObject, width: clientWidth}
    secondRef.current = [...secondRef.current, updateObject]
  }
};

const [currentFileName,setCurrentFileName]= useState()
const[saveID,setSaveId]= useState("")

useEffect(()=>{
  if (navObj?.CHILD_MODULE) {
setCurrentFileName(navObj?.CHILD_MODULE);
  }
},[navObj])


const saveColumnViews = async () => {
    const draggedCols = [...adjustedCols];
    const newCols = productColumns?.map((item) => {
        const matchedWidth = firtsRef?.current?.find((item1) => item?.field === item1.field)?.width;
        return matchedWidth ? { ...item, width: matchedWidth } : item;
    });
    const newColsSec = secondaryColumns?.map((item) => {
      const matchedWidth = secondRef?.current?.find((item1) => item?.field === item1.field)?.width;
      return matchedWidth ? { ...item, width: matchedWidth } : item;
  });
    setProductColumns(newCols);
    const primary = newCols;
    const secondary = newColsSec;

    // Check if both primary and secondary are null or undefined
    if (firtsRef?.current?.length === 0 && secondRef?.current?.length === 0) {
        toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please resize the columns"
            });
        return;
    }
    
    const body = {
        json_data: { primary, secondary, draggedCols },
        FILENAME: currentFileName,
        DIVISION: division.id,
        VISIBILITY: -1,
        MAKE_DEFAULT: "Y",
    };

    if (!saveID && Object.keys(selectedView)?.length === 0) {
        let res = await insertGridView(body).unwrap();
        if (res?.status_code === 200 || res?.res_status) {
          
            setSaveButton(!saveButton);
            firtsRef.current = [];
            secondRef.current = [];
            // setSecondaryColumns([]);
            // setChildAccordion(false);
            setSaveId(res?.ID);
            toast.current.show({
                severity: "info",
                summary: "Create",
                detail: "Created successfully",
                life: 3000,
            });
            saveGroupColumns(chips);
      
        prodCols.current = primary;
        dispatch(changeIsFilter({ queryString: chips, filterState: false }));
      
      
        setChips(chips);
           // fetchSavedGridViews();
            
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: res?.msg,
            });
        }
    } else {
        if(Object.keys(selectedView)?.length > 0){
        
           body.VISIBILITY = selectedView.VISIBILITY;
           body.MAKE_DEFAULT = selectedView.MAKE_DEFAULT;
          body.FILENAME = selectedView.FILENAME;
         
          
        }
        body.ID = saveID;
        let res = await gridViewEdit(body).unwrap();
        if (res?.status_code === 200 || res?.res_status) {
           
           firtsRef.current = [];
            secondRef.current = []; 
            setSaveButton(!saveButton);
            // setSecondaryColumns([]);
            // setChildAccordion(false);
                saveGroupColumns(chips);
      
        prodCols.current = primary;
        dispatch(changeIsFilter({ queryString: chips, filterState: false }));
      
      
        setChips(chips);
            //fetchSavedGridViews();
         //   setSaveId("")
        //  firtsRef.current = [];
          //  secondRef.current = [];
            toast.current.show({
                severity: "info",
                summary: "Update",
                detail: "Updated successfully",
                life: 3000,
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: res?.msg,
            });
        }
    }
};

 const fetchSavedGridViews = async () => {
      
        const body = {
            PARENT_MODULE: navObj.PARENT_MODULE,
            CHILD_MODULE: navObj.CHILD_MODULE
        };

        try {
            let res =await getSavedGridViews(body).unwrap();
       
            if(res?.res_status && res?.status_code === 200){
              if(res?.result_set?.length === 0){
                
                if (!permissionObj?.viewsWithFilters && (!props?.groupColumns || Object.keys(props?.groupColumns).length === 0)) {
                  dispatch(changeIsFilter({ filterState: false }));
                }
              }else {
              let data=res?.result_set?.find((item)=>item?.VISIBILITY === '-1');
              
              if(data){
                
                if(navObj?.CHILD_MODULE === 'Item Summary' && navObj?.PARENT_MODULE === 'itemSetup'){
                   const columnsData = data?.json_data?.primary?.map((item) => {
                  if(item.field === 'GL_DESCRIPTION'){
                      return {...item,field:'ITEM_DESCRIPTION_CASE',header:'Description'};
                  }
                  return item;
                });
                prodCols.current = columnsData;
                }else {
                  prodCols.current = data?.json_data?.primary;
                }
                
                setSelectedView(data);
                setSaveId(data?.ID);
              }
              setSavedViews(res);
              }
              
             
            
            }
            
        } catch (e) {
        }
    };

    
const [vmColumnType,setVmColumnType] = useState('');
const handleColumnChangeVM = (e) => {
  const selectedItem = e.target.value;
  setColumnRecord((prevState) => ({
    ...prevState,
    columnSelected: selectedItem.field,
    columnValue: selectedItem.value
  }));
  setVmColumnType(selectedItem.type);
};
const [editingCell, setEditingCell] = useState(null);
const handleCellDoubleClick = (e) =>{
 setEditingCell({ rowIndex: e.rowIndex, field: e.field });
}
 const isCellBeingEdited = (options) => {
        return (
            editingCell &&
            editingCell.rowIndex === options.rowIndex &&
            editingCell.field === options.field
        );
    };
const DataTableContent = () => {
  const isItemSummary = navObj?.CHILD_MODULE === 'Item Summary';
  const isExplodedRule = navObj?.CHILD_MODULE === 'Exploded Rules';
  const isValueMaps = navObj?.CHILD_MODULE === 'Value Maps';
  const columns = productColumns?.filter(item => item?.visibility !== false && item?.primary !== true);

  const renderColumn = useCallback((item, index) => {
   
    const commonColumnProps = {
      key: item.field,
      filterField: item.field,
      filterMatchMode: FilterMatchMode.CONTAINS,
      columnKey: item.field,
      frozen: item?.frozen,
      header: renderHeader(item?.field, item?.header, item?.width),
      className: item.frozen && isFilter?.filterState === null && index === lastFrozenIndex ? "last-frozen-column" : "",
      body: (rowData, columnProps) => gridBody(item, columnProps.rowIndex)(rowData),
    };

    if (isValueMaps) {
      return (
        <Column
          {...commonColumnProps}
          headerStyle={{ width: `${item?.width || 100}%`, textAlign: "left" }}
          bodyStyle={{ width: `${item?.width || 100}%`, textAlign: "left" }}
          sortable
        />
      );
    }

    return (
      <Column {...commonColumnProps} 
      headerStyle={{ maxWidth: item?.width ? `${item.width}px` : undefined ,wordWrap: item?.width ? 'break-word':'',  whiteSpace: item?.width ? 'normal' : '',   overflow: item?.width ? 'hidden'  :''    }}
        bodyStyle={{ maxWidth: item?.width ? `${item.width}px` : undefined }}
        width={`${item?.width}px`}
        onDoubleClick={(e) => handleCellDoubleClick({ ...e, field: 'name' })}
        sortable
        style={{ maxWidth: item?.width }}
      />
    );
  },[gridBody]);

  return (
    <>
    <DataTable
      onColumnResizeEnd={(e) => handleColumnResize(e, 'primary')}
      className={((localProducts?.length === 0 && isItemSummary) || (localProducts?.length === 0 && isExplodedRule)) ? 'grid' : 'grid'}
      value={localProducts}
      emptyMessage = { chips?.length > 0 && props?.data?.length === 0 && props?.columns.length === 0 ? 
         'Loading ...' :chips?.length > 0 && productColumns?.length > 0  && products?.length === 0 ? 'No Records Found': props?.columns?.length > 0 && props?.data?.length === 0 && props?.smartSearchOff ? 'No Records Found' : productColumns?.length > 0  && products?.length === 0 && navObj?.CHILD_MODULE === 'Value Maps' && navObj?.PARENT_MODULE === 'valueMap'  ? 'No Records Found' : 'Query to get the results'}
//       emptyMessage={
//   (isItemSummary || (isExplodedRule && !props?.storeView))
//     ? (
//         props?.columns?.length === 0
//           ? 'Loading...'
//           : chips?.length === 0
//             ? msg
//             : props?.data?.length === 0
//               ? 'No Records Found'
//               : null
//       )
//     : (
//         props?.columns?.length === 0
//           ? 'Loading...'
//           : props?.data?.length === 0
//             ? 'No Records Found'
//             : null
//       )
// }

      columnResizeMode="expand"
      style={{ overflow: 'auto' }}
      responsiveLayout="scroll"
      collapsedRowIcon={<i className='pi pi-chevron-circle-right black f-18'></i>}
      expandedRowIcon={<i className='pi pi-chevron-circle-down black f-18'></i>}
      reorderableColumns
      onRowClick={(e) => handleRowClick(e.index)}
      filterIcon={<i className=' pi pi-ellipsis-v filterIcon' />}
      // onFilter={onFilter}
      onFilter={(e) => setFilters(e.filters)}
      globalFilterFields={localProducts.length > 0 ? Object.keys(localProducts[0]) : []}
      filters={filters}
      ref={dt}
      selection={editTableData}
      onSelectionChange={onSelectionChange}
      resizableColumns
      scrollable
      stripedRows={props?.stripedRows}
      paginator={props?.paginator}
      rows={rowCount}
      rowsPerPageOptions={localProducts.length > 0 ? [10,15, 25, 50] : []}
      tableStyle={{ Width: 'auto' }}
      totalRecords={props.totalRecords ? props.totalRecords : localProducts.length}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      paginatorLeft={paginatorLeft}
      paginatorRight={paginatorRight}
      sortMode="multiple"
      removableSort
      globalFilter={globalFilterValue}
      expandedRows={expandedRows}
      onRowToggle={onRowToggle}
      rowExpansionTemplate={rowExpansionTemplate}
      lazy
      first={first}
      onPage={navObj?.CHILD_MODULE !== 'Exploded Rules' ? onPage : pageChangeExplod}
      // sortField={sortField}
      // sortOrder={sortOrder}
      {...(navObj?.CHILD_MODULE !== 'Exploded Rules' && {
        sortField,
        sortOrder,
      })}
    >
      {/* Conditionally render an expander column */}
      {(!props?.storeView && childAccordion) && <Column expander={childAccordion} style={{ width: '3em' }} frozen />}

      {
      updateByColumn ? props?.selectionMode && localProducts.length !== 0 && (copyRecord || activeLabel !== "" && activeLabel !== "Create") && (
        <Column 
         selectionMode={props?.selectionMode} frozen />
      ) : props?.selectionMode && localProducts.length !== 0 && (updateByColumn || copyRecord || activeLabel !== "" && activeLabel !== "Create") && (navObj?.CHILD_MODULE !== 'Item Summary') && (
        <Column  selectionMode={props?.selectionMode} frozen />
      )
      }

      {/* Render a message when there are no local products in Item Summary */}
      {/* {((localProducts.length === 0 && isItemSummary) || (localProducts.length === 0 && isExplodedRule)) ? (
      <Column
        body={() => <div style={{ textAlign: "center", fontWeight: "bold" }}>{msg}</div>}
        style={{ textAlign: "center", width: "100%" }}
      />
    ) : (
      columns.map(renderColumn)
    )} */}
      {
      
      // (((localProducts.length === 0 || props?.data?.length === 0) && chips?.length === 0) && (isItemSummary || (isExplodedRule && !props?.storeView))) ? (
      //   <Column
      //     body={() => (
      //       <div style={{ textAlign: "center", fontWeight: "bold" }}>
      //         {msg}
      //       </div>
      //     )}
      //     style={{ textAlign: "center", width: "100%" }} />
      // ) : 
      
      
      // (props?.data?.length === 0 && props?.columns?.length === 0 && localProducts.length === 0 && chips?.length === 0) ? (
      //   <Column
      //     body={() => (
      //       <div style={{ textAlign: "center", fontWeight: "bold" }}>
      //         Loading...
      //       </div>
      //     )}
      //     style={{ textAlign: "center", width: "100%" }} />
      // ) : (localProducts.length === 0 && !isItemSummary && !isExplodedRule && props?.columns?.length === 0) ? (
      //   <Column
      //     body={() => (
      //       <div style={{ textAlign: "center", fontWeight: "bold" }}>
      //         No Data Found
      //       </div>
      //     )}
      //     style={{ textAlign: "center", width: "100%" }} />
      // ) : 
      
      (
        gridColumns?.map(renderColumn)
      )}

      {/* Render actions for "Customer Groups" */}
      {navObj?.CHILD_MODULE === "Customer Groups" && products.some(i => i.isNewRecord) && (
        <Column
          header="Actions"
          body={(rowData, { rowIndex }) => rowData?.isNewRecord ? (
            <div className='d-flex gap-2'>
              <i className="pi pi-times pointer text-danger f-20" onClick={() => clearInlineData(rowIndex)}></i>
              <i className="pi pi-trash pointer text-danger f-20" onClick={() => removeRecord(rowIndex)}></i>
            </div>
          ) : null}
          style={{ textAlign: 'center', width: '5em' }} />
      )}
    </DataTable><>
   
      </></>
 
  );
};
  return (
    <div className="card">
          <Toast ref={toast}></Toast>
      <div className="selectFilters pb-0 mb-1">
        {!props?.smartSearchOff ? 
        <>
        {/* {props?.subMenu === 'Screen Features' && 
          <div className='d-flex align-items-center ps-2'>
                        <div className='me-3'>
                          <div style={{fontFamily:"Inter"}}>Division Code <span className='error-message'>*</span></div>
                            <TextField  variant="outlined" size='small' className='division-dd-css'
                             disabled={props?.divisionFlag !=="createDivision" ? true : false}
                             placeholder='Division Code'
                            value={props?.divisionCode} onChange={(e)=>props?.handleDivisionChange(e?.target?.value,"divisionCode")}/>
                        <p>{props?.formErrors.divisionCodeError && <span className="error-message p-invalid autoWidth">Division code is required</span>}</p>

                        </div>
                        <div className='me-3'>
                          <div style={{fontFamily:"Inter"}}>Division Name <span className='error-message'>*</span></div>
                            
                        <Dropdown value={props?.divisionName} onChange={(e)=>props?.handleDivisionChange(e?.target?.value,"divisionName")} options={props?.insertFields} optionLabel="name" optionValue="name"
                               disabled={props?.divisionFlag !=="createDivision" ? true : false} placeholder="Status" />
                        <p>{props?.formErrors.divisionNameError && <span className="error-message">Division name is required</span>}</p>

                        </div>
                        
                        {props?.editableFields === true &&
                        <div className='me-3 '>
                    <div style={{fontFamily:"Inter"}}>Screen Menu Name <span className='error-message'>*</span></div>
                            <TextField  variant="outlined" size='small' className='division-dd-css'
                            placeholder='Screen Menu Name'
                            // disabled={props?.divisionFlag ==="editDivision" ? true : false}
                            value={props?.fileName} onChange={(e)=>props?.fileNameChange(e?.target?.value)}/>
                      <p>{props?.formErrors.screenMenuNameError && <span className="error-message">Screen menu name is required</span>}</p>

                        </div>
                        }
                      
               {props?.editableFields=== true  &&
                  <div>
                     <div>
                      <div style={{fontFamily:"Inter"}}>Select Role <span className='error-message'>*</span></div>
                      <div>
                        <MultiSelect
                        value={updatedRoleOptions}
                         options={props?.rolesList? props?.rolesList : []}
                          optionLabel="name"
                                placeholder="Select Role"
                                display="chip"
                        onChange={(e)=>props?.handleRoleChange(e)}
                        />
                  <p>{props?.formErrors.divisionRoleError && <span className="error-message">At least one role must be selected</span>}</p>

                      </div>
                      </div>
                  </div>
                }
                    </div>
        } */}
 {
                              (() => {
                              const filtered = filteredGridOptions.filter(opt => opt.key !== 'edit');
                              if (props?.enableCrud !== false && filtered.length > 0) {
                                return (
                                <div className="hamburger">
                                  <div>
                                  <TieredMenu
                                    model={filtered}
                                    popup
                                    ref={menu}
                                    id="popup_menu"
                                  />
                                  </div>
                                  <div className="d-flex justify-content-center">
                                  <img
                                    className="ps-2 pe-2 pt-1 pointer"
                                    src={hambergMenu}
                                    alt=""
                                    onClick={toggleMenu}
                                  />
                                  </div>
                                </div>
                                );
                              }
                              return '';
                              })()
                            }

    
        {props?.crudEnabled === true ? "" : 
          <SmartSearch scrollRef={scrollRef} handleChipClick={handleChipClick} showSmartSearch={showSmartSearch} filterRules={filterRules} handleInputClick={handleInputClick}
            handleFieldChange={handleFieldChange} loading={loading} dateCalendar={dateCalendar} handleDateSearch={handleDateSearch}
          handleTypeChange={handleTypeChange} filterConditions={filterConditions} isDateenabled={isDateenabled}
          suggestions={suggestions} handleUserInputValueChange={handleUserInputValueChange} addFilterObject={addFilterObject}
          logicalhandleChange={logicalhandleChange} logicalConditions={logicalConditions} handleUserDateValueChange={handleUserDateValueChange}
          deleteFilterObject={deleteFilterObject}  productColumns={props?.filterCols} isFilterComplete={isFilterComplete}
          chips={chips} removeChip={removeChip} changeView={updateView} handleLogicalConditionChange={handleLogicalConditionChange} showAddFilter={showAddFilter}
    search={search} handleCheckboxChange={handleCheckboxChange} appendSuggestion={appendSuggestion} autoCompleteRef={autoCompleteRef} isContainsEnabled={isContainsEnabled}
    handleTextValue={handleTextValue} isBetweenEnabled={isBetweenEnabled} handleBetweenValues={handleBetweenValues} filteredGridOptions={filteredGridOptions}/>
    }
           
        <div className={chips?.length > 0 ? 'globalSearch mt-1 pt-4' : 'globalSearch mt-1'}>
      
        {navObj?.PARENT_MODULE !=="settings" && navObj?.PARENT_MODULE !=="valueMap" && navObj?.CHILD_MODULE !=="Item Details - Customer Item Details" &&  navObj?.CHILD_MODULE !=="Item Details - C&S Warehouse Details" && navObj?.CHILD_MODULE !=="Item Details - Mod/Shipper Details" &&  navObj?.CHILD_MODULE !=="Dea" && navObj?.CHILD_MODULE !=="Item Details - Tobacco Details" &&
        !props?.visibleStorePopup && Object.keys(permissionObj)?.length > 0  && permissionObj?.viewsWithFilters &&
        <div className='colSave'>
        <Button className='primary-button fix-button' disabled={(products.length > 0) &&  ((selectedView?.VISIBILITY !== '1' && selectedView?.VISIBILITY !== '3') || Object?.keys(selectedView).length === 0 ) ? false : true}  onClick={saveColumnViews} title="Save Column Width">Save Col Width</Button>
        </div>
        }
        {/* {navObj?.PARENT_MODULE ==="settings" &&
         <InputText
          style={{ width: "100%"}}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
          } */}
       {/**  @remarks Group column drodown @author Amar*/}
       {props?.globalViews === true || !permissionObj?.viewsWithFilters ? "" : <div>
          {savedColumnOrders()}
            
        </div>}
        
        {/* {saveButton &&
          <Button className='primary' onClick={saveRecord}>Save</Button>
        }  */}
          {/** @remarks save Icon Division @author Amar*/}    
          {props?.showSaveIcon ?   
          <img src={saveGridIcon} alt='group' className='pointer me-1' width={28} height={28} onClick={openColumnsGrouping}/>
          :''}
        </div>
        </>
        : ""}
       {!('hideButtons' in props) && (
          <div className="ms-1 d-flex flex-wrap justify-content-end">
            <Crudlabels saveBulkUpload={saveBulkUpload}  activeLabel={activeLabel} showMultiCreate={showMultiCreate} showMultiEdit={showMultiEdit}  deleteRecords={deleteRecords} selectedProducts={selectedProducts} navObj={navObj}
            updateByColumn={updateByColumn} copyRecord={copyRecord} copyAndCreate={copyAndCreate} clearGridOptions={clearGridOptions}/>
          </div>
        )}
      </div>
              {activeLabel === "BulkUpdateByColumn" ?
              <>
              {navObj?.PARENT_MODULE !== 'valueMap' ?
              <div className='d-flex gap-3 align-items-center mt-2 ms-2'>
                <div className='d-flex align-items-center ms-2' style={{fontWeight:"500"}}>
                  <p className='m-0'>Update By Column</p>
                </div>
                <div>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                 <InputLabel>Columns</InputLabel>
             <Select
  value={props?.upDateFields?.find(item => item?.field === columnRecord?.columnSelected) || ''}
  label="Columns"
  onChange={handleColumnChange}
>
  {props?.upDateFields?.map((item) => (
    <MenuItem key={item.field} value={item}>
      {item.header}
    </MenuItem>
  ))}
</Select>

                    </FormControl>
                </div>
                      <div className='d-flex flex-row '>
                          { upType === "list" &&
                          <FormControl sx={{ minWidth: 240 }} size="small">
                          <Select value={columnRecord?.columnValue} label="Fields"onChange={(e) => handleValueChange(e?.target?.value)}>
                        {statusField?.map((item) => (
                          <MenuItem key={item.name} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                        </FormControl>}
{upType ==="Autocomplete" &&
                         <AutoComplete
                               value={columnRecord?.columnValue}
                              suggestions={filteredSuggestions}
                              completeMethod={(e) => fetchAutoSuggestions(e.query)}
                            onChange={(e) => handleChangeAutoComplete(e?.value)}
                              field="name"
                              placeholder="Start typing..."
                            />}
{upType ==="Date" &&
                          <Calendar
                       defaultValue={columnRecord?.columnValue}
                     className='datePick vmDate' 
                     onChange={(e) => handleValueChangeVM(e?.value)}
                    showIcon
                    />}

  {upType === "decimal" &&
    <InputText type="number" value={columnRecord?.columnValue} onChange={(e) => handleValueChange(e?.target?.value)} step="0.1" min="0.00" />}
                      </div>
                      <div>
                      <Button className='primary-button' disabled={selectedProducts.length === 0 ? true : false} onClick={(e) =>updateByColumnValue(e)}>Update</Button>
                      </div>
                    <Button className='primary-button' onClick={()=>clearGridOptions()}>Cancel</Button>

              </div> 

:  <div className='d-flex gap-3 align-items-center mt-2 ms-2'>
                <div className='d-flex align-items-center ms-2' style={{fontWeight:"500"}}>
                  <p className='m-0'>Update By Column</p>
                </div>
                <div>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                 <InputLabel>Columns</InputLabel>
                <Select
                  value={props.columns.find(item => item.field === columnRecord?.columnSelected) || ''}
                  label="Columns"
                  onChange={handleColumnChangeVM}
                >
                  {props?.columns?.map((item) => (
                    <MenuItem key={item.field} value={item}>
                      {item.header}
                    </MenuItem>
                  ))}
             </Select>
                    </FormControl>
                    {vmColumnType === 'TEXT' && <InputText  type='text'
                     value={columnRecord?.columnValue}
                     onChange={(e) => handleValueChange(e?.target?.value)} className='txtUPDVal'/> }  
                      {vmColumnType === 'DATE' && <Calendar
                       defaultValue={columnRecord?.columnValue}
                     className='datePick vmDate' 
                     onChange={(e) => handleValueChangeVM(e?.value)}
                    showIcon showButtonBar
                    /> } 
                        {vmColumnType === 'NUMBER' &&  <InputText type="number" className='txtUPDVal'value={columnRecord?.columnValue}
                     onChange={(e) => handleValueChange(e?.target?.value)}/> }
                </div>
                      <div>
                      <Button className='primary-button' disabled={selectedProducts.length === 0 ? true : false} onClick={(e) =>updateByColumnValue(e)}>Update</Button>
                      </div>
                    <Button className='primary-button' onClick={()=>clearGridOptions()}>Cancel</Button>

              </div> }
              </>             
               :<></>}
      
      <div ref={wrapperRef}>
      
      {localProducts?.length > 0  || (navObj.CHILD_MODULE === 'Exploded Rules' && productColumns?.length > 0) || (localProducts?.length === 0 && productColumns?.length > 0) ? (
      <DataTableContent />
    ) : (
      <DatatableLoader paginator={props?.paginator}/>
    )}
</div>

{(activeLabel === "Edit" ) && (
  <BulkCreate 
    productColumns={productColumns} 
    createBulkRecord={props?.editBulkRecord}  
    insertFields={props?.insertFields} 
    addMultiCreate={addMultiCreate} 
    multiRecord={multiRecord} 
    addRecordsToTable={addRecordsToTable}
    handleInputChange={handleInputChange} 
    formData={formData} 
    multiEdit={activeLabel} 
    closeMultiCreate={closeMultiEdit} 
    openForm={openForm}
  />
)}

{(activeLabel === "Create" || openForm === "CopyAndCreate" ) && (
  <BulkCreate 
    productColumns={productColumns} 
    createBulkRecord={props?.createBulkRecord}  
    insertFields={props?.insertFields} 
    addMultiCreate={addMultiCreate} 
    multiRecord={multiRecord} 
    addRecordsToTable={addRecordsToTable}
    handleInputChange={handleInputChange} 
    formData={formData} 
    multiCreate={activeLabel}
    copiedRecords={copiedRecords} 
    closeMultiCreate={closeMultiCreate} 
  />
)}
      {showColumnsList && 
        <div className="multiCreateForm  m-1 p-1">
<DialogBox header='Column Selection' content={formatColumnGrouping()} style={{width:'40vw'}} onHide={openColumnsGrouping}/>
</div>
   }
    </div>
  );
  
})
export default PrimeDataTable;