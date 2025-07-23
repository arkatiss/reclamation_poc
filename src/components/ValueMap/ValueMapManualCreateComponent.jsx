import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { SelectButton } from 'primereact/selectbutton';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import PrimeDataTable from '../Shared/DataTable/DataTableComponent';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { useSaveValueMapDataMutation, useSaveVmDefMutation } from '../../services/valueMapSetup';
import { bulkCreateResponse } from '../../slices/columnSelection';
import { useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { removeIcon } from '../../assests/icons';

const ValueMapManualCreateComponent = forwardRef((props, ref) => {
  const toast = useRef(null);
    const options = ['Characters', 'Numbers', 'Dates'];
    const [value, setValue] = useState('Characters');
    const [tableData, setTableData] = useState();
    const [selectedValue, setSelectedValue] = useState([]);
    const [activeChecked, setActiveChecked] = useState(true);
  //  const [valueMapCode, setValueMapCode] = useState('');
    const [valueMapName, setValueMapName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeClass, setActiveClass] = useState(false);
    const [saveVMDef, { }] = useSaveVmDefMutation(); 
    const [saveVMData, { }] = useSaveValueMapDataMutation();
    const [formErrors, setFormErrors] = useState(false);
    const [formErrorsName, setFormErrorsName] = useState(false);
    const [formErrorsDesc, setFormErrorsDesc] = useState(false);
    const [formErrorsStartDate, setFormErrorsStartDate] = useState(false);
    const [tableObj,setTableObj] = useState({
       Characters: formatTableObj('C_VALUE'),
      Numbers: formatTableObj('N_VALUE'),
      Dates: formatTableObj('D_VALUE'),
    });
    let dispatch = useDispatch()
/** @remarks Useeffect to set data to the table*/
    useEffect(()=>{
      if(Object.keys(props?.rowData)?.length > 0){   
        
  ///      setValueMapCode(props?.rowData[0]?.mapDefId);
        setValueMapName(props?.rowData[0]?.name);
        setDescription(props?.rowData[0]?.desc);
        setStartDate(props?.rowData[0]?.activeBeginDate);
        setEndDate(props?.rowData[0]?.activeEndDate);
        let charactersTableData = props?.rowData[0]?.vMapDef?.filter(item => item?.type === 'Char');
        let numberTableData = props?.rowData[0]?.vMapDef?.filter(item => item?.type === 'Number');
        let datesTableData = props?.rowData[0]?.vMapDef?.filter(item => item?.type === 'Date');
        charactersTableData = charactersTableData.map((item)=>{
          return {...item, edit:item.edit === 'Y' ? true : false,show:item.show === 'Y' ? true : false,requiredFlag:item.requiredFlag === 'Y' ? true : false}
        })
        numberTableData = numberTableData.map((item)=>{
          return {...item, edit:item.edit === 'Y' ? true : false,show:item.show === 'Y' ? true : false,requiredFlag:item.requiredFlag === 'Y' ? true : false
          }
        })
        datesTableData = datesTableData.map((item)=>{
          return {...item, edit:item.edit === 'Y' ? true : false,show:item.show === 'Y' ? true : false,requiredFlag:item.requiredFlag === 'Y' ? true : false
          }
        })  
        setTableObj({
      Characters: formatTableObj('C_VALUE',charactersTableData),
      Numbers: formatTableObj('N_VALUE',numberTableData),
      Dates: formatTableObj('D_VALUE',datesTableData),
        })
        // setCharactersTableData(formatTableObj('C_VALUE',charactersTableData));
        // setNumbersTableData(formatTableObj('N_VALUE',numberTableData));
        // setDatesTableData(formatTableObj('D_VALUE',datesTableData));
      }
      // else {
        
      //   setCharactersTableData(formatTableObj('C_VALUE'));
      //   setNumbersTableData(formatTableObj('N_VALUE'));
      //   setDatesTableData(formatTableObj('D_VALUE'));
      // }
    },[props?.rowData])
      useImperativeHandle(ref, () => ({
        getColumns: () => columns,
        getData: () =>tableData
      }));
      const childRef = useRef(null);
      /**
    @remarks
    Function to change the menu items
    @author Amar
    */
    const changeMenu = (e) => {
        setValue(e.value);
        setActiveClass(false);
        // handleSaveAction();
        // if(e.value === 'Characters'){
        //   setTableData(charactersTableData);
        // }
        // else if(e.value === 'Numbers'){
        //   setTableData(numbersTableData);
        // }
        // else if(e.value === 'Dates'){
        //   setTableData(datesTableData);
        // }
        // if (childRef?.current) {
        //   const columnsData = childRef?.current?.getStoreDetails();
        //   if(value==='Characters'){
        //     setCharactersTableData(columnsData);
        //   }
        //   else if(value === 'Numbers'){
        //     setNumbersTableData(columnsData);
        //   }
        //   else if(value === 'Dates'){
        //     setDatesTableData(columnsData);
        //   }
        //   }
      }
      /**

  /** @remarks Function to click on Role*/
      const handleCLickRole = (e) =>{
        setValue(e);
        setActiveClass(true);
      }
  /** @remarks Useeffect to show first tab highlight */
      //   useEffect(() => {
      //   changeMenu({value: 'Characters'});    
      // },[]);
      const columns=[
        {field:'name',header:'Column' , width: 15},
        {field:'seqNumber',header:'Sequence', width: 10},
        {field:'prompt',header:'Column Name', width: 35},
        {field:'width',header:'Column Width', width: 15},
        {field:'requiredFlag',header:'Required Flag', width: 10},
        {field:'show',header:'View', width: 10},
        {field:'clear',header:'Clear', width: 5},
      ]
      const optionList = [
        {field:'admin', value:'Admin'},
        {field:'manager', value:'Manager'},
        {field:'business', value:'Business'},
        {field:'salesManager', value:'Sales Manager'},
        {field:'users', value:'Users'},
    ]
      /**
    @remarks
    Function to change the role
    @author Amar
    */
    const handleSelectRole = (e)=>{
        setSelectedValue(e?.value)
    }
    /**
    @remarks
    Function to save entered data
    @author Amar
    */

    const handleSaveAction = (e)=>{
    // if(valueMapCode === ''){
    //   setFormErrors(true)
    // }
    if (!valueMapName || valueMapName === '') {
      setFormErrorsName(true);
    }
    if (!description || description === '') {
      setFormErrorsDesc(true);
    }
    if (!startDate || startDate === '' || startDate === null || typeof startDate === 'undefined') {
      setFormErrorsStartDate(true);
    }
    if (
      !valueMapName ||
      valueMapName === '' ||
      !description ||
      description === '' ||
      !startDate ||
      startDate === '' ||
      startDate === null ||
      typeof startDate === 'undefined' ||
      activeChecked === false
    ) {
      let errorKey =
      !valueMapName || valueMapName === ''
        ? 'Value Map code'
        : !description || description === ''
        ? 'Description'
        : !startDate || startDate === '' || startDate === null || typeof startDate === 'undefined'
        ? 'Start Date'
        : 'Active';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorKey + ' is required' });
    } else {
      
      let finalData = [];
      const updateTableData = (data, type) => {
        data.forEach((c) => {
          if (c.seqNumber !== '' || c.width !== '' || c.prompt !== '') {
            finalData.push({
              name: c?.column ? c?.column : c?.name,
              seqNumber: c?.seqNumber ? parseInt(c.seqNumber) : '',
              prompt: c?.prompt,
              type: type,
              width: c?.width,
              // width: c?.width ? ((c?.width/totalWidth)*100) : '',
              requiredFlag: c.requiredFlag === true ? 'Y' : 'N',
              show: c.show === true ? 'Y' : 'N',
              // edit: "Y"
            });
          }
        });
      };
      const optionList = ['Characters', 'Numbers', 'Dates']
      optionList.forEach(tab => {
        const type = tab === 'Characters' ? 'Char' : tab === 'Numbers' ? 'Number' : 'Date';
        updateTableData(tableObj[tab], type);
      });
      // updateTableData(charactersTableData, "Char");
      // updateTableData(numbersTableData, "Number");
      // updateTableData(datesTableData, "Date");
      
     let sum = 0;
      finalData?.map((i) =>{
        sum += parseInt(i?.width) 
      })
      
      // Filter records where show === 'Y'
      const shownRecords = finalData?.filter(i => i.show === 'Y');
      let finalInfo;
      if (shownRecords.length === 1) {
        // Only one record is shown, set width to 100
        finalInfo = finalData?.map(i =>
          i.show === 'Y' ? { ...i, width: 100 } : { ...i, width: 0 }
        );
      } else {
        // Multiple records, distribute width proportionally
        // If sum is 0 or NaN, distribute width equally among shown columns
        const shownCount = shownRecords.length;
        if (!sum || isNaN(sum)) {
          // Distribute 100 equally among shown columns, 0 for hidden
          const equalWidth = shownCount > 0 ? 100 / shownCount : 0;
          finalInfo = finalData?.map(i =>
            i.show === 'Y'
              ? { ...i, width: equalWidth }
              : { ...i, width: 0 }
          );
        } else {
          // Some columns have width, some don't
          // Find columns with width and without width
          const withWidth = shownRecords.filter(i => i.width && !isNaN(i.width));
          const withoutWidth = shownRecords.filter(i => !i.width || isNaN(i.width));
          let usedWidth = 0;
          // Calculate total width for columns with width
          withWidth.forEach(i => {
            usedWidth += parseFloat(i.width);
          });
          // Calculate total width percentage for columns with width
          let totalPercent = 0;
          finalInfo = finalData?.map(i => {
            if (i.show !== 'Y') {
              return { ...i, width: 0 };
            }
            if (i.width && !isNaN(i.width) && usedWidth > 0) {
              const percent = (parseFloat(i.width) / usedWidth) * (100 - (withoutWidth.length > 0 ? 0 : 0));
              totalPercent += percent;
              return { ...i, width: percent };
            }
            return i; // We'll update these after
          });
          // Distribute remaining width equally among columns without width
          const remaining = 100 - totalPercent;
          if (withoutWidth.length > 0 && remaining > 0) {
            const perCol = remaining / withoutWidth.length;
            finalInfo = finalInfo.map(i =>
              i.show === 'Y' && (!i.width || isNaN(i.width))
          ? { ...i, width: perCol }
          : i
            );
          }
        }
      }
       saveVMDefDetails(finalInfo, e);
    }
}
      const saveVMDefDetails = async (finalData,e) => {      
        const sortedArray = finalData.sort((a, b) => a.seqNumber - b.seqNumber);
        let createType = e === 'Create' ? 'ADD' : 'UPD';
          const payLoad = {
            "actionObject":{
            "opType": createType,
            //"mapDefId": valueMapCode,
            "name": valueMapName,
            "activeBeginDate": startDate,
            "activeEndDate": endDate,
            "desc": description,
            "activeDateFlag": activeChecked,
            "vMapDef" : sortedArray
            }
          } 
            try {
            let result = await saveVMDef(payLoad).unwrap();
            console.log(result)
            if(result?.res_status){
              if(e === 'Update'){
                props?.closeDialog('Upd');
              }
              if(e === 'Create'){
                props?.closeDialog('Success');
              }
              dispatch(bulkCreateResponse(result?.res_status))            
            }
            else{
              //  props?.closeDialog('Failed');  
             dispatch(bulkCreateResponse(false))            
         
            }          
            } catch (e) {
              // props?.closeDialog('Failed');          
            }
            };
      /** @remarks Function to clear value map data */             
      const handleClearValueMap = ( field, rowData, index) =>{
      let resetValue = value === 'Characters' ? 'C_VALUE': value === 'Numbers' ? 'N_VALUE': 'D_VALUE';
      let obj = {name:resetValue + (index+1),seqNumber:'',prompt:'',width:'',requiredFlag:false, show: false, clear:''};
      //const columnsData = childRef?.current?.getStoreDetails();
      let data = {...tableObj};
      data[value][index] = obj;
      setTableObj(data);
    //  value === 'Characters' ? setCharactersTableData(data) : value === 'Numbers' ? setNumbersTableData(data) :setDatesTableData(data);      
      }
      // const setUpdatedTableData = (data,tabname) =>{
         
      //   value === 'Characters' ? setCharactersTableData(data) : value === 'Numbers' ? setNumbersTableData(data) :setDatesTableData(data);
      // }
      const [checkedValues, setCheckedValues] = useState(Array(selectedValue.length).fill(false));
      const handleChange = (index) =>{
      const updatedCheckedValues = [...checkedValues];
      updatedCheckedValues[index] = !updatedCheckedValues[index];
      setCheckedValues(updatedCheckedValues);
      }
        /** @remarks Function to enter input fields */
    const handleChangeTxt = (e, key) =>{
         // let valIndex = {...valVMIndex, [-1]:true}
      // setValVMIndex(valIndex)
        if(key === 'VCode'){
         // setValueMapCode(e)
          setFormErrors(false)
        }else if(key === 'VName'){
          setValueMapName(e)
          setFormErrorsName(false)
        }else if(key === 'Desc'){
          setDescription(e)
          setFormErrorsDesc(false)
        }
        else if(key === 'STDate'){
          
          // const formattedDate = e.value ? e.value.toISOString().split('T')[0] : null;
          // setStartDate(formattedDate);
          // setFormErrorsStartDate(false)
          if (e.value) {
            const localDate = new Date(e.value);
            localDate.setHours(0, 0, 0, 0);
            const adjustedDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
            const formattedDate = adjustedDate.toISOString().split('T')[0];
            setStartDate(formattedDate);
        } else {
            setStartDate(null);
        }

        setFormErrorsStartDate(false);
        } 
        else if(key === 'ETDate'){
          // const formattedDate = e.value ? e.value.toISOString().split('T')[0] : null;
          // setStartDate(formattedDate);
          // setFormErrorsStartDate(false)
          if (e.value) {
            const localDate = new Date(e.value);
            localDate.setHours(0, 0, 0, 0);
            const adjustedDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
            const formattedDate = adjustedDate.toISOString().split('T')[0];
            setEndDate(formattedDate);
        } else {
          setEndDate(null);
        }

        // setFormErrorsStartDate(false);
        }    
    }
const rows = useMemo(() => {
  return tableObj[value].map((row, rowIndex) => (
    <tr key={rowIndex}>
      {columns.map((col) => (
       
      <td
        key={col.field}
        style={col.width ? { width: `${col.width}%` } : {}}
      >
        {col.field === 'name' ? (
          <div className="d-flex align-items-center">
            <span>{row[col.field]}</span>
          </div>
        ) : col.field === 'requiredFlag' || col.field === 'show' ? (
          <div className="d-flex justify-content-center">
            <Checkbox
              checked={row[col.field]}
              onChange={(e) =>
                handleChangeGrid(rowIndex, col.field, e.checked)
              }
            />
          </div>
        ) : col.field === 'clear' ? (
          <div>
            <img
              src={removeIcon}
              alt={col.field}
              width={20}
              title="Clear row"
              className="pointer"
              onClick={() =>
                handleClearValueMap(col.field, row, rowIndex)
              }
            />
          </div>
        ) : (
          <InputText
            type="text"
            className="p-inputtext-sm w-100"
            placeholder=""
            value={row[col.field] || ''}
            onChange={(e) => {
              // Prevent alphabets for seqNumber and width
              if (col.field === 'seqNumber') {
                // Only allow digits for seqNumber
                const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
                handleChangeGrid(rowIndex, col.field, digitsOnly);
              } else if (col.field === 'width') {
                // Allow digits and dot for width
                const widthValue = e.target.value.replace(/[^0-9.]/g, '');
                handleChangeGrid(rowIndex, col.field, widthValue);
              } else {
                handleChangeGrid(rowIndex, col.field, e.target.value);
              }
            }}
          />
        )}
      </td>
      ))}
    </tr>
  ));
}, [tableObj, value]);


const handleChangeGrid = (rowIndex, field, newValue) => {
  setTableObj((prev) => {
    const updatedRows = [...prev[value]];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: newValue,
    };

    return {
      ...prev,
      [value]: updatedRows,
    };
  });
};

  return (
    <>
     <Toast ref={toast} />
        <div className='row '>
        {/* <div className='col-2'>
          <label className='label'>Value Map Code<label className='starColor'>*</label></label>
        <InputText label="Value Map Code" className={formErrors ? 'p-invalid ' : ''} 
        disabled={props?.headerText !=="Create Definition"} variant="outlined" size='small' value={valueMapCode} onChange={(e) => handleChangeTxt(e?.target?.value, 'VCode')}/>
        </div> */}
        <div className='col-2'>
        <label className='label'>Value Map Code<label className='starColor'>*</label></label>
        <InputText label="Value Map Name" className={formErrorsName ? 'p-invalid ' : ''}
        disabled={props?.headerText !=="Create Definition"} variant="outlined" size='small' value={valueMapName} onChange={(e) => handleChangeTxt(e?.target?.value, 'VName')}/>
        </div>
        <div className='col-2'>
        <label className='label'>Description<label className='starColor'>*</label></label>
        <InputText label="Description" className={formErrorsDesc ? 'p-invalid ' : ''} variant="outlined" size='small' value={description} onChange={(e) => handleChangeTxt(e?.target?.value, 'Desc')}/>
        </div>
        <div className='col-2'>
        <label className='label'>Start date<label className='starColor'>*</label></label>
        <Calendar showIcon showButtonBar className={formErrorsStartDate ? 'p-invalid calDate calender-css' : 'calDate calender-css'} 
         disabled={props?.headerText !=="Create Definition"}  value={startDate ? new Date(startDate) : null}  onChange={(e) => {
                handleChangeTxt(e, 'STDate') 
            }}
            dateFormat="yy-mm-dd" />
        </div>
        <div className='col-2'>
        <label className='label'>End date</label>
        {/* <Calendar showIcon className='calDate calender-css' value={endDate ? new Date(endDate) : null} onChange={(e) => {
           const formattedDate = e.value ? e.value.toISOString().split('T')[0] : null;
           setEndDate(formattedDate);
           }}
            dateFormat="yy-mm-dd"
           /> */}
             <Calendar showIcon showButtonBar className='calDate calender-css'  value={endDate ? new Date(endDate) : null}  onChange={(e) => {
                handleChangeTxt(e, 'ETDate') 
            }}
             minDate={startDate ? new Date(startDate) : null}
            // disabled={!startDate} 
            dateFormat="yy-mm-dd" />
        </div>
        <div className='col-2 m-auto mt-4'>
       
        <Checkbox checked={activeChecked} onChange={(e) => setActiveChecked(e.checked)}/>     
        <span className="ms-2">Active</span>
        </div>
    </div>
        <div className=' d-flex mt-3'>
        <div >
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e)} options={options} />
        </div>
        {/* <div className='roleDiv mb-2'>
        <button className={activeClass === true ? 'btnRolesActive' : 'btnRoles'} onClick={() =>handleCLickRole('Roles')}>Roles</button> 
        </div> */}
        <div className='dropdownRoles'>         
        {value === 'Roles' && 
        <>
      <MultiSelect options={optionList} value={selectedValue} optionLabel='value' placeholder='Select Role' onChange={(e) => handleSelectRole(e)}/>   
      </>
        }
        </div>
        </div>
            {value === 'Characters' || value === 'Numbers' || value === 'Dates' ?
            <div className='mt-3'>
             {/* <PrimeDataTable hideButtons hideSort className="tbl" handleClearValueMap={handleClearValueMap} columns = {columns}  
             data={ value === 'Characters' ? charactersTableData :value === 'Numbers' ? numbersTableData : datesTableData } ref={childRef} smartSearchOff={true} paginator ={false} filters={false} setUpdatedTableData = {setUpdatedTableData}
                   valueTab={value} /> */}
  <div className=''>
 <table className="custom-td valuemap-grid">
  <thead>
    <tr>
      {columns?.map((s) => (
        <th key={s.field}  style={s.width ? { width: `${s.width}%` } : {}}>{s.header}</th>
      ))}
    </tr>
  </thead>
  <tbody>{rows}</tbody>
</table>
  </div>
     


                </div>    
            :
           <div className='mt-3' style={{height:'35rem'}}>
           <table className='table border'>
                     <thead>
                        <tr>
                         <th>Role</th>
                         <th>Access</th>
                         </tr>
                     </thead>
                     <tbody>
                         {selectedValue && selectedValue?.map((i, index)=>(
                            <tr>
                              <td>{i}</td>
                              <td><span><Checkbox onChange={() =>handleChange(index)} checked={checkedValues[index]}/><span className='ms-2'>Read Only</span></span></td>
                            </tr>
                     ))}
                     </tbody>
                 </table>
           </div>}
           <div className='mt-3 row'>
            <div className='col-5'></div>
            <div className='col-1'>
            <button className='secondary-button' onClick={props?.closeDialog}>Cancel</button> 
            </div>
            <div className='col-1'>
            <button className='primary-button ms-3' onClick={(e) =>handleSaveAction(props?.rowData?.length > 0 ? 'Update' : 'Create')}>{props?.rowData?.length > 0 ? 'Update' : 'Create'}</button> 
            </div>
           </div>
    </>
  )
})

export default ValueMapManualCreateComponent
 
    function formatTableObj(param, data = null)  {
      let tableData = [];
      for (let i = 1; i <= 20; i++) {
          tableData.push({ name: param + i, seqNumber: '', prompt: '', width: '', requiredFlag: false, show: false, clear: '' });
      } 
      let finalData = tableData.map(item => {
          let matchingItem = data?.find(sub => sub.name === item.name);
          if (matchingItem) {
              return { ...item, ...matchingItem };
          }
          return item;
      }); 
      return finalData;
  };