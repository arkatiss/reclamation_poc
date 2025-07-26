import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import  {  useState } from 'react';
import { useSelector } from 'react-redux';

export const EditRecord = (props) => {
  console.log('EditRecord props', props?.insertFields);
    const {  field ,index} = props;
    const [formErrors, setFormErrors] = useState({});
     const navObj = useSelector((state) => state.navigation);
    const [insertFields, setInsertFields] = useState(props?.insertFields || []);
    const [showVendorWarning,setShowVendorWarning] = useState(false);
    
    const formatDate = async (date) => {
        if (!date) return '';
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const year = date?.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(currentHours).padStart(2, '0');
        const minutes = String(currentMinutes).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${'00'}:${'00'}:${'00'}`;
    };
       const handleChange = (value, rowData,updatedFields = insertFields) => {
        
        // Create a shallow copy to avoid mutating state directly
        const fieldName = rowData?.field;
        const fieldIndex = updatedFields.findIndex((f) => f.field === fieldName);
        const fieldsCopy = [...updatedFields];
        fieldsCopy[fieldIndex] = { ...fieldsCopy[fieldIndex], value };
        
       
        const selectedValue = fieldsCopy[fieldIndex]?.VALUES?.find(item => item?.name === value);
        const fieldsToShow = selectedValue?.fieldsToShow || [];
        // 3. Show/hide fields based on selected profile values
        let updateFields = fieldsCopy.map((field) => {
            if (fieldsCopy[fieldIndex]?.VALUES) {
            const isInProfileValues = fieldsCopy[fieldIndex]?.VALUES.some(
              (profile) => profile?.fieldsToShow?.includes(field.field)
            );
            if (isInProfileValues) {
              let updatedValue = (fieldsCopy[fieldIndex]?.field === 'SCAN_AGAINST_SALES_FLAG' &&
            value === 'Y' &&
            field.field === 'WGHT_AVG_TIME_HORIZ_VALIDA_WKS') ? '6' : ''
              props?.updateRowData(index, updatedValue,field?.field);
              return {
              ...field,
              edit:fieldsToShow.includes(field.field),
              visibility: fieldsToShow.includes(field.field),
              value: ( fieldsCopy[fieldIndex]?.field === 'SCAN_AGAINST_SALES_FLAG' &&
            value === 'Y' &&
            field.field === 'WGHT_AVG_TIME_HORIZ_VALIDA_WKS') ? '6' : ''
              };
            }
            }
          
          return field;
        });
        
      
        // 4. Special case: if field is GRP_EFFECTIVE_END_DATE, update STORE_EFFECTIVE_END_DATE where missing
        if (fieldsCopy[fieldIndex]?.field === 'GRP_EFFECTIVE_END_DATE') {
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
        if(fieldsCopy[fieldIndex]?.field === 'SOURCE' && value === 'VENDOR_DEFAULT'){

          setShowVendorWarning(true);
        }else {
          setShowVendorWarning(false);
        }
      
      
        // 5. Update the insertFields state
        props?.setInsertFields(updateFields);
      
        // 6. Remove validation error for this field if value exists
        if (value) {
          const updatedErrors = { ...formErrors };
          delete updatedErrors[fieldIndex];
          setFormErrors(updatedErrors);
        }
        const removeReqList = ['AP_VENDOR','FACILITY','GL_CODE','MASTER_UPC'];
        
        // If value is empty string, set required: true for all fields in removeReqList
        if (value === '' && navObj?.CHILD_MODULE === 'Vendor Costing' && removeReqList.includes(fieldsCopy[fieldIndex].field)) {
          
          const updatedFieldsWithRequired = updateFields.map((field) => ({
            ...field,
            required: removeReqList.includes(field.field) ? true : field.required,
            values:[]
          }));
          props?.setInsertFields(updatedFieldsWithRequired);
        } else if (removeReqList.includes(fieldsCopy[fieldIndex]?.field) && value && updateFields[fieldIndex]?.values?.length > 0 && navObj?.CHILD_MODULE === 'Vendor Costing') {

          const updatedFieldsWithRequired = updateFields.map((field) => {
            if (removeReqList.includes(field.field) && field.field !== fieldsCopy[fieldIndex].field) {
              return { ...field, required: false };
            }
            return field;
          });
          props?.setInsertFields(updatedFieldsWithRequired);
        }
       
        // 7. Optionally run validation rules for specific fields
        if (
          (updateFields[fieldIndex]?.field === "CUST_ITEM_CODE" && updateFields[fieldIndex]?.values?.length > 0) ||
          (updateFields[fieldIndex]?.field === "WHSE_ITEM_CODE" && updateFields[fieldIndex]?.values?.length > 0) ||  
          (updateFields[fieldIndex]?.field === "RECLAIM_AS_SERVICE" && updateFields[fieldIndex]?.VALUES?.length > 0)
          //  updateFields[index].field === "SCAN_AGAINST_SALES_FLAG" && updateFields[index]?.VALUES?.length > 0

        ) {
          //checkRuleFields(updateFields[index]);
        }
         props?.updateRowData(index, value,fieldName);
      };
        const handleNumberInputChange = (e, field) => {
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
    handleChange(value,field);
  };
  const fetchSuggestions = async (field, query) => {
     props?.fetchSuggestions(field, query, index, null);
  }
    if (!field ||  field?.create !== true || field?.field === 'GRP_STORES_DATA') {
      
        return <span>{field?.value}</span>;
    }
 

    return (
        
        <div className='' >
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
        
                                handleChange(index,field);
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
            {/* <label className='label'>
                {field?.header} {field?.required === true && <label style={{ color: 'red' }}>*</label>}
            </label> */}
            
            {field?.type?.toLowerCase() === 'text' && (
                <InputText
                    value={field?.value}
                    disabled={!field.edit}
                    onChange={(e) => handleChange(e.target.value,field)}
                    className={formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}
                    maxLength={field?.max_length}
                />
            )}
            {field?.type?.toLowerCase() === 'email' && (
                <InputText
                    value={field?.value}
                    disabled={!field.visibility}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleChange(value, field);
                        const isValidEmail = value.includes('@') && value.includes('.');
                        if (!isValidEmail) {
                            setFormErrors({ 0: 'Invalid email format' });
                        } else {
                            setFormErrors({ 0: '' });
                        }
                    }}
                    className={formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}
                />
            )}
            {/* {    JSON.stringify(formatValue(field))} */}
            {field?.type?.toLowerCase() === 'list' && !field?.url && (
              
                <Dropdown
                    className={`dd-List ${formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}`}
                    options={
                        Array.isArray(field?.VALUES) &&
                        (typeof field?.VALUES[0] === 'string' || typeof field?.VALUES[0] === 'number')
                            ? field?.VALUES
                            : Array.isArray(field?.VALUES)
                                ? field?.VALUES.map(obj => ({ name: obj.name, value: obj }))
                                : []
                    }
                    disabled={!field?.edit}
                    onChange={(e) => handleChange(e.value,field)}
      value={
        field?.field === 'PROFILE_LEVEL'
          ? (() => {
              const profileList = [
                { name: 'Store', value: 'STORE' },
                { name: 'Chain', value: 'CHAIN' },
                { name: 'Reclaim Customer Group', value: 'RECLAIM_GROUP' },
                { name: 'System Defaults', value: 'SYSTEM' }
              ];
              const profileValue = profileList.find((i) => i.value === field.value);
              return profileValue ? profileValue.name : field.value;
            })()
          :  field.field === 'CHAIN_NUMBER' ? (() => {
                const transformedValue = Array.isArray(field.value)
                    ? field.value.map((val) => ({ name: val }))
                    : field.value
                    ? [{ name: field.value }]
                    : [];
                return transformedValue;
            })()
          : field?.value
      }
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
                        disabled={!field.edit}
                         completeMethod={(e) => fetchSuggestions(field, e.query)}
                        onChange={(e) => handleChange(e.value,field)}
                        field="name"
                        placeholder="Start typing..."
                        className={formErrors[0] ? 'p-invalid auto-complete autoWidth' : 'auto-complete '}
                    />
                    <i
                        className={`clear-icon pointer pi pi-times ${ !field.edit? 'disabled-icon' : ''}`}
                        onClick={() => handleChange('',field)}
                    />
                </div>
            )}
            {field?.type?.toLowerCase() === 'date' && (
                <Calendar
                    value={field?.value ? new Date(field.value) : null}
                    disabled={!field.edit}
                    onChange={async (e) => {
                        if (e.value) {
                            const formattedDate = await formatDate(e.value);
                            handleChange(formattedDate,field);
                        } else {
                            handleChange(null,field);
                        }
                    }}
                    className={formErrors[0] ? 'p-invalid autoWidth calender-css' : 'calender-css autoWidth'}
                    showIcon
                    minDate={field?.previousDate === false ? new Date() : null}
                    {...(field?.maxDate ? { maxDate: new Date(field.maxDate) } : {})}
                    showButtonBar
                />
            )}
            {field?.type?.toLowerCase() === 'number' && (
                <InputText
                    type="text"
                    disabled={!field.edit}
                    value={field?.value}
                     onChange={(e) => handleNumberInputChange(e, field)}
                    className={formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}
                    maxLength={field?.max_length}
                />
            )}
            {field?.type?.toLowerCase() === 'mobile' && (
                <InputMask
                    id="phone"
                    value={field?.value || ''}
                    onChange={(e) => handleChange(e.value,field)}
                    disabled={!field.edit}
                    className={formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}
                    mask="(999) 999-9999"
                    placeholder="(999) 999-9999"
                />
            )}
            {field?.type?.toLowerCase() === 'multiselect' && (
                <MultiSelect
                    value={Array.isArray(field?.value) ? field.value : []}
                    options={field?.values}
                    onChange={(e) => handleChange(e.value,field)}
                     onFilter={(e) => fetchSuggestions(field, e.filter)}
                    optionLabel="name"
                    placeholder="Select Values"
                    filter
                    maxSelectedLabels={1}
                    disabled={!field.edit}
                    className={formErrors[0] ? 'p-invalid custom-multi-select autoWidth' : 'custom-multi-select autoWidth'}
                />
            )}
            {field?.type?.toLowerCase() === 'decimal' && (
                <InputText
                    type="number"
                    value={field?.value || ''}
                    onChange={(e) => {
                        if (field?.max_length) {
                            let val = e.target.value;
                            val = val.replace(/[^0-9.]/g, '');
                            const parts = val.split('.');
                            if (parts.length > 2) return;
                            const digitsBefore = parts[0] || '';
                            const digitsAfter = parts[1] || '';
                            const totalDigits = digitsBefore.length + digitsAfter.length;
                            if (totalDigits <= field.max_length) {
                                 handleNumberInputChange({ target: { value: val } },field);
                            }
                        } else {
                             handleNumberInputChange({ target: { value: e?.target?.value } },field);
                        }
                    }}
                    className={formErrors[0] ? 'p-invalid autoWidth' : 'autoWidth'}
                    step={field?.field === 'trans_control_num' ? "1" : "0.1"}
                    min="0.00"
                    maxLength={field.max_length}
                    disabled={!field.edit}
                />
            )}
        </div>
    );
};

export default EditRecord;