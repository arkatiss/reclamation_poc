import { api } from '../api';
import vendorSetup from './vendorSetup';

export const vendorApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVendorMasterList: vendorSetup(build).getVendorMasterList,
    getVendorMasterAudit: vendorSetup(build).getVendorMasterAudit,
    getVendorProfile: vendorSetup(build).getVendorProfile,  
    createVendorMaster: vendorSetup(build).saveVendorMaster, 
    getVendorProfileFromMaster: vendorSetup(build).getVendorProfileFromMaster,
    saveVendorProfile: vendorSetup(build).saveVendorProfile,
    getSystemDefaults: vendorSetup(build).getSystemDefaults,
    saveSystemDefaults:vendorSetup(build).saveSystemDefaults
  }),
  overrideExisting: false,
})

export const { useGetVendorMasterListMutation, useGetVendorMasterAuditMutation, useGetVendorProfileMutation, useCreateVendorMasterMutation, useGetVendorProfileFromMasterMutation,
  useSaveVendorProfileMutation,useGetSystemDefaultsMutation,useSaveSystemDefaultsMutation
} = vendorApi

