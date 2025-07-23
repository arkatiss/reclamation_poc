import  { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { useLookUpSearchMutation } from '../../../../services/common';
import { deleteIcon, plusIcon } from '../../../../assests/icons';
import { previousIcon, nextIcon } from '../../../../assests/icons';
import { bulkCreate, clearBulkCreateRecords } from '../../../../slices/columnSelection';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from 'primereact/skeleton';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
        
export const DynamicForm = (props) => {
  const [insertFields, setInsertFields] = useState([]);
  const [storeInsertFields,setStoreInsertFields] = useState([])
  const [formErrors, setFormErrors] = useState({});
  const toastRef = useRef(null);
  const [records, setRecords] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [rowIndex, setRowIndex] = useState(null)
  const [getLookUpSearch, { data: lookupData }] = useLookUpSearchMutation();
  const [temporaryFields,setTemporaryFields] = useState([]);
  const navObj = useSelector((state) => state.navigation);
  const [disableFields,setDisabledFields]= useState([]);
  const [showVendorWarning,setShowVendorWarning] = useState(false);
  const dispatch = useDispatch()
  useEffect( () => {
    const updatedInsertFields = addInsertFields(props?.insertFields);
    
    setInsertFields(updatedInsertFields || []);
    setStoreInsertFields(updatedInsertFields)
  }, [props?.insertFields])
  /** @remarks Function to Add Insert fields */
  const addInsertFields =  (insertFields) => {
   

    return insertFields.map(  (item) => {
      if (item.field === 'GRP_STORES_DATA') {
        let newObj = {};
        item.fields.forEach((subitem) => {
          if(subitem.hasOwnProperty('default_value')){
            newObj = { ...newObj, [subitem.field]:  subitem.default_value };
          }else if(subitem.default){
            const formattedDate =  formatDateObj(new Date());
            newObj = { ...newObj, [subitem.field]: formattedDate };
          }else{
            newObj = { ...newObj, [subitem.field]:  '' };
          }
        });
        return { ...item, values: [...(item.values || []), newObj] };
      }
      if(item.hasOwnProperty('default_value')){
        
        return {...item, value: item.default_value}
      }else if(item.default){
        
        const formattedDate =  formatDateObj(new Date());
        return {...item,value:formattedDate}
      }
      return item;
    });
  }
   /** @remarks Function to handle inserted or copied or edited fields */
  const handleMissingFields = (records, insertFields, productColumns = []) => {
    if (records?.length > 0 && insertFields?.length > 0) {
      console.log(navObj)
      const dataFields = Object.keys(records[0]);
      const configFields = insertFields.map((item) => item.field);
      const missingFields = dataFields.filter((field) => !configFields.includes(field));
      let updatedConfigArray = [...insertFields];
        if (missingFields.length > 0) {
          missingFields.forEach((field) => {
            const isPrimary = productColumns.find((item) => item.field === field)?.primary;
            if (!isPrimary) {
              updatedConfigArray.push({
                create: false,
                edit: true,
                field,
                header: field,
                required: false,
                type: 'TEXT',
                visibility:true
              });
            }
          });
        }
      return updatedConfigArray;
    }
    return insertFields;
  };
  const [backUpRecords,setBackUpRecords] = useState([]);
  useEffect(() => {
    if (props?.editRecords?.length > 0) {
      
      const updatedConfigArray = handleMissingFields(props.editRecords, props.insertFields);
      setRecords(props.editRecords);
      if(backUpRecords.length === 0){
 setBackUpRecords(JSON.parse(JSON.stringify(props.editRecords)));
      }
      
      
      setInsertFields(updatedConfigArray);
      setStoreInsertFields(updatedConfigArray)
      handleRowClick({ data: props.editRecords[0], index: 0 }, updatedConfigArray);
    }
  }, [props?.editRecords, props?.insertFields]);
  useEffect(() => {
    if (props?.copiedRecords?.length > 0) {
      const updatedConfigArray = handleMissingFields(
        props.copiedRecords,
        props.insertFields,
        props.productColumns
      );
      if (backUpRecords.length === 0) {
        setBackUpRecords(JSON.parse(JSON.stringify(props.copiedRecords)));
      }
      setRecords(props.copiedRecords);
      setInsertFields(updatedConfigArray);
      handleRowClick({ data: props.copiedRecords[0], index: 0 }, updatedConfigArray);
      dispatch(clearBulkCreateRecords());
      dispatch(bulkCreate(updatedConfigArray));
    }
  }, [props?.copiedRecords, props?.insertFields]);
  /**
  @remarks Function to handle Validate required fields @author Raja
  */
  const handleSubmit = (e) => {
    
    props?.clicked(true)
    e.preventDefault();
    let validationPassed = {};
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    insertFields.forEach((field, index) => {

      if (field.required && !field.value && field.field !== 'GRP_STORES_DATA' && field.visibility) {
        
        validationPassed[field?.field] = false;
        errors[index] = `${field.header} is required`;
      }
      if (field?.type?.toLowerCase() === 'email' && field.value) {
        const isValidEmail = emailRegex.test(field.value);
        if (!isValidEmail) {
          validationPassed[field?.field] = false;
          errors[index] = `${field.header} is not a valid email address`;
          toastRef.current.show({
            severity: 'error',
            summary: 'Invalid Email',
            detail: `${field.header} is not a valid email address`,
            life: 3000
          });
        }
      }
      if (field?.type?.toLowerCase() === 'mobile' && field.value) {
         let phoneRegex=/^(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        const isValidPhone = phoneRegex.test(field.value);
        if (!isValidPhone) {
          validationPassed[field?.field] = false;
          errors[index] = `${field.header} is not a valid Phone number`;
          toastRef.current.show({
            severity: 'error',
            summary: 'Invalid Email',
            detail: `${field.header} is not a valid Phone number`,
            life: 3000
          });
        }
      }
      if ((field?.type?.toLowerCase() === 'list' || field?.type?.toLowerCase() === 'multiselect') && field.value && field?.url && (!props?.hasOwnProperty('editRecords') || props?.editRecords?.length === 0) && (!props?.hasOwnProperty('copiedRecords') || props?.copiedRecords?.length === 0)) {
        const isValidList = field?.values && field.values.some(item => {
          if (Array.isArray(field?.value)) {
            return field.value.length === 0 || field.value.some(subItem => subItem.name === item.name);
          }
          return field?.value?.name === item.name;
        });
        if (!isValidList) {
          validationPassed[field?.field] = false;
          errors[index] = `${field.header} is not a valid ${field.header} number`;
          toastRef.current.show({
            severity: 'error',
            summary: `Invalid ${field.header}`,
            detail: `${field.header} is not a valid ${field.header} number`,
            life: 3000
          });
        }
      }
      if (field?.field === 'GRP_STORES_DATA' && props?.editRecords?.length === 0) {
        
        field?.values?.forEach((store, storeIdx) => {
          field.fields.forEach((subField,chIdx) => {
            if (subField.required && !store[subField.field]) {
              validationPassed[subField.field] = false;
              errors[`${storeIdx}-${chIdx}-${subField.field}`] = `${subField.header} in Store ${chIdx + 1} is required`;
            }
          if (subField?.type?.toLowerCase() === 'list' && store[subField.field] && subField?.url) {
            const isValidList = subField?.values?.[storeIdx] && subField?.values?.[storeIdx]?.some(v => v.name === store[subField.field]?.name);
            let hasDuplicate = false;
            if (field?.values && Array.isArray(field.values)) {
              const valueNames = field.values
                .map(storeObj => {
                  const val = storeObj[subField.field];
                  return val && typeof val === 'object' ? val.name : val;
                })
                .filter(Boolean);
              const nameSet = new Set();
              for (const name of valueNames) {
                if (nameSet.has(name)) {
                  hasDuplicate = true;
                  break;
                }
                nameSet.add(name);
              }
            }
            if (hasDuplicate) {
              validationPassed[subField.field] = false;
              errors[`${storeIdx}-${chIdx}-${subField.field}`] = `${subField.header} has duplicate values`;
              toastRef.current.show({
                severity: 'error',
                summary: `Duplicate ${subField.header}`,
                detail: `${subField.header} has duplicate values`,
                life: 3000
              });
            }
            if (!isValidList) {
               validationPassed[subField.field] = false;
          
               errors[`${storeIdx}-${chIdx}-${subField.field}`] = `${subField.header} is not a valid  number`;
                toastRef.current.show({
                  severity: 'error',
                  summary: `Invalid ${subField.header}`,
                  detail: `${subField.header} is not a valid number`,
                  life: 3000
                });
            }
            // if (!isValidList) {
            //     validationPassed[subField.field] = true;
            // } else {
            //     validationPassed[subField.field] = false;
            //     errors[index] = `${subField.header} is not a valid ${subField.header} number`;
            //     toastRef.current.show({
            //       severity: 'error',
            //       summary: `Invalid ${subField.header}`,
            //       detail: `${subField.header} is not a valid ${subField.header} number`,
            //       life: 3000
            //     });
            // }
        }
          });
        });
      }
    });
    if (Object.keys(validationPassed).length > 0) {
       toastRef.current.show({
          severity: 'error',
          summary: 'Field Required',
          detail: `Mandatory fields are required`,
          life: 3000
        });
    }
    setFormErrors(errors);
    if (Object.keys(validationPassed).length === 0) {
      let newRecord = {};
      insertFields.forEach(item => {
        if (item.field === 'GRP_STORES_DATA') { 
          newRecord[item.field] = item?.values?.map(store => {
            const transformedStore = {};
            for (const key in store) {
              if (typeof store[key] === 'object' && store[key] !== null && 'name' in store[key]) {
                transformedStore[key] = store[key].name;
              } else {
                transformedStore[key] = store[key];
              }
            }
            return transformedStore;
          }) || [];
        } else {
        if (item.hasOwnProperty('default_value')) {
            if (item.default_value && !item.visibility) {
            newRecord[item.field] = '';
              return;
            }
            }
        newRecord[item.field] = Array.isArray(item?.value)
  ? item.value.map((val) => val?.name).join(",") 
  : typeof item?.value === 'object'
  ? item?.value?.name 
  : (item.value !== null && item.value !== undefined ? item.value : '');
          

        }
      });
      let tempFields = [];
      if(rowIndex !== undefined && rowIndex !== null){
        temporaryFields[rowIndex] = insertFields;
        tempFields = temporaryFields;
      }else {
         tempFields = [...temporaryFields,insertFields];
      }  
      setTemporaryFields(tempFields);
      const hasAtLeastOneValue = (obj) => {
        return obj && typeof obj === 'object' && Object.values(obj).some(value => {
          return value !== null && value !== undefined && value !== '';
        });
      }
      
      const hasValue = hasAtLeastOneValue(newRecord);
      if (hasValue) {
        if (typeof rowIndex !== undefined && rowIndex !== null) {
          setRecords((prevRecords) => {
            const updatedRecords = [...prevRecords];
            updatedRecords[rowIndex] = newRecord; // Replace the record at editIndex
            if (!props?.copiedRecords && typeof props?.getUpdatedRecords === 'function') {
              props.getUpdatedRecords(updatedRecords);
            }
            return updatedRecords;
          });
          setRowIndex(null)
        }
        else {
          setRecords((prevRecords) => [...prevRecords, newRecord]);
          setRowIndex(null)
        }
        clearFields();
      } else {
        toastRef.current.show({
          severity: 'error',
          summary: 'Value Required',
          detail: `No values provided`,
          life: 3000
        });
      }
    }
  };
  useEffect(()=>{
    props?.getRecords(records);
  },[records])
  /**
      @remarks Function to handle Reset all fields' values to an empty string or default value @author Raja
      */
  const clearFields = () => {
    const resetFields = props?.insertFields?.map(field => ({
      ...field,
      value: field?.field === 'GRP_STORES_DATA' ? field?.values?.map(() => ({})) : field?.default_value ??  '',
      values: field?.field === 'GRP_STORES_DATA' ? [] : field?.values
    }));
    const newFields = addInsertFields(resetFields);
    setDisabledFields([]);
    setInsertFields(newFields);
  };
   /** @remarks Function to handle date format */
  const formatDate = async (date) => {
    if (!date) return '';
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(currentHours).padStart(2, '0');
    const minutes = String(currentMinutes).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${'00'}:${'00'}:${'00'}`;
  };
    const formatDateObj =  (date) => {
    if (!date) return '';
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(currentHours).padStart(2, '0');
    const minutes = String(currentMinutes).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${'00'}:${'00'}:${'00'}`;
  };
   /** @remarks Function to handle Number input field */
  const handleNumberInputChange = (e, index, field) => {
    let value = e.target.value.replace(/[^0-9\s().]/g, '');  // Allow numbers, +, space, (), -, and .
    value = value.replace(/(\..*?)\..*/g, '$1');

  if (field?.field === 'CREDIT_PCT_COST' || field?.field === 'PASS_THROUGH_PERCENT') {
    if(value?.includes?.('.')){
      return;
    }
    const numericValue = parseFloat(value);
    if (numericValue < 0 || numericValue > 100) {
      return; // Exit 
    }
  }
    handleChange(index, value);
  };
 /**
 @remarks Function to patch selected product @author Shankar Anupoju
       */
  const handleRowClick = (e, updatedFieldsArray = storeInsertFields) => {

    const clickedRowData = e.data;
    let updatedFields = [];
    let fieldShowValues = []
    setRowIndex(e?.index);
    if(temporaryFields?.length > 0 && temporaryFields[e.index]){
      updatedFields = temporaryFields[e.index];
    }else {
     updatedFields = updatedFieldsArray?.map((item,index) => {
      const value = clickedRowData[item.field];
      const selectedValue = item?.VALUES?.find((val) => val?.name === value);
      const fieldsToShow = selectedValue?.fieldsToShow || [];
      if (fieldsToShow && fieldsToShow.length > 0) {
        fieldsToShow.map((s)=>{
          fieldShowValues.push(s);
        })
      }
      if (item.field === 'GRP_STORES_DATA' && Array.isArray(value)) {
        return {
          ...item,
          values: value
        };
      }
      if (item.field === 'CHAIN_NUMBER') {
                const transformedValue = Array.isArray(value)
                    ? value.map((val) => ({ name: val }))
                    : value
                    ? [{ name: value }]
                    : [];
                return {
                    ...item,
                    value: transformedValue,
                    values: item?.VALUES || [], 
                };
            }  
      if(item.field === 'PROFILE_LEVEL'){
        let profileList = [{name:'Store',value:'STORE'},{name:'Chain',value:'CHAIN'},{name:'Reclaim Customer Group',value:'RECLAIM_GROUP'},{name:'System Defaults',value:'SYSTEM'}];
        const profileValue = profileList.find((i) => i.value === value) 
        return {
          ...item,
            value: profileValue?.name || '',
        }
      }
      return {
        ...item,
        value: value,
      };
    });
    }
    fieldShowValues =  [...new Set(fieldShowValues)];
    const hiddenFields = getMatchedFieldObjects(updatedFields,fieldShowValues);
    const fields = [...updatedFields];
    let notMatchedFields = [];
    const finalFieldsMap = {};
    fields.forEach((field) => {
        finalFieldsMap[field.field] = {
            ...field
        };
    });
Object.keys(hiddenFields).forEach((item) => {
    hiddenFields[item]?.forEach((sub) => {
        sub?.VALUES.forEach((s) => {
            if (s?.fieldsToShow?.includes(item)) {
                if (finalFieldsMap[item]) {
                    finalFieldsMap[item].visibility = true;
                }
            } else {
                if (s.fieldsToShow) { 
                  if(!finalFieldsMap.hasOwnProperty(s.fieldsToShow[0]))
                    notMatchedFields.push(...s.fieldsToShow);
                }
            }
        });
    });
});
const finalFields = Object.values(finalFieldsMap);
    notMatchedFields = [...new Set(notMatchedFields)];
    const newFields = finalFields.map(field => {
      if (notMatchedFields.includes(field.field)) {
          return { ...field, visibility: false,value:'' }; 
      }
      return field;
  });
    if(navObj?.PARENT_MODULE === 'valueMap' && navObj?.CHILD_MODULE === "Value Maps"){
      const updatedData = newFields?.map(item => 
        item.field === 'id' ? { ...item, visibility: false } : item
    );
checkRuleFieldsEdit(updatedData)
    }else if(navObj?.PARENT_MODULE === 'rulesSetup' && navObj?.CHILD_MODULE === "Vendor Costing"){
      const removeReqList = ['AP_VENDOR', 'FACILITY', 'GL_CODE', 'MASTER_UPC'];
      // Find which fields in removeReqList have a value
      const filledFields = newFields.filter(
        (field) => removeReqList.includes(field.field) && field.value && field.value !== ''
      ).map(field => field.field);

      let updatedFieldsWithRequired;
      if (filledFields.length > 0) {
        // If any field in removeReqList has a value, set required: false for the rest in the list
        updatedFieldsWithRequired = newFields.map((field) => ({
          ...field,
          required: removeReqList.includes(field.field) && !filledFields.includes(field.field) ? false : field.required,
          values: [],
        }));
      } else {
        // If none are filled, set required: true for all in removeReqList
        updatedFieldsWithRequired = newFields.map((field) => ({
          ...field,
          required: removeReqList.includes(field.field) ? true : field.required,
          values: [],
        }));
      }
      setInsertFields(updatedFieldsWithRequired);
    } else{
      let disbaleRules = true;
      let updatedRulesData = [...newFields];
      newFields?.map((i) =>{
        if(i?.field === 'RULE_UPDATEABLE' && i?.value === 'N'){
          disbaleRules = false
        }
      })
      updatedRulesData = updatedRulesData?.map((e) =>{
        if(disbaleRules === false){
          return {...e, edit: e.field === 'RULE_EFFECTIVE_TO' ? true : false}
        }
        return e;
      })
      checkRuleFieldsEdit(updatedRulesData)
    }
    setSelectedProduct(clickedRowData)
  };
  /**
         @remarks Function to get matched  fields from the fieldsToShow array of the selected product
         @author Shankar Anupoju */
  const getMatchedFieldObjects = (data, targetArray) => {
    const matchedObjects = {};
    data?.forEach(item => {    
        if (Array.isArray(item?.VALUES)) {
            item?.VALUES.forEach(value => {              
                if (value?.fieldsToShow) {
                    value?.fieldsToShow?.forEach(field => {
                        if (targetArray.includes(field)) {
                            matchedObjects[field] = matchedObjects[field] || [];
                            matchedObjects[field].push(item);
                        }
                    });
                }
            });
        }
    });
    return matchedObjects;
};
  /**
         @remarks Function to get dynamically lookup values  @author Shankar Anupoju
         */
        //  const fetchSuggestions = async (field, query, index) => {
        //   console.log("Typed query:", query);
        
        //   // ✅ Immediately update the value in state
        //   setInsertFields(prevFields => {
        //     const newFields = [...prevFields];
        //     newFields[index] = {
        //       ...newFields[index],
        //       value: query,
        //     };
        //     return newFields;
        //   });
        
        //   // ✅ Clear any previous debounce timer
        //   if (debounceTimer) {
        //     clearTimeout(debounceTimer);
        //   }
        
        //   // ✅ Set new debounce timer
        //   const newTimer = setTimeout(async () => {
        //     const currentFields = [...insertFields]; // Grab latest state snapshot
        //     const currentField = currentFields[index];
        
        //     let dynamicPayload = { ...currentField.url.payload };
        
        //     currentFields.forEach(f => {
        //       if (f.value && dynamicPayload.hasOwnProperty(f.field)) {
        //         dynamicPayload[f.field] =
        //           typeof f.value === 'object' && f.value?.name
        //             ? f.value.name
        //             : f.value;
        //       }
        //     });
        
        //     dynamicPayload.searchValue = query;
        
        //     const body = {
        //       url: currentField.url.url,
        //       method: currentField.url.method,
        //       payload: { ...dynamicPayload, opType: "I" },
        //     };
        
        //     try {
        //       const result = await getLookUpSearch(body).unwrap();
        //       const newSuggestions = result?.result_set?.map(item => ({ name: item })) || [];
        
        //       // ✅ Only update 'values' for the matching field
        //       setInsertFields(prevFields => {
        //         const updatedFields = [...prevFields];
        //         updatedFields[index] = {
        //           ...updatedFields[index],
        //           values: newSuggestions,
        //         };
        //         return updatedFields;
        //       });
        
        //       if (newSuggestions.length === 0) {
        //         toastRef.current.show({
        //           severity: 'error',
        //           summary: 'Lookup',
        //           detail: 'No values found',
        //           life: 2000,
        //         });
        //       }
        //     } catch (error) {
        //       toastRef.current.show({
        //         severity: 'error',
        //         summary: 'Lookup',
        //         detail: 'Error fetching suggestions',
        //         life: 2000,
        //       });
        //     }
        //   }, 1000);
        
        //   setDebounceTimer(newTimer);
        // };
        const fetchSuggestions = async (field, query, index, level = null, parentIdx = null) => {
      
          // Add a flag to track if the fetch should be cancelled
          if (!level) {
            setInsertFields(prevFields => {
              const newFields = [...prevFields];
              newFields[index] = {
                ...newFields[index],
                value: query, // Update input instantly
              };
              return newFields;
            });
          }

          // If query is empty (clear button), cancel debounce and do not fetch
          if (query === '' || query === null) {
            if (debounceTimer) {
              clearTimeout(debounceTimer);
            }
            // Optionally clear suggestions for the field
            setInsertFields(prevFields => {
              const newFields = [...prevFields];
              if (!level) {
                newFields[index] = {
                  ...newFields[index],
                  values: [],
                };
              } else {
                const updatedFields = [...newFields[parentIdx].fields];
                updatedFields[index] = {
                  ...updatedFields[index],
                  values: [],
                };
                newFields[parentIdx] = {
                  ...newFields[parentIdx],
                  fields: updatedFields,
                };
              }
              return newFields;
            });
            return; // Stop further execution
          }

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          const newTimer = setTimeout(async () => {
            let dynamicPayload = { ...field.url.payload };
            insertFields.forEach(f => {
              if (f.value && dynamicPayload.hasOwnProperty(f.field)) {
                dynamicPayload[f.field] = typeof f.value === 'object' && f.value?.name
                  ? f.value.name
                  : f.value;
              }
            });
            dynamicPayload.searchValue = query;
            const body = {
              url: field.url.url,
              method: field.url.method,
              payload: { ...dynamicPayload, opType: "I" },
            };
            try {
              const result = await getLookUpSearch(body).unwrap();
              const updatedFields = [...insertFields];
              const updateFieldValues = (fields, targetField, newValue,idx = null) => {
                return fields.map(f => {
                    if (f.field === targetField) {
                    if (idx !== null) {
                      // Clone the existing values array or create a new one if undefined
                      const updatedValues = Array.isArray(f.values) ? [...f.values] : [];
                      updatedValues[idx] = newValue;
                        let obj = { values: updatedValues };
                        return {
                        ...f,
                        ...obj
                        };
                    } else {
                      return {
                        ...f,
                        values: newValue,
                      };
                    }
                    }
                  if (f.fields && Array.isArray(f.fields)) {
                    
                    return {
                      
                      ...f,
                      fields: updateFieldValues(f.fields, targetField, newValue,index),
                    };
                  }
                  return f;
                });
              };
              if (result?.result_set?.length > 0) {
                const newUpdatedFields = updateFieldValues(
                  updatedFields,
                  field.field,
                  result.result_set.map(item => ({ name: item }))
                );
                
                if (!level) {
                  setInsertFields(prevFields => {
                    const newFields = [...prevFields];
                    newFields[index] = {
                      ...newFields[index],
                      values: newUpdatedFields[index].values,
                    };
                    return newFields;
                  });
                } else {
                  setInsertFields(prevFields => {
                    const newFields = [...prevFields];
                    const updatedFields = newUpdatedFields[parentIdx].fields;
                    // const updatedField = {
                    //   ...updatedFields[index],
                    //   values: newUpdatedFields[parentIdx].fields[index].values,
                    // }; 
                    // updatedFields[index] = updatedField;
                    newFields[parentIdx] = {
                      ...newFields[parentIdx],
                      fields: updatedFields,
                    };
                    return newFields;
                  });
                }
              } else {
                const newUpdatedFields = updateFieldValues(updatedFields, field.field, []);
                setInsertFields(newUpdatedFields);
                toastRef.current.show({
                  severity: 'error',
                  summary: 'Lookup',
                  detail: 'No values found',
                  life: 2000,
                });
              }
            } catch (error) {
              toastRef.current.show({
                severity: 'error',
                summary: 'Lookup',
                detail: 'Error fetching suggestions',
                life: 2000,
              });
            }
          }, 1000);
          setDebounceTimer(newTimer);
        };
 /** @remarks Function to delete fields */
  const handleDelete=(data,index)=>{
   setRecords((prevRecords) => {
    const updatedRecords = [...prevRecords]; 
    updatedRecords.splice(index, 1);         
    return updatedRecords;                   
  });
  }
  /**
         @remarks Function to add new store values @author Shankar Anupoju
         */

  const removeAllStoreEndDate = () =>{
    let storesData = insertFields.find(item=>item.field === 'GRP_STORES_DATA');
    
    if(storesData && Array.isArray(storesData.values)){
      const updatedValues = storesData.values.map((store) => {
        return {
          ...store,
          STORE_EFFECTIVE_END_DATE: null
        };
      });
      const updatedFields = insertFields.map((field) => {
        if (field.field === 'GRP_STORES_DATA') {
          return { ...field, values: updatedValues };
        }
        return field;
      });
      setInsertFields(updatedFields);
    }
  }
  const addStoreFields = (field, index) => {
    
    let grpEndDate = insertFields.find(item=>item.field === 'GRP_EFFECTIVE_END_DATE');
    const newRow = {};
    const formattedDate =  formatDateObj(new Date());
    field.fields.forEach(item => {
      if (item.field === 'STORE_EFFECTIVE_END_DATE') {
      newRow[item.field] = grpEndDate?.value || '';
      } else {
      newRow[item.field] = item.default_value ?? (item.default ? formattedDate : '');
      }
    });
    const updatedValues = [...field.values, newRow];
    const updatedFields = [...insertFields];
    const updatedField = {
      ...updatedFields[index],
      values: updatedValues
    };
    updatedFields[index] = updatedField;
    setInsertFields(updatedFields);
  }
    /**
      @remarks  Function to handle Update the specific field's value based on user input @author Raja
      */
      const handleChange = (index, value, updatedFields = insertFields) => {
        
        updatedFields[index] = { ...updatedFields[index], value };
        const selectedValue = updatedFields[index]?.VALUES?.find(item => item?.name === value);
        const fieldsToShow = selectedValue?.fieldsToShow || [];
        // 3. Show/hide fields based on selected profile values
        let updateFields = updatedFields.map((field) => {
            if (updatedFields[index]?.VALUES) {
            const isInProfileValues = updatedFields[index]?.VALUES.some(
              (profile) => profile?.fieldsToShow?.includes(field.field)
            );
            if (isInProfileValues) {
              return {
              ...field,
              visibility: fieldsToShow.includes(field.field),
              value: ( updatedFields[index]?.field === 'SCAN_AGAINST_SALES_FLAG' &&
            value === 'Y' &&
            field.field === 'WGHT_AVG_TIME_HORIZ_VALIDA_WKS') ? '6' : ''
              };
            }
            }
          
          return field;
        });
        debugger
      
        // 4. Special case: if field is GRP_EFFECTIVE_END_DATE, update STORE_EFFECTIVE_END_DATE where missing
        if (updatedFields[index]?.field === 'GRP_EFFECTIVE_END_DATE') {
          updateFields = updateFields.map((field) => {
            if (field.field === 'GRP_STORES_DATA' && Array.isArray(field.values)) {
              const updatedValues = field.values.map((s) => {
                
                if (!s.STORE_EFFECTIVE_END_DATE) {
                  return {
                    ...s,
                    STORE_EFFECTIVE_END_DATE: value
                  };
                }
                return s;
              });
      
              return {
                ...field,
                values: updatedValues
              };
            }
      
            return field;
          });
        }
        if(updatedFields[index]?.field === 'SOURCE' && value === 'VENDOR_DEFAULT'){

          setShowVendorWarning(true);
        }else {
          setShowVendorWarning(false);
        }
      
      
        // 5. Update the insertFields state
        setInsertFields(updateFields);
      
        // 6. Remove validation error for this field if value exists
        if (value) {
          const updatedErrors = { ...formErrors };
          delete updatedErrors[index];
          setFormErrors(updatedErrors);
        }
        const removeReqList = ['AP_VENDOR','FACILITY','GL_CODE','MASTER_UPC'];
        
        // If value is empty string, set required: true for all fields in removeReqList
        if (value === '' && navObj?.CHILD_MODULE === 'Vendor Costing' && removeReqList.includes(updatedFields[index].field)) {
          
          const updatedFieldsWithRequired = updateFields.map((field) => ({
            ...field,
            required: removeReqList.includes(field.field) ? true : field.required,
            values:[]
          }));
          setInsertFields(updatedFieldsWithRequired);
        } else if (removeReqList.includes(updatedFields[index]?.field) && value && updateFields[index]?.values?.length > 0 && navObj?.CHILD_MODULE === 'Vendor Costing') {
          
          const updatedFieldsWithRequired = updateFields.map((field) => {
            if (removeReqList.includes(field.field) && field.field !== updatedFields[index].field) {
              return { ...field, required: false };
            }
            return field;
          });
          setInsertFields(updatedFieldsWithRequired);
        }
       
        // 7. Optionally run validation rules for specific fields
        if (
          (updateFields[index].field === "CUST_ITEM_CODE" && updateFields[index]?.values?.length > 0) ||
          (updateFields[index].field === "WHSE_ITEM_CODE" && updateFields[index]?.values?.length > 0) ||  
          updateFields[index].field === "RECLAIM_AS_SERVICE" && updateFields[index]?.VALUES?.length > 0 
          //  updateFields[index].field === "SCAN_AGAINST_SALES_FLAG" && updateFields[index]?.VALUES?.length > 0

        ) {
          checkRuleFields(updateFields[index]);
        }
      };
      
const checkRuleFields = (data) => {
  let disableList = [];
  let newFields = [...insertFields];
  const updateFields = (fields, targets, requiredStatus) => {
    return fields.map((item) => {
      if (targets.includes(item.field)) {
        
        return { ...item, required: requiredStatus };
      }
      return item;
    });
  };
  
  if ((data?.field === "CUST_ITEM_CODE" || data?.field === "WHSE_ITEM_CODE") && data?.value === "") {
     let venIdObjIdx = newFields.findIndex(s=>s.field === 'RECLAIM_AS_SERVICE');
    newFields[venIdObjIdx] = {...newFields[venIdObjIdx],value:'N'};
    disableList = [];
    setDisabledFields([]);
    newFields = updateFields(newFields, ["AP_VENDOR_NUMBER"], data?.field === "CUST_ITEM_CODE");
  } else if (data?.field === "CUST_ITEM_CODE" && data?.values?.length > 0) {
    disableList = ["WHSE_ITEM_CODE","AP_VENDOR_NUMBER","RECLAIM_AS_SERVICE",'NEW_VENDOR'];
    newFields = updateFields(newFields, disableList, false);
    let venIdObjIdx = newFields.findIndex(s=>s.field === 'RECLAIM_AS_SERVICE');
    newFields[venIdObjIdx] = {...newFields[venIdObjIdx],value:'Y'};
    setDisabledFields(disableList);
  } else if (data?.field === "WHSE_ITEM_CODE" && data?.values?.length > 0) {
    disableList = ["CUST_ITEM_CODE"];
    newFields = updateFields(newFields, disableList, false);
    setDisabledFields(disableList);
  } else if (data?.field === "RECLAIM_AS_SERVICE" && data?.VALUES?.length > 0){
    
    disableList = [];
    newFields = updateFields(newFields, ['AP_VENDOR_NUMBER'], data?.value === 'Y' ? false : true);
    setDisabledFields(disableList);
  }else if(data?.field === 'SCAN_AGAINST_SALES_FLAG' && data?.value === 'Y'){
    
     let venIdObjIdx = newFields.findIndex(s=>s.field === 'WGHT_AVG_TIME_HORIZ_VALIDA_WKS');
      newFields[venIdObjIdx] = {...newFields[venIdObjIdx],value:'8'};
   

  }
  setInsertFields(newFields);
  return disableList;
};
const checkRuleFieldsEdit=(data)=>{
let newInsertFields = data
let newArr=[]
newInsertFields?.map((item)=>{
  if (item?.field === "CUST_ITEM_CODE" && item?.value) {
    newArr =["AP_VENDOR_NUMBER","WHSE_ITEM_CODE","NEW_VENDOR","RECLAIM_AS_SERVICE"]
    setDisabledFields(newArr)
   
  }
  if (item?.field === "WHSE_ITEM_CODE" && item?.value) {
    newArr =["CUST_ITEM_CODE"]
    setDisabledFields(newArr)
   
  }
  let newFields=newInsertFields.map((item)=>{
    if (newArr?.includes(item?.field)) {
     return {...item,required:false}
    }
    return item
  })
    setInsertFields(newFields)
})
}
  /**
         @remarks Function to change values in a field @author Shankar Anupoju
         */
  const handleChangeSubFields = (rowIdx, value, field, parentIdx,item) => {
    
    const updatedFields = [...insertFields];
    const updatedValues = [...updatedFields[parentIdx].values];
    const updatedRow = { ...updatedValues[rowIdx] };
    updatedRow[field] =  value ;
    updatedValues[rowIdx] = updatedRow;
    updatedFields[parentIdx].values = updatedValues;
    setInsertFields(updatedFields);
  }
  // Function to remove a store field row
  const removeStoreFields = (field, rowIndex) => {
    const updatedFields = [...insertFields];
    // Find the specific field by its index
    const fieldIndex = insertFields.findIndex(f => f === field);
    if (fieldIndex > -1) {
      // Clone the values array for immutability
      const updatedValues = [...updatedFields[fieldIndex].values];
      // Remove the row at rowIndex
      updatedValues.splice(rowIndex, 1);
      // Update the field with the modified values
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        values: updatedValues
      };
      // Set the updated fields back to the state
      setInsertFields(updatedFields);
    }
  };

  const appendEndDate = () =>{
    let grpEndDate = insertFields.find(item=>item.field === 'GRP_EFFECTIVE_END_DATE');

    return grpEndDate.value ? new Date(grpEndDate.value):null
  }


  
  return (
    <div>
       {showVendorWarning && (
              <div className="card flex justify-content-center">
                <Dialog
                  header="Note"
                  visible={true}
                  style={{ width: "25vw" }}
                  onHide={() => setShowVendorWarning(false)}
                  footer={ <div className="d-flex justify-content-center">
                    <Button
                      className="p-2 m-2 secondary-button"
                      label="No"
                      onClick={() => {
                        setShowVendorWarning(false);
                        let index = insertFields.findIndex(s=>s.field === 'SOURCE');

                        handleChange(index,null);
                      }}
                    //onClick={() => handleDialogYesClick()}
                    />
                    <Button
                      className="p-2 m-2 border-button"
                      label="Yes"
                      onClick={() => {
                       // handleNewClick(); 
                        setShowVendorWarning(false);
                      }}
                      autoFocus
                    />
                  </div>}
                >
                  <p className="p-2 m-2 txtDialog">You have selected <b>Vendor Default</b>, are you sure you want to continue                  </p>
                </Dialog>
              </div>
            )}
      <Toast ref={toastRef} />
      <form >
        <div className='row m-0 d-flex'>
          {
            insertFields?.length > 0 ? (
              insertFields?.map((field, index) => {
              if (field?.create === true && field?.field !== 'GRP_STORES_DATA' && (field?.visibility !== false)) {
                return (
                  <div className='col-sm-3 mt-2 d-grid' style={{ flex: '0 0 20%' }} key={index}>
                    <label className='label'>
                      {field?.header} {field?.required === true && <label style={{ color: 'red' }}>*</label>}
                     
                    </label>
                    {field?.type?.toLowerCase() === 'text' && (
                      <InputText
                        value={field?.value }
                        disabled={props?.editRecords?.length > 0 && field.edit === false}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={formErrors[index] ? 'p-invalid autoWidth' : 'autoWidth'}
                        maxLength={field?.max_length}
                      />
                    )}
                    {field?.type?.toLowerCase() === 'email' && (
                      <InputText
                       value={field?.value}
                        disabled={props?.editRecords?.length > 0 && field.edit === false}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChange(index, value);
                          const isValidEmail = value.includes('@') && value.includes('.');
                          if (!isValidEmail) {
                            setFormErrors((prevErrors) => ({
                              ...prevErrors,
                              [index]: 'Invalid email format',
                            }));
                          } else {
                            setFormErrors((prevErrors) => ({
                              ...prevErrors,
                              [index]: '',
                            }));
                          }
                        }}
                        className={formErrors[index] ? 'p-invalid autoWidth' : 'autoWidth'}
                      />
                    )}
                    {field?.type?.toLowerCase() === 'list' && !field?.url && (
                      <Dropdown
                        className={`dd-List ${formErrors[index] ? 'p-invalid autoWidth' : 'autoWidth'}`}
                        options={
                          Array.isArray(field?.VALUES) &&
                            (typeof field?.VALUES[0] === 'string' || typeof field?.VALUES[0] === 'number')
                            ? field?.VALUES
                            : Array.isArray(field?.VALUES)
                              ? field?.VALUES.map(obj => ({ name: obj.name, value: obj }))
                              : []
                        }
                        disabled={(props?.editRecords?.length > 0 && field.edit === false) || disableFields?.includes(field?.field)}
                        onChange={(e) => handleChange(index, e.value)}
                       value={field?.value }
                        optionLabel="name"
                        optionValue="name"
                        placeholder="Select"
                        dropdownIcon={<i className="pi pi-chevron-down" />}
                      />
                    )}
                    {field?.type?.toLowerCase() === 'list' && field?.url && (
                      <div className="auto-complete-with-clear">
                      <AutoComplete
                         value={field?.value} 
                         suggestions={field?.values}
                        disabled={(props?.editRecords?.length > 0 && field.edit === false) || disableFields?.includes(field?.field)}
                        completeMethod={(e) => fetchSuggestions(field, e.query, index)}
                        onChange={(e) => handleChange(index, e.value)}
                        field="name"
                        placeholder="Start typing..."
                        className={formErrors[index] ? 'p-invalid auto-complete autoWidth' : 'auto-complete '}
                      />                     
                       <i
    className={`clear-icon pointer pi pi-times ${props?.editRecords?.length > 0 && field.edit === false ? 'disabled-icon' : ''}`}
                    onClick={() => handleChange(index, '')}
                  />
              </div>
                    )}
                    {                     
                      field?.type?.toLowerCase() === 'date' && (
                        <Calendar
                      value={field?.value ? new Date(field.value) :  null}
                          disabled={props?.editRecords?.length > 0 && field.edit === false}
                          onChange={async (e) => {
                            if (e.value) {
                              const formattedDate = await formatDate(e.value);
                              handleChange(index, formattedDate);
                            }else {
                              
                              handleChange(index, null);
                              if(field?.field === 'GRP_EFFECTIVE_END_DATE'){
                               
                                removeAllStoreEndDate();
                                
                              }
                            }
                          }}
                        className={formErrors[index] ? 'p-invalid autoWidth calender-css' : 'calender-css autoWidth'}
                          showIcon
                          minDate={field?.previousdate === false ? new Date() : null}

                           {...(field?.maxDate ? { maxDate: new Date(field.maxDate) } : {})}
                          //maxDate={new Date(field?.maxDate)}
                          showButtonBar 
                        />
                      )}
                    {field?.type?.toLowerCase() === 'number' && (
                      <InputText
                        type="text"
                        disabled={props?.editRecords?.length > 0 && field.edit === false}
                       value={field?.value}
                        onChange={(e) => handleNumberInputChange(e, index, field)}
                        className={formErrors[index] ? 'p-invalid autoWidth' : 'autoWidth'}
                        maxLength={field?.max_length}
                      />
                    )}
                    {field?.type?.toLowerCase() === 'mobile' && (
                       <InputMask id="phone" value={field?.value || ''} onChange={(e) =>handleChange(index, e.value)} disabled={props?.editRecords?.length > 0 && field.edit === false} className={formErrors[rowIndex] ? 'p-invalid autoWidth' : 'autoWidth'}  mask="(999) 999-9999" placeholder="(999) 999-9999"></InputMask>                    
                    )}
                    {field?.type?.toLowerCase() === 'multiselect' && (
                      <MultiSelect
                        value={Array.isArray(field?.value) ? field.value : []}
                        options={field?.values}
                        onChange={(e) => handleChange(index, e.value)}
                        onFilter={(e) => fetchSuggestions(field, e.filter, index)}
                        optionLabel="name"
                        placeholder="Select Values"
                        filter
                        maxSelectedLabels={1}
                        disabled={props?.editRecords?.length > 0 && field.edit === false}
                        className={formErrors[index] ? 'p-invalid custom-multi-select autoWidth' : 'custom-multi-select autoWidth'}
                      />
                    )}
                      {field?.type?.toLowerCase() === 'decimal' && (
                      <InputText
                        type="number"
                        value={field?.value || ''}
                        onChange={(e) => {
                          if(field?.max_length) {
                            let val = e.target.value;
                            val = val.replace(/[^0-9.]/g, '');
                            const parts = val.split('.');
                            if (parts.length > 2) return;
                            const digitsBefore = parts[0] || '';
                            const digitsAfter = parts[1] || '';
                            const totalDigits = digitsBefore.length + digitsAfter.length;                 
                            if (totalDigits <= field.max_length) {
                              handleNumberInputChange({ target: { value: val } }, index);
                            }
                          } else {
                            handleNumberInputChange({ target: { value: e?.target?.value } }, index);
                          }
                          
                        }}
                        // onBlur={(e) => {
                        //   let val = e.target.value;
                        //   if (!val.includes('.')) {
                        //     val = `${val}.000`;
                        //     handleNumberInputChange({ target: { value: val } }, index);
                        //   }
                        // }}
                        className={formErrors[index] ? 'p-invalid autoWidth' : 'autoWidth'}
                        step={field?.field === 'trans_control_num' ? "1" : "0.1"}
                        min="0.00"
                        maxLength={field.max_length}
                        disabled={props?.editRecords?.length > 0 && field.edit === false}
                      />
                    )}
                  </div>
                );
              }
              if (field?.create === true && field?.field === 'GRP_STORES_DATA' && field?.values && field?.values?.length > 0 && props?.editRecords?.length === 0) {
                return (
                  <div className="row m-0 d-flex">
                    <span className='title-tag mt-5 p-0 d-flex justify-content-between'>Store Assignment {field?.values?.length > 0 && <div className='col-sm-1 mt-auto text-end mb-2'>
                      <img src={plusIcon} alt='Add Store' className='pointer' width={24} onClick={() => addStoreFields(field, index)} />
                    </div>}</span>
                    <hr />
                    {field?.values?.map((item, rowIndex) => (
                      <div className='row p-0 mt-2'>
                        <div className='col-11 d-flex mt-2 gap-3' key={rowIndex}>
                          {field.fields.map((subField, idx) => (
                            <div className='col-sm-3 d-grid' key={idx}>
                              <label className='label'>
                                {subField.header} {subField.required && <label style={{ color: 'red' }}>*</label>}
                              </label>
                              {subField.type.toLowerCase() === 'text' && (
                                <InputText
                                
                                  value={item[subField.field] || ''}
                                  disabled={props?.editRecords?.length > 0 && field.edit === false}
                                  onChange={(e) => handleChangeSubFields(rowIndex, e.target.value, subField.field, index)}
                                  className={formErrors[`${rowIndex}-${idx}-${subField.field}`]  ? 'p-invalid autoWidth' : 'autoWidth'}
                                />
                              )}
                              {subField.type.toLowerCase() === 'list' && !subField.url && (
                                <Dropdown
                                  className={`dd-List ${formErrors[`${rowIndex}-${idx}-${subField.field}`]  ? 'p-invalid autoWidth' : 'autoWidth'}`}
                                  disabled={props?.editRecords?.length > 0 && field.edit === false}
                                  options={
                                    Array.isArray(subField?.VALUES) &&
                                      (typeof subField?.VALUES[0] === 'string' || typeof subField?.VALUES[0] === 'number')
                                      ? subField?.VALUES
                                      : Array.isArray(subField?.VALUES)
                                        ? subField?.VALUES.map(obj => ({ name: obj.name, value: obj }))
                                        : []
                                  }
                                  onChange={(e) => handleChangeSubFields(rowIndex, e.target.value, subField.field, index)}
                                  value={item[subField.field]}
                                  placeholder="Select"
                                  dropdownIcon={<i className="pi pi-chevron-down" />}
                                />
                              )}
                              {subField.type.toLowerCase() === 'list' && subField.url && (
                                <div className="auto-complete-with-clear-store">
                                <AutoComplete
                                  value={item[subField.field]}
                                  disabled={props?.editRecords?.length > 0 && field.edit === false }
                                  suggestions={subField?.values?.[rowIndex]}
                                  completeMethod={(e) => fetchSuggestions(subField, e.query, rowIndex,'sub',index)}
                                  onChange={(e) => handleChangeSubFields(rowIndex, e.value, subField.field, index)}
                                  field="name"
                                  placeholder="Start typing..."
                                  className={formErrors[`${rowIndex}-${idx}-${subField.field}`] ? 'p-invalid form-auto-complete autoWidth' : 'form-auto-complete autoWidth'}
                                />
                                          <i className={`clear-icon-store pointer pi pi-times ${props?.editRecords?.length > 0 && field.edit === false ? 'disabled-icon' : ''}`} 
                                onClick={() => handleChangeSubFields(rowIndex, '', subField.field, index, item)}
                            />
                  </div>
                              )}
                              { 
                              
                                subField.type.toLowerCase() === 'date' && (
                                  <Calendar
                          
                                     value={ item[subField?.field] ? new Date(item[subField?.field]) : subField?.default ? new Date():null}
                                    disabled={props?.editRecords?.length > 0 && field.edit === false}
                                    onChange={async (e) => {
                                      const formattedDate = await formatDate(e.value);
                                      handleChangeSubFields(rowIndex, formattedDate, subField.field, index)
                                    }} 
                                    className={formErrors[`${rowIndex}-${idx}-${subField.field}`] ? 'p-invalid autoWidth calender-css' : 'calender-css autoWidth'}
                                    showIcon
                                    minDate={subField?.previousdate === false ? new Date() : null}
                                    maxDate={subField?.field === 'STORE_EFFECTIVE_END_DATE' ? appendEndDate() : null}
                                    showButtonBar
                                  />
                                )
                                }
                              {subField.type.toLowerCase() === 'number' && (
                                <InputText
                                  type="text"
                                  disabled={props?.editRecords?.length > 0 && field.edit === false}
                                  value={item[subField.field] || ''}
                                  onChange={(e) => handleChangeSubFields(rowIndex, e.target.value, subField.field, index)}
                                  className={formErrors[`${rowIndex}-${idx}-${subField.field}`]  ? 'p-invalid autoWidth' : 'autoWidth'}
                                />
                              )}
                              {subField.type.toLowerCase() === 'mobile' && (
                                <InputMask id="phone" value={item[subField.field] || ''} onChange={(e) => handleChange(rowIndex, e.target.value, subField.field, index)} disabled={props?.editRecords?.length > 0 && field.edit === false} className={formErrors[rowIndex] ? 'p-invalid autoWidth' : 'autoWidth'}  mask="(999) 999-9999" placeholder="(999) 999-9999"></InputMask>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="col-1 p-0 d-flex justify-content-end mt-4">
                          <img src={deleteIcon} alt='Add Store' className='pointer' width={24} onClick={() => removeStoreFields(field, rowIndex)} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
            return null;
            })) : (
              <>
                {props?.insertFields.map((_, i) => (
                  <div className="col-sm-3 mt-2" key={i} style={{ flex: '0 0 20%' }}>
                    <Skeleton width="50%" height="1rem" className="mb-1" />
                    <Skeleton width="100%" height="2.5rem" className="p-inputtext autoWidth" borderRadius="4px" />
                  </div>
                ))}
              </>
            )
          }
        </div>
        <div className="mt-3 d-flex justify-content-between">
          {((props?.editRecords?.length > 0 || props?.copiedRecords?.length > 0) && insertFields?.length > 0 && rowIndex >= 0) && (
            <div className="col-sm-1 justify-content-start d-flex">
              {rowIndex > 0 && (
                <img
                  src={previousIcon}
                  className='pointer'
                  title='Pre Record'
                  alt="icon"
                  width={22}
                  onClick={() => {
                    const previousData = props?.editRecords[rowIndex - 1] || props?.copiedRecords[rowIndex - 1];
                    handleRowClick({ data: previousData, index: rowIndex - 1 });
                    }}
                  />
                  )}
                </div>
                )}
                <div className={((props?.editRecords?.length > 0 || props?.copiedRecords?.length) > 0 && insertFields?.length > 0) ? "col-sm-10 d-flex justify-content-center d-flex gap-2" : "col-sm-12 d-flex justify-content-center d-flex gap-2"}>
                {props?.editRecords?.length > 0 ? '' : <button type="button" className='secondary-button' onClick={clearFields}>Clear</button>}
                <button type="submit" className='primary-button' onClick={handleSubmit}>{props?.editRecords?.length > 0 ? "Update" : "Add"}</button>
                </div>
                {((props?.editRecords?.length > 0 || props?.copiedRecords?.length > 0) && insertFields?.length > 0 && rowIndex >= 0) && (
                <div className="col-sm-1 justify-content-end d-flex">
                  {rowIndex < props?.editRecords?.length - 1 && (
                  <img
                    src={nextIcon}
                    className='pointer'
                    title='Next Record'
                    alt="icon"
                    width={22}
                    onClick={() => handleRowClick({ data: props?.editRecords[rowIndex + 1], index: rowIndex + 1 })}
                  />
                  )}
                  {rowIndex < props?.copiedRecords?.length - 1 && (
                  <img
                    src={nextIcon}
                    className='pointer'
                    title='Next Record'
                    alt="icon"
                    width={22}
                    onClick={() => handleRowClick({ data: props?.copiedRecords[rowIndex + 1], index: rowIndex + 1 })}
                  />
                  )}
                </div>
                )}
              </div>
              </form>    
              {
              records?.length > 0 ? (
              <div className='mt-3' style={{ height: "calc(100vh - 76vh)", overflow: "auto" }}>
                <DataTable className="grid" value={records} resizableColumns selectionMode="single" selection={selectedProduct} onRowClick={props?.editRecords?.length > 0 || records.length > 0 ? (e) => handleRowClick(e) : null}>             
                {(() => {
                  // Collect all fields that are present in records (even if not visible in insertFields)
                    // 1. Collect all fields from insertFields (with config)
                    const insertFieldMap = {};
                    insertFields.forEach(f => { insertFieldMap[f.field] = f; });

                    // 2. Collect all fields present in any record (not just records[0])
                    const allRecordFields = Array.from(
                    new Set(records.flatMap(rec => Object.keys(rec)))
                    );

                    // 3. Merge: show all fields from insertFields, plus any extra fields from records
                    const allFields = [
                    ...insertFields.map(f => f.field),
                    ...allRecordFields.filter(f => !insertFieldMap[f])
                    ];
                    

                    // 4. Only show columns if:
                    //    - config.visibility !== false
                    //    - OR any record has a non-empty value for that field
                    return allFields.filter(field => field !== 'GRP_STORES_DATA')
                    .filter(field => {
                      const config = insertFieldMap[field];
                      console.log(config)
                      const isVisible = config?.visibility !== false;
                      const hasValue = records.some(rec => {
                      const val = rec[field];
                      return val !== undefined && val !== null && val !== '';
                      });
                      return isVisible || hasValue;
                    })
                    .map((field, index) => {
                      const config = insertFieldMap[field];
                      const header = config?.header || field;
                    
                      // Hide 'id' column if navObj.CHILD_MODULE === 'valuemap'
                      if (navObj?.CHILD_MODULE === 'Value Maps' && navObj?.PARENT_MODULE === 'valueMap' && header === 'id') {
                        return false;
                      }
                      
                  
                     // console.log(field);
                        return (
                        <Column
                          key={field}
                          frozen={config?.frozen}
                          field={field}
                          header={header}
                          body={(rowData, options) => {
                          const rowIndex = options.rowIndex;
                          const originalValue = backUpRecords?.[rowIndex]?.[field];
                          const currentValue = rowData?.[field];
                          const isChanged = originalValue !== currentValue && (props?.editRecords?.length > 0 || props?.copiedRecords?.length > 0);

                          // Highlight the entire cell (td) by applying a class to the cell
                          return (
                            <div className={isChanged ? 'highlight-changed-td' : ''}>
                            {currentValue}
                            </div>
                          );
                          }}
                          bodyClassName={(rowData, options) => {
                          const rowIndex = options.rowIndex;
                          const originalValue = backUpRecords?.[rowIndex]?.[field];
                          const currentValue = rowData?.[field];
                          const isChanged = originalValue !== currentValue && (props?.editRecords?.length > 0 || props?.copiedRecords?.length > 0);
                          return isChanged ? 'highlight-changed-td' : '';
                          }}
                        />
                        );
                    });
                
                  })()}
                {props?.editRecords.length === 0 && 
                  <Column 
                  header="Actions" 
                  body={(rowData, { rowIndex }) => (
                    <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(rowData, rowIndex)}
                    >
                      Delete
                    </button>
                    </div>
                  )} 
                  style={{ textAlign: 'center', width: '10em' }}
                  />}
                </DataTable>    
                </div>
              ) : 
               (
              props?.editRecords?.length > 0 && 
              <div className='d-flex m-0 align-items'>
              <DataTable
                className="grid"
                value={Array(12).fill({})} // Skeleton data for 10 rows
          rows={props?.editRecords?.length} // Keep rows count the same as the actual DataTable
          paginator={props?.paginator} // Skeleton view won't have a paginator
          tableStyle={{ minWidth: '103rem' }}
        >         
            {Array(10).fill().map((_, i) => (
              <Column
                key={i}
                header={<Skeleton width="5rem" />}
                body={() => <Skeleton width="100%" height="2rem" />}  // Show skeletons
              />
            )
            )
    }
      </DataTable>
    </div>
       )  
      }
    </div>
  )
}
export default DynamicForm;