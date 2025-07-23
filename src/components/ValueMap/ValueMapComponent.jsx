import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import {  plusIcon, plusOutLineIcon, valueMapIcon,  configValuemap, download, status} from '../../assests/icons';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import PrimeDataTable from '../Shared/DataTable/DataTableComponent';
import DialogBox from '../Shared/Dialog-Box/DialogBox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'antd';
import { TieredMenu } from 'primereact/tieredmenu';
import ValueMapManualCreateComponent from './ValueMapManualCreateComponent';
import BrowseComponent from '../Shared/Browse/browse';
import {DivisionComponent} from '../Shared/Division';
import { useGetValueMapCodesMutation, useGetValueMapDataMutation, useGetValueMapDefMutation, useSaveValueMapDataMutation } from '../../services/valueMapSetup';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { changeSubModule } from '../../slices/navigation';
import { bulkCreateResponse, bulkEditResponse, clearDeleteRecordsData } from '../../slices/columnSelection';
import { ConfirmDialog } from 'primereact/confirmdialog';
import StatusComponent from '../Shared/Status/Status';
import { useExcelDownloadMutation } from '../../services/customersSetup';
import { duration } from '@mui/material';
import { height } from '@mui/system';

const ValueMapComponent = () => {
  const [valueMap, setValueMap] = useState({});
  const [showContent, setShowContent] = useState(true);
  const [configPopup, setConfigPopup] = useState(false);
  const [clausePopup, setClausePopup] = useState(false);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [isCheckBoxChecked,setCheckboxChecked] = useState(false);
  const [filterString,setFilterString]=useState('');
  const [defData,setDefData]=useState([]);
  const [defColumns,setDefColumns]=useState([]);
  const [insertFields,setInsertFields]=useState([]);
  const [selectedCode,setSelectedCode]=useState(null);
  const [filterCols,setFilterCols] = useState([]);   
  const [manualCreatePopup,setManualCreatePopup]=useState(false);
  const [browseFilePopup,setBrowseFilePopup]=useState(false);
  const [valueMapCodes,setValueMapCodes]=useState(false);
  const [getValueMapsCodes,{}] = useGetValueMapCodesMutation();  
  const [getValueMapDef,{dataCodesDef,isSuccessDef,isLoadingDef,isFetchingDef,errorDef}] = useGetValueMapDefMutation();  
  const [getValueMapData,{}] = useGetValueMapDataMutation();  
  const [saveVMData, {}] = useSaveValueMapDataMutation();
  const toast = useRef(null);
  const [headerText,setHeaderText]= useState("")
  const [totalRecords,setTotalRecords] = useState('');
  const [loader,setLoader] = useState(false);
  const [loaderDwl,setLoaderDwl] = useState(false); 
  const bulkDelData = useSelector((state)=>state?.columnSelection?.bulkDeleteRecords)
  const [delRecords,setDelRecords]= useState();
  const [showDeletePopup,setShowDeletePopup]= useState(false);
  const [delMessage, setDelMessage] = useState();
  const navObj = useSelector((state) => state.navigation);
  const userObject = useSelector(state => state?.user?.userData);
  const isAdmin = userObject?.[0]?.divisionData?.[0]?.ROLE?.join("") === 'IS Admin' || 
                    userObject?.[0]?.divisionData?.[0]?.ROLE?.join("") === 'Admin';
  const dispatch = useDispatch();
  const [statusPopup, setStatusPopup] = useState(false);
  const division = useSelector((state) => state.division);
  const [permissionsObj,setPermissionsObj] = useState({}); 
  const [bulkRecords,setBulkRecords]= useState([]);
  const [bulkEditRecords,setBulkEditRecords] = useState([])
  const bulkData = useSelector((state)=>state?.columnSelection?.bulkRecord)
  const bulkEdit = useSelector((state)=>state?.columnSelection?.bulkEdit)
  /** @remarks Useeffect to store permissions data */
       useEffect(() => {
          if(navObj.PARENT_MODULE && navObj.CHILD_MODULE && division){     
            let permissions = division?.SCREENDATA?.find((i)=> i?.screens === navObj.CHILD_MODULE)
            if(permissions){
              setPermissionsObj(permissions);
            }
          }
          }, [navObj.PARENT_MODULE && navObj.CHILD_MODULE]);
  /** @remarks Useeffect to call Value map codes */
   useEffect(() => {
    fetchValueMapCodes();
    dispatch(changeSubModule({subModule:'Value Maps'}));
  },[])
    /** @remarks Function to call Value map codes */
  const fetchValueMapCodes = async() =>{
    const body = {
    "requestMethod": "getMapCodes",
    "searchParams": {  
    },
    "pagination": {
        "pageNumber": 1,
        "pageSize": 15
    }
  }
    try {
        let res=await getValueMapsCodes(body).unwrap();
      setValueMapCodes(res?.result_set);
    } catch (e) { }
  }
  /** headers columns for value map config table*/
  const configColumns = [
    { field: 'sequence', header: 'Sequence' },
    { field: 'column', header: 'Column' },
    { field: 'columnPrompt', header: 'Column Prompt' },
    { field: 'type', header: 'Type' },
    { field: 'view', header: 'View' },
    { field: 'update', header: 'Update' },
    // Add more columns as needed
  ];

  /** this array use for value map config data table*/
  const configData = [
    { sequence: '7', column: 'N_VALUE', columnPrompt: 'Format Number', type: 'Char', view: true, update: true },
    { sequence: '2', column: 'N_VALUE', columnPrompt: 'File Name', type: 'Char', view: true, update: true },
    { sequence: '5', column: 'N_VALUE', columnPrompt: 'Period Start Date', type: 'Char', view: true, update: true },
    { sequence: '10', column: 'N_VALUE', columnPrompt: 'Block Size', type: 'Char', view: true, update: true },
    { sequence: '3', column: 'N_VALUE', columnPrompt: 'Customer Name', type: 'Char', view: true, update: true },
    { sequence: '6', column: 'N_VALUE', columnPrompt: 'Period End Date', type: 'Char', view: true, update: true },
    { sequence: '4', column: 'N_VALUE', columnPrompt: 'Reclaim Group Number', type: 'Char', view: true, update: true },
    { sequence: '1', column: 'N_VALUE', columnPrompt: 'Rice ID', type: 'Char', view: true, update: true },
    { sequence: '8', column: 'N_VALUE', columnPrompt: 'Original File Name', type: 'Char', view: true, update: true },
    { sequence: '9', column: 'N_VALUE', columnPrompt: 'Customer File Name', type: 'Char', view: true, update: true },
    { sequence: '11', column: 'N_VALUE', columnPrompt: 'Zip Required', type: 'Char', view: true, update: true },
    { sequence: '12', column: 'N_VALUE', columnPrompt: 'File Type', type: 'Char', view: true, update: true },

  ];
  /** this searchValueMap show the grid after select the value map option */
  const searchValueMap = (e) => {
  sessionStorage.setItem('valueMap', selectedCode)
   if(selectedCode === null || selectedCode === undefined){
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select value map',
    });
   }
   else{
    fetchValueMapDef(selectedCode);
   }
  }
  const [valueMapPayLoad,setValueMapPayLoad] = useState({
    "requestMethod": "getMapCodes",
    "searchParams": {
        "map_code": selectedCode
    },
    "pagination": {
        "pageNumber": 1,
        "pageSize": 15
    }
  })
    /** @remarks Function to get VM defs */
  const fetchValueMapDef = async(data) =>{
       setShowContent(!showContent);
    setLoader(true);
    const body = {  
      "searchParams": {
          "map_code": data
      },
      "pagination": {
          "pageNumber": 0,
          "pageSize": 15
      }
  }
    try {
        let res=await getValueMapDef(body).unwrap();
      if(res?.res_status){
           setShowContent(!showContent);
        resetGrid();
        // if(res?.resultSet?.length === 0){
        //   setShowContent(true);
        //   setLoader(false);
        //   toast.current.show({
        //     severity: 'info',
        //     summary: 'Info',
        //     detail: 'No data found for this value map',
        //   });

        // }else {
       
         let fields = res?.insert_fields?.map((i) =>{
            return {...i, visibility: true, create: i.header === 'id' ? false: true,field: i?.header, colName: i?.field}
        });
        const hasView = fields?.some((s) => s.view === true);
        if(hasView){
          setLoader(false);
        setShowContent(false);
       
        const filteredData = res?.columns?.filter(item => item.filter);
        setFilterCols(filteredData);
        setDefData(res?.resultSet);
         let cols = res?.columns?.map((i) =>{
          return {...i, field: i?.header}
        })
      
       
        let finalCols = cols?.filter(item => item.view);
        setDefColumns(finalCols);
          setInsertFields(fields)
        setTotalRecords(res?.totalRecords);
        }else {
          setShowContent(true);
          setLoader(false);
          toast.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Please select the view checkbox for atleast one column to display the value map.',
            duration:3000
          });
        }
       
    
      //  }
      
      }
   else {
     setShowContent(true);
          setLoader(false);
          toast.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'No data found for this value map',
          });
 }
    } catch (e) {
      setLoader(false);
        setShowContent(true);
    }
  }
  /** @remarks Useeffect to store insert records */
  useEffect(() => {
    if (bulkData) {
        setBulkRecords(bulkData);       
    }
}, [bulkData]);
/** @remarks Useeffect to store edited records */
useEffect(()=>{
  if (bulkEdit.length > 0) {
    setBulkEditRecords(bulkEdit)
  }
},[bulkEdit])
/** @remarks Function to Create records */
  const createBulkRecord = async() => {
    let mapId = valueMapCodes?.find((i)=>
      i?.mapCode === selectedCode
    )
  let values = [];
  if(bulkRecords.length === 0){
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'please add data',
    });
  } else {
    values = insertFields.map(field => (
      bulkRecords.map((s)=>{
       return {
          key: field.header,
          edit: field.edit ? "Y" : "N", 
          show: field.visibility ? "Y" : "N", 
          columnName: field.colName, 
          value: s[field.field] || ""
        }
      })
  ));
  const outputArray = values[0].map((item, i) => {
    return {
      id: "",
      values: values.map(subItem => ({
        ...subItem[i],
      })),
    };
  });
    const bulkCreatePayload = {
      mapDefId: mapId?.mapDefId,
      "opType": "ADD",
      "requestMethod": "saveVMData",
      "actionObject": outputArray
    }
    let res = await saveVMData(bulkCreatePayload)
    if(res?.data?.res_status){
      dispatch(bulkCreateResponse(res?.data?.res_status))
      fetchValueMapDef(selectedCode);
    }
  }
}
/** @remarks Function to update records */
const editBulkRecord = async(data)=>{
  let mapId;
  let outputArray
  if(data?.length > 0){
    let values = [];
     mapId = valueMapCodes?.find((i)=>
      i?.mapCode === selectedCode
    )
    values = insertFields.map(field => (
     data?.map((s)=>{
       return {
          key: field.header,
          edit: field.edit ? "Y" : "N", 
          show: field.visibility ? "Y" : "N", 
          columnName: field.colName, 
          value: s[field.field] || "",
          id:s.id
        }
      })
    ));
     outputArray = values[0].map((item, i) => {
    return {
      id: item.id,
      values: values.map(subItem => ({
        ...subItem[i],
      })),
    };
    });
    outputArray = outputArray.map((item)=>{
      item?.values?.map((sub)=>{
        delete sub.id
      })
      return item
    })
  }
else{
  let values = [];
 mapId = valueMapCodes?.find((i)=>
  i?.mapCode === selectedCode
)
values = insertFields.map(field => (
 bulkEditRecords.map((s)=>{
   return {
      key: field.header,
      edit: field.edit ? "Y" : "N", 
      show: field.visibility ? "Y" : "N", 
      columnName: field.colName, 
      value: s[field.field] || "",
      id:s.id
    }
  })
));
 outputArray = values[0].map((item, i) => {
return {
  id: item.id,
  values: values.map(subItem => ({
    ...subItem[i],
  })),
};
});
}
outputArray = outputArray.map((item)=>{
  item?.values?.map((sub)=>{
    delete sub.id
  })
  return item
})
const payload={
  "mapDefId": mapId?.mapDefId,
  "opType": "UPD",
  "requestMethod": "saveVMData",
  "actionObject": outputArray
}
let res = await saveVMData(payload)
if(res?.data?.res_status){
  dispatch(bulkEditResponse(true))
  fetchValueMapDef(selectedCode);
}
else{
  dispatch(bulkEditResponse(true))
}
}
/** @remarks Useeffect to store deleted records */
useEffect(() => {
  if (bulkDelData?.length > 0) {
    const ids = bulkDelData?.map((e)=>{
      return e?.id
    })
    setDelMessage('Are you sure you want to delete the selected records?');
    const stringIds = ids.map(String);
    setDelRecords(stringIds)
    setShowDeletePopup(!showDeletePopup)
  }
}, [bulkDelData?.length > 0]);
/** @remarks Function to open delete popup */
const hideDeletePopup =() =>{
setShowDeletePopup(false);
dispatch(clearDeleteRecordsData([]));
}
/** @remarks Function to delete records */
const handleDeleteRecords = async ()=>{
  let mapId = valueMapCodes?.find((i)=>
    i?.mapCode === selectedCode
  )
  const body = {
    "mapDefId": mapId?.mapDefId,
  "opType": "DEL",
  "requestMethod": "saveVMData",
  "actionObject": [{
    "id" : delRecords,
    "values": [] 
  }]
}
  try {
      let res = await saveVMData(body).unwrap();
      console.log(res)
      if(res?.res_status){
        fetchValueMapDef(selectedCode);
        dispatch(clearDeleteRecordsData([]));
        dispatch(bulkCreateResponse(true))
      }  
  } catch (e) {}
}
const handleChangeMapCode = (e) =>{
  setSelectedCode(e);
}
/** @remarks Function to edit VM data */
const handleEdit = () =>{
  setHeaderText("Edit Definition")
  if(selectedCode === null || selectedCode === undefined){
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select value map',
    });
  }
  else{
    fetchValueMapData(selectedCode)
  }
}
/** @remarks Function to Update VM data */
  const fetchValueMapData = async(data) =>{
    const body = {
      "requestMethod": "getMapCodes",
      "searchParams": {
          "map_code": data
      },
      "pagination": {
          "pageNumber": 1,
          "pageSize": 15
      }
  }
    try {
        let res=await getValueMapData(body).unwrap();
      if(res?.res_status){  
        setValueMap(res?.result_set);
        openMapConfig();
      }
   else {
    setLoader(false);
   }
    } catch (e) {
      setLoader(false);
        setShowContent(true);
    }
  }
  /** @remarks Function for pagination */
  const pageChange = (params) =>{
    valueMapPayLoad.pagination = params;
    const updatedPayLoad = {
      ...valueMapPayLoad,
      searchParams: {
        map_code: selectedCode
      },
    };
     resetGrid();
  //  setShowContent(!showContent);
    fetchValueMapDefPagination(updatedPayLoad);
  }
  
  /** @remarks Function to get Value map def data */
  const fetchValueMapDefPagination = async(data) =>{
    try {
        let res=await getValueMapDef(data).unwrap();
      if(res?.res_status){
        //   setShowContent(!showContent);
       
        // setDefData([]);
        // setFilterCols([]);
        setLoader(false);
        setShowContent(false);
        const filteredData = res?.columns?.filter(item => item.filter);
        setFilterCols(filteredData);
        setDefData(res?.resultSet);
        const cols = res?.columns?.map((i) =>{
          return {...i, field: i?.header}
        })
        const finalCols = cols?.filter(item => item.view);
        setDefColumns(finalCols);
        let fields = res?.insert_fields?.map((i) =>{
            return {...i, visibility: true, create: i.header === 'id' ? false: true,field: i?.header, colName: i?.field}
        })
    
        setInsertFields(fields)
        setTotalRecords(res?.totalRecords);
      }
   else {
    setLoader(false);
   }
    } catch (e) {
      setLoader(false);
      setShowContent(true);
    }
  }
  /**
@remarks
Function to handle the filter string
@author Shankar Anupoju
   */
const generateFilterString = (conditions) => {
  const filterString = [];
  let currentGroup = [];
  let currentGrouping = null;
  let previousGrouping = null;
  conditions.forEach((condition, index) => {
    if (condition.grouping !== currentGrouping) {
      if (currentGroup.length > 0) {
        filterString.push(`(${currentGroup.join(" ")})`);
      }
      currentGroup = [];
      currentGrouping = condition.grouping;
      if (previousGrouping !== null && previousGrouping !== currentGrouping) {
        filterString.push(` ${condition.operand.toUpperCase()} `);
      }
      previousGrouping = currentGrouping;
    }
    const formattedValue = condition.operator.toLowerCase() === "like" ? `'%${condition.value}%'` : `'${condition.value}'`;
    if (currentGroup.length > 0) {
      currentGroup.push(condition.operand.toUpperCase());
    }
    currentGroup.push(`${condition.field} ${condition.operator} ${formattedValue}`);
    const nextCondition = conditions[index + 1];
    if (!nextCondition || nextCondition.grouping !== currentGrouping) {
      filterString.push(`(${currentGroup.join(" ")})`);
      currentGroup = [];
    }
  });
  return filterString.join("");
};
  /*** clause operations start */
  const [clauses, setClauses] = useState([
    { operand: '', field: '', operator: '', value: '', grouping: '0' ,selected:false}
  ]);
  const handleChange = (index, field, value) => {
    const newClauses = [...clauses];
    newClauses[index][field] = value;
    updateClauses(newClauses)
  };
  const addClause = () => {
    setClauses([
      ...clauses,
      { operand: 'AND', field: '', operator: '', value: '', grouping: '0',selected:false },
    ]);
  };
  const removeClause = (index,type) => {
    let newClauses = [];
    if(type === 'single'){
      newClauses = clauses.filter((_, i) => i !== index);
    }else {
      newClauses = clauses.filter((item, i) => item?.selected === false);
      setIsHeaderChecked(false);
      setCheckboxChecked(false);
    }
    updateClauses(newClauses);
  };
  const handleCheckboxChange = (index) => {
    const newClauses = [...clauses];
    newClauses[index].selected = !newClauses[index].selected;
    updateClauses(newClauses);
    const checkState = checkAnyOneChecked(newClauses);
    const checkAllChecked = newClauses.every((item) => item?.selected === true);
    setIsHeaderChecked(checkAllChecked)
    setCheckboxChecked(checkState);
  };
  const checkAnyOneChecked = (newClauses) =>{
    const newState = newClauses.some((item) => item?.selected === true);
    return newState;
  }
  const operandOptions = [
    { name: 'AND', value: 'and' },
    { name: 'OR', value: 'or' }
  ];
  const fieldColumnsList = [
    { name: 'Format Number', value: 'formatNumber' ,aliasName:'C_VALUE1'},
    { name: 'Period Start Date', value: 'periodStartDate',aliasName:'C_VALUE2' }
  ];
  const operatorList = [
    { name: 'Greater Than', value: '>' },
    { name: 'Equal To', value: '=' },
    { name: 'Less Than', value: '<' },
    { name: 'Not Equal To', value: '<>' },
    { name: 'Like', value: 'Like' }
  ];
  const groupingList = [
    { name: '0', value: 0 },
    { name: '1', value: 1 }
  ]
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
  const updateClauses = (clauses) =>{
    setClauses(clauses);
    const filterString = generateFilterString(clauses);
    setFilterString(filterString);
  }
  /*** this method show the content of Map Config */
  const openMapConfig = () => {
    setManualCreatePopup(true);
  };
  /*** this method use close the popup screen */
  const closeDialog = () => {
    setConfigPopup(false)
    setClausePopup(false)
    setManualCreatePopup(false)
    setBrowseFilePopup(false);
    fetchValueMapCodes();
  }
  const closeDialogManual = (key) => {
    setManualCreatePopup(false)
    if(key === 'Success'){
      fetchValueMapCodes();
      // toast.current.show({
      //   severity: 'info',
      //   summary: 'Succes',
      //   detail: 'Success',
      // });
    }
    if(key === 'Upd'){
      searchValueMap()
      // toast.current.show({
      //   severity: 'info',
      //   summary: 'Succes',
      //   detail: 'Success',
      // });
    }
  }
  /*** this is use for popup footer for map config */
  const footerEditContent = (
    <div className='d-flex justify-content-center gap-2'>
      <button className="secondary-button" onClick={closeDialog}>Cancel</button>
      <button className="primary-button">Save</button>
    </div>
  );
/* Function to Reset fields */
  const resetPage = () =>{
    setClauses([]);
    setFilterString('')
  }
  const resetGrid =() =>{
    setDefColumns([]);
    setDefData([]);
    setInsertFields([]);
    setTotalRecords(0);
    setFilterCols([]);
  }
  /*** this is use for popup footer for clause config */
  const footerClauseContent = (
    <div className='d-flex justify-content-center gap-2'>
      <button className="secondary-button" onClick={closeDialog}>Cancel</button>
      <button className="border-button" onClick={resetPage}>Reset</button>
      <button className="primary-button">Set Where</button>
    </div>
  );
  /*** show the grid for map config data */
  const editConfig = () => {
    return (
      <div>
        <PrimeDataTable columns={configColumns} data={configData} smartSearchOff={true} paginator={false} />
      </div>
    )
  }
  /*** this.ediClause use for content of clause html start */
  const editClause = () => {
    return (
      <div>
        <div className='row m-0' style={{ overflow: 'scroll' }}>
          <div className='d-flex justify-content-end pb-2'>
            <img src={plusIcon} alt="add" className='pointer' width={22} height={22} onClick={addClause} /> {(
            isCheckBoxChecked && 
            <div className='d-flex justify-content-end pb-2' >
            <i className='pi pi-trash f-20' onClick={() => removeClause('','all')} style={{color: 'red', marginLeft: '6px'}}></i>
            </div>
          )}
          </div>
          <table className='custom-clause-table'>
            <tr>
              <th><Checkbox
              checked={isHeaderChecked}
              onChange={handleHeaderCheckboxChange}
            /></th>
              <th>Operand</th>
              <th>Field</th>
              <th>Arithmetic Operator</th>
              <th>Value</th>
              <th>Grouping</th>
              <th></th>
            </tr>
            {clauses.map((clause, index) => (
              <tr key={index}>
                <td><Checkbox
                  checked={clause.selected}
                  onChange={() => handleCheckboxChange(index)}
                /></td>
                <td><Dropdown
                  value={clause.operand}
                  onChange={(e) => handleChange(index, 'operand', e.target.value)}
                  options={operandOptions}
                  disabled={index === 0}
                  optionLabel='name'
                 
                  placeholder='Select'
                  className='w-100'
                  dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
                >
                </Dropdown></td>
                <td>          <Dropdown
                  value={clause.field}
                  onChange={(e) => handleChange(index, 'field', e.target.value)}
                  options={fieldColumnsList}
                  optionLabel='name'
                  placeholder='Select'
                  className='w-100'
                  dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
                >
                </Dropdown></td>
                <td><Dropdown
                  value={clause.operator}
                  onChange={(e) => handleChange(index, 'operator', e.target.value)}
                  options={operatorList}
                  optionLabel='name'
                  placeholder='Select'
                  className='w-100'
                  dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
                >
                </Dropdown></td>
                <td><InputText type="text" className="p-inputtext-sm" value={clause.value} onChange={(e) => handleChange(index, 'value', e.target.value)} /></td>
                <td><Dropdown
                  options={groupingList}
                  optionLabel='name'
                  placeholder='Select'
                  className="w-100"
                  value={clause.grouping}
                  onChange={(e) => handleChange(index, 'grouping', e.target.value)}
                  dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
                ></Dropdown></td>
                {(index > 0 && !isCheckBoxChecked) &&  (
                <td>
                  <i className='pi pi-trash f-16' onClick={() => removeClause(index,'single')} style={{color: 'red'}}></i>
                </td>
                )}
              </tr>
            ))}
          </table>
        </div>
        <div className='row ps-3 pe-3 pt-3'>
          <label className='label p-0'>Where Clause</label>
          <InputTextarea rows={2} cols={30} value={filterString}/>
        </div>
      </div>
    )
  }
   useEffect(()=>{
  if (bulkCreateResponse) {
       setManualCreatePopup(false);
  }
    const body = {
    "requestMethod": "getMapCodes",
    "searchParams": {
        
    },
    "pagination": {
        "pageNumber": 1,
        "pageSize": 15
    }
  }
    getValueMapsCodes(body)
},[bulkCreateResponse])
  /*** this.ediClause use for content of clause html end */
  const menu = useRef(null);
  const items = [
    {
        label: 'Manual',
        icon: 'pi pi-pencil',
    },
]
     /**
    @remarks
    Function to populate value map create options
    @author Amar
    */
  const handleShowOptions = (e) =>{
    menu.current.toggle(e);
  }
    /**
    @remarks Function to open create value map popups @author Amar
    */
  const handleChangeOptions = (e)=>{
      if(e?.target?.innerText === 'Manual'){
        setValueMap({});
        setManualCreatePopup(true);
        setHeaderText("Create Definition")
      }
      else if(e?.target?.innerText === 'Upload'){
        setBrowseFilePopup(true);
      }
  }
      /**
    @remarks Function to show manual value map creation page @author Amar
    */
  const handleOpenManualCreatePage = () => {
    return (
      <div>
        <ValueMapManualCreateComponent rowData={valueMap}  closeDialog={(e) => closeDialogManual(e)} headerText={headerText}/>
      </div>
    )
  }
  const handleBrowseFilePage = ()=>{
    return(
      <BrowseComponent closeDialog={closeDialog}/>
    )
  }
  const openStatusPopup = (value) => {
    setStatusPopup(!statusPopup);
  };
  const onClose = () => {
    setStatusPopup(!statusPopup);
  };
    /**
    @remarks This function to open status page @author Amar
    */
    const openStatusComponent = () => {
      return (<StatusComponent />)
    }
 const [downloadFileVM, { }] = useExcelDownloadMutation();
    const downloadFile = async () => {
      if(selectedCode === null || selectedCode === undefined){
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select value map',
        });
       } else{
        setLoaderDwl(true);
      const payload ={
        "actionObject": {
          "jobName": "VALUE_MAP",
          "templateYN": "N",
          "fileName": "ValueMapDefinition",
          "fileType": "xlsx",
          "searchParams": {
              "sortBy": "",
              "sortorder": "",
              "filterData": "",
        "map_code": selectedCode
          },
          "requestMethod": "downloadFile",
      },
      }
      try {
        let result = await downloadFileVM(payload).unwrap();
        if(result?.res_status){
         // toast.current.show({ severity: 'info',summary: 'Download', detail: 'File requested successfully', life: 3000 });
          setLoaderDwl(false)
        }
        else{
          setLoaderDwl(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Download failed',
          });
        }
      } catch (e) {
         setLoaderDwl(false)
          toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Download failed',
          });
      }
    }
    };
  return (
    <div>
      <div>
        <div className="row">
          <div className="col-2 valueMapTitle">
            <span className='page-title'>Value Map</span>
          </div>
          <div className="col-10">
            <div className='d-flex gap-2 justify-content-end align-items-end'>
              <div className=''>
                <span className='divison'>Division</span>
                <DivisionComponent />
              </div>
              <div className='dropDownCss'>
                <span className="lblValue">Value Map</span>
                <Dropdown
                  filter
                  options={valueMapCodes ? valueMapCodes : []}
                  optionLabel="mapCode"
                  dropdownIcon={PrimeIcons.SORT_DOWN_FILL}
                  style={{ width: '100%', overflow: 'hidden' }}
                  placeholder="Select"
                  value={selectedCode}
                  title={selectedCode}
                  showClear
                  className='me-2'
                  optionValue='mapCode'
                  onChange={(e) => handleChangeMapCode(e?.target?.value)}
                />
              </div>
              <button className='primary-button' onClick={searchValueMap}>
                Search {loader ? <span className="spinner-border spinner-border-sm loaderCss" role="status"></span> : ''}
              </button>
              {isAdmin && (
                <button className='primary-button-create' onClick={handleEdit}>
                  <img src={configValuemap} alt="save" width="20" height="20" className='me-1' />
                  Edit Value Map Def
                </button>
              )}
              {/* <TieredMenu model={items} popup ref={menu} breakpoint="767px"
                onHide={(e) => handleChangeOptions(e)} /> */}
              {isAdmin && (
                <button
                  className='success-button-create'
                  onClick={() => {
                    setValueMap({});
                    setManualCreatePopup(true);
                    setHeaderText("Create Definition");
                  }}
                >
                  <img src={plusOutLineIcon} alt="save" className='me-1' />
                  Create Value Map Def
                </button>
              )}
              {permissionsObj?.excelDownload && (
                <button
                  className='secondary-button dwlBtnVM'
                  disabled={defData.length === 0 || loaderDwl}
                  onClick={() => downloadFile()}
                >
                  <img src={download} alt="download" height={17} width={20} className='me-1' />
                  Download {loaderDwl ? <span className="spinner-border spinner-border-sm loaderCss" role="status"></span> : ''}
                </button>
              )}
              {permissionsObj?.divisionStatus && (
                <button className='primary-button' onClick={(e) => openStatusPopup()}>
                  <img src={status} alt="Status" width={16} className='me-1' />
                  Status
                </button>
              )}
            </div>
          </div>
        </div>
        <Toast ref={toast} />
        {showContent && (
          <div className='text-center valueMapImg'>
            <img src={valueMapIcon} width={400} alt="ValueMap" /><br />
            <span className='title-tag'> Search the <span className='valueMapText'>"Value Map"</span> to view the details</span>
          </div>
        )}
        {!showContent && (
          <div className=' mt-3 p-2'>
            <PrimeDataTable
              columns={defColumns}
              hideSort
              globalViews={true}
              insertFields={insertFields}
              isLoading={isLoadingDef}
              data={defData}
              filterCols={filterCols}
              paginator={true}
              height={43}
              totalRecords={totalRecords}
              pageChange={pageChange}
              selectionMode="multiple"
              createBulkRecord={createBulkRecord}
              editBulkRecord={editBulkRecord}
              crudEnabled={true}
            />
          </div>
        )}
        <div>
          {configPopup &&
            <DialogBox header='Value Map Config' content={editConfig()} style={{ width: '50vw' }} onHide={closeDialog} footer={footerEditContent} />
          }
        </div>
        <div>
          {clausePopup &&
            <DialogBox header='Where Clause' content={editClause()} style={{ width: '50vw' }} onHide={closeDialog} footer={footerClauseContent} />
          }
        </div>
        <div>
          {manualCreatePopup &&
            <DialogBox header={headerText} style={{ width: '70vw', height:'100vh - 290px' }}  content={handleOpenManualCreatePage()} onHide={closeDialog} />
          }
          {browseFilePopup &&
            <DialogBox header='Data Upload' style={{ width: '30vw' }} content={handleBrowseFilePage()} onHide={closeDialog} />
          }
        </div>
        <ConfirmDialog
          visible={showDeletePopup}
          onHide={hideDeletePopup}
          message={delMessage}
        />
      </div>
    </div>
  );
}
export default ValueMapComponent;