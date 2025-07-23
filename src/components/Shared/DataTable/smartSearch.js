import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { AdditionalFiltersComponent } from './additionalFilters';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';

const SmartSearch = (props) => {
  const [selectedValues, setSelectedValues] = useState(Array.isArray(props.f?.userInputValue) ? props.f.userInputValue : []);
  const [filCols, setFilCols] = useState([]);
  const [staticValues, setStaticValues] = useState({});
  const navObj = useSelector((state) => state.navigation);
  const [multiSelectKey, setMultiSelectKey] = useState(0);
  const [filterConditions,setFilterConditions] = useState([]);
  const [selectedColumn,setSelectedColumn] = useState('');
  const [enableMultiSelect, setEnableMultiSelect] = useState(false);
  const [maxLengthList,setMaxLengthList] = useState(['UPC_MFG', 'UPC_CASE', 'UPC_ITEM', 'UPC_UNIT'])  ;
  const [fieldValue,setFieldValue] = useState(null);
  const [freezeColumns,setFreezeColumns] = useState(false);
  const [chipName, setChipName] = useState(null);

  const handleChange = (value, index) => {
    const myList = value;
    let newSelectedValues = [];
    myList.map((item) => {
         newSelectedValues.push( (navObj?.PARENT_MODULE === 'scanSetup' && typeof item.name !== 'number') ? item?.split('-')[0] : item )
    })
    setSelectedValues(value);
    props.appendSuggestion(newSelectedValues, index);
  };
  const handleFilter = (e, index) => {
    props.handleUserInputValueChange(e, index,freezeColumns);
  };
  useEffect(() => {
    
    // let fieldNames = []
    // let filColumns = props?.productColumns;
    // if(props?.chips?.length > 0){
    //   fieldNames = props?.chips?.map((item) => item?.field);
    //   filColumns = updateVisibility(props?.productColumns,props?.chips);
    // }
    // if (fieldNames?.length > 0) {
    //   filColumns = filColumns?.filter(
    //     (item) => !fieldNames.includes(item.field)
    //   )
    // }
    // if (props?.chips?.length > 0) {
      
    //   let selectedChip = props?.chips?.find((item) => item?.userInputValue === 'C&S Vendor');
    //   if (selectedChip) {
    //     filColumns = filColumns?.filter((item) => item.field !== 'CLIENT');
    //   }
    // }
    // setFilCols(filColumns);
    handleCancel();
  }, [props?.productColumns, props?.chips]);

  const handleCancel = (type=null) =>{
    
     let fieldNames = []
    let filColumns = props?.productColumns;
    if(props?.chips?.length > 0){
      fieldNames = props?.chips?.map((item) => item?.field);
      if(chipName !== null && type === null){
        fieldNames.push(chipName);
      }
      filColumns = updateVisibility(props?.productColumns,props?.chips);
    }
    if (fieldNames?.length > 0) {
      filColumns = filColumns?.filter(
        (item) => (item.field === chipName && type === null) || !fieldNames.includes(item.field)
      )
    }
    if (props?.chips?.length > 0) {
      
      let selectedChip = props?.chips?.find((item) => item?.userInputValue === 'C&S Vendor');
      if (selectedChip) {
        filColumns = filColumns?.filter((item) => item.field !== 'CLIENT');
      }
    }
    setFilCols(filColumns);
  }

const updateVisibility = (fields, filters) => {
    
    const updatedFields = fields?.map((field) => {
      // If chipName is not null and matches the current index, do not filter/hide this field
      if (chipName !== null && chipName === field.field) {
      return { ...field, visibility: true };
      }
      const filter = filters.find(f => f.field === field.field);
      if (filter) {
      const valueObject = field.VALUES?.find(v => v.name === filter.userInputValue);
      if (valueObject && valueObject.fieldsToShow) {
        return fields.map(f =>
        valueObject.fieldsToShow.includes(f.field) ? { ...f, visibility: true } : f
        );
      }
      }
      return field;
    });
    let updateFields = updatedFields;
    if (updateFields && Array.isArray(updateFields[0])) {
      updateFields = updateFields[0];
    }
    return updateFields;
  }
  const checkValue = (type)=>{
    if (type === "true") {
         props?.addFilterObject()
    }
  }
  let hasCalledAddFilterObject = false;
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!hasCalledAddFilterObject) {
            hasCalledAddFilterObject = true;
            // Call the addFilterObject function from props
            props?.addFilterObject();
            // Clear selected values and static values
            setSelectedValues([]); 
            setStaticValues([]);
            // Update the multiSelectKey to refresh the component
            setMultiSelectKey((prevKey) => prevKey + 1);
        }
    } else {
        // Reset the flag if any other key is pressed
        hasCalledAddFilterObject = false;
    }
}
useEffect(()=>{
  
const summaryList = ['UPC_MFG','UPC_CASE','UPC_ITEM','UPC_UNIT'];
 const rulesList = ['COMMENTS']; 
      if(navObj?.CHILD_MODULE === 'Item Summary'){
        let newList = [{
                headerName: 'Equals to',
                field: '=',
              }];
         if(summaryList?.includes(selectedColumn)){
          newList =  [ 
            ...newList,
                {
                headerName: 'Greater than',
                field: '>',
              },
            
              {
                headerName: 'Less than',
                field: '<',
              }
              ]
         }
      
        setFilterConditions(newList);
      }
    
       else if(navObj?.CHILD_MODULE === 'Rules Definition'){
        let newList = [
            {
               headerName: 'Equals to',
                field: '=',
              },
            {
                headerName: 'Contains',
                field: 'in',
              }];
       if (rulesList.includes(selectedColumn)) {
        newList = newList.filter(item => item.headerName !== 'Equals to');
    }  
        setFilterConditions(newList);
      }
      else {
        setFilterConditions(props?.filterConditions);
      }
     
},[props?.filterConditions,selectedColumn,navObj?.CHILD_MODULE]);
const [filterRules, setFilterRules] = useState([]);
useEffect(()=>{
  
 // if(props?.chips?.length === 0){
    setFilterRules(props?.filterRules);
 // }
  
  console.log('Filter Rules:', props?.filterRules);
},[props?.filterRules])
  const handleColChange = (value, index,type) => {
      
    setSelectedColumn(value);
    const updatedStaticValues = { ...staticValues };
    updatedStaticValues[index] = filCols.find(item => item.field === value);
    setStaticValues(updatedStaticValues);
    props?.handleFieldChange(value, index,type)
  }
  const changeValue = (chip) =>{
    return chip?.filterValues?.map(value => value).slice(0, 1).join(', ')
  }
  const handleChipClick = (chip, index) => {
    setChipName(chip?.field);
    setFreezeColumns(true);
   let colObj =  props?.productColumns?.find(item => item.field === chip?.field);
  if (colObj) {
    if (!filCols.some(item => item.field === colObj.field)) {
      setFilCols([...filCols, colObj]);
    }
  }
  
 // setSelectedColumn(chip?.userInputValue);
 
   
    setFieldValue(chip?.userInputValue);
    
  if(chip.type === '='){
    if(colObj?.type === 'DATE'){
      setStaticValues([]);
      //handleColChange(colObj.field, index, colObj.type);
      setEnableMultiSelect(false);
    }else if(colObj?.VALUES){
    const updatedStaticValues = { ...staticValues };
    //updatedStaticValues[index] = props?.productColumns?.find(item => item.field === chip?.field);
    updatedStaticValues[0] = props?.productColumns?.find(item => item.field === chip?.field);
    setStaticValues(updatedStaticValues);
    setEnableMultiSelect(false);
    setSelectedValues(chip.filterValues);
    }else {
      setStaticValues([]);
      setEnableMultiSelect(true);
    setSelectedValues(chip.filterValues);
    }
   
  }else {
    setEnableMultiSelect(false);
  }
  props?.handleChipClick(chip,index,colObj);
  // const updatedRules = [...filterRules];
  // updatedRules[index] = chip; 
  // setFilterRules(updatedRules);
  //props?.handleTypeChange(chip.type, index);
  
  
  }
   

  
  return (
    <>
      <div className='d-flex display-manage gap-1'>
        <div className='d-flex align-items-center gap-2 chipCardWrap'>
          {props?.chips && props?.chips?.map((chip, index) => {
            const productColumn = props?.productColumns?.find(item => item.field === chip?.field);
             
            return (
              <div className='filter-card mb-1 pointer'  key={index}>
                <div onClick={() => handleChipClick(chip, index)}>

               
              <span>{productColumn ? productColumn.header : chip?.field} &nbsp;</span>

              <span>{chip?.type} &nbsp;</span>
              <span
                title={chip?.filterValues?.map(value => {
                if (productColumn?.type === 'DATE' && typeof value === 'string') {
                  // Extract only the date part if value is in 'YYYY-MM-DD HH:mm:ss' format
                  return value.split(' ')[0];
                }
                // Format date values as MM/DD/YYYY if type is DATE
                return productColumn?.type === 'DATE' && typeof value === 'string'
                  ? new Date(value.split(' ')[0]).toLocaleDateString('en-US')
                  : value;
                }).join(', ')}
                >
                {changeValue({
                  ...chip,
                  filterValues: chip?.filterValues?.map(value => {
                  if (productColumn?.type === 'DATE' && typeof value === 'string') {
                    // Format as MM/DD/YYYY
                    return new Date(value.split(' ')[0]).toLocaleDateString('en-US');
                  }
                  return value;
                  })
                })}
                {chip?.filterValues?.length > 1 ? ', ...' : ''}
                </span>
                 </div>
                <i
                style={{ fontSize: '12px', marginTop: '2px', color: 'rgb(211, 21, 16)' }}
                className="pi pi-times icon-cancel pointer"
                onClick={() => { props?.removeChip(index)}}
               // onClick={() => { props?.removeChip(index); setEnableMultiSelect(false);setStaticValues([]);setSelectedValues([])  }}
              ></i>
              </div>
            );
          })}
        </div>
       
        <div className= {props?.filteredGridOptions.length === 0 ? "querydataSpace" :"filtergrid"} ref={props?.scrollRef}>
          {props?.showSmartSearch ? (
            <>
              {filterRules?.map((f, index) => (
              
                <div key={index}>
                  <>
                    <div className="filterSelect">
                      <>
                        <FormControl sx={{ width:150 }} size="small">
                          <InputLabel>Columns</InputLabel>
                           <Select
                           disabled={freezeColumns && props?.chips?.length > 0}
          className="ellipsis"
          value={f.field || ''}
          label="Columns"
 onChange={(e) => {
    // Find the selected item from filCols using the field value
    const selectedItem = filCols.find(item => item.field === e.target.value);
    if (selectedItem) {
      handleColChange(selectedItem.field, index, selectedItem.type); // Pass field, index, and type
    }
  }}        >
          {filCols
            ?.filter((item) => item?.field )
            .map((item) => (
              <MenuItem 
                value={item.field}
                sx={{
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  alignItems:'center',
                 
                }}
                title={item.header} 
              >
                {item.header.length > 15 
                  ? `${item.header.substring(0, 15)}...` 
                  : item.header}
              </MenuItem>
          ))}
      </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }} size="small">
                          <InputLabel >Conditions</InputLabel>
                          <Select
                            className="ellipsis"
                            value={f.type || ''}
                            label="Conditions"
                            onChange={(e) => {
                              props?.handleTypeChange(e.target.value, index);
                              e.target.value === '=' ? setEnableMultiSelect(true) : setEnableMultiSelect(false);
                            
                            }}
                          >
                            {/* {props?.filterConditions?.map((item) => (
                              <MenuItem value={item.field}>{item.headerName}</MenuItem>
                            ))} */}
                            {
                            filterConditions
    ?.filter((item) => {
      
      // If dateCalendar is true, only include "Equals", otherwise include all items
      return props?.dateCalendar || navObj?.CHILD_MODULE === "Exploded Rules" ? item.field === "=" : true;
    })
    .map((item) => (
      <MenuItem key={item.field} value={item.field}>
        {item.headerName}
      </MenuItem>
    ))}
                          </Select>
                        </FormControl>
                       
                        {staticValues[index]?.VALUES?.length > 0 ?
                          <FormControl sx={{ minWidth: 120 }} size="small">
                          <InputLabel>Select</InputLabel>
                          <Select
                            className="ellipsis"                          
                            label="Values"
                            value={f?.userInputValue}
                            onChange={(e) => { props?.handleTextValue(e.target.value, index); setFieldValue(e.target.value); }}
                          >
                            {staticValues[index]?.VALUES?.map((item) => (
                              <MenuItem value={item.name ? item.name:item?.value? item.value  : item}>{item.name? item.name : item.key ? item?.key : item}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>                          
                          :
                          ( (props?.isContainsEnabled !== true   && props?.isBetweenEnabled !== true  && props?.dateCalendar !==true ) || (enableMultiSelect && props?.dateCalendar !==true)? (
                            <div>
                              <MultiSelect
                              key={multiSelectKey} 
                                value={selectedValues}
                                options={f?.list ? f.list : []}
                                onChange={(e) => handleChange(e.value, index)}
                                onFilter={(e) => handleFilter(e, index)}
                                optionLabel="name"
                                optionValue='key'
                                placeholder="Select Values"
                                display="chip"
                                filter
                                showSelectAll={false}
                                maxSelectedLabels={1}
                                style={{ width: '98%' }}
                              emptyFilterMessage={
                                  props?.loading
                                    ? "Loading..."
                                    : f?.list && f.list.length === 0 
                                    ? "No records"
                                    : "No matching records"
                                }    
                                    onKeyDown={(e) => handleKeyDown(e)}// Add this line
                       
                              />
                              {    
}
                            </div>
                          ) : null)}
                        {(props?.isContainsEnabled === true && !staticValues[index]?.VALUES) && !enableMultiSelect && (
                          <div>
                            <InputText
                              label="Value"
                              onChange={(e) => props?.handleTextValue(e?.target?.value, index)}
                              value={f?.userInputValue}
                              onKeyDown={(e) => handleKeyDown(e)}
                              maxLength={maxLengthList.includes(f.field) ? 5 :null}


                            />
                          </div>
                        )}
                         {(props?.isBetweenEnabled === true && props?.isContainsEnabled !== true && props?.dateCalendar !==true && !staticValues[index]?.VALUES) && (
                          <div className='d-flex gap-2 align-items-center'>
                            <div>
                            <InputText
                              label="Value"
                              onChange={(e) => props?.handleBetweenValues(e?.target?.value, index,"first")}
                            />
                            </div>
                            <div>
                            <InputText
                              label="Value"
                              onChange={(e) => props?.handleBetweenValues(e?.target?.value, index,"second")}
                            />
                            </div>
                          </div>
                        )}
                        {props?.dateCalendar && props?.isContainsEnabled !== true &&
                        <div>
                         <Calendar
                         className='datePick'
                          onChange={(e) => props?.handleDateSearch(e.value, index)}
                          showIcon
                          showButtonBar
                          value={f?.userInputValue ? new Date(f?.userInputValue) : null}
                        />
                        </div>
                        }
                        {<AdditionalFiltersComponent checkValue={checkValue}/>}
                        {props?.isFilterComplete &&
                          <>
                            <Button className='primary-button' disabled={maxLengthList.includes(f.field) && f.type !== '=' && f?.userInputValue?.length < 5} onClick={() => {
    props?.addFilterObject();
    setFilterRules([
          { field: "", type: "", userInputValue: '', list: [], logicalCondition: "", filterValues: [] },
        ]);
    //setFilterConditions([]); // Clear filter conditions
    setSelectedValues([]); // Clear selected values
    setStaticValues([]);   // Clear static values
setMultiSelectKey((prevKey) => prevKey + 1); 
setFreezeColumns(false); 
setChipName(null); 
}}>Apply</Button>
                          </>
                        }
                        {props?.isFilterComplete &&
<Button 
    className='secondary-button' 
    onClick={() => {
        props?.handleInputClick();
        setSelectedValues([]);
        setFreezeColumns(false);
        setChipName(null);
        handleCancel('cancel');
    }}
>
    Cancel
</Button>}                      </>
                    </div>
                  </>
                </div>
              ))}
              
            </>
          ) : (
            ""
          )}

          {props?.showAddFilter && (
            <>
             
              {(() => {
                const filtered = props?.filteredGridOptions.filter(opt => opt.key !== 'edit');
                return (
                  <div className={filtered.length === 0 ? "querydataSpace" : "addFilter"}>
                    <button className='primary-button' onClick={props?.handleInputClick}>Query Data</button>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* {
      visiblePopup &&
      <div>
      <DialogBox header='Save View' content={displayView()} style={{ width: '31vw' }} onHide={showSaveDialogue}/>
    </div>
    }
    */}
    </>
  )
}

export default SmartSearch