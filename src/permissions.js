const config =
{
  cs: {

    customerSetup: {
      "Customer Master": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Customer Profile": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": true,
        "Status": true
      },
      "Customer Groups": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Store Assignment":{
         "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
       "customerFee": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
    },
    "itemSetup": {
      "Item Summary": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Hazardous": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Item Details": {
        "ViewsWithFilters": false,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": true,
        "ExcelUpload": false,
        "ExcelDownload": false,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - C&S Warehouse Details": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Customer Item Details": {
        "ViewsWithFilters": false,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": false
      },
      "Item Details - Mod/Shipper Details": {
        "ViewsWithFilters": false,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Hazardous, DEA Details": {
        "ViewsWithFilters": false,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Tobacco Details": {
        "ViewsWithFilters": false,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Hazardous": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    vendorSetup: {
      "Vendor Master": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Vendor Profile": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      }
    },
    rulesSetup: {
      "Rules Definition": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "Exploded Rules": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Vendor Costing": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "Scanomatic": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    scanSetup: {
      "Scan Process": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Scan Error Process": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    valueMap: {
      "Value Maps": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      }

    },
    settings: {
      "Division": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    }

  },
  nonCs: {
    "customerSetup": {
      "Customer Master": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Customer Profile": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "customerFee": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Customer Groups": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
       "Store Assignment":{
         "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
    },
    "itemSetup": {
      "Item Summary": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Hazardous": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": true,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Item Details": {
        "ViewsWithFilters": false,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - C&S Warehouse Details": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Customer Item Details": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "Item Details - Mod/Shipper Details": {
        "ViewsWithFilters": false,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Hazardous, DEA Details": {
        "ViewsWithFilters": false,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Item Details - Tobacco Details": {
        "ViewsWithFilters": false,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
    
    },
    "vendorSetup": {
      "Vendor Master": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      },
      "Vendor Profile": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      }
    },
    "rulesSetup": {
      "Rules Definition": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": true,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "Exploded Rules": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Vendor Costing": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": true,
        "Status": true
      },
      "Scanomatic": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    "scanSetup": {
      "Scan Process": {
        "ViewsWithFilters": true,
        "Create": false,
        "Edit": false,
        "Delete": false,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      },
      "Scan Error Process": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    "valueMap": {
      "Value Maps": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": false,
        "ExcelDownload": true,
        "Template": false,
        "CopyAndCreate": false,
        "Status": true
      }
    },
    "settings": {
      "Division": {
        "ViewsWithFilters": true,
        "Create": true,
        "Edit": true,
        "Delete": true,
        "BulkUpdateByColumn": false,
        "ExcelUpload": true,
        "ExcelDownload": true,
        "Template": true,
        "CopyAndCreate": false,
        "Status": true
      }
    }
  }
}

export const hasPermission = (module, submodule, divisionId,childModule = null) => {
  const divisionName = divisionId === 2 ? 'nonCs' : 'cs'
  const key = childModule ? `${submodule} - ${childModule}` : submodule;
  const permissions = config[divisionName][module][key];
  
  return permissions;
}
export default config;
