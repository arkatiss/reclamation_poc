import { api } from '../api';
import rulesSetup from './rulesSetup';

export const rulesApi = api.injectEndpoints({
  endpoints: (build) => ({
      getRulesDefList: rulesSetup(build).getRulesDefList,
    getScanomatic: rulesSetup(build).getScanomatic,
    getRulesVendorCosting:rulesSetup(build).getRulesVendorCosting,
    getRulesAuditRec:rulesSetup(build).getRulesAuditRec,
    getRulesVendorFee:rulesSetup(build).getRulesVendorFee,
    createRulesVendorCostingData:rulesSetup(build).createRulesVendorCostingData,
    getVendorConditionsList:rulesSetup(build).getVendorConditionsList,
    deleteRulesVendorCostingRecords:rulesSetup(build).deleteRulesVendorCostingRecords,
    updateRulesVendorCostingRecords:rulesSetup(build).updateRulesVendorCostingRecords,
    saveVendorConditionsList:rulesSetup(build).saveVendorConditionsList,
    getVendorCostingAudit:rulesSetup(build).getVendorCostingAudit,
    saveRulesDef:rulesSetup(build).saveRulesDef, 
    deleteRulesDef:rulesSetup(build).deleteRulesDef,
    explodeRulesVendorFee:rulesSetup(build).explodeRulesVendorFee

  }),
  overrideExisting: false,
})

export const { useGetRulesDefListMutation,useGetScanomaticMutation,useGetRulesVendorCostingMutation,useGetRulesAuditRecMutation,
  useGetVendorConditionsListMutation,
  useGetRulesVendorFeeMutation,useCreateRulesVendorCostingDataMutation,useDeleteRulesVendorCostingRecordsMutation,useUpdateRulesVendorCostingRecordsMutation,useSaveVendorConditionsListMutation, useGetVendorCostingAuditMutation, useSaveRulesDefMutation, useDeleteRulesDefMutation
,useExplodeRulesVendorFeeMutation} = rulesApi

