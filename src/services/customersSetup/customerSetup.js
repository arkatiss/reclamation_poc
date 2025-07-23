export default build => ({
    getCustomerList:build.mutation  ({
       
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'customer/get_customer_details',
             
            //url: 'customer/v2/getcustomerdetails',
        }),
        providesTags: ['customerMaster'] 
    }),
    getCustomerGroups:build.mutation  ({
        // invalidatesTags: ['Game'],
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_rc_group',
        }),
        providesTags: ['gridGroupRetrieve'],
    }),

     getCustomerStores:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_store_details',
        }),
    }),
    getCustomerProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_customer_profile',
        }),
    }),

    getCustomerFee:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_fees',
        }),
    }),
    // updateCMSData :build.mutation  ({
    //     // invalidatesTags: ['Game'],
    //     query: () => ({
    //         body: {
    //             referenceName: "CSConnectMobileImages",
    //             userName: "rardani"
    //         },
    //         method: 'POST',
    //         url: 'cms/1.0/content/updateCMSData',
    //     }),
    // })
    deleteCustomer:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_delete',
        }),
    }),

      bulkRecordCreate:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_insert',
        }),
          invalidatesTags: ['customerMaster'],
    }),
    bulkRecordUpdate:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_update',
        }),
        invalidatesTags: ['customerMaster'],
    }),
    getScannedSources:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_profile_scan',
        }),
    }),
    getCustomerProfileAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_profile_audit',
        }),
    }),
    createCustomerGroup:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/rc_group_insert',
        }),
        invalidatesTags: ['gridGroupRetrieve'],
    }),
    storeDeleteCustomerGroup:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/rc_group_delete',
        }),
    }),

    deleteCustomerGroup:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/rc_group_delete',
        }),
    }),
   
    bulkRecordCreateCustProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_profile_insert',
        }),
    }),
    updateScanGLCustomerProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/update_scan_gl',
        }),
    }),
     updateStoreDetailRecords:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/update_customer_group',
        }),
    }),
     createBulkStore:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/rc_group_insert',
        }),
}),
        updateCustomerProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_profile_update',
        }),
        invalidatesTags: ['gridGroupRetrieve'],
    }),
    getCustomerProfileScanAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_customer_profile_scan_list',
        }),
    }),
    getCustomerProfileGLAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_customer_profile_gl_list',
        }),
    }),
    createCustomerFees:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/save_fee_details',
        }),
    }),
    getStatusTracker:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_file_tracker_status_details',
        }),
    }),   
    getStatusGenerateFile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/generate_signed_url',
        }),
    }),
    deleteCustomerProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_profile_delete',
        }),
    }),   
    downloadFile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/save_customer_setup',
        }),
    }), 
    customerFeeAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_fee_audit',
        }),
    }),  
    customerGroupStoreAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/customer_group_audit',
        }),
    }),   
    getRulesDefinitionList:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/getRulesDef',
        }),
    }),   
    getExplodedRulesList:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/elastic/rules_explosion/csreclm/_search',
        }),
    }), 
    getVendorCoastingList:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/getVendCstg',
        }),
    }),
    getScanomaticList:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/getScanomatic',
        }),
    }),

    getRulesDefCustomerFee: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/rcmcustomer/rest/rcmCustService/getFeesByRules',
        }),
    }),
    getRulesDefCustomerFeeAudit:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationaudit/rest/audit/getAudit',
        }),
    }),
    getRulesDefAuditData:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationaudit/rest/audit/getAudit',
        }),
    }),
    getLookUp:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/lookupservice/rest/commonLookup/getIndLookup',
        }),
    }),
    getScanProcess:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/scanservices/rest/rcmScan/getScans',
        }),
    }),
    // getScanErrorProcess:build.mutation  ({
    //     query: (payload) => ({
    //         body: payload,
    //         method: 'POST',
    //         url: 'https://reclamationdev.cswg.com/api/scanservices/rest/rcmScan/getScansStg',
    //     }),
    // }),
    getAuditScanSetup:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationaudit/rest/audit/getAudit',
        }),
    }),
      getExplodedRulesVendorFee:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/getFeesForRulesExp',
             }),
    }),
    ruleDefinitionBulkCreate:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/saveRulesDef',
        }),
    }),
    fileDownloadExistingURL:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationexcelutility/rest/recExcel/download',
        }),
    }),
    fileStatusExistingURL:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationexcelutility/rest/recExcel/fileStatus'
    }),
}),
     getVendorCostingAuditDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationaudit/rest/audit/getAudit',
        }),
    }),
    
     createRulesVendorCosting:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: ' https://reclamationdev.cswg.com/api/reclamationrules/rest/recRules/saveVendCstg',
        }),
    }),

    // getItemSummary:build.mutation  ({
    //     query: (payload) => ({
    //         body: payload,
    //         method: 'POST',
    //         url: 'https://reclamationdev.cswg.com/api/reclamationitems/rest/recItem/getItemSum',
    //     }),
    // }),
    getCSWhseDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationitems/rest/recItem/getItemWH',
        }),
    }),
    getItemSetupAuditDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationaudit/rest/audit/getAudit',
        }),
    }),
    getCustItemDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationitems/rest/recItem/getItemCust',
        }),
    }),
    getModShippDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'https://reclamationdev.cswg.com/api/reclamationitems/rest/recItem/getModShipp',
        }),
    }),
    excelDownload:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'excel_download/download',
        }),
    }),
    fileStatusDeatils:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'fileStatus/',
        }),
    }),
    fileDownloadDetails:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'fileStatus/fetch_file_url/',
        }),
    })
})
