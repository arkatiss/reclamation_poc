import { api } from '../api';
import customerSetup from './customerSetup';

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCustomerData: customerSetup(build).getCustomerList,
    getCustomerGroup:customerSetup(build).getCustomerGroups,
    getGroupStoreData:customerSetup(build).getCustomerStores,
    getCustomerProfile:customerSetup(build).getCustomerProfile,
    deleteCustomer:customerSetup(build).deleteCustomer,
    getCustomerFee:customerSetup(build).getCustomerFee,
    bulkRecordCreate:customerSetup(build).bulkRecordCreate,
    bulkRecordUpdate:customerSetup(build).bulkRecordUpdate,
    getScannedSources:customerSetup(build).getScannedSources,
    getCustomerProfileAudit:customerSetup(build).getCustomerProfileAudit,
    bulkRecordCreateCustProfile:customerSetup(build).bulkRecordCreateCustProfile,
    updateScanGLCustomerProfile: customerSetup(build).updateScanGLCustomerProfile,
    createCustomerGroup:customerSetup(build).createCustomerGroup,
    storeDeleteCustomerGroup:customerSetup(build).storeDeleteCustomerGroup,
    updateCustomerProfile:customerSetup(build).updateCustomerProfile,
    getCustomerProfileScanAudit:customerSetup(build).getCustomerProfileScanAudit,
    getCustomerProfileGLAudit:customerSetup(build).getCustomerProfileGLAudit,
    createCustomerFees:customerSetup(build).createCustomerFees,
    updateStoreDetailRecords:customerSetup(build).updateStoreDetailRecords,
    createBulkStore:customerSetup(build).createBulkStore,
    getStatusTracker:customerSetup(build).getStatusTracker,
    getStatusGenerateFile:customerSetup(build).getStatusGenerateFile,
    deleteCustomerProfile:customerSetup(build).deleteCustomerProfile,
    deleteCustomerGroup:customerSetup(build).deleteCustomerGroup,
    downloadFile:customerSetup(build).downloadFile,
    customerGroupStoreAudit:customerSetup(build).customerGroupStoreAudit,
    customerFeeAudit:customerSetup(build).customerFeeAudit,
    getExplodedRulesList:customerSetup(build).getExplodedRulesList,
    getVendorCoastingList:customerSetup(build).getVendorCoastingList,
    getScanomaticList:customerSetup(build).getScanomaticList,
    getRulesDefCustomerFee:customerSetup(build).getRulesDefCustomerFee,
    getRulesDefCustomerFeeAudit:customerSetup(build).getRulesDefCustomerFeeAudit,
    getRulesDefAuditData:customerSetup(build).getRulesDefAuditData,
    getLookUp:customerSetup(build).getLookUp, 
    getScanProcess:customerSetup(build).getScanProcess, 
    // getScanErrorProcess:customerSetup(build).getScanErrorProcess,
    getAuditScanSetup:customerSetup(build).getAuditScanSetup,
    getLookUp:customerSetup(build).getLookUp,
    getExplodedRulesVendorFee:customerSetup(build).getExplodedRulesVendorFee,
    ruleDefinitionBulkCreate:customerSetup(build).ruleDefinitionBulkCreate,
    fileDownloadExistingURL:customerSetup(build).fileDownloadExistingURL,
    fileStatusExistingURL:customerSetup(build).fileStatusExistingURL,
    getVendorCostingAuditDetails:customerSetup(build).getVendorCostingAuditDetails,
    createRulesVendorCosting:customerSetup(build).createRulesVendorCosting,
    getCSWhseDetails:customerSetup(build).getCSWhseDetails,
    getItemSetupAuditDetails:customerSetup(build).getItemSetupAuditDetails,
    getCustItemDetails:customerSetup(build).getCustItemDetails,
    getModShippDetails:customerSetup(build).getModShippDetails, 
    excelDownload:customerSetup(build).excelDownload, 
    fileStatusDetails:customerSetup(build).fileStatusDeatils, 
    fileDownloadDetails:customerSetup(build).fileDownloadDetails, 

  }),
  overrideExisting: false,
})

export const { useGetCustomerDataMutation,useGetCustomerGroupMutation ,useGetGroupStoreDataMutation, useGetCustomerProfileMutation, useDeleteCustomerMutation, useGetCustomerFeeMutation,
  useBulkRecordCreateMutation,useBulkRecordUpdateMutation,useGetScannedSourcesMutation, useGetCustomerProfileAuditMutation, useBulkRecordCreateCustProfileMutation, useUpdateScanGLCustomerProfileMutation,
 useGetCustomerProfileScanAuditMutation, useGetCustomerProfileGLAuditMutation, useCreateCustomerFeesMutation,
 useCreateCustomerGroupMutation,useStoreDeleteCustomerGroupMutation,useUpdateStoreDetailRecordsMutation,useCreateBulkStoreMutation
 ,useUpdateCustomerProfileMutation, useGetStatusTrackerMutation, useGetStatusGenerateFileMutation, useDeleteCustomerProfileMutation
 , useCustomerGroupStoreAuditMutation
 ,useGetRulesDefCustomerFeeMutation
 ,useDeleteCustomerGroupMutation, useDownloadFileMutation, useCustomerFeeAuditMutation, useGetExplodedRulesListMutation, useGetVendorCoastingListMutation, useGetScanomaticListMutation,
 useGetRulesDefCustomerFeeAuditMutation,useGetRulesDefAuditDataMutation,
 useGetScanProcessMutation, useGetAuditScanSetupMutation,
 useGetExplodedRulesVendorFeeMutation, useRuleDefinitionBulkCreateMutation, useFileDownloadExistingURLMutation, useFileStatusExistingURLMutation

, useGetModShippDetailsMutation
,useGetVendorCostingAuditDetailsMutation,useCreateRulesVendorCostingMutation,useGetLookUpMutation, useGetCSWhseDetailsMutation, useGetItemSetupAuditDetailsMutation, useGetCustItemDetailsMutation,
useExcelDownloadMutation, useFileStatusDetailsMutation, useFileDownloadDetailsMutation
} = customerApi

