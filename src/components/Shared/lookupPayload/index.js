export const getLookUpPayLoad = (payload) => {
    const { navObj, field, data, chips } = payload;
    let reqPayload = {};
    switch (navObj.PARENT_MODULE) {
        case 'vendorSetup':
            switch (navObj.CHILD_MODULE) {
                case 'Vendor Master':
                    reqPayload = {
                        requestMethod: "getIndLookup",
                        columnName: field,
                        searchValue: data,
                        ...(field === 'AP_VENDOR_NUMBER' && {
                            preFilterParams: getPrefCols(chips),
                        }),
                    };
                    break;
                default:
                    reqPayload = {
                        requestMethod: "getIndLookup",
                        columnName: field,
                        searchValue: data,
                    };
            }
            break;
        default:
            reqPayload = {
                requestMethod: "getIndLookup",
                columnName: field,
                searchValue: data,
            };
    }

    return reqPayload;
};

export const getPrefCols = (filters) => {
    
    let retFilters = [];
    filters.map((item)=>{
        if(item.field !== 'AP_VENDOR_NUMBER'){
            retFilters.push({columnName:item.field,searchValue:item.filterValues})
        }
        
    })
    return retFilters
   
    
};
// const changeValues = (filter) =>{
//     if(){

//     }
// }
export const generateFilterString =(isFilter) => {
    
    return Array.isArray(isFilter?.filterString) ? isFilter.filterString.map((filter) => {
      const values = filter.filterValues ? `['${filter.filterValues.join("','")}']` : `'${filter.userInputValue}'`;
      return `${filter.field} ${filter.type} ${values}`;
    }).join(` ${isFilter.filterString[0]?.logicalCondition || 'AND'} `) : isFilter?.filterString || "";
 
  }

 
export const rulesFilterString = (isFilter, addFilObj, filterCols = null) => {
  if (
    (!Array.isArray(isFilter?.filterString) || isFilter.filterString.length === 0) &&
    (!addFilObj || Object.keys(addFilObj).length === 0)
  ) {
    return {};
  }

  const mustArray = [];

  // Handle isFilter.filterString
  if (Array.isArray(isFilter?.filterString)) {
    isFilter.filterString.forEach((filter) => {
      const values = filter.filterValues?.length > 0 ? filter.filterValues : [filter.userInputValue];
      const fieldMeta = filterCols?.find(col => col.field === filter.field);

      if (fieldMeta?.type === 'DATE') {
        const dateValue = values[0]?.split(' ')[0];
        const rangeCondition = {};

        if (filter.field.toLowerCase().includes('from')) {
          rangeCondition['gte'] = dateValue;
        } else if (filter.field.toLowerCase().includes('to')) {
          rangeCondition['lte'] = dateValue;
        }

        rangeCondition['format'] = 'dd/MM/yyyy||yyyy';

        mustArray.push({
          bool: {
            should: [
              {
                range: {
                  [filter.field]: rangeCondition
                }
              }
            ]
          }
        });
      } else {
        mustArray.push({
          bool: {
            should: values.map((value) => ({
              match: {
                [filter.field]: value
              }
            }))
          }
        });
      }
    });
  }

  // Handle addFilObj filters
  if (addFilObj && typeof addFilObj === 'object') {
    
    for (const [field, value] of Object.entries(addFilObj)) {
      if(field !== 'Inactive_Rules'){
  mustArray.push({
        bool: {
          should: [
            {
              match: {
                [field]: value
              }
            }
          ]
        }
      });
      }else {
       
      }
    
    }
  }

  return {
    query: {
      bool: {
        must: mustArray
      }
    },
    _source: [],
    from: 0,
    size: 50
  };
};



  
