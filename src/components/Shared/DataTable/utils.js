import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLookUpSearchMutation } from "../../../services/common";

export const useUtils = () => {
  const navObj = useSelector((state) => state.navigation);
  const [debounceTimer, setDebounceTimer] = useState(null);
   const [getLookUpSearch, { data: lookupData }] = useLookUpSearchMutation();
  const toastRef = useRef(null);
  const handleRowClickFun = async (e, updatedFieldsArray, productColumns) => {
    const clickedRowData = e.data;
    let updatedFields = [];
    let fieldShowValues = [];

    updatedFields = updatedFieldsArray?.map((item) => {
      const value = clickedRowData[item.field];
      const selectedValue = item?.VALUES?.find((val) => val?.name === value);
      const fieldsToShow = selectedValue?.fieldsToShow || [];

      if (fieldsToShow.length > 0) {
        fieldShowValues.push(...fieldsToShow);
      }

      if (item.field === "GRP_STORES_DATA" && Array.isArray(value)) {
        return { ...item, values: value };
      }

      if (item.field === "CHAIN_NUMBER") {
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

      if (item.field === "PROFILE_LEVEL") {
        const profileList = [
          { name: "Store", value: "STORE" },
          { name: "Chain", value: "CHAIN" },
          { name: "Reclaim Customer Group", value: "RECLAIM_GROUP" },
          { name: "System Defaults", value: "SYSTEM" },
        ];
        const profileValue = profileList.find((i) => i.value === value);
        return {
          ...item,
          value: profileValue?.name || "",
        };
      }

      return { ...item, value };
    });

    // Deduplicate
    fieldShowValues = [...new Set(fieldShowValues)];
    const hiddenFields = getMatchedFieldObjects(updatedFields, fieldShowValues);
    const finalFieldsMap = {};
    updatedFields.forEach((field) => {
      finalFieldsMap[field.field] = { ...field };
    });
    
    Object.keys(hiddenFields).forEach((item) => {
      hiddenFields[item]?.forEach((sub) => {
       // sub?.VALUES?.forEach((s) => {
         // if (s?.fieldsToShow?.includes(item)) {
            if (finalFieldsMap[item]) {
              finalFieldsMap[item].visibility = true;
            }
        //  }
      //  });
      });
    });

    const notMatchedFields = [];
    Object.keys(hiddenFields).forEach((item) => {
      hiddenFields[item]?.forEach((sub) => {
        sub?.VALUES?.forEach((s) => {
          if (
            !s.fieldsToShow?.includes(item) &&
            s.fieldsToShow &&
            !finalFieldsMap.hasOwnProperty(s.fieldsToShow[0])
          ) {
            notMatchedFields.push(...s.fieldsToShow);
          }
        });
      });
    });

    const finalFields = Object.values(finalFieldsMap);
    const newFields = finalFields.map((field) => {
      if (notMatchedFields.includes(field.field)) {
        return { ...field, visibility: false, value: "" };
      }
      return field;
    });

    let updatedFinalFields = [...newFields];

    if (
      navObj?.PARENT_MODULE === "valueMap" &&
      navObj?.CHILD_MODULE === "Value Maps"
    ) {
      updatedFinalFields = newFields.map((item) =>
        item.field === "id" ? { ...item, visibility: false } : item
      );
    } else if (
      navObj?.PARENT_MODULE === "rulesSetup" &&
      navObj?.CHILD_MODULE === "Vendor Costing"
    ) {
      const removeReqList = ["AP_VENDOR", "FACILITY", "GL_CODE", "MASTER_UPC"];
      const filledFields = newFields
        .filter(
          (field) =>
            removeReqList.includes(field.field) &&
            field.value &&
            field.value !== ""
        )
        .map((field) => field.field);

      updatedFinalFields = newFields.map((field) => ({
        ...field,
        required:
          removeReqList.includes(field.field) &&
          !filledFields.includes(field.field)
            ? false
            : removeReqList.includes(field.field)
            ? true
            : field.required,
        values: [],
      }));
    } else {
      
      let disableRules = true;
      if (
        newFields.find(
          (i) => i?.field === "RULE_UPDATEABLE" && i?.value === "N"
        )
      ) {
        disableRules = false;
      }
      
      if(e.data.hasOwnProperty("RULE_UPDATEABLE") && e.data.RULE_UPDATEABLE === "N"){
        disableRules = false;
      }

      updatedFinalFields = newFields.map((e) => {
        if (!disableRules) {
          return {
            ...e,
            edit: e.field === "RULE_EFFECTIVE_TO" ? true : false,
          };
        }
        return e;
      });

      // Custom edit rules (CUST_ITEM_CODE disables others, etc.)
      const disableMap = {};
      updatedFinalFields.forEach((item) => {
        if (item?.field === "CUST_ITEM_CODE" && item?.value) {
          ["AP_VENDOR_NUMBER", "WHSE_ITEM_CODE", "NEW_VENDOR", "RECLAIM_AS_SERVICE"].forEach(
            (f) => {
              disableMap[f] = true;
            }
          );
        } else if (item?.field === "WHSE_ITEM_CODE" && item?.value) {
          disableMap["CUST_ITEM_CODE"] = true;
        }
      });

      updatedFinalFields = updatedFinalFields.map((item) => {
        if (disableMap[item.field]) {
          return { ...item, required: false, visibility: false };
        }
        return item;
      });
    };
    
    // updatedFinalFields = handleMissingFields([e.data], updatedFinalFields);

    return updatedFinalFields;
  };
const handleMissingFields = (records, insertFields, productColumns = []) => {
    if (records?.length > 0 && insertFields?.length > 0) {
  
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
  const getMatchedFieldObjects = (fields, fieldShowValues) => {
    const matchedFields = {};
    fields.forEach((field) => {
      if (fieldShowValues.includes(field.field)) {
        matchedFields[field.field] = matchedFields[field.field] || [];
        matchedFields[field.field].push(field);
      }
    });
    return matchedFields;
  };
      const fetchSuggestions = async (field, query, level = null,insertFields,setInsertFields) => {
        const index = insertFields.findIndex(f => f.field === field.field);
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

  return { handleRowClickFun,fetchSuggestions,handleMissingFields };
};
