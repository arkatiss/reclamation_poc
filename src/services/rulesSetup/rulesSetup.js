export default build => ({
    getRulesDefList:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_rules_def'
        })
    }), 
    getScanomatic:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_scanomatic',
        }),
    }),
   getRulesVendorCosting:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_vndr_cstng',
        }),
    }),
    getRulesAuditRec:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_rules_audit',
        }),
    }),
    getRulesVendorFee:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_fees_by_rules',
        }),
    }),
    createRulesVendorCostingData:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/save_vndr_cstng',
        }),
    }),
    getVendorConditionsList:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_cond_valdn',
        }),
    }),

    
    deleteRulesVendorCostingRecords:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/save_vndr_cstng',
        }),
    }),
     updateRulesVendorCostingRecords:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/save_vndr_cstng',
        }),
    }),
    saveVendorConditionsList:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/save_cond_valdn',
        }),
    }),
    getVendorCostingAudit:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/vendor_costing_audit',
        }),
    }),
    saveRulesDef:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/save_rules_def',
        }),
    }),
    deleteRulesDef:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/del_rule_def',
        }),
    }),
     explodeRulesVendorFee:build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'rules/get_fees_for_rules_exp',
        }),
    })
})
